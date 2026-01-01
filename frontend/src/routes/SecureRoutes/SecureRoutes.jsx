import { Route, Routes, Navigate } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Social from "@/pages/Social/Social";
import Chat from "@/pages/Chat/Chat";
import ChatDetail from "@/pages/Chat/ChatDetail";
import Vote from "@/pages/Vote/Vote";
import Live from "@/pages/Live/Live";
import KarmaDashboard from "@/pages/Karma/KarmaDashboard";
import NotificationCenter from "@/pages/Notifications/NotificationCenter";
import UserProfile from "@/pages/profile/UserProfile";
import EditProfile from "@/pages/profile/Edit/EditProfile";
import OtherUserProfile from "@/pages/User/OtherUserProfile";

const SecureRoutes = () => {
    return (
        <Routes>
            {/* Default redirect to home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Main routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/social/*" element={<Social />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:conversationId" element={<ChatDetail />} />
            <Route path="/vote/*" element={<Vote />} />
            <Route path="/live" element={<Live />} />
            <Route path="/live/:streamId" element={<Live />} />
            <Route path="/karma" element={<KarmaDashboard />} />
            <Route path="/notifications" element={<NotificationCenter />} />

            {/* Profile routes */}
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/edit-profile" element={<EditProfile />} />
            <Route path="/user/:userId" element={<OtherUserProfile />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
};

export default SecureRoutes;

