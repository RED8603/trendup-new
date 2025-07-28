import { Typography, LinearProgress, Button, Box, Stack, useTheme, Container } from "@mui/material";
import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import ButtonMain from "@/components/common/ButtonMain";

export default function HodleVoting() {
    const theme = useTheme();

    return (
        <Container maxWidth="md">
            <BoxConatner>
                <Box>
                    <Stack sx={{ p: 2 }}>
                        {/* Title */}
                        <Box>
                            <Typography variant="h3" color={theme.palette.text.secondary}>
                                Sell Limits Poll
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "1rem",
                                    transition: "color 0.3s ease",
                                    my: 1,
                                }}
                            >
                                Voting ends in 6 days
                            </Typography>
                        </Box>

                        {/* Description */}
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.primary,
                                fontSize: "1.1rem",
                                lineHeight: 1.5,
                                transition: "color 0.3s ease",
                                mb: 1,
                            }}
                        >
                            Reduce the maximum sell limit to 10% of holdings.
                        </Typography>

                        {/* Voting Results */}
                        <Stack spacing={3}>
                            {/* Yes Option */}
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "600",
                                            fontSize: "1.2rem",
                                            mb: 1,
                                            transition: "color 0.3s ease",
                                        }}
                                    >
                                        Yes
                                    </Typography>{" "}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "600",
                                            fontSize: "1.2rem",
                                            mb: 1,
                                            transition: "color 0.3s ease",
                                        }}
                                    >
                                        No
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={40}
                                    sx={{
                                        height: 15,
                                        borderRadius: 4,
                                        backgroundColor: theme.palette.background.paper,
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: theme.palette.text.primary,
                                            borderRadius: 4,
                                        },
                                        transition: "background-color 0.3s ease",
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mt: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            mt: 1,
                                            transition: "color 0.3s ease",
                                        }}
                                    >
                                        {40}%
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            mt: 1,
                                            transition: "color 0.3s ease",
                                        }}
                                    >
                                        {60}%
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>

                        {/* Voting Buttons */}
                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                            <ButtonMain fullWidth>Yes</ButtonMain>
                            <ButtonMain
                                fullWidth
                                sx={{
                                    background: "red",
                                    color: "#fff",
                                }}
                            >
                                No
                            </ButtonMain>
                        </Stack>
                    </Stack>
                </Box>
            </BoxConatner>
        </Container>
    );
}
