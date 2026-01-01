import { Alert, AlertTitle, Box, Button, IconButton, Slide, alpha, useTheme, Fade } from '@mui/material';
import { Close as CloseIcon, AccountCircle as AccountIcon, RocketLaunch as RocketIcon } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { exitGuestMode } from '@/store/slices/userSlices';

const GuestModeBanner = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { isGuestMode } = useSelector((state) => state.user);

    // Check if user has dismissed the banner before
    const bannerDismissedKey = 'guestBannerDismissed';
    const [show, setShow] = useState(() => {
        if (typeof window === 'undefined') return false;
        return !localStorage.getItem(bannerDismissedKey);
    });

    const handleDismiss = useCallback(() => {
        setShow(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem(bannerDismissedKey, 'true');
        }
    }, []);

    // Auto-dismiss after 8 seconds
    useEffect(() => {
        if (show && isGuestMode) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [show, isGuestMode, handleDismiss]);

    if (!isGuestMode || !show) return null;

    const handleSignUp = () => {
        dispatch(exitGuestMode());
        handleDismiss();
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
            navigate('/register');
        }, 50);
    };

    return (
        <Fade in={show}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    maxWidth: { xs: 'calc(100% - 32px)', sm: '600px' },
                    width: '100%',
                }}
            >
                <Alert
                    icon={<RocketIcon />}
                    sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                            color: theme.palette.primary.main,
                        },
                    }}
                    action={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={handleSignUp}
                                sx={{
                                    whiteSpace: 'nowrap',
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    fontWeight: 600,
                                    px: 2,
                                    '&:hover': {
                                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                    },
                                }}
                            >
                                Get Started
                            </Button>
                            <IconButton
                                size="small"
                                onClick={handleDismiss}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                    },
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    }
                >
                    <AlertTitle sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                        Welcome! Explore TrendUp
                    </AlertTitle>
                    <Box component="span" sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                        Sign up to create content, interact with posts, and join the community
                    </Box>
                </Alert>
            </Box>
        </Fade>
    );
};

export default GuestModeBanner;

