import { useSelector } from 'react-redux';
import { useToast } from './useToast';
import { useNavigate } from 'react-router-dom';
import { mockPosts, mockVotes, mockComments } from '@/utils/mockData';

/**
 * Hook that returns mock data for guest users and real API for authenticated users
 */
export const useGuestAwareApi = () => {
    const { isGuestMode } = useSelector((state) => state.user);
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const promptLogin = (action = 'perform this action') => {
        showToast(`Sign up to ${action}`, 'info');
        setTimeout(() => {
            navigate('/register');
        }, 1500);
    };
    
    // New function to check if action is allowed and return modal props
    const getRestrictionInfo = (action, feature, route = '/register') => {
        if (!isGuestMode) return { restricted: false };
        
        return {
            restricted: true,
            action,
            feature,
            route,
        };
    };
    
    return {
        isGuest: isGuestMode,
        getMockData: (dataType) => {
            if (!isGuestMode) return null;
            
            switch (dataType) {
                case 'posts':
                    return mockPosts;
                case 'votes':
                    return mockVotes;
                case 'comments':
                    return mockComments;
                default:
                    return [];
            }
        },
        canPerformAction: (actionName) => {
            if (!isGuestMode) return true;
            
            promptLogin(actionName);
            return false;
        },
        getRestrictionInfo, // Export new function
        promptLogin,
    };
};

