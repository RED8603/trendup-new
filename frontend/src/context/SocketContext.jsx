import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/useToast';
import { env } from '@/config/env';

// Provide default context value to prevent errors if used outside provider
const defaultContextValue = {
  socket: null,
  isConnected: false,
  connectionStatus: 'disconnected',
  reconnectAttempts: 0,
  lastError: null,
  reconnect: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  emitEvent: () => {}
};

const SocketContext = createContext(defaultContextValue);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastError, setLastError] = useState(null);
  
  const { user } = useSelector((state) => state.user);
  const { showToast } = useToast();

  // Socket configuration - use env helper to ensure required vars in production
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || env.backendUrl;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 1000; // Start with 1 second

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userToken = user?.token || accessToken;
    
    if (!userToken) {
      return;
    }

    setConnectionStatus('connecting');
    setLastError(null);
    
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: accessToken || user?.token,
        userId: user?._id
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      setLastError(null);
      
      // Authenticate with chat socket
      const token = accessToken || user?.token;
      newSocket.emit('authenticate', { token });
      
      newSocket.on('error', (error) => {
        console.error('[SocketContext] Socket error:', error);
      });
      
      showToast('Chat is live! You\'ll receive messages instantly', 'success');
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        showToast('Disconnected from server', 'warning');
      } else {
        showToast('Connection lost, attempting to reconnect...', 'warning');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('[SocketContext] Connection error:', error);
      setConnectionStatus('error');
      setLastError(error.message);
      
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setReconnectAttempts(prev => prev + 1);
        showToast(`Connection failed (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS}), retrying...`, 'error');
      } else {
        showToast('Unable to connect to chat. Please check your connection', 'error');
      }
    });

    newSocket.on('reconnect', () => {
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      setLastError(null);
      showToast('Chat reconnected! You\'re back online', 'success');
    });

    newSocket.on('reconnect_attempt', () => {
      setConnectionStatus('connecting');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('[SocketContext] Reconnection error:', error);
      setConnectionStatus('error');
      setLastError(error.message);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('[SocketContext] Reconnection failed after maximum attempts');
      setConnectionStatus('error');
      setLastError('Failed to reconnect after maximum attempts');
      showToast('Connection lost. Please refresh the page', 'error');
    });

    // Real-time event handlers are handled by individual hooks/components

    setSocket(newSocket);
  }, [user, showToast, reconnectAttempts]);

  // Cleanup socket connection
  const disconnectSocket = useCallback(() => {
    if (socket) {
      console.log('[SocketContext] Disconnecting socket...');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setReconnectAttempts(0);
      setLastError(null);
    }
  }, [socket]);

  // Initialize socket when user is available
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const hasToken = accessToken || user?.token;
    
    if (hasToken && !socket) {
      initializeSocket();
    } else if (!hasToken && socket) {
      disconnectSocket();
    }
  }, [user, socket, initializeSocket, disconnectSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (socket) {
      disconnectSocket();
    }
    setTimeout(() => {
      initializeSocket();
    }, 1000);
  }, [socket, disconnectSocket, initializeSocket]);

  // Join room function
  const joinRoom = useCallback((roomName) => {
    if (socket && isConnected) {
      socket.emit('join_room', { roomName });
    }
  }, [socket, isConnected]);

  // Leave room function
  const leaveRoom = useCallback((roomName) => {
    if (socket && isConnected) {
      socket.emit('leave_room', { roomName });
    }
  }, [socket, isConnected]);

  // Emit event function
  const emitEvent = useCallback((eventName, data) => {
    if (socket && isConnected) {
      socket.emit(eventName, data);
    }
  }, [socket, isConnected]);

  const value = {
    socket,
    isConnected,
    connectionStatus,
    reconnectAttempts,
    lastError,
    reconnect,
    joinRoom,
    leaveRoom,
    emitEvent
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  // Context will always have a value (either from provider or default)
  // No need to throw error - just return the context
  return context;
};

export default SocketContext;
