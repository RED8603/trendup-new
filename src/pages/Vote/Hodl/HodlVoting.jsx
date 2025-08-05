import { Typography, LinearProgress, Box, Stack, useTheme, Container } from "@mui/material";
import { useGenrelContext } from "@/context/GenrelContext";
import { useAppKit } from "@reown/appkit/react";
import { useTokenWriteFunction } from "@/connectivityAssets/hooks";
import { useState } from "react";
import MainButton from "@/components/common/MainButton/MainButton";
import Loading from "@/components/common/loading";
import Toastify from "@/components/common/Toastify";

export default function HodleVoting() {
    const theme = useTheme();
    const { address } = useGenrelContext();
    const { open } = useAppKit();
    const { handleWriteContract } = useTokenWriteFunction();

    const [title, setTitle] = useState({ text: "", error: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [alertState, setAlertState] = useState({
        open: false,
        message: "",
        severity: undefined,
    });

    const showToast = (msg, type) => {
        return setAlertState({
            open: true,
            message: msg,
            severity: type,
        });
    };

    const vote = async () => {
        if (title.text?.trim()?.length < 2) {
            showToast("Minimum two chrachters allowed", "error");
            return;
        }
        try {
            setIsLoading(true);

            await handleWriteContract("createDemocraticVote", [title.text], address);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);

            if (error?.data?.message) {
                showToast(error?.data?.message, "error");
            } else if (error?.reason) {
                showToast(error?.reason, "error");
            } else {
                showToast(error?.message, "error");
            }
        }
    };

    return (
        <>
            <Loading isLoading={isLoading} />
            <Toastify setAlertState={setAlertState} alertState={alertState} />
            <Container maxWidth="md">
                <Box
                    sx={{
                        border: `2px solid ${theme.palette.secondary.main}`,
                        borderRadius: "15px",
                        padding: { md: 3, xs: 1.5 },
                    }}
                >
                    <Box>
                        <Stack sx={{ p: 2 }}>
                            {/* Title */}
                            <Box>
                                <Typography variant="h3" color={theme.palette.text.secondary}>
                                    HODL Voting
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

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#a0a0a0",
                                    textAlign: "center",
                                    mt: 3,
                                    fontSize: "0.9rem",
                                }}
                            >
                                Accepted Currencies : ETH,Trendup
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#a0a0a0",
                                    textAlign: "center",
                                    mt: 3,
                                    fontSize: "0.9rem",
                                }}
                            >
                                Token address TUP : 0x52c06a62d9495bee1dadf2ba0f5c0588a4f3c14c
                            </Typography>
                            {/* Voting Buttons */}

                            {address ? (
                                <>
                                    {" "}
                                    <MainButton onClick={vote} sx={{ mt: 2, width: "100%" }}>
                                        Vote
                                    </MainButton>
                                </>
                            ) : (
                                <MainButton onClick={open} sx={{ mt: 2, width: "100%" }}>
                                    Connect Wallet
                                </MainButton>
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
