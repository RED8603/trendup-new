import AppWrapper from "@/components/AppWrapper/AppWrapper";
import AuthContainer from "@routes/AuthContainer";
import { ToastProvider, useToast } from '@/hooks/useToast.jsx';
import Toastify from '@/components/common/Toastify';
import KarmaGainToast from '@/components/common/KarmaGainToast';
import { SocketProvider } from '@/context/SocketContext';
import { ConfigProvider } from '@/context/GenrelContext';
import { GuestModeProvider } from '@/context/GuestModeContext';
import GuestModeBanner from '@/components/common/GuestModeBanner';
import { useSelector } from 'react-redux';

// Toast notification wrapper
function ToastNotification() {
    const { toast, hideToast } = useToast();
    return <Toastify toast={toast} onClose={hideToast} />;
}

// Karma notifications wrapper
function KarmaNotifications() {
    const { user, isAuthenticated } = useSelector((state) => state.user);
    return (isAuthenticated && user) ? <KarmaGainToast userId={user._id} /> : null;
}

function App() {
    return (
        <ConfigProvider>
            <ToastProvider>
                <GuestModeProvider>
                    <SocketProvider>
                        <AppWrapper>
                            <GuestModeBanner />
                            <AuthContainer />
                            <ToastNotification />
                            <KarmaNotifications />
                        </AppWrapper>
                    </SocketProvider>
                </GuestModeProvider>
            </ToastProvider>
        </ConfigProvider>
    );
}

export default App;
