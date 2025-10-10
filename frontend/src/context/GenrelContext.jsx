import React, { createContext, useState, useContext, useMemo, useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";

const GenrelContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Get wallet data from wagmi
    const { address, isConnected } = useAccount();
    const { data: signer } = useWalletClient();

    // Toggle theme function - memoized to prevent re-creation
    const toggleTheme = useCallback(() => {
        setIsDarkMode((prevMode) => !prevMode);
    }, []);

    // Memoized value - Only depend on stable values, not signer object
    const value = useMemo(
        () => ({
            isDarkMode,
            toggleTheme,
            address,
            signer,
            isConnected,
        }),
        [isDarkMode, toggleTheme, address, isConnected]
        // Removed 'signer' from dependencies to prevent infinite re-renders
    );

    return <GenrelContext.Provider value={value}>{children}</GenrelContext.Provider>;
};

// Custom hook to use the ConfigContext
export const useGenrelContext = () => {
    const context = useContext(GenrelContext);
    if (!context) {
        throw new Error('useGenrelContext must be used within ConfigProvider');
    }
    return context;
};
 
