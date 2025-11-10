import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useSocketEvent } from './useSocket';
import { useSelector } from 'react-redux';

/**
 * Hook for chat-specific Socket.io functionality
 * Handles typing indicators, online status, and real-time chat events
 */
export const useChatSocket = (conversationId) => {
  const { socket, isConnected } = useSocket();
  const { user } = useSelector((state) => state.user);
  const typingTimeoutRef = useRef(null);
  const typingUsersRef = useRef(new Set());

  // Typing indicator state
  const [typingUsers, setTypingUsers] = useState([]);

  // Clear typing users when conversation changes or becomes null
  useEffect(() => {
    typingUsersRef.current.clear();
    setTypingUsers([]);
    
    // Clear any pending timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [conversationId]);

  // Listen for typing start events - ONLY if conversationId exists
  useSocketEvent(
    'chat:typing:start',
    useCallback((data) => {
      if (!conversationId || !user?._id) {
        return;
      }
      
      const conversationMatch = String(data.conversationId) === String(conversationId);
      const userMismatch = String(data.userId) !== String(user._id);
      
      if (conversationMatch && userMismatch) {
        typingUsersRef.current.add(data.userId);
        setTypingUsers(Array.from(typingUsersRef.current));
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
          typingUsersRef.current.delete(data.userId);
          setTypingUsers(Array.from(typingUsersRef.current));
        }, 3000);
      }
    }, [conversationId, user?._id]),
    // Enable this listener ONLY when we have a conversationId and user
    !!conversationId && !!user?._id
  );

  // Listen for typing stop events - ONLY if conversationId exists
  useSocketEvent(
    'chat:typing:stop',
    useCallback((data) => {
      if (!conversationId || !user?._id) {
        return;
      }
      
      const conversationMatch = String(data.conversationId) === String(conversationId);
      const userMismatch = String(data.userId) !== String(user._id);
      
      if (conversationMatch && userMismatch) {
        typingUsersRef.current.delete(data.userId);
        setTypingUsers(Array.from(typingUsersRef.current));
      }
    }, [conversationId, user?._id]),
    // Enable this listener ONLY when we have a conversationId and user
    !!conversationId && !!user?._id
  );

  // Listen for online/offline status
  useSocketEvent('chat:user:online', useCallback((data) => {
    if (data.conversationId === conversationId) {
      // Handle online status update
      // You can dispatch to Redux or call a callback
    }
  }, [conversationId]));

  useSocketEvent('chat:user:offline', useCallback((data) => {
    if (data.conversationId === conversationId) {
      // Handle offline status update
    }
  }, [conversationId]));

  // Emit typing start - with guards
  const startTyping = useCallback(() => {
    if (!socket || !isConnected || !conversationId || !user?._id) {
      return;
    }

    socket.emit('chat:typing:start', { conversationId });
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (socket?.connected && conversationId) {
        socket.emit('chat:typing:stop', { conversationId });
      }
      typingTimeoutRef.current = null;
    }, 3000);
  }, [socket, isConnected, conversationId, user?._id]);

  // Emit typing stop - with guards
  const stopTyping = useCallback(() => {
    if (!socket?.connected || !conversationId) {
      return;
    }

    socket.emit('chat:typing:stop', { conversationId });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [socket, conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return {
    typingUsers,
    startTyping,
    stopTyping,
    // Return ready state so components can check
    isReady: !!conversationId && !!user?._id && isConnected
  };
};

/**
 * Hook to handle chat authentication with Socket.io
 */
export const useChatAuth = () => {
  const { socket, isConnected } = useSocket();
  const { user } = useSelector((state) => state.user);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (socket && isConnected && user?.token && !authenticated) {
      // Authenticate with chat socket
      socket.emit('authenticate', { token: user.token });
      
      socket.on('authenticated', () => {
        setAuthenticated(true);
      });
      
      socket.on('error', (error) => {
        console.error('[ChatAuth] Authentication error:', error);
        setAuthenticated(false);
      });
    }

    return () => {
      if (socket) {
        socket.off('authenticated');
        socket.off('error');
      }
    };
  }, [socket, isConnected, user?.token, authenticated]);

  return { authenticated };
};

export default useChatSocket;

