import {
    Stack,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    VideocamOff as VideocamOffIcon,
    Videocam as VideocamIcon,
    ScreenShare as ScreenShareIcon,
    MoreVert as MoreIcon,
} from "@mui/icons-material";

const VideoControls = ({ 
    cameraActive, 
    isInitializing, 
    onToggleCamera,
    onScreenShare,
    onMoreOptions 
}) => {
    const theme = useTheme();
    const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Stack direction="row" spacing={1} sx={{ position: "absolute", bottom: 8, left: 8 }}>
            <Tooltip 
                title={isInitializing ? "Initializing camera..." : (cameraActive ? "Turn off camera" : "Turn on camera")}
                placement="top"
            >
                <IconButton
                    onClick={onToggleCamera}
                    disabled={isInitializing}
                    sx={{
                        backgroundColor: cameraActive 
                            ? alpha(theme.palette.error.main, 0.8)
                            : alpha(theme.palette.success.main, 0.8),
                        color: theme.palette.common.white,
                        "&:hover": {
                            backgroundColor: cameraActive 
                                ? theme.palette.error.main
                                : theme.palette.success.main,
                        },
                        "&:disabled": {
                            backgroundColor: alpha(theme.palette.grey[500], 0.5),
                            color: alpha(theme.palette.common.white, 0.5),
                        },
                        fontSize: isSmallMobile ? "small" : "medium",
                    }}
                >
                    {cameraActive ? (
                        <VideocamOffIcon fontSize={isSmallMobile ? "small" : "medium"} />
                    ) : (
                        <VideocamIcon fontSize={isSmallMobile ? "small" : "medium"} />
                    )}
                </IconButton>
            </Tooltip>

            <Tooltip title="Share screen" placement="top">
                <IconButton
                    onClick={onScreenShare}
                    sx={{
                        backgroundColor: alpha(theme.palette.grey[900], 0.7),
                        color: theme.palette.common.white,
                        fontSize: isSmallMobile ? "small" : "medium",
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.grey[800], 0.8),
                        },
                    }}
                >
                    <ScreenShareIcon fontSize={isSmallMobile ? "small" : "medium"} />
                </IconButton>
            </Tooltip>

            <Tooltip title="More options" placement="top">
                <IconButton
                    onClick={onMoreOptions}
                    sx={{
                        backgroundColor: alpha(theme.palette.grey[900], 0.7),
                        color: theme.palette.common.white,
                        fontSize: isSmallMobile ? "small" : "medium",
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.grey[800], 0.8),
                        },
                    }}
                >
                    <MoreIcon fontSize={isSmallMobile ? "small" : "medium"} />
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

export default VideoControls;
