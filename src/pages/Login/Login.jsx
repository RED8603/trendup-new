import { AppleIcon, GoogleIcon, ReplyIcon, Visibility, VisibilityOff, WalletIcon } from "@/assets/icons";

import InputFeild from "@/components/common/InputFeild/InputFeild";
import Loading from "@/components/common/loading";
import Logo from "@/components/common/Logo/Logo";
import MainButton from "@/components/common/MainButton/MainButton";
import { setUser } from "@/store/slices/userSlices";
import { Box, Checkbox, Container, IconButton, InputAdornment, Stack, Typography, useTheme } from "@mui/material";
import { useAppKit } from "@reown/appkit/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { open } = useAppKit();
    const theme = useTheme();

    const [email, setEmail] = useState({ email: "", error: "" });
    const [password, setPassword] = useState({ password: "", error: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loginWithEmail, setLoginWithEmail] = useState(false);

    const [checked, setChecked] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleToggleVisibility = () => setShowPassword((prev) => !prev);

    const endAdornment = (
        <InputAdornment position="end">
            <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={handleToggleVisibility}
                edge="end"
            >
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    );

    const handleEmailChange = (e) => {
        const _email = e.target.value.trim();
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email);
        setEmail((prev) => ({
            ...prev,
            email: _email,
            error: isValidEmail || email === "" ? "" : "Invalid email address",
        }));
    };

    const handlePasswordChange = (e) => {
        const _password = e.target.value?.trim();
        // Validation Conditions
        const minLength = _password.length >= 8;
        const hasNumber = /\d/.test(_password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(_password);
        const hasUppercase = /[A-Z]/.test(_password);
        const hasLowercase = /[a-z]/.test(_password);

        let error = "";
        if (!minLength) {
            error = "Password must be at least 8 characters long.";
        } else if (!hasNumber) {
            error = "Password must include at least one number.";
        } else if (!hasSpecialChar) {
            error = "Password must include at least one special character.";
        } else if (!hasUppercase) {
            error = "Password must include at least one uppercase letter.";
        } else if (!hasLowercase) {
            error = "Password must include at least one lowercase letter.";
        }
        setPassword((prev) => ({
            ...prev,
            password: _password,
            error,
        }));
    };

    const handleSubmit = () => {
        if (isLoading) return;
        setIsLoading(true);
        setTimeout(() => {
            dispatch(setUser({ name: "user", id: 1, address: "" }));
            setIsLoading(false);
            navigate("/");
        }, 2000);
    };
    if (isLoading) return <Loading isLoading={true} />;

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Container maxWidth="sm">
                <Box
                    sx={(theme) => ({
                        border: `2px solid ${theme.palette.secondary.main}`,
                        borderRadius: "15px",
                        padding: { md: 4, xs: 1.5 },
                        position: "relative",
                    })}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: "10px",
                        }}
                    >
                        <IconButton sx={{ display: "flex", alignItems: "center", gap: "5px" }} onClick={handleSubmit}>
                            <ReplyIcon color={theme.palette.text.primary} />{" "}
                            <Typography color="textPrimary"> Skip </Typography>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Logo />
                    </Box>

                    <Typography
                        sx={(theme) => ({
                            fontSize: {
                                md: "22px",
                                xs: "18px",
                            },
                            textAlign: "center",
                            color: theme.palette.text.secondary,
                            fontWeight: 700,
                            mt: { md: 2, xs: 1.5 },
                        })}
                    >
                        Welcome Back!
                    </Typography>
                    <Typography
                        sx={(theme) => ({
                            textAlign: "center",
                            color: theme.palette.text.secondary,
                            mt: 1,
                        })}
                    >
                        Login to continue
                    </Typography>

                    {loginWithEmail ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            <InputFeild
                                placeholder="Email"
                                lable="Email"
                                name="email"
                                type="email"
                                onChange={handleEmailChange}
                                value={email.email}
                                error={email.error}
                            />
                            <InputFeild
                                placeholder="Password"
                                lable="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                endAdornment={endAdornment}
                                onChange={handlePasswordChange}
                                value={password.password}
                                error={password.error}
                            />
                            <Stack direction="row" justifyContent="space-between" alignItems={"center"}>
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    slotProps={{ "aria-label": "controlled" }}
                                />

                                <Typography
                                    sx={(theme) => ({
                                        color: theme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: "14px",
                                    })}
                                >
                                    {" "}
                                    Forgot Password?{" "}
                                </Typography>
                            </Stack>
                            <Stack direction="column" alignItems={"center"} justifyContent={"center"} mt={2}>
                                <MainButton
                                    sx={{ width: "230px" }}
                                    type="submit"
                                    onClick={() => setLoginWithEmail(true)}
                                >
                                    Login
                                </MainButton>
                            </Stack>
                        </form>
                    ) : (
                        <Stack
                            direction="column"
                            sx={{ gap: { xs: "10px" } }}
                            alignItems={"center"}
                            justifyContent={"center"}
                            mt={4}
                        >
                            <MainButton sx={{ width: "230px" }} startIcon={<WalletIcon />} onClick={open}>
                                Connect Wallet{" "}
                            </MainButton>
                            <MainButton sx={{ width: "230px" }} startIcon={<GoogleIcon />} onClick={handleSubmit}>
                                Log in with Goggle{" "}
                            </MainButton>
                            <MainButton sx={{ width: "230px" }} startIcon={<AppleIcon />} onClick={handleSubmit}>
                                Wallet with Apple
                            </MainButton>
                            <MainButton sx={{ width: "230px" }} onClick={() => setLoginWithEmail(true)}>
                                Login with Email
                            </MainButton>
                        </Stack>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
