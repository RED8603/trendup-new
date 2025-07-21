import React, { createContext, useState, useContext, useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";

const GenrelContext = createContext();
export const ConfigProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const { address } = useAccount();
    const { data: signer } = useWalletClient();

    console.log(address , signer);
    

    // Toggle theme function
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Memoized value to avoid unnecessary re-renders
    const value = useMemo(
        () => ({
            isDarkMode,
            toggleTheme,
            address,
            signer
        }),
        [isDarkMode ,address , signer]
    );

    return <GenrelContext.Provider value={value}>{children}</GenrelContext.Provider>;
};

// Custom hook to use the ConfigContext
export const useGenrelContext = () => useContext(GenrelContext);
 
