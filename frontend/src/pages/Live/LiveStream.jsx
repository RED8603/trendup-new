import { useState, useEffect } from "react";
import { Box, styled, alpha} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import VideoGridComponent from "./components/VideoGrid";
import VideoControls from "./components/VideoControls";
import LiveChat from "./components/LiveChat";
import NotificationAnimation from "./components/NotificationAnimation";

// Import hooks
import useCamera from "./hooks/useCamera";

// Styled components
const LiveContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    background:
        theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${alpha(theme.palette.primary.dark, 0.7)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`,
    position: "relative",
    overflow: "hidden",
}));

const VideoSection = styled(Box)(({ theme }) => ({
    flex: 1,
    position: "relative",
    overflow: "hidden",
    background: theme.palette.grey[900],
}));

const ChatSection = styled(motion.div)(({ theme }) => ({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: alpha(theme.palette.background.paper, 0.95),
    backdropFilter: "blur(20px)",
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    maxHeight: "50vh",
    display: "flex",
    flexDirection: "column",
}));

const ChatToggleButton = styled(motion.button)(({ theme }) => ({
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: alpha(theme.palette.primary.main, 0.9),
    color: theme.palette.common.white,
    border: "none",
    borderRadius: "20px",
    padding: "10px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    zIndex: 101,
    backdropFilter: "blur(10px)",
    boxShadow: theme.shadows[4],
    "&:hover": {
        backgroundColor: theme.palette.primary.main,
        transform: "scale(1.05)",
    },
}));

const LiveStreamView = () => {
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Camera hook
    const { cameraActive, cameraError, isInitializing, videoRef, toggleCamera } = useCamera();

    // State
    const [viewers, setViewers] = useState(1254);
    const [messages, setMessages] = useState([
        { id: 1, user: "Justin", text: "Awesome stream!", type: "message" },
        { id: 2, user: "Emma", text: "Thank you!", type: "message" },
        { id: 3, user: "Adam", text: "donated $19.99", type: "donation" },
    ]);
    const [liveUsers, setLiveUsers] = useState([
        { id: 1, name: "Emma", isActive: true, isSpeaking: true, hasVideo: true, hasAudio: true },
        { id: 2, name: "Alex", isActive: false, isSpeaking: false, hasVideo: true, hasAudio: false },
        { id: 3, name: "Jordan", isActive: false, isSpeaking: true, hasVideo: false, hasAudio: true },
        { id: 4, name: "James", isActive: false, isSpeaking: true, hasVideo: true, hasAudio: true },
    ]);
    const [chatOpen, setChatOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Effects
    useEffect(() => {
        const interval = setInterval(() => {
            setViewers((prev) => Math.max(1000, prev + Math.floor(Math.random() * 10) - 3));
            setLiveUsers((prev) =>
                prev.map((user) => ({
                    ...user,
                    isSpeaking: Math.random() > 0.7,
                    hasVideo: Math.random() > 0.2,
                    hasAudio: Math.random() > 0.3,
                }))
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Event handlers
    const handleSendMessage = (message) => {
        const newMessage = {
            id: Date.now(),
            user: "You",
            text: message,
            type: "message",
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const handleDonate = () => {
        const donationAmount = (Math.random() * 50 + 5).toFixed(2);
        const donorName = "Anonymous";

        const newMessage = {
            id: Date.now(),
            user: donorName,
            text: `donated $${donationAmount}`,
            type: "donation",
        };

        setMessages((prev) => [...prev, newMessage]);

        addNotification({
            type: "donation",
            data: {
                name: donorName,
                amount: donationAmount,
                message: "Thanks for the support!",
            },
        });
    };

    const handleLike = () => {
        const likerName = "Viewer";
        const likeCount = Math.floor(Math.random() * 5) + 1;

        const newMessage = {
            id: Date.now(),
            user: likerName,
            text: `liked the stream ${likeCount > 1 ? `${likeCount} times` : ""}`,
            type: "like",
        };

        setMessages((prev) => [...prev, newMessage]);

        addNotification({
            type: "like",
            data: {
                name: likerName,
                count: likeCount,
            },
        });
    };

    const handleSubscribe = () => {
        const subscriberName = "New Subscriber";
        const tier = Math.floor(Math.random() * 3) + 1;

        const newMessage = {
            id: Date.now(),
            user: subscriberName,
            text: `subscribed at Tier ${tier}!`,
            type: "subscription",
        };

        setMessages((prev) => [...prev, newMessage]);

        addNotification({
            type: "subscribe",
            data: {
                name: subscriberName,
                tier: tier,
            },
        });
    };

    const handleFollow = () => {
        const followerName = "New Follower";

        const newMessage = {
            id: Date.now(),
            user: followerName,
            text: "started following!",
            type: "follow",
        };

        setMessages((prev) => [...prev, newMessage]);

        addNotification({
            type: "follow",
            data: {
                name: followerName,
            },
        });
    };

    const handleGift = () => {
        const gifterName = "Generous Viewer";
        const giftName = "Super Gift";

        const newMessage = {
            id: Date.now(),
            user: gifterName,
            text: `sent a ${giftName}!`,
            type: "gift",
        };

        setMessages((prev) => [...prev, newMessage]);

        addNotification({
            type: "gift",
            data: {
                name: gifterName,
                giftName: giftName,
            },
        });
    };

    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: Date.now(),
            timestamp: Date.now(),
        };

        setNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
        }, 4000);
    };

    const handleUserClick = (userId) => {
        setLiveUsers((prev) =>
            prev.map((user) => ({
                ...user,
                isActive: user.id === userId,
            }))
        );
    };

    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    const handleScreenShare = () => {
        console.log("Screen share clicked");
    };

    const handleMoreOptions = () => {
        console.log("More options clicked");
    };

    return (
        <LiveContainer>
            <VideoSection>
                {/* Video Grid */}
                <VideoGridComponent
                    liveUsers={liveUsers}
                    onUserClick={handleUserClick}
                    cameraActive={cameraActive}
                    cameraError={cameraError}
                    isInitializing={isInitializing}
                    videoRef={videoRef}
                    viewers={viewers}
                />

                {/* Video Controls */}
                <VideoControls
                    cameraActive={cameraActive}
                    isInitializing={isInitializing}
                    onToggleCamera={toggleCamera}
                    onScreenShare={handleScreenShare}
                    onMoreOptions={handleMoreOptions}
                />

                {/* Chat Toggle Button */}
                <ChatToggleButton
                    onClick={toggleChat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    💬 {chatOpen ? "Hide Chat" : "Show Chat"} • {messages.length}
                </ChatToggleButton>

                {/* Animated Chat Section */}
                <AnimatePresence>
                    {chatOpen && (
                        <ChatSection
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <LiveChat
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                onDonate={handleDonate}
                                onLike={handleLike}
                                onSubscribe={handleSubscribe}
                                onFollow={handleFollow}
                                onGift={handleGift}
                                chatOpen={chatOpen}
                                onToggleChat={toggleChat}
                                isCompact={true}
                            />
                        </ChatSection>
                    )}
                </AnimatePresence>
            </VideoSection>

            {/* Notification Animations Overlay */}
            {notifications.map((notification) => (
                <NotificationAnimation key={notification.id} notification={notification} />
            ))}
        </LiveContainer>
    );
};

export default LiveStreamView;
