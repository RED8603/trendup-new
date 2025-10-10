import { useState } from "react";
import { Box, Typography, Stack, Container, useTheme, LinearProgress, Divider, Fade } from "@mui/material";
import Loading from "@/components/common/loading";
import MainButton from "@/components/common/MainButton/MainButton";
import { useToast } from "@/hooks/useToast.jsx";
import { useTokenWriteFunction } from "@/connectivityAssets/hooks";
import { useGenrelContext } from "@/context/GenrelContext";
import { useAppKit } from "@reown/appkit/react";
import VoteContainer from "@/components/common/VoteContainer/VoteContainer";

export default function HodleVoting() {
    const theme = useTheme();
    const { address } = useGenrelContext();
    const { open } = useAppKit();
    const { handleWriteContract } = useTokenWriteFunction();

    const [title, _setTitle] = useState({ text: "", error: "" });
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const vote = async () => {
        if (title.text.trim().length < 2) {
            showToast("Minimum two characters allowed", "error");
            return;
        }
        try {
            setIsLoading(true);
            await handleWriteContract("createDemocraticVote", [title.text], address);
        } catch (error) {
            const errMsg = error?.data?.message || error?.reason || error?.message || "Voting failed";
            showToast(errMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Loading isLoading={isLoading} />
            <Container maxWidth="md">
                <VoteContainer>
                    <Fade in timeout={300}>
                        <Stack spacing={2}>
                            <Typography variant="h4" fontWeight={600} color="text.primary">
                                🏦 HODL Voting
                            </Typography>

                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                Voting ends in 6 days
                            </Typography>

                            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

                            <Typography variant="h6" fontWeight={500} color="text.secondary">
                                Reduce the maximum sell limit to 10% of holdings.
                            </Typography>

                            <Stack spacing={2}>
                                <Box>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body1" fontWeight={600} color="text.primary">
                                            Yes
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600} color="text.primary">
                                            No
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={40}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: theme.palette.background.default,
                                            "& .MuiLinearProgress-bar": {
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                                boxShadow: `0 0 8px ${theme.palette.primary.main}`,
                                            },
                                        }}
                                    />
                                    <Stack direction="row" justifyContent="space-between" mt={1}>
                                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                                            40%
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                                            60%
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>

                            <Stack spacing={1} mt={2}>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Accepted Currencies: ETH, Trendup
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ wordBreak: "break-word" }}
                                >
                                    Token address TUP: 0x52c06a62d9495bee1dadf2ba0f5c0588a4f3c14c
                                </Typography>
                            </Stack>

                            <MainButton
                                onClick={address ? vote : open}
                                fullWidth
                                sx={{
                                    mt: 3,
                                    fontWeight: 600,
                                    background: theme.palette.primary.main,
                                    ":hover": {
                                        background: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                {address ? "Submit Vote" : "Connect Wallet"}
                            </MainButton>
                        </Stack>
                    </Fade>
                </VoteContainer>
            </Container>
        </>
    );
}
