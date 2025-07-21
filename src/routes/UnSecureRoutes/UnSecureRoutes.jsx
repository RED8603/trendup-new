import Login from "@/pages/Login/Login";
import { Route, Routes } from "react-router-dom";

const UnSecureRoutes = () => {
    return (
        <Routes>
            <Route element={<Login />}  path="/login" />
        </Routes>
    );
};

export default UnSecureRoutes;
