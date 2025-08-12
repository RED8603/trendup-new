import {
    Box,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Avatar,
    Badge,
    Chip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import BoxConatner from "@/components/common/BoxContainer/BoxConatner";

export default function UserList({ users, conversations, activeUserId, searchQuery, onSearchChange, onUserSelect }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "online":
                return "#43b581";
            case "away":
                return "#faa61a";
            case "busy":
                return "#f04747";
            case "offline":
                return "#747f8d";
            default:
                return "#747f8d";
        }
    };

    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <BoxConatner sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Server Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "rgba(255,255,255,0.1)" }}>
                <Typography variant="h6" sx={{ color: "#dcddde", fontWeight: 600 }}>
                    Trendup Chat
                </Typography>
            </Box>

            {/* Search */}
            <Box sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: "#b9bbbe", mr: 1 }} />,
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            bgcolor: "#40444b",
                            color: "#dcddde",
                            "& fieldset": {
                                borderColor: "rgba(255,255,255,0.1)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#5865F2",
                            },
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#72767d",
                            opacity: 1,
                        },
                    }}
                />
            </Box>

            {/* Users List */}
            <Box
                sx={{
                    flex: 1,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#333",
                        borderRadius: "8px",
                    },
                    "&": {
                        scrollbarColor: "#333 transparent",
                        scrollbarWidth: "thin",
                    },
                }}
            >
                <List sx={{ py: 0 }}>
                    {filteredUsers.map((user) => {
                        const conversation = conversations.find((conv) => conv.userId === user.id);
                        const isActive = activeUserId === user.id;
                        const unreadCount = conversation?.unreadCount || 0;

                        return (
                            <ListItem key={user.id} disablePadding>
                                <ListItemButton
                                    onClick={() => onUserSelect(user.id)}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        bgcolor: isActive ? "rgba(88, 101, 242, 0.1)" : "transparent",
                                        "&:hover": {
                                            bgcolor: isActive ? "rgba(88, 101, 242, 0.2)" : "rgba(255,255,255,0.05)",
                                        },
                                        borderLeft: isActive ? "3px solid #5865F2" : "3px solid transparent",
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                            badgeContent={
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: "50%",
                                                        bgcolor: getStatusColor(user.status),
                                                        border: "2px solid #2f3136",
                                                    }}
                                                />
                                            }
                                        >
                                            <Avatar
                                                src={user.avatar}
                                                sx={{ bgcolor: user.color, width: 40, height: 40 }}
                                            >
                                                {user.name[0]}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: isActive ? "#dcddde" : "#b9bbbe",
                                                        fontWeight: isActive ? 600 : 400,
                                                    }}
                                                >
                                                    {user.name}
                                                </Typography>
                                                {unreadCount > 0 && (
                                                    <Chip
                                                        label={unreadCount}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: "#f04747",
                                                            color: "white",
                                                            height: 18,
                                                            fontSize: "0.7rem",
                                                            minWidth: 18,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            user.status === "offline" && user.lastSeen ? (
                                                <Typography variant="caption" sx={{ color: "#72767d" }}>
                                                    Last seen{" "}
                                                    {user.lastSeen.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: getStatusColor(user.status),
                                                        textTransform: "capitalize",
                                                    }}
                                                >
                                                    {user.status}
                                                </Typography>
                                            )
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </BoxConatner>
    );
}
