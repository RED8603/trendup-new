import { useState, useCallback } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import UserList from "./UserList";
import ChatDetail from "./ChatDetail";
import WelcomeScreen from "./WelcomeScreen";
import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import abstract_design_elements from "../../assets/images/abstract-design-elements.png"

const DRAWER_WIDTH = 280;
const users = [
    {
        id: "general",
        name: "# general",
        avatar: "/abstract-geometric-shapes.png",
        color: "#5865F2",
        status: "online",
    },
    {
        id: "alice",
        name: "Alice",
        avatar: "/alice-in-wonderland.png",
        color: "#ff6b6b",
        status: "online",
    },
    {
        id: "bob",
        name: "Bob",
        avatar: "/bob-portrait.png",
        color: "#4ecdc4",
        status: "away",
    },
    {
        id: "charlie",
        name: "Charlie",
        avatar: "/abstract-figure-charlie.png",
        color: "#45b7d1",
        status: "online",
    },
    {
        id: "david",
        name: "David",
        avatar: "/abstract-colorful-swirls.png",
        color: "#f39c12",
        status: "busy",
    },
    {
        id: "eve",
        name: "Eve",
        avatar: abstract_design_elements,
        color: "#e74c3c",
        status: "offline",
        lastSeen: new Date(Date.now() - 3600000),
    },
];

// Initial conversations
const initialConversations = [
    {
        userId: "general",
        unreadCount: 0,
        messages: [
            {
                id: "1",
                user: { name: "Alice", avatar: "/alice-in-wonderland.png", color: "#ff6b6b" },
                content: "Hey everyone! How's it going?",
                timestamp: new Date(Date.now() - 3600000),
                reactions: [
                    { emoji: "👋", count: 3, users: ["Bob", "Charlie", "David"] },
                    { emoji: "😊", count: 1, users: ["Bob"] },
                ],
            },
            {
                id: "2",
                user: { name: "Bob", avatar: "/bob-portrait.png", color: "#4ecdc4" },
                content: "Pretty good! Just working on some new features.",
                timestamp: new Date(Date.now() - 3000000),
                reactions: [{ emoji: "💪", count: 2, users: ["Alice", "Charlie"] }],
            },
            {
                id: "3",
                user: { name: "Charlie", avatar: "/abstract-figure-charlie.png", color: "#45b7d1" },
                content: "Check out this cool design I made!",
                timestamp: new Date(Date.now() - 1800000),
                reactions: [
                    { emoji: "🔥", count: 4, users: ["Alice", "Bob", "David", "Eve"] },
                    { emoji: "👏", count: 2, users: ["Alice", "David"] },
                ],
                attachments: [
                    { name: "design-mockup.png", url: abstract_design_elements, type: "image", size: 245760 },
                ],
            },
        ],
    },
    {
        userId: "alice",
        unreadCount: 2,
        messages: [
            {
                id: "alice-1",
                user: { name: "Alice", avatar: "/alice-in-wonderland.png", color: "#ff6b6b" },
                content: "Hey! How are you doing?",
                timestamp: new Date(Date.now() - 1800000),
                reactions: [],
            },
            {
                id: "alice-2",
                user: { name: "Alice", avatar: "/alice-in-wonderland.png", color: "#ff6b6b" },
                content: "I wanted to ask you about that project we discussed.",
                timestamp: new Date(Date.now() - 1200000),
                reactions: [],
            },
        ],
    },
    {
        userId: "bob",
        unreadCount: 0,
        messages: [
            {
                id: "bob-1",
                user: { name: "You", avatar: "/abstract-geometric-shapes.png", color: "#5865F2" },
                content: "Hey Bob, how's the development going?",
                timestamp: new Date(Date.now() - 2400000),
                reactions: [],
            },
            {
                id: "bob-2",
                user: { name: "Bob", avatar: "/bob-portrait.png", color: "#4ecdc4" },
                content: "Going well! Almost finished with the new features.",
                timestamp: new Date(Date.now() - 2100000),
                reactions: [{ emoji: "👍", count: 1, users: ["You"] }],
            },
        ],
    },
];

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
        <Box sx={{ display: "flex", height: "100vh", }}>
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
                        bgcolor: "#2f3136",
                        borderRight: "1px solid rgba(255,255,255,0.1)",
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
                    height: "100vh",
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
