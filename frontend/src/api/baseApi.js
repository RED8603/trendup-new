import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { removeUser } from "@/store/slices/userSlices";
import { env } from "@/config/env";

/**
 * Get API base URL from environment configuration
 * In production, VITE_API_URL must be set or env.js will throw an error
 */
const baseUrl = env.apiUrl;

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { extra, endpoint }) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQueryWithAuth(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Check if user is in guest mode - don't redirect if so
        const guestMode = localStorage.getItem('guestMode');
        if (guestMode === 'true') {
            // User is in guest mode, don't redirect to login
            return result;
        }

        const refreshToken = localStorage.getItem("refreshToken");
        
        if (refreshToken) {
            const refreshResult = await baseQueryWithAuth(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refreshToken }
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                localStorage.setItem("accessToken", refreshResult.data.data.accessToken);
                result = await baseQueryWithAuth(args, api, extraOptions);
            } else {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                api.dispatch(removeUser());
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        } else {
            localStorage.removeItem("accessToken");
            api.dispatch(removeUser());
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: [
        "Auth", "Users", "Posts", "Comments", "Reactions", "Feed", "Following", "Followers", 
        "Karma", "Badges", "Polls", "Predictions", "Categories", "Hashtags", "Trending", "Discover", 
        "FollowSuggestions", "KarmaLeaderboard", "KarmaStats", "Notifications", "NotificationCount", 
        "UserProfile", "UserSearch", "FollowerStats", "FollowingStats",
        // Karma system tags
        "UsersByLevel", "UserKarmaHistory", "UserReactions", "ReactionPermission", "UserReactionWeight",
        "MyKarma", "MyKarmaStats", "MyBadges", "MyReactions", "MyKarmaHistory",
        // Badge system tags
        "BadgeStats", "BadgesByCategory", "BadgesByRarity", "Badge", "AvailableBadges", 
        "UserBadgeProgress", "MyAvailableBadges", "MyBadgeProgress",
        // Chat system tags
        "Conversations", "Messages"
    ],
});
