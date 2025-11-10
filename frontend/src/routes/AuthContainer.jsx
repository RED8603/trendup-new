import Loading from "@/components/common/loading";
import { useSelector } from "react-redux";
import SecureRoutes from "@routes/SecureRoutes/SecureRoutes";
import UnSecureRoutes from "@routes/UnSecureRoutes/UnSecureRoutes";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAutoLogin } from "@/hooks/useAutoLogin";

const AuthContainer = () => {
    const { user, loading, isAuthenticated, isGuestMode } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading: autoLoginLoading } = useAutoLogin();
    const previousPathRef = useRef(location.pathname);
    const hasProcessedAuthRef = useRef(false);

    useEffect(() => {
        // If guest mode is active, handle it immediately (don't wait for loading)
        if (isGuestMode) {
            const authPages = ['/login', '/register', '/'];
            if (authPages.includes(location.pathname)) {
                navigate("/home", { replace: true });
            }
            // Allow guest to stay on any other route
            return;
        }
        
        // Don't do anything while loading (for authenticated users)
        if (loading || autoLoginLoading) {
            hasProcessedAuthRef.current = false;
            return;
        }
        
        // Only process redirects if we have complete auth state (user + isAuthenticated)
        // or if we're not authenticated
        const shouldProcess = (!isAuthenticated || (isAuthenticated && user));
        
        if (!shouldProcess) {
            // Still loading user data, don't process yet
            return;
        }
        
        // Check if pathname changed - if so, reset the processed flag
        if (previousPathRef.current !== location.pathname) {
            previousPathRef.current = location.pathname;
            hasProcessedAuthRef.current = false;
        }
        
        // Skip if we've already processed this auth state for this pathname
        if (hasProcessedAuthRef.current) {
            return;
        }
        
        // Mark as processed
        hasProcessedAuthRef.current = true;
        
        // Regular auth flow
        if (isAuthenticated && user) {
            const authPages = ['/login', '/register', '/'];
            // Only redirect if we're on an auth page - preserve all other routes
            if (authPages.includes(location.pathname)) {
                navigate("/home", { replace: true });
            }
            // If user is on any other route (like /social, /chat, /vote, etc.), don't redirect
        } else {
            // User is not authenticated - redirect to login only from protected routes
            const allowedPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
            if (!allowedPaths.includes(location.pathname)) {
                navigate("/login", { replace: true });
            }
        }
    }, [user, isAuthenticated, isGuestMode, loading, autoLoginLoading, navigate, location.pathname]);

    // Wait for loading to complete AND ensure we have user data if authenticated
    // BUT: Don't wait if guest mode is active
    const isLoading = (loading || autoLoginLoading) && !isGuestMode;
    const hasUserData = isAuthenticated && user;
    const isGuest = isGuestMode;
    
    // Check if we're in the process of fetching user data
    // (tokens exist and we're waiting for the fetch to complete)
    // BUT: Don't wait if guest mode is active
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const isFetchingUser = accessToken && !user && (loading || autoLoginLoading) && !isGuestMode;
    
    if (isLoading || isFetchingUser) {
        return <Loading isLoading={true} />;
    }

    // Allow guest mode to access secure routes
    return <div>{(hasUserData || isGuest) ? <SecureRoutes /> : <UnSecureRoutes />}</div>;
};

export default AuthContainer;
