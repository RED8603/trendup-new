import { useGenrelContext } from "@/context/GenrelContext";
import { darkTheme, lightTheme } from "@/utils/theme";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, CssBaseline } from "@mui/material";
import Topbar from "@components/Topbar/Topbar";
import { AnimatePresence, motion } from "framer-motion";

const MotionDiv = motion.div;

const AppWrapper = ({ children }) => {
    const { isDarkMode } = useGenrelContext();
    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Topbar />
            <Box sx={{overflowX: "hidden"}} >
                <AnimatePresence mode="wait">
                    <MotionDiv
                        key={isDarkMode} // triggers animation on mode change
                        initial={{ x: isDarkMode === "light" ? -100 : 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isDarkMode === "light" ? 100 : -100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ padding: 20 }}
                    >
                        <Container maxWidth="xl">{children}</Container>
                    </MotionDiv>
                </AnimatePresence>
            </Box>
        </ThemeProvider>
    );
};

export default AppWrapper;
