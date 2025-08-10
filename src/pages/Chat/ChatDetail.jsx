import { useRef, useEffect, useCallback } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Tooltip,
  Badge,
} from "@mui/material"
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachIcon,
  Image as ImageIcon,
  Description as FileIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
  MoreVert as MoreIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
import EmojiPicker from "./EmojiPicker"
import BoxConatner from "@/components/common/BoxContainer/BoxConatner"
 

export default function ChatDetail({
  currentUser,
  messages,
  newMessage,
  selectedFiles,
  emojiAnchor,
  reactionAnchor,
  uploadProgress,
  replyTo,
  isMobile,
  onOpenDrawer,
  onMessageChange,
  onFileSelect,
  onRemoveFile,
  onSendMessage,
  onKeyDown,
  onEmojiClick,
  onEmojiClose,
  onEmojiSelect,
  onReactionClick,
  onReactionClose,
  onAddReaction,
  onReply,
  onCancelReply,
}) {
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }, [])

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }, [])

  const getReplyMessage = useCallback(
    (messageId) => {
      return messages.find((msg) => msg.id === messageId)
    },
    [messages],
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#43b581"
      case "away":
        return "#faa61a"
      case "busy":
        return "#f04747"
      case "offline":
        return "#747f8d"
      default:
        return "#747f8d"
    }
  }

  return (
    <BoxConatner
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
       
        borderRadius: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          // borderColor: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {isMobile && (
          <IconButton onClick={onOpenDrawer} sx={{ color: "#b9bbbe" }}>
            <MenuIcon />
          </IconButton>
        )}
        {currentUser && (
          <>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: getStatusColor(currentUser.status),
                    border: "2px solid #36393f",
                  }}
                />
              }
            >
              <Avatar src={currentUser.avatar} sx={{ bgcolor: currentUser.color, width: 32, height: 32 }}>
                {currentUser.name[0]}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#dcddde" }}>
                {currentUser.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: getStatusColor(currentUser.status), textTransform: "capitalize" }}
              >
                {currentUser.status}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {messages.map((message, index) => {
          const showAvatar = index === 0 || messages[index - 1].user.name !== message.user.name
          const replyMessage = message.replyTo ? getReplyMessage(message.replyTo) : null

          return (
            <Box key={message.id} sx={{ mb: showAvatar ? 2 : 0.5 }}>
              {replyMessage && (
                <Box sx={{ ml: 6, mb: 0.5, display: "flex", alignItems: "center", opacity: 0.7 }}>
                  <ReplyIcon sx={{ fontSize: 16, mr: 1, color: "#b9bbbe" }} />
                  <Typography variant="caption" sx={{ mr: 1, color: "#b9bbbe" }}>
                    Replying to {replyMessage.user.name}:
                  </Typography>
                  <Typography variant="caption" sx={{ fontStyle: "italic", color: "#b9bbbe" }}>
                    {replyMessage.content.substring(0, 50)}...
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  px: 1,
                  py: 0.5,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                  position: "relative",
                  group: true,
                }}
              >
                {showAvatar ? (
                  <Avatar src={message.user.avatar} sx={{ width: 40, height: 40, bgcolor: message.user.color }}>
                    {message.user.name[0]}
                  </Avatar>
                ) : (
                  <Box sx={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ fontSize: "0.7rem", color: "#b9bbbe" }}>
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {showAvatar && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ color: message.user.color, fontWeight: 600 }}>
                        {message.user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#b9bbbe" }}>
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Box>
                  )}

                  {message.content && (
                    <Typography variant="body2" sx={{ wordBreak: "break-word", mb: 1, color: "#dcddde" }}>
                      {message.content}
                    </Typography>
                  )}

                  {message.attachments && (
                    <Box sx={{ mb: 1 }}>
                      {message.attachments.map((attachment, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                          {attachment.type === "image" ? (
                            <Box
                              component="img"
                              src={attachment.url}
                              alt={attachment.name}
                              sx={{
                                maxWidth: 400,
                                maxHeight: 300,
                                borderRadius: 1,
                                cursor: "pointer",
                              }}
                              onError={(e) => {
                                const target = e.target 
                                target.src = "/abstract-colorful-swirls.png"
                              }}
                            />
                          ) : (
                            <Paper
                              sx={{
                                p: 2,
                                maxWidth: 300,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                bgcolor: "#2f3136",
                                color: "#dcddde",
                              }}
                            >
                              <FileIcon sx={{ color: "#5865F2" }} />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" noWrap sx={{ color: "#dcddde" }}>
                                  {attachment.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#b9bbbe" }}>
                                  {formatFileSize(attachment.size)}
                                </Typography>
                              </Box>
                            </Paper>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {message.reactions.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                      {message.reactions.map((reaction, idx) => (
                        <Chip
                          key={idx}
                          label={`${reaction.emoji} ${reaction.count}`}
                          size="small"
                          variant={reaction.users.includes("You") ? "filled" : "outlined"}
                          onClick={() => onAddReaction(message.id, reaction.emoji)}
                          sx={{
                            height: 24,
                            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                            bgcolor: reaction.users.includes("You") ? "#5865F2" : "transparent",
                            color: "#dcddde",
                            borderColor: "rgba(255,255,255,0.2)",
                          }}
                        />
                      ))}
                      <IconButton
                        size="small"
                        onClick={(e) => onReactionClick(e, message.id)}
                        sx={{ width: 24, height: 24, color: "#b9bbbe" }}
                      >
                        <EmojiIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    opacity: 0,
                    "&:hover": { opacity: 1 },
                    ".MuiBox-root:hover &": { opacity: 1 },
                    display: "flex",
                    gap: 0.5,
                    position: "absolute",
                    right: 8,
                    top: 8,
                    bgcolor: "#36393f",
                    borderRadius: 1,
                    p: 0.5,
                  }}
                >
                  <Tooltip title="Add reaction">
                    <IconButton size="small" onClick={(e) => onReactionClick(e, message.id)} sx={{ color: "#b9bbbe" }}>
                      <EmojiIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reply">
                    <IconButton size="small" onClick={() => onReply(message.id)} sx={{ color: "#b9bbbe" }}>
                      <ReplyIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More">
                    <IconButton size="small" sx={{ color: "#b9bbbe" }}>
                      <MoreIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <Box sx={{ px: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ bgcolor: "#2f3136" }} />
        </Box>
      )}

      {/* Reply Preview */}
      {replyTo && (
        <Box sx={{ px: 2, py: 1, bgcolor: "rgba(255,255,255,0.05)" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ReplyIcon sx={{ fontSize: 16, color: "#b9bbbe" }} />
              <Typography variant="caption" sx={{ color: "#b9bbbe" }}>
                Replying to {getReplyMessage(replyTo)?.user.name}
              </Typography>
            </Box>
            <IconButton size="small" onClick={onCancelReply} sx={{ color: "#b9bbbe" }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#dcddde" }}>
            Attachments ({selectedFiles.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedFiles.map((file, index) => (
              <Chip
                key={index}
                label={`${file.name} (${formatFileSize(file.size)})`}
                onDelete={() => onRemoveFile(index)}
                icon={file.type.startsWith("image/") ? <ImageIcon /> : <FileIcon />}
                variant="outlined"
                sx={{
                  color: "#dcddde",
                  borderColor: "rgba(255,255,255,0.2)",
                  "& .MuiChip-deleteIcon": { color: "#b9bbbe" },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "rgba(255,255,255,0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            multiple
            style={{ display: "none" }}
            accept="image/*,application/*,text/*"
          />

          <IconButton onClick={() => fileInputRef.current?.click()} sx={{ mb: 0.5, color: "#b9bbbe" }}>
            <AttachIcon />
          </IconButton>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={replyTo ? "Reply..." : `Message ${currentUser?.name || ""}`}
            variant="outlined"
            size="small"
            onKeyDown={onKeyDown}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#40444b",
                color: "#dcddde",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.1)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5865F2",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#72767d",
                opacity: 1,
              },
            }}
          />

          <IconButton onClick={onEmojiClick} sx={{ mb: 0.5, color: "#b9bbbe" }}>
            <EmojiIcon />
          </IconButton>

          <IconButton
            onClick={onSendMessage}
            disabled={!newMessage.trim() && selectedFiles.length === 0}
            sx={{
              mb: 0.5,
              color: "#5865F2",
              "&:disabled": { color: "rgba(255,255,255,0.3)" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Emoji Picker for Message Input */}
      <EmojiPicker
        anchorEl={emojiAnchor}
        open={Boolean(emojiAnchor)}
        onClose={onEmojiClose}
        onEmojiSelect={onEmojiSelect}
      />

      {/* Emoji Picker for Reactions */}
      <EmojiPicker
        anchorEl={reactionAnchor?.element || null}
        open={Boolean(reactionAnchor)}
        onClose={onReactionClose}
        onEmojiSelect={(emoji) => {
          if (reactionAnchor) {
            onAddReaction(reactionAnchor.messageId, emoji)
          }
        }}
      />
    </BoxConatner>
  )
}
