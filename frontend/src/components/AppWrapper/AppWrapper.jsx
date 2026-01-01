import { useGenrelContext } from "@/context/GenrelContext";
import { darkTheme, lightTheme } from "@/utils/theme";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, CssBaseline } from "@mui/material";
import Topbar from "@components/Topbar/Topbar";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@components/Topbar/Sidebar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const MotionDiv = motion.div;

const AppWrapper = ({ children }) => {
    const { isDarkMode } = useGenrelContext();
    const { isGuestMode } = useSelector((state) => state.user);
    const location = useLocation();

    const duration = 0.3; // match 300ms from theme
    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            {/* <Topbar /> */}
            <Sidebar>
                <Box sx={{ overflowX: "hidden", position: "relative", width: "100%" }}>
                    <AnimatePresence mode="wait">
                        <MotionDiv
                            key={location.pathname}
                            initial={{
                                opacity: 0,
                                scale: 0.98,
                                y: 10,
                                filter: "blur(4px)",
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                filter: "blur(0px)",
                                transition: {
                                    duration,
                                    ease: "easeInOut",
                                },
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.98,
                                y: -10,
                                filter: "blur(4px)",
                                transition: {
                                    duration,
                                    ease: "easeInOut",
                                },
                            }}
                            style={{ width: "100%" }}
                        >
                            <Container 
                                maxWidth="xl"
                                sx={{
                                    pb: isGuestMode ? { xs: 12, sm: 14 } : 0,
                                    width: "100%",
                                    px: { xs: 1, sm: 2, md: 3 }
                                }}
                            >
                                {children}
                            </Container>
                        </MotionDiv>
                    </AnimatePresence>
                </Box>
            </Sidebar>
        </ThemeProvider>
    );
};

export default AppWrapper;
