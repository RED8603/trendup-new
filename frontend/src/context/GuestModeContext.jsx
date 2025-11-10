import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const GuestModeContext = createContext({
    isGuest: false,
    canAccessFeature: () => true,
});

export const GuestModeProvider = ({ children }) => {
    const { isGuestMode } = useSelector((state) => state.user);
    
    // Define which features are restricted in guest mode
    const restrictedFeatures = {
        chat: true,
        createPost: true,
        createVote: true,
        editProfile: true,
        notifications: true,
        voting: true,
        commenting: true,
        liking: true,
        following: true,
        sharing: true,
    };
    
    const canAccessFeature = (featureName) => {
        if (!isGuestMode) return true;
        return !restrictedFeatures[featureName];
    };
    
    return (
        <GuestModeContext.Provider value={{ isGuest: isGuestMode, canAccessFeature }}>
            {children}
        </GuestModeContext.Provider>
    );
};

export const useGuestMode = () => useContext(GuestModeContext);

