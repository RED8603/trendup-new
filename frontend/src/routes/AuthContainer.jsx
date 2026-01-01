import Loading from "@/components/common/loading";
import { useSelector, useDispatch } from "react-redux";
import SecureRoutes from "@routes/SecureRoutes/SecureRoutes";
import UnSecureRoutes from "@routes/UnSecureRoutes/UnSecureRoutes";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAutoLogin } from "@/hooks/useAutoLogin";
import { setGuestMode } from "@/store/slices/userSlices";

const AuthContainer = () => {
    const { user, loading, isAuthenticated, isGuestMode } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading: autoLoginLoading } = useAutoLogin();
    const previousPathRef = useRef(location.pathname);
    const hasProcessedAuthRef = useRef(false);
    const navigationInProgressRef = useRef(false);
    const hasAutoSetGuestModeRef = useRef(false);
    const previousGuestModeRef = useRef(isGuestMode);

    useEffect(() => {
        // Detect when guest mode was just exited (user clicked login/signup)
        // In this case, DON'T auto-set guest mode again - let them navigate to login
        const justExitedGuestMode = previousGuestModeRef.current === true && isGuestMode === false;
        previousGuestModeRef.current = isGuestMode;

        // If user just exited guest mode, don't do anything - let navigation complete
        if (justExitedGuestMode) {
            return;
        }

        // Prevent infinite loops - if navigation is in progress, don't process
        if (navigationInProgressRef.current) {
            return;
        }

        const currentPath = location.pathname;
        const hasTokens = typeof window !== 'undefined' &&
            localStorage.getItem('accessToken') &&
            localStorage.getItem('refreshToken');

        // Auth pages that should not auto-enable guest mode
        const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];

        // If user navigates to an auth page, reset the auto guest mode flag
        // So when they come back later (e.g., after registering), guest mode can be set again if needed
        if (authPages.includes(currentPath)) {
            hasAutoSetGuestModeRef.current = false;
        }

        // If guest mode is active, handle it immediately (don't wait for loading)
        if (isGuestMode) {
            const redirectFromPages = ['/login', '/register', '/'];
            if (redirectFromPages.includes(currentPath)) {
                navigationInProgressRef.current = true;
                navigate("/home", { replace: true });
                // Reset after a short delay to allow navigation to complete
                setTimeout(() => {
                    navigationInProgressRef.current = false;
                }, 200);
            }
            // Allow guest to stay on any other route
            return;
        }

        // PRIORITY 1: If user is authenticated with user data AND has tokens, they're logged in
        // Only redirect from auth pages, don't redirect to login
        if (isAuthenticated && user && user._id && user._id !== 'guest-user' && hasTokens) {
            const redirectFromPages = ['/login', '/register', '/'];
            // Only redirect if we're on an auth page - preserve all other routes
            if (redirectFromPages.includes(currentPath)) {
                navigationInProgressRef.current = true;
                navigate("/home", { replace: true });
                setTimeout(() => {
                    navigationInProgressRef.current = false;
                }, 200);
            }
            // Don't process further if user is authenticated
            return;
        }

        // PRIORITY 2: If user has tokens but not yet authenticated (login in progress)
        // Don't redirect to login - wait for authentication to complete
        if (hasTokens && !isAuthenticated) {
            // Don't redirect anywhere - let the login process complete
            // This prevents redirecting to login while tokens exist
            return;
        }

        // PRIORITY 3: Don't do anything while loading (for unauthenticated users or when fetching profile)
        if (loading || autoLoginLoading) {
            hasProcessedAuthRef.current = false;
            return;
        }

        // PRIORITY 4: Only process redirects if we have complete auth state (user + isAuthenticated)
        // or if we're not authenticated
        const shouldProcess = (!isAuthenticated || (isAuthenticated && user));

        if (!shouldProcess) {
            // Still loading user data, don't process yet
            return;
        }

        // Check if pathname changed - if so, reset the processed flag
        if (previousPathRef.current !== currentPath) {
            previousPathRef.current = currentPath;
            hasProcessedAuthRef.current = false;
        }

        // Skip if we've already processed this auth state for this pathname
        if (hasProcessedAuthRef.current) {
            return;
        }

        // Mark as processed
        hasProcessedAuthRef.current = true;

        // PRIORITY 5: Auto-enable guest mode for first-time visitors on landing page
        // Instead of redirecting to login, show home page in guest mode
        if (!isAuthenticated && !hasTokens && !isGuestMode) {
            // User is not authenticated - auto-enable guest mode for landing experience
            // Only for non-auth pages (i.e., protected routes like /home)
            if (!authPages.includes(currentPath)) {
                // User is trying to access a protected route - auto-enable guest mode
                if (!hasAutoSetGuestModeRef.current) {
                    hasAutoSetGuestModeRef.current = true;
                    dispatch(setGuestMode());

                    // If on root, navigate to home
                    if (currentPath === '/') {
                        navigationInProgressRef.current = true;
                        navigate("/home", { replace: true });
                        setTimeout(() => {
                            navigationInProgressRef.current = false;
                        }, 200);
                    }
                }
            }
            // Allow users to explicitly visit login/register pages without interference
        }
    }, [user, isAuthenticated, isGuestMode, loading, autoLoginLoading, navigate, location.pathname, dispatch]);

    // Check if user has tokens in localStorage
    const hasTokens = typeof window !== 'undefined' &&
        localStorage.getItem('accessToken') &&
        localStorage.getItem('refreshToken');

    // Wait for loading to complete AND ensure we have user data if authenticated
    // BUT: Don't wait if guest mode is active OR if user is already authenticated
    const hasUserData = isAuthenticated && user && user._id && user._id !== 'guest-user';
    const isGuest = isGuestMode;

    // Only show loading if:
    // 1. Not in guest mode
    // 2. Not already authenticated with user data
    // 3. Actually loading
    const shouldShowLoading = (loading || autoLoginLoading) && !isGuestMode && !hasUserData;

    // Check if we're in the process of fetching user data
    // (tokens exist and we're waiting for the fetch to complete)
    // BUT: Don't wait if guest mode is active OR if we already have user data
    const isFetchingUser = hasTokens && !user && (loading || autoLoginLoading) && !isGuestMode && !hasUserData;

    if (shouldShowLoading || isFetchingUser) {
        return <Loading isLoading={true} />;
    }

    // Allow guest mode to access secure routes
    return <div>{(hasUserData || isGuest) ? <SecureRoutes /> : <UnSecureRoutes />}</div>;
};

export default AuthContainer;
