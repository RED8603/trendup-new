import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, initAuth, setLoading, setGuestMode } from '@/store/slices/userSlices';
import { useGetProfileQuery } from '@/api/slices/authApi';
import { authUtils } from '@/utils/auth';

export const useAutoLogin = () => {
    const dispatch = useDispatch();
    const { isGuestMode } = useSelector((state) => state.user);
    const [shouldFetchProfile, setShouldFetchProfile] = useState(false);

    useEffect(() => {
        // Check for guest mode first
        const guestMode = localStorage.getItem('guestMode');
        if (guestMode === 'true') {
            dispatch(setGuestMode());
            dispatch(setLoading(false));
            return;
        }
        
        // Set loading state BEFORE initAuth to prevent premature redirects
        dispatch(setLoading(true));
        
        dispatch(initAuth());
        
        const { accessToken } = authUtils.getTokens();
        
        if (accessToken && !authUtils.isAccessTokenExpired()) {
            setShouldFetchProfile(true);
        } else {
            // No valid token - automatically enable guest mode
            // Clear invalid tokens first
            if (accessToken && authUtils.isAccessTokenExpired()) {
                authUtils.clearTokens();
            }
            // Automatically set guest mode so user sees the home page instead of login
            dispatch(setGuestMode());
            dispatch(setLoading(false));
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

