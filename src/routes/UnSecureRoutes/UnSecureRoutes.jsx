import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import { Route, Routes } from "react-router-dom";

const UnSecureRoutes = () => {
    return (
        <Routes>
            <Route element={<Login />}  path="/login" />
            <Route element={<Register />}  path="/register" />
        </Routes>
    );
};

export default UnSecureRoutes;
