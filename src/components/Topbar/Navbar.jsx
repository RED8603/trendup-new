import { Avatar, Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

import { useGenrelContext } from "@/context/GenrelContext";
import { darkLogo, lightLogo } from "@/assets";
import ButtonBorder from "@components/common/ButtonBorder";
import { ThemeToggle } from "../common/ToggelTheme/ToggelTheme";
import ConnectButton from "../common/ConnectButton/ConnectButton";
import { useSelector } from "react-redux";

const array = [
    {
        name: "Home",
        link1: "/",
    },
    {
        name: "Vote",
        link1: "/vote",
    },
    {
        name: "Chats",
        link1: "/chat",
    },
];

const Navbar = () => {
    const { isDarkMode } = useGenrelContext();
    const theme = useTheme();
    const { user } = useSelector((state) => state.user);

    return (
        <Container sx={{ position: "relative" }} maxWidth={"xl"}>
            <Box
                py={5}
                sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "transparent",
                }}
            >
                <Stack direction="row" alignItems="center" gap={"0px"}>
                    <img width="60px" src={isDarkMode ? darkLogo : lightLogo} alt="logo" srcSet="" />
                    <Typography fontWeight="700" fontSize="24px">
                        {" "}
                        Trend Up{" "}
                    </Typography>
                </Stack>

                {user && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            gap: "0px 80px",
                            alignItems: "center",
                            borderRadius: "10px",
                        }}
                    >
                        <Box>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    alignItems: "center",
                                }}
                            >
                                {array.map((item, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            to={item.link1}
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "none",
                                                padding: "10px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                textTransform: "capitalize",
                                                color: theme.palette.primary.main,
                                                alignItems: "center",
                                                fontWeight: "700",
                                            }}
                                            className="cool-link"
                                        >
                                            {item.name.toUpperCase()}
                                        </Link>
                                    );
                                })}

                                <a
                                    href="/whitePaper.pdf"
                                    style={{
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        fontSize: "12px",
                                        textTransform: "capitalize",
                                        color: theme.palette.primary.main,
                                        alignItems: "center",
                                        fontWeight: "700",
                                    }}
                                    className="cool-link"
                                    target="_blanck"
                                >
                                    WHITE PAPER
                                </a>
                                <a
                                    href="/audit.pdf"
                                    style={{
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        fontSize: "12px",
                                        textTransform: "capitalize",
                                        color: theme.palette.primary.main,
                                        alignItems: "center",
                                        fontWeight: "700",
                                    }}
                                    className="cool-link"
                                    target="_blanck"
                                >
                                    AUDIT
                                </a>
                            </Stack>
                        </Box>
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <ThemeToggle />

                    {user && (
                        <Link to="/user/profile">
                            <Avatar src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png" />
                        </Link>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Navbar;
