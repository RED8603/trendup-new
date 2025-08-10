import { Box, Typography, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import darkLogo from "../../assets/images/darkLogo.svg";

export default function WelcomeScreen({ isMobile, onOpenDrawer }) {
    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 4,
            }}
        >
            {isMobile && (
                <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                    <IconButton onClick={onOpenDrawer} sx={{ color: "#b9bbbe" }}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            <Box
                component={"img"}
                src={darkLogo}
                alt="darkLogo"
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                }}
            />

            <Typography
                variant="h4"
                sx={{
                    color: "#dcddde",
                    fontWeight: 600,
                    mb: 2,
                }}
            >
              Trendup
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: "#b9bbbe",
                    mb: 4,
                    maxWidth: 400,
                    lineHeight: 1.6,
                }}
            >
                Select a user from the sidebar to start chatting, or join a channel to see what's happening in your
                community.
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: "#72767d",
                        fontSize: "0.9rem",
                    }}
                >
                    💬 Click on any user to start a conversation
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "#72767d",
                        fontSize: "0.9rem",
                    }}
                >
                    🔍 Use the search bar to find specific users
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "#72767d",
                        fontSize: "0.9rem",
                    }}
                >
                    📱 On mobile, tap the menu icon to access the user list
                </Typography>
            </Box>
        </Box>
    );
}
