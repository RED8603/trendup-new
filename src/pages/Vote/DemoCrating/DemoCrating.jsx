import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import ButtonMain from "@/components/common/ButtonMain";
import InputFeild from "@/components/common/InputFeild/InputFeild";
import Loading from "@/components/common/loading";
import MainButton from "@/components/common/MainButton/MainButton";
import Toastify from "@/components/common/Toastify";
import { useTokenWriteFunction } from "@/connectivityAssets/hooks";
import { useGenrelContext } from "@/context/GenrelContext";
import { Typography, LinearProgress, Box, Stack, useTheme, Container, AvatarGroup, Avatar } from "@mui/material";
import { useAppKit } from "@reown/appkit/react";
import { useState } from "react";
const votingOptions = [
    { id: 1, label: "1% - Reduce fees", percentage: 23 },
    { id: 2, label: "2% - Keep current fees", percentage: 62 },
    { id: 3, label: "3% - Increase fees", percentage: 15 },
];

const participents = [
    { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/250px-User_icon_2.svg.png" },
    { img: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740" },
    {
        img: "https://static.vecteezy.com/system/resources/thumbnails/004/607/791/small_2x/man-face-emotive-icon-smiling-male-character-in-blue-shirt-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg",
    },
    {
        img: "https://static.vecteezy.com/system/resources/thumbnails/004/607/791/small_2x/man-face-emotive-icon-smiling-male-character-in-blue-shirt-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg",
    },
    { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9lRck6miglY0SZF_BZ_sK829yiNskgYRUg&s" },
    { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s" },
];
export default function GeneralVotingComponent() {
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

    const onTextChange = (e) => {
        const text = e.target.value?.trim();

        setTitle((prev) => ({ ...prev, text: text, error: text?.length < 2 ? "Minimum two chrachters allowed" : "" }));
    };
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
                <Box sx={{
                        border: `2px solid ${theme.palette.secondary.main}`,
                        borderRadius: "15px",
                        padding: { md: 3, xs: 1.5 },
                    }}>
                    <Box sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <Typography variant="h3" color={theme.palette.text.secondary}>
                                Democratic VotingView Results:
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
                                variant="h6"
                                sx={{
                                    color: "#a0a0a0",
                                    textAlign: "center",
                                    mt: 3,
                                }}
                            >
                               Your Balance: 0
                            </Typography>

                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                mt={5}
                                gap={"40px"}
                            >
                                <AvatarGroup max={4}>
                                    {participents.map((item, i) => (
                                        <Avatar src={item.img} key={i} sizes="small" />
                                    ))}
                                </AvatarGroup>

                                <Typography
                                    sx={(theme) => ({
                                        textAlign: "center",
                                        color: theme.palette.secondary.main,
                                    })}
                                >
                                    People
                                </Typography>
                            </Stack>
                            {/* Vote Button */}
                            <InputFeild
                                placeholder="Vote Id"
                                name="voteId"
                                type="text"
                                onChange={onTextChange}
                                value={title.text}
                                error={title.error}
                            />
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
