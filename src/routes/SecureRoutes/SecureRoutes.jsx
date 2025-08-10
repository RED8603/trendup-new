import Chat from "@/pages/Chat/Chat";
import Home from "@/pages/Home/Home";
import Vote from "@/pages/Vote/Vote";
import { Route, Routes } from "react-router-dom";

const SecureRoutes = () => {
    return (
        <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Vote/>} path="/vote" />
            <Route element={<Chat />} path="/chat" />
        </Routes>
    );
};

export default SecureRoutes;
