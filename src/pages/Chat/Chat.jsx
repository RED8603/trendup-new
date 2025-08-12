import { useState, useCallback } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import UserList from "./UserList";
import ChatDetail from "./ChatDetail";
import WelcomeScreen from "./WelcomeScreen";
import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import { initialConversations, users } from "@/constants";

const DRAWER_WIDTH = 280;

export default function Chat() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [conversations, setConversations] = useState(initialConversations);
    const [activeUserId, setActiveUserId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [emojiAnchor, setEmojiAnchor] = useState(null);
    const [reactionAnchor, setReactionAnchor] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const [blobUrls, setBlobUrls] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [searchQuery, setSearchQuery] = useState("");
  
    console.log(blobUrls)
    // Get current conversation
    const currentConversation = activeUserId ? conversations.find((conv) => conv.userId === activeUserId) : null;
    const currentUser = activeUserId ? users.find((user) => user.id === activeUserId) : null;
    const messages = currentConversation?.messages || [];

    // Handle user selection
    const handleUserSelect = useCallback(
        (userId) => {
            setActiveUserId(userId);
            setReplyTo(null);
            setNewMessage("");
            setSelectedFiles([]);

            // Mark messages as read
            setConversations((prev) =>
                prev.map((conv) => (conv.userId === userId ? { ...conv, unreadCount: 0 } : conv))
            );

            if (isMobile) {
                setDrawerOpen(false);
            }
        },
        [isMobile]
    );

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() && selectedFiles.length === 0) return;

        const newBlobUrls = [];
        const attachments = selectedFiles.map((file) => {
            const url = URL.createObjectURL(file);
            newBlobUrls.push(url);
            return {
                name: file.name,
                url,
                type: file.type.startsWith("image/") ? "image" : "file",
                size: file.size,
            };
        });

        setBlobUrls((prev) => [...prev, ...newBlobUrls]);

        if (selectedFiles.length > 0) {
            setUploadProgress(0);
            for (let i = 0; i <= 100; i += 10) {
                await new Promise((resolve) => setTimeout(resolve, 50));
                setUploadProgress(i);
            }
            setUploadProgress(null);
        }

        const message = {
            id: Date.now().toString(),
            user: { name: "You", avatar: "/abstract-geometric-shapes.png", color: "#5865F2" },
            content: newMessage,
            timestamp: new Date(),
            reactions: [],
            attachments: attachments.length > 0 ? attachments : undefined,
            replyTo,
        };

        setConversations((prev) =>
            prev.map((conv) =>
                conv.userId === activeUserId ? { ...conv, messages: [...conv.messages, message] } : conv
            )
        );

        setNewMessage("");
        setSelectedFiles([]);
        setReplyTo(null);
    }, [newMessage, selectedFiles, replyTo, activeUserId]);

    const handleFileSelect = useCallback((event) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles((prev) => [...prev, ...files]);
    }, []);

    const removeFile = useCallback((index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const addReaction = useCallback(
        (messageId, emoji) => {
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.userId === activeUserId
                        ? {
                              ...conv,
                              messages: conv.messages.map((msg) => {
                                  if (msg.id === messageId) {
                                      const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
                                      if (existingReaction) {
                                          if (existingReaction.users.includes("You")) {
                                              return {
                                                  ...msg,
                                                  reactions: msg.reactions
                                                      .map((r) =>
                                                          r.emoji === emoji
                                                              ? {
                                                                    ...r,
                                                                    count: r.count - 1,
                                                                    users: r.users.filter((u) => u !== "You"),
                                                                }
                                                              : r
                                                      )
                                                      .filter((r) => r.count > 0),
                                              };
                                          } else {
                                              return {
                                                  ...msg,
                                                  reactions: msg.reactions.map((r) =>
                                                      r.emoji === emoji
                                                          ? { ...r, count: r.count + 1, users: [...r.users, "You"] }
                                                          : r
                                                  ),
                                              };
                                          }
                                      } else {
                                          return {
                                              ...msg,
                                              reactions: [...msg.reactions, { emoji, count: 1, users: ["You"] }],
                                          };
                                      }
                                  }
                                  return msg;
                              }),
                          }
                        : conv
                )
            );
        },
        [activeUserId]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    return (
        <Box
            sx={{
                display: "flex",
                height: "100%",
            }}
        >
            {/* Sidebar */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: DRAWER_WIDTH,
                        boxSizing: "border-box",
                        bgcolor: "transparent",
                        borderRight: "none",
                        backdropFilter: "blur(10px)",
                    },
                }}
            >
                <UserList
                    users={users}
                    conversations={conversations}
                    activeUserId={activeUserId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onUserSelect={handleUserSelect}
                />
            </Drawer>

            {/* Main Chat Area */}
            <BoxConatner
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    height: "84vh",
                    overflow: "auto",
                  
                    // Custom scrollbar styles
                    "&::-webkit-scrollbar": {
                        width: "8px",
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#333",
                        borderRadius: "8px",
                    },
                    "&": {
                        scrollbarColor: "#333 transparent",
                        scrollbarWidth: "thin",
                    },
                }}
            >
                {!activeUserId ? (
                    <WelcomeScreen isMobile={isMobile} onOpenDrawer={() => setDrawerOpen(true)} />
                ) : (
                    <ChatDetail
                        currentUser={currentUser}
                        messages={messages}
                        newMessage={newMessage}
                        selectedFiles={selectedFiles}
                        emojiAnchor={emojiAnchor}
                        reactionAnchor={reactionAnchor}
                        uploadProgress={uploadProgress}
                        replyTo={replyTo}
                        isMobile={isMobile}
                        onOpenDrawer={() => setDrawerOpen(true)}
                        onMessageChange={setNewMessage}
                        onFileSelect={handleFileSelect}
                        onRemoveFile={removeFile}
                        onSendMessage={handleSendMessage}
                        onKeyDown={handleKeyDown}
                        onEmojiClick={(e) => setEmojiAnchor(e.currentTarget)}
                        onEmojiClose={() => setEmojiAnchor(null)}
                        onEmojiSelect={(emoji) => setNewMessage((prev) => prev + emoji)}
                        onReactionClick={(e, messageId) => setReactionAnchor({ element: e.currentTarget, messageId })}
                        onReactionClose={() => setReactionAnchor(null)}
                        onAddReaction={addReaction}
                        onReply={setReplyTo}
                        onCancelReply={() => setReplyTo(null)}
                    />
                )}
            </BoxConatner>
        </Box>
    );
}
