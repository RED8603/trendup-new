const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils');
const { sendSuccessResponse } = require('../../../core/utils/response');
const { AuthenticationError } = require('../../../core/errors/AppError');
const ErrorHandler = require('../../../core/errors/ErrorHandler');
const { logger } = require('../../../core/utils/logger');

// Log Google Client ID status on module load
const googleClientId = process.env.GOOGLE_CLIENT_ID;
if (!googleClientId) {
    logger.warn('GOOGLE_CLIENT_ID is not set! Google login will not work.');
} else {
    logger.info(`Google OAuth configured with client ID: ${googleClientId.substring(0, 20)}...`);
}

const client = new OAuth2Client(googleClientId);

class SocialController {
    async googleLogin(req, res) {
        const { credential, accessToken: googleAccessToken } = req.body;

        if (!credential && !googleAccessToken) {
            throw new AuthenticationError('No Google credential or access token provided');
        }

        let email, name, picture, googleId, email_verified;

        try {
            if (credential) {
                // ID Token Flow (Standard Google Login Button)
                const ticket = await client.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                email = payload.email;
                name = payload.name;
                picture = payload.picture;
                googleId = payload.sub;
                email_verified = payload.email_verified;
            } else {
                // Access Token Flow (Custom UI using useGoogleLogin)
                // Use direct fetch to Google userinfo API - more reliable than OAuth2Client methods
                logger.info('Validating Google access token via userinfo API');

                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${googleAccessToken}` }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    logger.error('Google userinfo API error:', { status: response.status, body: errorText });
                    throw new Error(`Google API returned ${response.status}: ${errorText}`);
                }

                const profile = await response.json();
                logger.info('Google userinfo response:', { email: profile.email, name: profile.name });

                email = profile.email;
                name = profile.name;
                picture = profile.picture;
                googleId = profile.sub;
                email_verified = profile.email_verified;
            }
        } catch (error) {
            logger.error('Google token validation failed:', {
                error: error.message,
                stack: error.stack,
                hasCredential: !!credential,
                hasAccessToken: !!googleAccessToken,
            });
            throw new AuthenticationError(`Invalid Google token: ${error.message}`);
        }

        if (!email_verified) {
            throw new AuthenticationError('Google email not verified');
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                email,
                name,
                username: email.split('@')[0] + Math.floor(Math.random() * 10000), // Temporary username
                avatar: picture,
                isEmailVerified: true,
                // We do NOT create an Auth record because they don't have a password yet.
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user._id,
            email: user.email,
        });

        const refreshToken = generateRefreshToken({
            userId: user._id,
            email: user.email,
        });

        const userObject = user.toObject();
        delete userObject.__v;

        sendSuccessResponse(res, {
            user: userObject,
            accessToken,
            refreshToken,
        }, 'Google login successful');
    }
}

const socialController = new SocialController();

module.exports = {
    googleLogin: ErrorHandler.handleAsync(socialController.googleLogin.bind(socialController)),
};
