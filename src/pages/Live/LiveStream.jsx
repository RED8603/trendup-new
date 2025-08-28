import { useState, useEffect } from "react";
import { Box, styled, alpha } from "@mui/material";

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

const LiveStreamView = () => {
    
    // Camera hook
    const { cameraActive, cameraError, isInitializing, videoRef, toggleCamera } = useCamera();
    
    // State
    const [viewers, setViewers] = useState(1254);
    const [messages, setMessages] = useState([
        { user: "Justin", text: "Awesome stream!", type: "message" },
        { user: "Emma", text: "Thank you!", type: "message" },
        { user: "Adam", text: "donated $19.99", type: "donation" },
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
            setViewers((prev) => prev + Math.floor(Math.random() * 10) - 3);
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
        setMessages([...messages, { user: "You", text: message, type: "message" }]);
    };

    const handleDonate = () => {
        const donationAmount = (Math.random() * 50 + 5).toFixed(2);
        const donorName = "Anonymous";
        
        // Add message to chat
        setMessages([
            ...messages,
            {
                user: donorName,
                text: `donated $${donationAmount}`,
                type: "donation",
            },
        ]);

        // Trigger donation animation
        addNotification({
            type: 'donation',
            data: {
                name: donorName,
                amount: donationAmount,
                message: 'Thanks for the support!'
            }
        });
    };

    const handleLike = () => {
        const likerName = "Viewer";
        const likeCount = Math.floor(Math.random() * 5) + 1;
        
        // Add message to chat
        setMessages([
            ...messages,
            {
                user: likerName,
                text: `liked the stream ${likeCount > 1 ? `${likeCount} times` : ''}`,
                type: "like",
            },
        ]);

        // Trigger like animation
        addNotification({
            type: 'like',
            data: {
                name: likerName,
                count: likeCount
            }
        });
    };

    const handleSubscribe = () => {
        const subscriberName = "New Subscriber";
        const tier = Math.floor(Math.random() * 3) + 1;
        
        // Add message to chat
        setMessages([
            ...messages,
            {
                user: subscriberName,
                text: `subscribed at Tier ${tier}!`,
                type: "subscription",
            },
        ]);

        // Trigger subscribe animation
        addNotification({
            type: 'subscribe',
            data: {
                name: subscriberName,
                tier: tier
            }
        });
    };

    const handleFollow = () => {
        const followerName = "New Follower";
        
        // Add message to chat
        setMessages([
            ...messages,
            {
                user: followerName,
                text: 'started following!',
                type: "follow",
            },
        ]);

        // Trigger follow animation
        addNotification({
            type: 'follow',
            data: {
                name: followerName
            }
        });
    };

    const handleGift = () => {
        const gifterName = "Generous Viewer";
        const giftName = "Super Gift";
        
        // Add message to chat
        setMessages([
            ...messages,
            {
                user: gifterName,
                text: `sent a ${giftName}!`,
                type: "gift",
            },
        ]);

        // Trigger gift animation
        addNotification({
            type: 'gift',
            data: {
                name: gifterName,
                giftName: giftName
            }
        });
    };

    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: Date.now(), // Unique ID for each animation
            timestamp: Date.now()
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-remove notification after 4 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
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
            <Box sx={{ display: "flex", height: "100%", position: "relative" }}>
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

                {/* Live Chat */}
                <LiveChat
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onDonate={handleDonate}
                    onLike={handleLike}
                    onSubscribe={handleSubscribe}
                    onFollow={handleFollow}
                    onGift={handleGift}
                    // onShare={handleShare}
                    chatOpen={chatOpen}
                    onToggleChat={toggleChat}
                />
            </Box>

            {/* Notification Animations Overlay */}
            {notifications.map(notification => (
                <NotificationAnimation 
                    key={notification.id} 
                    notification={notification} 
                />
            ))}
        </LiveContainer>
    );
};

export default LiveStreamView;