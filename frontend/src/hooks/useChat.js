import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '@/context/SocketContext';
import { useSocketEvent } from './useSocket';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageAsReadMutation,
  useMarkAllMessagesAsReadMutation,
  useAddReactionMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  usePinMessageMutation,
  useGetPinnedMessagesQuery,
  useArchiveConversationMutation,
  useMuteConversationMutation,
  useSearchMessagesQuery,
  chatApi,
} from '@/api/slices/chatApi';
import {
  setCurrentChat,
  setInputText,
  addFile,
  removeFile,
  setReplyTo,
  cancelReply,
} from '@/store/slices/chatSlice';
import { useToast } from './useToast';

/**
 * Main hook for chat functionality
 * Handles conversations, messages, and real-time updates
 */
export const useChat = () => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.user);
  const { currentChat, input } = useSelector((state) => state.chat);
  
  
  // Get active conversations
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useGetConversationsQuery({ page: 1, limit: 50, archived: false });

  // Get archived conversations
  const {
    data: archivedConversationsData,
    isLoading: archivedLoading,
    refetch: refetchArchived,
  } = useGetConversationsQuery({ page: 1, limit: 50, archived: true });

  // Get messages for current chat
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    { conversationId: currentChat, page: 1, limit: 50 },
    { skip: !currentChat }
  );

  // Mutations
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();
  const [markAllAsRead] = useMarkAllMessagesAsReadMutation();
  const [addReaction] = useAddReactionMutation();
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [pinMessage] = usePinMessageMutation();
  const [archiveConversation] = useArchiveConversationMutation();
  const [muteConversation] = useMuteConversationMutation();

  const conversations = conversationsData?.data?.conversations || [];
  const archivedConversations = archivedConversationsData?.data?.conversations || [];
  const messages = messagesData?.data?.messages || [];

  // Handle new message received via socket
  useSocketEvent(
    'chat:message:sent',
    useCallback((data) => {
      if (!user?._id || !data?.conversationId) {
        return;
      }
      
      const conversationMatch = String(data.conversationId) === String(currentChat);
      
      if (conversationMatch && currentChat) {
        refetchMessages();
        dispatch(chatApi.util.invalidateTags([{ type: 'Messages', id: currentChat }]));
        dispatch(chatApi.util.invalidateTags([{ type: 'Conversations', id: currentChat }]));
      } else {
        refetchConversations();
        dispatch(chatApi.util.invalidateTags(['Conversations']));
      }
    }, [currentChat, dispatch, refetchMessages, refetchConversations, user?._id]),
    // Enable ONLY when we have necessary data
    !!user?._id
  );

  // Handle message edited via socket
  useSocketEvent(
    'chat:message:edited',
    useCallback((data) => {
      if (currentChat && String(data.conversationId) === String(currentChat)) {
        dispatch(
          chatApi.util.invalidateTags([{ type: 'Messages', id: currentChat }])
        );
      }
    }, [currentChat, dispatch]),
    !!user?._id
  );

  // Handle message deleted via socket
  useSocketEvent(
    'chat:message:deleted',
    useCallback((data) => {
      if (currentChat && String(data.conversationId) === String(currentChat)) {
        dispatch(
          chatApi.util.invalidateTags([{ type: 'Messages', id: currentChat }])
        );
      }
    }, [currentChat, dispatch]),
    !!user?._id
  );

  // Handle message reaction via socket
  useSocketEvent(
    'chat:message:reaction',
    useCallback((data) => {
      if (currentChat && String(data.conversationId) === String(currentChat)) {
        dispatch(
          chatApi.util.invalidateTags([{ type: 'Messages', id: currentChat }])
        );
      }
    }, [currentChat, dispatch]),
    !!user?._id
  );

  // Handle conversation created via socket
  useSocketEvent('chat:conversation:created', useCallback(() => {
    dispatch(chatApi.util.invalidateTags(['Conversations']));
  }, [dispatch]));

  // Handle conversation updated via socket
  useSocketEvent('chat:conversation:updated', useCallback((data) => {
    dispatch(
      chatApi.util.invalidateTags([{ type: 'Conversations', id: data.conversationId }])
    );
  }, [dispatch]));

  // Join conversation room when chat is selected
  useEffect(() => {
    if (currentChat && isConnected && socket) {
      // Wait a bit for socket authentication to complete
      const timeout = setTimeout(() => {
        socket.emit('chat:join_conversation', { conversationId: currentChat });
        
        // Mark all messages as read when opening conversation
        markAllAsRead(currentChat).catch(console.error);
      }, 500); // Give socket time to authenticate
      
      return () => {
        clearTimeout(timeout);
        if (socket && socket.connected) {
          socket.emit('chat:leave_conversation', { conversationId: currentChat });
        }
      };
    }
  }, [currentChat, isConnected, socket, markAllAsRead]);

  // Send message handler
  const handleSendMessage = useCallback(async (fileObjects = null, messageTypeOverride = null) => {
    if (!currentChat) {
      return;
    }

    // Check if we have content, files, or voice note
    const hasContent = input.text.trim().length > 0;
    const hasFiles = input.files.length > 0 || (fileObjects && fileObjects.length > 0);
    
    if (!hasContent && !hasFiles) {
      return;
    }

    try {
      // If fileObjects provided, use them; otherwise files are metadata (shouldn't happen)
      const attachments = fileObjects || input.files;
      
      // Determine message type
      let messageType = messageTypeOverride;
      if (!messageType) {
        if (attachments && attachments.length > 0) {
          // Check if it's an audio file
          const firstFile = attachments[0];
          const isAudio = firstFile instanceof File 
            ? firstFile.type.startsWith('audio/')
            : firstFile.type === 'audio' || firstFile.mimeType?.startsWith('audio/');
          messageType = isAudio ? 'audio' : 'file';
        } else {
          messageType = 'text';
        }
      }
      
      const messageData = {
        conversationId: currentChat,
        content: input.text.trim() || '',
        replyTo: input.replyTo,
        messageType: messageType,
        attachments: attachments,
      };

      await sendMessage(messageData).unwrap();
      
      // Clear input
      dispatch(setInputText(''));
      // Clear all files
      for (let i = input.files.length - 1; i >= 0; i--) {
        dispatch(removeFile(i));
      }
      dispatch(cancelReply());
      
      // Scroll will happen automatically via refetch
    } catch (error) {
      console.error('[useChat] Failed to send message:', error);
      showToast(error?.data?.message || 'Failed to send message', 'error');
    }
  }, [currentChat, input, sendMessage, dispatch, showToast, removeFile]);

  // Select conversation handler
  const selectConversation = useCallback((conversationId) => {
    dispatch(setCurrentChat(conversationId));
  }, [dispatch]);

  // Handle reaction
  const handleAddReaction = useCallback(async (messageId, emoji) => {
    try {
      await addReaction({ id: messageId, emoji }).unwrap();
    } catch (error) {
      console.error('Failed to add reaction:', error);
      showToast('Failed to add reaction', 'error');
    }
  }, [addReaction, showToast]);

  // Handle edit message
  const handleEditMessage = useCallback(async (messageId, newContent) => {
    try {
      await editMessage({ id: messageId, content: newContent }).unwrap();
    } catch (error) {
      console.error('Failed to edit message:', error);
      showToast('Failed to edit message', 'error');
    }
  }, [editMessage, showToast]);

  // Handle delete message
  const handleDeleteMessage = useCallback(async (messageId, deleteFor = 'everyone') => {
    try {
      await deleteMessage({ id: messageId, deleteFor }).unwrap();
    } catch (error) {
      console.error('Failed to delete message:', error);
      showToast('Failed to delete message', 'error');
    }
  }, [deleteMessage, showToast]);

  // Handle pin/unpin message
  const handlePinMessage = useCallback(async (messageId, pin = true) => {
    try {
      await pinMessage({ id: messageId, pin }).unwrap();
      showToast(pin ? 'Message pinned' : 'Message unpinned', 'success');
    } catch (error) {
      console.error('Failed to pin message:', error);
      showToast('Failed to pin message', 'error');
    }
  }, [pinMessage, showToast]);

  // Get pinned messages for current chat
  const { data: pinnedMessagesData } = useGetPinnedMessagesQuery(currentChat, {
    skip: !currentChat
  });
  
  const pinnedMessages = pinnedMessagesData?.data?.messages || [];

  // Handle archive conversation
  const handleArchiveConversation = useCallback(async (conversationId, archive = true) => {
    try {
      await archiveConversation({ id: conversationId, archive }).unwrap();
      
      // Manually refetch both lists to ensure UI updates immediately
      await Promise.all([
        refetchConversations(),
        refetchArchived(),
      ]);
      
      showToast(archive ? 'Conversation archived' : 'Conversation unarchived', 'success');
    } catch (error) {
      console.error('Failed to archive conversation:', error);
      showToast('Failed to archive conversation', 'error');
    }
  }, [archiveConversation, refetchConversations, refetchArchived, showToast]);

  // Handle mute conversation
  const handleMuteConversation = useCallback(async (conversationId, mute = true) => {
    try {
      await muteConversation({ id: conversationId, mute }).unwrap();
      showToast(mute ? 'Conversation muted' : 'Conversation unmuted', 'success');
    } catch (error) {
      console.error('Failed to mute conversation:', error);
      showToast('Failed to mute conversation', 'error');
    }
  }, [muteConversation, showToast]);

  return {
    // Data
    conversations,
    archivedConversations,
    messages,
    currentChat,
    input,
    
    // Loading states
    conversationsLoading,
    messagesLoading,
    sendingMessage,
    
    // Actions
    selectConversation,
    handleSendMessage,
    handleAddReaction,
    handleEditMessage,
    handleDeleteMessage,
    handlePinMessage,
    handleArchiveConversation,
    handleMuteConversation,
    pinnedMessages,
    setInputText: (text) => dispatch(setInputText(text)),
    addFile: (files) => dispatch(addFile(files)),
    removeFile: (index) => dispatch(removeFile(index)),
    setReplyTo: (messageId) => dispatch(setReplyTo(messageId)),
    cancelReply: () => dispatch(cancelReply()),
    
    // Refetch
    refetchConversations,
    refetchMessages,
  };
};

export default useChat;

