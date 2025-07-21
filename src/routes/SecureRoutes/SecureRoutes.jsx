import Home from "@/pages/Home/Home";
import Vote from "@/pages/Vote/Vote";
import { Route, Routes } from "react-router-dom";

const SecureRoutes = () => {
    return (
        <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Vote/>} path="/vote" />
        </Routes>
    );
};

export default SecureRoutes;
