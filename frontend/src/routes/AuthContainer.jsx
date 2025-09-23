import Loading from "@/components/common/loading";
import { useSelector } from "react-redux";
import SecureRoutes from "@routes/SecureRoutes/SecureRoutes";
import UnSecureRoutes from "@routes/UnSecureRoutes/UnSecureRoutes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContainer = () => {
    const { user, loading } = useSelector((state) => state.user);
    console.log(user, loading);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate("/login");
        }
    }, [user, loading]);

    if (loading) return <Loading isLoading={true} />;

    return <div>{user ? <SecureRoutes /> : <UnSecureRoutes />}</div>;
};

export default AuthContainer;
