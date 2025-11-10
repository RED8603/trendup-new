import { useState, useCallback, useEffect, useRef } from "react";
import { Box, Drawer, styled, useMediaQuery, useTheme, alpha, Alert, Typography, CircularProgress } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import UserList from "./UserList";
import ChatDetail from "./ChatDetail";
import WelcomeScreen from "./WelcomeScreen";
import NewConversationDialog from "./components/NewConversationDialog";
import NewGroupDialog from "./components/NewGroupDialog";
import ArchivedConversationsDialog from "./components/ArchivedConversationsDialog";
import { motion } from "framer-motion";
import useChat from "@/hooks/useChat";
import useChatSocket from "@/hooks/useChatSocket";
import { useSocket } from "@/context/SocketContext";
import Loading from "@/components/common/loading";
import { 
  useCreateDirectConversationMutation, 
  useCreateGroupConversationMutation,
  useGetConversationQuery
} from "@/api/slices/chatApi";
import { useToast } from "@/hooks/useToast";
import { useSelector } from "react-redux";

const DRAWER_WIDTH = 280;

// Styled components with Web3/Social Media aesthetics
const ChatContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100vh",
    minHeight: "100vh",
    width: "100%",
    background: "transparent",
    position: "relative",
    overflow: "hidden",
    margin: { md: `-${theme.spacing(3)}` },
    padding: 0,
    "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 30%, rgba(100, 80, 255, 0.15) 0%, transparent 40%)",
        zIndex: -1,
    },
}));

const DividerGlow = styled(Box)(({ theme }) => ({
    position: "absolute",
    left: DRAWER_WIDTH,
    top: 0,
    bottom: 0,
    width: "1px",
    background: `linear-gradient(to bottom, 
        transparent 0%, 
        ${alpha(theme.palette.primary.main, 0.2)} 50%, 
        transparent 100%
    )`,
    pointerEvents: "none",
    transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shorter,
    }),
    zIndex: 1,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: DRAWER_WIDTH,
        boxSizing: "border-box",
        background: alpha(theme.palette.background.paper, 0.9),
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        borderRadius: 0,
        backdropFilter: "blur(20px)",
        boxShadow: `inset -1px 0 0 ${alpha(theme.palette.divider, 0.1)}`,
        overflow: "hidden",
        transition: theme.transitions.create(["width", "box-shadow", "border"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
        }),
        "&:hover": {
            borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        },
    },
}));

const MainChatArea = styled(motion.div)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    height: "100vh",
    borderRadius: { md: "0" },
    background: alpha(theme.palette.background.paper, 0.9),
    backdropFilter: "blur(20px)",
    boxShadow: `0 0 24px ${alpha(theme.palette.primary.main, 0.08)}`,
    overflow: "hidden",
    border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    borderLeft: "none",
    transition: theme.transitions.create(["background", "box-shadow"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    "&:hover": {
        boxShadow: `0 0 32px ${alpha(theme.palette.primary.main, 0.12)}`,
    },
    "&::-webkit-scrollbar": {
        width: "6px",
        background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
        background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        borderRadius: "6px",
    },
    "&": {
        scrollbarColor: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main}) transparent`,
        scrollbarWidth: "thin",
    },
    position: "relative",
    "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 100%)`,
        zIndex: -1,
    },
}));

