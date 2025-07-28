import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import ButtonMain from "@/components/common/ButtonMain";
import { Typography, LinearProgress, Box, Stack, useTheme, Container } from "@mui/material";

const votingOptions = [
    { id: 1, label: "1% - Reduce fees", percentage: 23 },
    { id: 2, label: "2% - Keep current fees", percentage: 62 },
    { id: 3, label: "3% - Increase fees", percentage: 15 },
];

export default function GeneralVotingComponent() {
    const theme = useTheme();
    return (
        <Container maxWidth="md">
            <BoxConatner>
                <Box sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h3" color={theme.palette.text.secondary}>
                            General Voting
                        </Typography>

                        {/* Subtitle */}
                        <Typography
                            variant="body1"
                            color={theme.palette.text.primary}
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                mb: 1,
                                lineHeight: 1.4,
                            }}
                        >
                            Cast your vote Below.{"\n"}
                            Voting period lasts for 7 days.
                        </Typography>

                        {/* Question */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: "500",
                                fontSize: "1.1rem",
                                mt: 2,
                            }}
                        >
                            What should the transaction fees be set to?
                        </Typography>

                        {/* Voting Options */}
                        <Stack spacing={2.5} sx={{ mt: 2 }}>
                            {votingOptions.map((option) => (
                                <Box key={option.id}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography
                                            color={theme.palette.text.secondary}
                                            variant="body2"
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            {option.label}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color={theme.palette.text.primary}
                                            sx={{
                                                fontWeight: "bold",
                                                mb: 1,
                                            }}
                                        >
                                            {option.percentage}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={option.percentage}
                                        sx={{
                                            height: 15,
                                            borderRadius: 4,
                                            backgroundColor: theme.palette.background.paper,
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: theme.palette.text.primary,
                                                borderRadius: 4,
                                            },
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>

                        {/* Countdown Timer */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#a0a0a0",
                                textAlign: "center",
                                mt: 3,
                                fontSize: "0.9rem",
                            }}
                        >
                            Time for voting ends in: 5d 21h 47m
                        </Typography>

                        {/* Vote Button */}
                        <ButtonMain>VOTE</ButtonMain>
                    </Stack>
                </Box>
            </BoxConatner>
        </Container>
    );
}
