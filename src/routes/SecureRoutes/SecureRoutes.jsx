import Chat from "@/pages/Chat/Chat";
import Home from "@/pages/Home/Home";
import GoLiveView from "@/pages/Live/Live";
import LiveStreamView from "@/pages/Live/LiveStream";
import Vote from "@/pages/Vote/Vote";
import { Route, Routes } from "react-router-dom";

const SecureRoutes = () => {
    return (
        <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Vote />} path="/vote" />
            <Route element={<Chat />} path="/chat" />
            <Route element={<GoLiveView />} path="/live" />
            <Route element={<LiveStreamView />} path="/live/stream" />
        </Routes>
    );
};

export default SecureRoutes;
