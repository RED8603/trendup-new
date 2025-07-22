import { ArrowForwardIcon, Visibility, VisibilityOff } from "@/assets/icons";
import ButtonBorder from "@/components/common/ButtonBorder";
import ButtonMain from "@/components/common/ButtonMain";
import InputFeild from "@/components/common/InputFeild/InputFeild";
import Loading from "@/components/common/loading";
import { setUser } from "@/store/slices/userSlices";
import { Box, Checkbox, Container, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState({ email: "", error: "" });
    const [password, setPassword] = useState({ password: "", error: "" });
    const [showPassword, setShowPassword] = useState(false);

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
                    })}
                >
                    <Typography
                        sx={(theme) => ({
                            fontSize: {
                                md: "22px",
                                xs: "18px",
                            },
                            textAlign: "center",
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                        })}
                    >
                        {" "}
                        Trend-Up{" "}
                    </Typography>
                    <Typography
                        sx={(theme) => ({
                            fontSize: {
                                md: "22px",
                                xs: "18px",
                            },
                            textAlign: "center",
                            color: theme.palette.text.secondary,
                            fontWeight: 700,
                            mt: 1,
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
                                inputProps={{ "aria-label": "controlled" }}
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
                        <Stack
                            direction="row"
                            sx={{ gap: { md: "50px", xs: "10px" } }}
                            alignItems={"center"}
                            justifyContent={"center"}
                            mt={2}
                        >
                            <ButtonMain sx={{ width: "150px" }} type="submit" onClick={handleSubmit}>
                                Login
                            </ButtonMain>
                            <ButtonBorder sx={{ width: "150px" }}>
                                Wallet <ArrowForwardIcon />{" "}
                            </ButtonBorder>
                        </Stack>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
