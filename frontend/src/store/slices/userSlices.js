import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: true, // Start with true to prevent premature redirects
    error: null,
    isAuthenticated: false,
    isGuestMode: false, // NEW: Track guest mode
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            state.isAuthenticated = true;
            state.isGuestMode = false; // Clear guest mode when real user logs in
        },
        
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            }
        },
        
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.isGuestMode = false; // Clear guest mode
            state.loading = false;
            state.error = null;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            }
        },
        
        removeUser: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isGuestMode = false; // Clear guest mode
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("guestMode");
            }
        },
        
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        
        initAuth: (state) => {
            if (typeof window !== 'undefined') {
                const accessToken = localStorage.getItem("accessToken");
                const refreshToken = localStorage.getItem("refreshToken");
                const guestMode = localStorage.getItem("guestMode");
                
                if (guestMode === 'true') {
                    // Restore guest mode
                    state.isGuestMode = true;
                    state.user = {
                        _id: 'guest-user',
                        username: 'Guest User',
                        email: 'guest@trendup.com',
                        profileImage: null,
                        isGuest: true,
                    };
                    state.loading = false;
                    state.isAuthenticated = false;
                } else if (accessToken && refreshToken) {
                    state.accessToken = accessToken;
                    state.refreshToken = refreshToken;
                    // Don't set isAuthenticated here - wait for user data to be loaded
                    // This prevents the race condition where isAuthenticated is true but user is null
                }
            }
        },
        
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isGuestMode = false; // Clear guest mode
            state.error = null;
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("guestMode");
            }
        },
        
        // NEW: Set guest mode
        setGuestMode: (state) => {
            state.isGuestMode = true;
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {
                _id: 'guest-user',
                username: 'Guest User',
                email: 'guest@trendup.com',
                profileImage: null,
                isGuest: true,
            };
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestMode', 'true');
            }
        },
        
        // NEW: Exit guest mode
        exitGuestMode: (state) => {
            state.isGuestMode = false;
            state.user = null;
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem('guestMode');
            }
        },
    },
});

export const { 
    setUser, 
    setTokens, 
    setAuth, 
    removeUser, 
    setLoading, 
    setError, 
    initAuth, 
    logout,
    setGuestMode, // NEW
    exitGuestMode, // NEW
} = userSlice.actions;

export default userSlice.reducer;

