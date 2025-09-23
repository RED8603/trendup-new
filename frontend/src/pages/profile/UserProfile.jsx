import { Box, CardContent, Avatar, Typography, Button, Stack, Divider, IconButton, Chip } from "@mui/material";
import {
    PersonAdd as PersonAddIcon,
    LocationOn as LocationIcon,
    Link as LinkIcon,
    MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import MainButton from "@/components/common/MainButton/MainButton";
import Posts from "@/components/Post/Posts";
import { dummyPost } from "@/constants";
import { Link } from "react-router-dom";

const user = {
    name: "John Doe",
    username: "johndoe",
    isVerified: true,
    bio: "Frontend Developer | React & Next.js Enthusiast | Tech Blogger",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinDate: "January 2022",
    profileImage: "https://images.pexels.com/photos/163077/mario-yoschi-figures-funny-163077.jpeg",
    backgroundImage: "https://images.pexels.com/photos/158826/structure-light-led-movement-158826.jpeg",
};
const stats = {
    posts: 134,
    followers: 12800,
    following: 350,
};
export default function Profile() {
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    };

    return (
        <>
            <BoxConatner sx={{ mt: 2, p: 1.5 }}>
                <Box
                    sx={{
                        height: 200,
                        backgroundImage: `url(${user.backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                        borderRadius: "3px",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                        }}
                    >
                        <IconButton
                            sx={{
                                bgcolor: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ px: 2, pt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 1 }}>
                        <Avatar
                            src={user.profileImage}
                            sx={{
                                width: 120,
                                height: 120,
                                mt: -8,
                                border: "4px solid var(--color-card)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                borderRadius: "50%",
                            }}
                        />
                        <Link to={"/edit-profile"}>
                        <MainButton sx={{ width: "150px" }}>Edit Profile</MainButton>
                        </Link>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "2rem", color: "text.secondary" }}>
                                {user.name}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                            @ {user.username}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "text.secondary", mb: 1, lineHeight: 1.5 }}>
                            {user.bio}
                        </Typography>

                        {/* Additional Info */}
                        <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap", gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    {user.location}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LinkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        "&:hover": { textDecoration: "underline" },
                                    }}
                                >
                                    {user.website}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Joined {user.joinDate}
                            </Typography>
                        </Stack>
                    </Box>

                    <Divider sx={{ bgcolor: "var(--color-border)", mb: 2 }} />

                    {/* Stats */}
                    <Stack direction="row" spacing={4}>
                        <Box sx={{ textAlign: "center", cursor: "pointer" }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                                {formatNumber(stats.posts)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Posts
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", cursor: "pointer" }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                                {formatNumber(stats.followers)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Followers
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", cursor: "pointer" }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                                {formatNumber(stats.following)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Following
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </BoxConatner>
            <BoxConatner sx={{ maxWidth: "full", mx: "auto", mt: 2, p: 1.5 }}>
                <Posts postData={dummyPost.slice(0,2)} />
            </BoxConatner>
        </>
    );
}
