import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type SocketType = ReturnType<typeof io>;

interface SocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
  connectionState: number;
}
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState(0);

  const connect = () => {
    if (!socket) {
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', "polling"],
        autoConnect: true,
        query: {
            userId: localStorage.getItem('userId'),
        },
        pingTimeout: 10000,
        pingInterval: 5000,
      });

      newSocket.auth = {
        sessionId: localStorage.getItem('sessionId'),
      };

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setConnectionState((prev) => prev + 1);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
        setConnectionState((prev) => prev + 1);
      });

      newSocket.on('error', (error: unknown) => {
        console.error('Socket error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);
      newSocket.connect();
    } else if (!socket.connected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  const emit = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket is not connected, cannot emit event:', event);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event: string) => {
    if (socket) {
      socket.off(event);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = {
    socket,
    isConnected,
    connectionState,
    connect,
    disconnect,
    emit,
    on,
    off,
  };

  return (
      <SocketContext.Provider value={value}>
        {children}
      </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const useSocketEvent = (
    event: string,
    callback: (data: any) => void,
    dependencies: any[] = []
) => {
  const { on, off } = useSocket();

  useEffect(() => {
    on(event, callback);
    return () => off(event);
  }, [event, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps
};
