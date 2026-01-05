import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, initAuth, setLoading, setGuestMode } from '@/store/slices/userSlices';
import { useGetProfileQuery } from '@/api/slices/authApi';
import { authUtils } from '@/utils/auth';

export const useAutoLogin = () => {
    const dispatch = useDispatch();
    const { isGuestMode, user, isAuthenticated } = useSelector((state) => state.user);
    const [shouldFetchProfile, setShouldFetchProfile] = useState(false);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        // Only run once on mount - prevent infinite loops
        if (hasInitializedRef.current) {
            return;
        }
        
        // If user is already authenticated with user data, mark as initialized and return
        if (isAuthenticated && user && user._id && user._id !== 'guest-user') {
            hasInitializedRef.current = true;
            return;
        }
        
        // Mark as initialized to prevent re-running
        hasInitializedRef.current = true;
        
        // Set loading state BEFORE initAuth to prevent premature redirects
        dispatch(setLoading(true));
        
        dispatch(initAuth());
        
        const { accessToken } = authUtils.getTokens();
        
        // Prioritize tokens over guest mode - if tokens exist, user is authenticated
        if (accessToken && !authUtils.isAccessTokenExpired()) {
            // User has valid tokens - fetch profile and clear any guest mode
            const guestMode = localStorage.getItem('guestMode');
            if (guestMode === 'true') {
                localStorage.removeItem('guestMode');
            }
            setShouldFetchProfile(true);
        } else {
            // No valid token - check for guest mode
            // Clear invalid tokens first
            if (accessToken && authUtils.isAccessTokenExpired()) {
                authUtils.clearTokens();
            }
            
            // Only set guest mode if explicitly set in localStorage AND no valid tokens
            const guestMode = localStorage.getItem('guestMode');
            if (guestMode === 'true') {
                dispatch(setGuestMode());
                dispatch(setLoading(false));
            } else {
                // No tokens and no guest mode - user needs to login
                dispatch(setLoading(false));
            }
        }
    }, [dispatch]);

    // Monitor guest mode and disable profile fetch if guest mode becomes active
    useEffect(() => {
        if (isGuestMode) {
            setShouldFetchProfile(false);
        }
    }, [isGuestMode]);

    const { data, isLoading, isError } = useGetProfileQuery(undefined, {
        skip: !shouldFetchProfile || isGuestMode, // Skip if guest mode is active
    });

    useEffect(() => {
        if (data && !isLoading && !isError) {
            const { accessToken, refreshToken } = authUtils.getTokens();
            
            dispatch(setAuth({
                user: data.data,
                accessToken,
                refreshToken,
            }));
        }
        
        if (isError || (shouldFetchProfile && !isLoading && !data)) {
            // If we tried to fetch but got an error or no data, stop loading
            // Don't clear tokens here - baseQueryWithReauth already handles 401s and token refresh
            dispatch(setLoading(false));
        }
    }, [data, isLoading, isError, shouldFetchProfile, dispatch]);

    // Return both the local loading state and the query loading state
    return { isLoading: isLoading || (shouldFetchProfile && !data && !isError) };
};

