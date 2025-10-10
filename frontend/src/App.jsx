import AppWrapper from "@/components/AppWrapper/AppWrapper";
import AuthContainer from "@routes/AuthContainer";
import { ToastProvider, useToast } from '@/hooks/useToast.jsx';
import Toastify from '@/components/common/Toastify';

// Toast notification wrapper
function ToastNotification() {
    const { toast, hideToast } = useToast();
    return <Toastify toast={toast} onClose={hideToast} />;
}

function App() {
    return (
        <ToastProvider>
            <AppWrapper>
                <AuthContainer />
                <ToastNotification />
            </AppWrapper>
        </ToastProvider>
    );
}

export default App;
