import InputFeild from "@/components/common/InputFeild/InputFeild";
import MainButton from "@/components/common/MainButton/MainButton";
import Loading from "@/components/common/loading";
import Logo from "@/components/common/Logo/Logo";
import { setUser } from "@/store/slices/userSlices";
import { Box, Checkbox, Container, IconButton, InputAdornment, Stack, Typography, useTheme } from "@mui/material";
import { Visibility, VisibilityOff, ReplyIcon } from "@/assets/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const [form, setForm] = useState({
        name: { value: "", error: "" },
        email: { value: "", error: "" },
        password: { value: "", error: "" },
        confirmPassword: { value: "", error: "" },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: { ...prev[key], value } }));
    };

    const handleValidation = () => {
        let isValid = true;
        const updates = { ...form };

        if (!form.name.value.trim()) {
            updates.name.error = "Name is required.";
            isValid = false;
        } else {
            updates.name.error = "";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(form.email.value.trim())) {
            updates.email.error = "Invalid email address";
            isValid = false;
        } else {
            updates.email.error = "";
        }

        const password = form.password.value.trim();
        const minLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);

        if (!minLength || !hasNumber || !hasSpecialChar || !hasUppercase || !hasLowercase) {
            updates.password.error = "Password must include 8+ chars, 1 number, 1 special char, and both cases.";
            isValid = false;
        } else {
            updates.password.error = "";
        }

        if (form.confirmPassword.value.trim() !== password) {
            updates.confirmPassword.error = "Passwords do not match.";
            isValid = false;
        } else {
            updates.confirmPassword.error = "";
        }

        setForm(updates);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoading || !handleValidation()) return;

        setIsLoading(true);
        setTimeout(() => {
            dispatch(setUser({ name: form.name.value, id: 1, address: "" }));
            setIsLoading(false);
            navigate("/");
        }, 2000);
    };

    const handleToggleVisibility = () => setShowPassword((prev) => !prev);

    const endAdornment = (
        <InputAdornment position="end">
            <IconButton onClick={handleToggleVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    );

    if (isLoading) return <Loading isLoading={true} />;

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Container maxWidth="sm">
                <Box
                    sx={{
                        border: `2px solid ${theme.palette.secondary.main}`,
                        borderRadius: "15px",
                        padding: { md: 4, xs: 1.5 },
                        position: "relative",
                    }}
                >
                    <Box position="absolute" top={0} left="10px">
                        <IconButton component={Link} to="/login" sx={{ display: "flex", gap: 1 }}>
                            <ReplyIcon color={theme.palette.text.primary} />
                            <Typography color="textPrimary">Back</Typography>
                        </IconButton>
                    </Box>

                    <Box display="flex" justifyContent="center">
                        <Logo />
                    </Box>

                    <Typography
                        sx={{
                            textAlign: "center",
                            color: theme.palette.text.secondary,
                            fontWeight: 700,
                            fontSize: { md: "22px", xs: "18px" },
                            mt: { md: 2, xs: 1.5 },
                        }}
                    >
                        Create Your Account
                    </Typography>

                    <Typography textAlign="center" color="textSecondary" mt={1}>
                        Join the Trend Up platform today.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <InputFeild
                            placeholder="Name"
                            lable="Name"
                            name="name"
                            type="text"
                            value={form.name.value}
                            error={form.name.error}
                            onChange={(e) => handleInput("name", e.target.value)}
                        />
                        <InputFeild
                            placeholder="Email"
                            lable="Email"
                            name="email"
                            type="email"
                            value={form.email.value}
                            error={form.email.error}
                            onChange={(e) => handleInput("email", e.target.value)}
                        />
                        <InputFeild
                            placeholder="Password"
                            lable="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={endAdornment}
                            value={form.password.value}
                            error={form.password.error}
                            onChange={(e) => handleInput("password", e.target.value)}
                        />
                        <InputFeild
                            placeholder="Confirm Password"
                            lable="Confirm Password"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            endAdornment={endAdornment}
                            value={form.confirmPassword.value}
                            error={form.confirmPassword.error}
                            onChange={(e) => handleInput("confirmPassword", e.target.value)}
                        />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                            <Typography color="textPrimary" fontWeight={500} fontSize="14px">
                                I agree to Terms & Conditions
                            </Typography>
                        </Stack>

                        <Stack direction="column" alignItems="center" justifyContent="center" mt={2}>
                            <MainButton sx={{ width: "230px" }} type="submit">
                                Register
                            </MainButton>
                        </Stack>

                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <Typography color="textPrimary" mt={2} align="center">
                                Already have an account? Log in
                            </Typography>
                        </Link>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default Register;
