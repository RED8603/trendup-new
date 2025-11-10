import { createSlice } from "@reduxjs/toolkit";

/**
 * Chat Slice
 * Manages UI state for chat (input, current selection, etc.)
 * Actual data (conversations, messages) is managed by RTK Query (chatApi)
 */
const initialState = {
  currentChat: null, // Current conversation ID
  input: {
    text: "",
    files: [],
    replyTo: null,
    recording: null,
  },
  ui: {
    emojiPicker: null,
    reactionPicker: null,
    isRecording: false,
    typingUsers: [], // Users currently typing in current chat
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
      // Clear input when switching chats
      state.input.text = "";
      state.input.files = [];
      state.input.replyTo = null;
    },
    setInputText: (state, action) => {
      state.input.text = action.payload;
    },
    addFile: (state, action) => {
      const files = Array.isArray(action.payload) ? action.payload : [action.payload];
      // Convert File objects to serializable metadata
      const fileMetadata = files.map((file, index) => {
        // If it's already metadata, use it; otherwise extract from File object
        if (file && typeof file === 'object' && !(file instanceof File)) {
          return file; // Already metadata
        }
        // Extract serializable metadata from File object
        return {
          id: `${Date.now()}-${index}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
      });
      state.input.files = [...state.input.files, ...fileMetadata];
    },
    removeFile: (state, action) => {
      state.input.files = state.input.files.filter((_, i) => i !== action.payload);
    },
    setReplyTo: (state, action) => {
      state.input.replyTo = action.payload;
    },
    cancelReply: (state) => {
      state.input.replyTo = null;
    },
    setTypingUsers: (state, action) => {
      state.ui.typingUsers = action.payload;
    },
    setEmojiPicker: (state, action) => {
      state.ui.emojiPicker = action.payload;
    },
    setReactionPicker: (state, action) => {
      state.ui.reactionPicker = action.payload;
    },
    setIsRecording: (state, action) => {
      state.ui.isRecording = action.payload;
    },
    clearInput: (state) => {
      state.input.text = "";
      state.input.files = [];
      state.input.replyTo = null;
    },
  }
});

export const { 
  setCurrentChat, 
  setInputText, 
  addFile, 
  removeFile, 
  setReplyTo, 
  cancelReply,
  setTypingUsers,
  setEmojiPicker,
  setReactionPicker,
  setIsRecording,
  clearInput,
} = chatSlice.actions;

export default chatSlice.reducer;