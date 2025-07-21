import { createTheme } from "@mui/material/styles";

// Light Theme
const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#16b48e", // 
        },
        secondary: {
            main: "#616161", //
        },
        background: {
            default: "#f4f6f8", // Light grey
            paper: "#616161", // White
        },
        text: {
            primary: "#16b48e", // Black
            secondary: "#030303", // Grey
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: "2.5rem",
            fontWeight: 500,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 500,
        },
        // Add more typography settings as needed
    },
    transitions: {
        duration: {
            standard: 300,
        },
    },
});

// Dark Theme
const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#16b48e", // Light blue
        },
        secondary: {
            main: "#616161", // Light pink
        },
        background: {
            default: "#030303", // Dark grey
            paper: "#616161", // Slightly lighter dark grey
        },
        text: {
            primary: "#16b48e", // White
            secondary: "#fff", // Light grey
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: "2.5rem",
            fontWeight: 500,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 500,
        },
        // Add more typography settings as needed
    },
    transitions: {
        duration: {
            standard: 300,
        },
    },
});

export { lightTheme, darkTheme };
