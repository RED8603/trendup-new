import { baseApi } from "../baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // CONVERSATION ENDPOINTS
    // ==========================================

    // Get user conversations
    getConversations: builder.query({
      query: ({ page = 1, limit = 50, archived = false } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        // Always include archived parameter to ensure proper query key separation
        params.append('archived', archived ? 'true' : 'false');
        
        return `/chat/conversations?${params.toString()}`;
      },
      providesTags: (result, error, { archived = false }) => [
        'Conversations',
        { type: 'Conversations', id: archived ? 'archived' : 'active' },
        ...(result?.data?.conversations?.map(({ _id }) => ({ type: 'Conversations', id: _id })) || [])
      ],
    }),

    // Get conversation by ID
    getConversation: builder.query({
      query: (id) => `/chat/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Conversations', id }],
    }),

    // Create direct conversation
    createDirectConversation: builder.mutation({
      query: (data) => ({
        url: '/chat/conversations/direct',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Conversations'],
    }),

    // Create group conversation
    createGroupConversation: builder.mutation({
      query: (data) => ({
        url: '/chat/conversations/group',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Conversations'],
    }),

    // Update group conversation
    updateGroupConversation: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/chat/conversations/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Conversations', id }],
    }),

    // Add participants to group
    addParticipants: builder.mutation({
      query: ({ id, participantIds }) => ({
        url: `/chat/conversations/${id}/participants`,
        method: 'POST',
        body: { participantIds },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Conversations', id }],
    }),

    // Remove participant from group
    removeParticipant: builder.mutation({
      query: ({ id, participantId }) => ({
        url: `/chat/conversations/${id}/participants`,
        method: 'DELETE',
        body: { participantId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Conversations', id }],
    }),

    // Archive/unarchive conversation
    archiveConversation: builder.mutation({
      query: ({ id, archive = true }) => ({
        url: `/chat/conversations/${id}/archive`,
        method: 'POST',
        body: { archive },
      }),
      invalidatesTags: [
        'Conversations',
        { type: 'Conversations', id: 'active' },
        { type: 'Conversations', id: 'archived' },
      ], // Invalidate all conversations to refetch both active and archived lists
    }),

    // Mute/unmute conversation
    muteConversation: builder.mutation({
      query: ({ id, mute = true, muteUntil = null }) => ({
        url: `/chat/conversations/${id}/mute`,
        method: 'POST',
        body: { mute, muteUntil },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Conversations', id }],
    }),

    // ==========================================
    // MESSAGE ENDPOINTS
    // ==========================================

    // Get messages for conversation
    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 50, before = null }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (before) params.append('before', before);
        
        return `/chat/${conversationId}/messages?${params.toString()}`;
      },
      providesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        ...(result?.data?.messages?.map(({ _id }) => ({ type: 'Messages', id: `${conversationId}-${_id}` })) || [])
      ],
      keepUnusedDataFor: 0, // Don't cache - always refetch when needed
      refetchOnMountOrArgChange: true, // Refetch when conversationId changes or when invalidated
    }),

    // Send message
    sendMessage: builder.mutation({
      query: ({ conversationId, content, replyTo, messageType = 'text', attachments = [] }) => {
        // Check if we have actual File objects (not metadata)
        const hasFiles = attachments && attachments.length > 0 && 
          attachments.some(file => file instanceof File);
        
        // If there are file attachments, use FormData
        if (hasFiles) {
          const formData = new FormData();
          
          // Add message data
          if (content && content.trim()) {
            formData.append('content', content.trim());
          }
          if (replyTo) {
            formData.append('replyTo', replyTo);
          }
          formData.append('messageType', messageType);
          
          // Add attachments - only actual File objects
          attachments.forEach((file) => {
            if (file instanceof File) {
              formData.append('attachments', file);
            }
          });
          
          return {
            url: `/chat/${conversationId}/messages`,
            method: 'POST',
            body: formData,
          };
        } else {
          // Regular JSON message
          return {
            url: `/chat/${conversationId}/messages`,
            method: 'POST',
            body: { content, replyTo, messageType },
          };
        }
      },
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        { type: 'Conversations', id: conversationId },
      ],
    }),

    // Edit message
    editMessage: builder.mutation({
      query: ({ id, content }) => ({
        url: `/chat/messages/${id}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: (result, error, { id }) => ['Messages'],
    }),

    // Delete message
    deleteMessage: builder.mutation({
      query: ({ id, deleteFor = 'everyone' }) => ({
        url: `/chat/messages/${id}`,
        method: 'DELETE',
        body: { deleteFor },
      }),
      invalidatesTags: ['Messages'],
    }),

    // Add reaction to message
    addReaction: builder.mutation({
      query: ({ id, emoji }) => ({
        url: `/chat/messages/${id}/reactions`,
        method: 'POST',
        body: { emoji },
      }),
      invalidatesTags: ['Messages'],
    }),

    // Mark message as read
    markMessageAsRead: builder.mutation({
      query: (id) => ({
        url: `/chat/messages/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Messages', 'Conversations'],
    }),

    // Mark all messages as read
    markAllMessagesAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/${conversationId}/messages/read-all`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'Messages', id: conversationId },
        { type: 'Conversations', id: conversationId },
      ],
    }),

    // Pin/unpin message
    pinMessage: builder.mutation({
      query: ({ id, pin = true }) => ({
        url: `/chat/messages/${id}/pin`,
        method: 'POST',
        body: { pin },
      }),
      invalidatesTags: ['Messages'],
    }),

    // Get pinned messages
    getPinnedMessages: builder.query({
      query: (conversationId) => `/chat/${conversationId}/messages/pinned`,
      providesTags: (result, error, conversationId) => [
        { type: 'Messages', id: `${conversationId}-pinned` }
      ],
    }),

    // Search messages
    searchMessages: builder.query({
      query: ({ conversationId, q, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        params.append('q', q);
        params.append('page', page);
        params.append('limit', limit);
        
        return `/chat/${conversationId}/messages/search?${params.toString()}`;
      },
      providesTags: ['Messages'],
    }),
  }),
});

export const {
  // Conversation queries
  useGetConversationsQuery,
  useGetConversationQuery,
  
  // Conversation mutations
  useCreateDirectConversationMutation,
  useCreateGroupConversationMutation,
  useUpdateGroupConversationMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
  useArchiveConversationMutation,
  useMuteConversationMutation,
  
  // Message queries
  useGetMessagesQuery,
  useGetPinnedMessagesQuery,
  useSearchMessagesQuery,
  
  // Message mutations
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useAddReactionMutation,
  useMarkMessageAsReadMutation,
  useMarkAllMessagesAsReadMutation,
  usePinMessageMutation,
} = chatApi;

