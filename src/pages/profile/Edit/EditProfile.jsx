import { useState } from "react";
import { Button, CardContent, TextField, Avatar, Box, Typography, Grid } from "@mui/material";
import { PhotoCamera as CameraIcon, Save as SaveIcon, Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import MainButton from "@/components/common/MainButton/MainButton";

export default function EditProfilePage() {
    const [profileData, setProfileData] = useState({
    name: "John Doe",
    username: "johndoe",
 
    bio: "Frontend Developer | React & Next.js Enthusiast | Tech Blogger",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinDate: "January 2022",
    profileImage: "https://images.pexels.com/photos/163077/mario-yoschi-figures-funny-163077.jpeg",
    backgroundImage: "https://images.pexels.com/photos/158826/structure-light-led-movement-158826.jpeg",
});

   
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageUpload = (type) => {
        console.log(`Upload ${type} image`);
    };

    const handleSave = () => {
        console.log("Saving profile data:", profileData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <BoxConatner>
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Typography variant="h3" sx={{ color: "text.primary", fontWeight: "bold" }}>
                        Edit Profile
                    </Typography>
                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <MainButton sx={{ borderRadius: 2, px: 3, py: 1.5 }}>Back to Profile</MainButton>
                    </Link>
                </Box>

                <Box sx={{ overflow: "hidden" }}>
                    {/* Background Image Section */}
                    <Box
                        sx={{
                            height: 192,
                            backgroundImage: `url(${profileData.backgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                            "&:hover .cover-overlay": { opacity: isEditing ? 1 : 0.9 },
                        }}
                    >
                        <Box
                            className="cover-overlay"
                            sx={{
                                position: "absolute",
                                inset: 0,
                                bgcolor: "rgba(0,0,0,0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "opacity 0.2s",
                            }}
                        >
                            <MainButton
                                onClick={() => handleImageUpload("background")}
                                startIcon={<CameraIcon />}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.9)",
                                    color: "black",
                                    "&:hover": { bgcolor: "white" },
                                }}
                            >
                                Change Cover
                            </MainButton>
                        </Box>
                    </Box>

                    <Box sx={{p:3}}>
                        {/* Profile Image Section */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3 }}>
                            <Box sx={{ position: "relative" }}>
                                <Avatar
                                    src={profileData.profileImage || "/placeholder.svg"}
                                    alt={profileData.name}
                                    sx={{
                                        width: 112,
                                        height: 112,
                                        mt: -7,
                                        border: "4px solid",
                                        borderColor: "background.paper",
                                        boxShadow: 3,
                                    }}
                                >
                                    {profileData.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </Avatar>
                                {isEditing && (
                                    <Button
                                        onClick={() => handleImageUpload("profile")}
                                        sx={{
                                            position: "absolute",
                                            bottom: -8,
                                            right: -8,
                                            minWidth: 32,
                                            width: 32,
                                            height: 32,
                                            bgcolor: "primary.main",
                                            "&:hover": { bgcolor: "primary.dark" },
                                        }}
                                    >
                                        <CameraIcon sx={{ fontSize: 16 }} />
                                    </Button>
                                )}
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: "flex", gap: 1 }}>
                                
                                        <MainButton onClick={handleCancel} startIcon={<CloseIcon />}>
                                            Cancel
                                        </MainButton>
                                        <MainButton onClick={handleSave} startIcon={<SaveIcon />}>
                                            Save Changes
                                        </MainButton>
                                 
                            </Box>
                        </Box>

                        <Box sx={{ borderTop: 1, borderColor: "divider", pt: 3 }}>
                            {/* Form Fields */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <TextField
                                    label="Display Name"
                                    value={profileData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                
                                    fullWidth
                                    variant="outlined"
                                />

                                <TextField
                                    label="Username"
                                    value={profileData.username}
                                    onChange={(e) => handleInputChange("username", e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />

                                <TextField
                                    label="Bio"
                                    value={profileData.bio}
                                    onChange={(e) => handleInputChange("bio", e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Location"
                                            value={profileData.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Website"
                                            value={profileData.website}
                                            onChange={(e) => handleInputChange("website", e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </BoxConatner>
    );
}
