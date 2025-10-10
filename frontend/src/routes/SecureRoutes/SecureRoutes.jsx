import Chat from "@/pages/Chat/Chat";
import Home from "@/pages/Home/Home";
import GoLiveView from "@/pages/Live/Live";
import LiveStreamView from "@/pages/Live/LiveStream";
import EditProfilePage from "@/pages/profile/Edit/EditProfile";
import Profile from "@/pages/profile/UserProfile";
import Vote from "@/pages/Vote/Vote";
import { Route, Routes } from "react-router-dom";

const SecureRoutes = () => {
    return (
        <Routes>
            <Route element={<Home />} path="/home/*" />
            <Route element={<Vote />} path="/vote" />
            <Route element={<Chat />} path="/chat" />
            <Route element={<GoLiveView />} path="/live" />
            <Route element={<LiveStreamView />} path="/live/stream" />
            <Route element={<Profile />} path="/user/profile" />
            <Route element={<EditProfilePage />} path="/user/edit-profile" />


        </Routes>
    );
};

export default SecureRoutes;