export default function Chat() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { showToast } = useToast();
    const { isConnected } = useSocket();
    const { user } = useSelector((state) => state.user);

    // Use chat hook for API integration
    const {
        conversations,
        messages,
        currentChat,
        input,
        conversationsLoading,
        messagesLoading,
        sendingMessage,
        selectConversation,
        handleSendMessage,
        handleAddReaction,
        handleEditMessage,
        handleDeleteMessage,
        handlePinMessage,
        handleArchiveConversation,
        handleMuteConversation,
        archivedConversations,
        pinnedMessages,
        setInputText,
        addFile,
        removeFile,
        setReplyTo,
        cancelReply,
    } = useChat();

    // Use chat socket for typing indicators
    const { typingUsers, startTyping, stopTyping, isReady: socketReady } = useChatSocket(currentChat);

    const [createDirectConversation] = useCreateDirectConversationMutation();
    const [createGroupConversation] = useCreateGroupConversationMutation();
    const [emojiAnchor, setEmojiAnchor] = useState(null);
    const [reactionAnchor, setReactionAnchor] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [searchQuery, setSearchQuery] = useState("");
    const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
    const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
    const [archivedDialogOpen, setArchivedDialogOpen] = useState(false);
    // Store actual File objects separately (not in Redux)
    const fileObjectsRef = useRef(new Map());
    // Track chat switching state
    const [switchingChat, setSwitchingChat] = useState(false);
    const previousChatRef = useRef(currentChat);

    // Fetch full conversation details with populated participants
    const { data: conversationData, isLoading: conversationLoading } = useGetConversationQuery(currentChat, {
      skip: !currentChat
    });

    // Get current conversation details - prefer fetched data with participants, fallback to list item
    const currentConversation = conversationData?.data || (currentChat 
        ? conversations.find((conv) => conv._id === currentChat) 
        : null);

    // Handle user/conversation selection
    const handleUserSelect = useCallback(
        async (conversationId) => {
            if (conversationId !== currentChat) {
                setSwitchingChat(true);
            }
            selectConversation(conversationId);
            if (isMobile) setDrawerOpen(false);
        },
        [selectConversation, currentChat, isMobile]
    );

    // Handle creating new conversation with user
    const handleStartConversation = useCallback(
        async (userId) => {
            try {
                const result = await createDirectConversation({ otherUserId: userId }).unwrap();
                selectConversation(result.data._id);
                if (isMobile) setDrawerOpen(false);
            } catch (error) {
                console.error('Failed to create conversation:', error);
                showToast(error?.data?.message || 'Failed to start conversation', 'error');
            }
        },
        [createDirectConversation, selectConversation, isMobile, showToast]
    );

    // Handle new chat dialog
    const handleNewChat = useCallback(() => {
        setNewChatDialogOpen(true);
    }, []);

    // Handle new group dialog
    const handleNewGroup = useCallback(() => {
        setNewGroupDialogOpen(true);
    }, []);

    // Handle user selection from new chat dialog
    const handleSelectUserForChat = useCallback(async (user) => {
        try {
            const result = await createDirectConversation({ otherUserId: user._id }).unwrap();
            selectConversation(result.data._id);
            if (isMobile) setDrawerOpen(false);
            showToast('Conversation started', 'success');
        } catch (error) {
            console.error('Failed to create conversation:', error);
            showToast(error?.data?.message || 'Failed to start conversation', 'error');
        }
    }, [createDirectConversation, selectConversation, isMobile, showToast]);

    // Handle group creation
    const handleCreateGroup = useCallback(async (groupData) => {
        try {
            const result = await createGroupConversation({
                name: groupData.name,
                participantIds: groupData.participantIds,
            }).unwrap();
            selectConversation(result.data?._id || result.data?.conversation?._id);
            if (isMobile) setDrawerOpen(false);
            showToast('Group created successfully', 'success');
        } catch (error) {
            console.error('Failed to create group:', error);
            showToast(error?.data?.message || error?.message || 'Failed to create group', 'error');
        }
    }, [createGroupConversation, selectConversation, isMobile, showToast]);

    // Enhanced send message with typing indicator
    const handleSendMessageWithTyping = useCallback(async () => {
        stopTyping(); // Stop typing when sending
        
        // Map file metadata IDs to actual File objects
        const fileObjects = input.files.map(fileMetadata => {
            // Try to get from ref first
            if (fileMetadata.id && fileObjectsRef.current.has(fileMetadata.id)) {
                return fileObjectsRef.current.get(fileMetadata.id);
            }
            // Fallback: if it's already a File object, use it
            return fileMetadata instanceof File ? fileMetadata : null;
        }).filter(Boolean);
        
        await handleSendMessage(fileObjects.length > 0 ? fileObjects : null);
        
        // Clear file objects from ref after sending
        input.files.forEach(fileMetadata => {
            if (fileMetadata?.id) {
                fileObjectsRef.current.delete(fileMetadata.id);
            }
        });
    }, [handleSendMessage, stopTyping, input.files]);

    // Handle sending voice note
    const handleSendVoiceNote = useCallback(async (audioFile) => {
        if (!audioFile || !currentChat) return;
        
        stopTyping();
        await handleSendMessage([audioFile], 'audio');
    }, [handleSendMessage, stopTyping, currentChat]);

    const handleFileSelect = useCallback((event) => {
        const files = Array.from(event.target.files || []);
        // Store File objects in ref for later use
        files.forEach((file) => {
            const metadata = {
                id: `${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
            };
            fileObjectsRef.current.set(metadata.id, file);
            addFile(metadata);
        });
    }, [addFile]);

    const handleRemoveFile = useCallback((index) => {
        const fileMetadata = input.files[index];
        if (fileMetadata?.id) {
            fileObjectsRef.current.delete(fileMetadata.id);
        }
        removeFile(index);
    }, [removeFile, input.files]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessageWithTyping();
            } else {
                startTyping();
            }
        },
        [handleSendMessageWithTyping, startTyping]
    );

    // Handle typing indicator on text change
    useEffect(() => {
        if (input.text) {
            startTyping();
        } else {
            stopTyping();
        }
    }, [input.text, startTyping, stopTyping, currentChat]);

    // Track when chat is switching
    useEffect(() => {
        if (currentChat && previousChatRef.current !== currentChat) {
            setSwitchingChat(true);
            previousChatRef.current = currentChat;
        }
    }, [currentChat]);

    // Reset switching state when messages are loaded
    useEffect(() => {
        if (!messagesLoading && !conversationLoading && switchingChat) {
            // Small delay for smooth transition
            const timer = setTimeout(() => {
                setSwitchingChat(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [messagesLoading, conversationLoading, switchingChat]);


    return (
        <ChatContainer>
            <DividerGlow />
            {/* Connection status indicator */}
            {!isConnected && user && (
                <Alert 
                    severity="warning" 
                    sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        borderRadius: 0,
                        '& .MuiAlert-message': {
                            width: '100%',
                            textAlign: 'center'
                        }
                    }}
                >
                    <Typography variant="body2">
                        Reconnecting... Messages may be delayed
                    </Typography>
                </Alert>
            )}
            
            {/* Sidebar with modern Web3 styling */}
            <StyledDrawer
                variant={isMobile ? "temporary" : "permanent"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
            >
                {conversationsLoading ? (
                    <Loading isLoading={true} />
                ) : (
                    <UserList
                        conversations={conversations}
                        activeConversationId={currentChat}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onConversationSelect={handleUserSelect}
                        onStartConversation={handleStartConversation}
                        onNewChat={handleNewChat}
                        onNewGroup={handleNewGroup}
                    />
                )}
            </StyledDrawer>

            {/* Main Chat Area with animated Web3 elements */}
            <MainChatArea
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
                sx={{
                    borderRadius: { md: "0" },
                    transform: { md: "translateX(0)" },
                }}
            >
                <AnimatePresence mode="wait">
                    {!currentChat ? (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ height: '100%' }}
                        >
                            <WelcomeScreen isMobile={isMobile} onOpenDrawer={() => setDrawerOpen(true)} />
                        </motion.div>
                    ) : (messagesLoading || switchingChat || conversationLoading) ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: 2 
                            }}>
                                <CircularProgress size={48} />
                                <Typography variant="body1" color="text.secondary">
                                    Loading conversation...
                                </Typography>
                            </Box>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentChat}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            style={{ height: '100%' }}
                        >
                            <ChatDetail
                                conversation={currentConversation}
                                messages={messages}
                                newMessage={input.text}
                                selectedFiles={input.files}
                                emojiAnchor={emojiAnchor}
                                reactionAnchor={reactionAnchor}
                                uploadProgress={uploadProgress}
                                replyTo={input.replyTo}
                                typingUsers={typingUsers}
                                isMobile={isMobile}
                                isConnected={isConnected}
                                sendingMessage={sendingMessage}
                                onOpenDrawer={() => setDrawerOpen(true)}
                                onMessageChange={setInputText}
                                onFileSelect={handleFileSelect}
                                onRemoveFile={handleRemoveFile}
                                onSendMessage={handleSendMessageWithTyping}
                                onSendVoiceNote={handleSendVoiceNote}
                                onKeyDown={handleKeyDown}
                                onEmojiClick={(e) => setEmojiAnchor(e.currentTarget)}
                                onEmojiClose={() => setEmojiAnchor(null)}
                                onEmojiSelect={(emoji) => setInputText(input.text + emoji)}
                                onReactionClick={(e, messageId) => setReactionAnchor({ element: e.currentTarget, messageId })}
                                onReactionClose={() => setReactionAnchor(null)}
                                onAddReaction={handleAddReaction}
                                onEditMessage={handleEditMessage}
                                onDeleteMessage={handleDeleteMessage}
                                onPinMessage={handlePinMessage}
                                pinnedMessages={pinnedMessages}
                                onArchiveConversation={handleArchiveConversation}
                                onMuteConversation={handleMuteConversation}
                                onViewArchived={() => setArchivedDialogOpen(true)}
                                onSearchMessages={(query) => {
                                    // TODO: Implement search results display
                                }}
                                onReply={setReplyTo}
                                onCancelReply={cancelReply}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </MainChatArea>

            {/* Archived Conversations Dialog */}
            <ArchivedConversationsDialog
                open={archivedDialogOpen}
                onClose={() => setArchivedDialogOpen(false)}
                archivedConversations={archivedConversations}
                onConversationSelect={(conversationId) => {
                    selectConversation(conversationId);
                    setArchivedDialogOpen(false);
                    if (isMobile) setDrawerOpen(false);
                }}
                onUnarchive={(conversationId) => {
                    handleArchiveConversation(conversationId, false);
                }}
            />

            {/* New Conversation Dialog */}
            <NewConversationDialog
                open={newChatDialogOpen}
                onClose={() => setNewChatDialogOpen(false)}
                onSelectUser={handleSelectUserForChat}
            />

            {/* New Group Dialog */}
            <NewGroupDialog
                open={newGroupDialogOpen}
                onClose={() => setNewGroupDialogOpen(false)}
                onCreateGroup={handleCreateGroup}
            />
        </ChatContainer>
    );
}
