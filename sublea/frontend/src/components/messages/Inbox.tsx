import React, { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../api/client';

// Type Definitions

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

interface Thread {
  id: string;
  listing: {
    id: string;
    title: string;
    image: string;
  };
  otherUser: {
    name: string;
    avatar?: string;
    isAnonymous: boolean;
    isOnline: boolean;
  };
  messages: Message[];
  unreadCount: number;
  lastUpdated: Date;
}

interface ThreadListItemProps {
  key?: React.Key;
  thread: Thread;
  isActive: boolean;
  onSelect: (threadId: string) => void;
}

interface ThreadHeaderProps {
  thread: Thread;
  onBack: () => void;
}

interface MessageBubbleProps {
  key?: React.Key;
  message: Message;
  isMe: boolean;
  showTimestamp: boolean;
}

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

// Utility Functions

const formatRelativeTime = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const calculateUnreadCount = (threads: Thread[]): number => {
  return threads.reduce((acc, t) => acc + t.unreadCount, 0);
};

// Sub-Components

const UserAvatar = ({ 
  user, 
  size = 'md' 
}: { 
  user: Thread['otherUser']; 
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (user.isAnonymous) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center`}>
        <svg className={`${iconSizes[size]} text-[var(--text-muted)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );
  }

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="relative">
      {user.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name} 
          className={`${sizeClasses[size]} rounded-full object-cover border border-[var(--border)] bg-[var(--surface)]`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center`}>
          <span className="text-sm font-bold text-[var(--text-main)] w-full text-center truncate">{initials}</span>
        </div>
      )}
      
      {user.isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--background)] rounded-full" />
      )}
    </div>
  );
};

const ThreadListItem = ({ thread, isActive, onSelect }: ThreadListItemProps) => {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const isUnread = thread.unreadCount > 0;

  return (
    <button
      onClick={() => onSelect(thread.id)}
      className={`w-full text-left p-4 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface)] relative
        ${isActive ? 'bg-[var(--surface)] border-l-4 border-l-[var(--primary)]' : 'border-l-4 border-l-transparent'}
      `}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <UserAvatar user={thread.otherUser} size="md" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <span className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-[var(--text-main)]' : 'font-medium text-[var(--text-main)]'}`}>
              {thread.otherUser.name}
            </span>
            <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
              {formatRelativeTime(thread.lastUpdated)}
            </span>
          </div>
          
          <div className="text-xs text-[var(--text-muted)] truncate mb-1">
            {thread.listing.title}
          </div>
          
          <p className={`text-sm truncate ${isUnread ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--text-muted)]'}`}>
            {lastMessage ? (
              <>
                {lastMessage.sender === 'me' && 'You: '}
                {lastMessage.text}
              </>
            ) : (
              <i>No messages yet...</i>
            )}
          </p>
        </div>

        <div className="hidden sm:block flex-shrink-0 ml-2">
          <img 
            src={thread.listing.image} 
            alt="Listing" 
            className="w-12 h-12 rounded-md object-cover opacity-70" 
          />
        </div>

        {isUnread && (
          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2.5 h-2.5 bg-[var(--primary)] rounded-full" />
        )}
      </div>
    </button>
  );
};

const ThreadHeader = ({ thread, onBack }: ThreadHeaderProps) => {
  return (
    <div className="p-4 border-b border-[var(--border)] flex items-center gap-3 bg-[var(--surface)]/50 backdrop-blur-md z-10">
      <button 
        onClick={onBack}
        className="md:hidden p-1 -ml-1 hover:bg-[var(--background)] rounded-full text-[var(--text-muted)]"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <UserAvatar user={thread.otherUser} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-[var(--text-main)] truncate">{thread.otherUser.name}</h2>
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 truncate">
            <span>Inquiring about: {thread.listing.title}</span>
          </div>
        </div>
        <a href={`/listings/${thread.listing.id}`} className="btn btn-outline text-xs py-1.5 hidden sm:flex">
          View Listing
        </a>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isMe, showTimestamp }: MessageBubbleProps) => {
  return (
    <>
      {showTimestamp && (
        <div className="text-center text-xs text-[var(--text-muted)] my-4">
          {formatRelativeTime(message.timestamp)}
        </div>
      )}
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`
          max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm
          ${isMe 
            ? 'bg-[var(--primary)] text-white rounded-tr-none' 
            : 'bg-[var(--surface)] text-[var(--text-main)] border border-[var(--border)] rounded-tl-none'}
        `}>
          <p>{message.text}</p>
        </div>
      </div>
    </>
  );
};

const MessageInput = ({ value, onChange, onSubmit, disabled = false }: MessageInputProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button type="button" className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--border)] transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 input bg-[var(--background)] border-transparent focus:border-[var(--primary)]"
        />
        <button 
          type="submit" 
          disabled={!value.trim() || disabled}
          className="btn btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-24 h-24 bg-[var(--surface)] rounded-full flex items-center justify-center mb-6 border border-[var(--border)]">
        <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Your Messages</h3>
      <p className="text-[var(--text-muted)] max-w-xs">
        Select a conversation from the list to view details or send a reply.
      </p>
    </div>
  );
};

// ============================================================================
// API Integration Layer (Ready for Backend)
// ============================================================================

/**
 * Hook to fetch and manage message threads
 * TODO: Replace with actual API call
 */
const useThreads = (user: any) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      const data = await apiFetch('/api/conversations');
      const mappedThreads: Thread[] = data.map((conv: any) => ({
        id: conv.other_user.id.toString(),
        listing: {
          id: conv.latest_message.listing_id.toString(),
          title: `Listing #${conv.latest_message.listing_id}`,
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'
        },
        otherUser: {
          name: `${conv.other_user.first_name} ${conv.other_user.last_name}`,
          avatar: conv.other_user.profile_picture || undefined,
          isAnonymous: false,
          isOnline: true
        },
        messages: [{
          id: conv.latest_message.id.toString(),
          text: conv.latest_message.content,
          sender: conv.latest_message.sender_id === user.id ? 'me' : 'other',
          timestamp: new Date(conv.latest_message.sent_at)
        }],
        unreadCount: conv.unread_count,
        lastUpdated: new Date(conv.latest_message.sent_at)
      }));
      setThreads(prev => {
        // Preserve any temporary threads (threads with no messages that aren't from backend yet)
        const tempThreads = prev.filter(t => t.messages.length === 0 && !mappedThreads.some(m => m.id === t.id));
        return [...tempThreads, ...mappedThreads];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threads');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchThreads();
    }
  }, [user, fetchThreads]);

  // Set up WebSocket
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NODE_ENV === 'development' ? 'localhost:8000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws/messages?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      fetchThreads();
    };
    
    return () => ws.close();
  }, [user, fetchThreads]);

  return { threads, setThreads, isLoading, error, fetchThreads };
};

const useSendMessage = (user: any) => {
  const [isSending, setIsSending] = useState(false);
  const sendMessage = async (threadId: string, text: string, listingId: string = "1") => {
    setIsSending(true);
    try {
      const response = await apiFetch(`/api/inbox`, {
        method: 'POST',
        body: JSON.stringify({
          sender_id: user.id,
          recipient_id: parseInt(threadId, 10),
          listing_id: parseInt(listingId, 10),
          content: text
        })
      });
      const newMessage: Message = {
        id: response.id.toString(),
        text: response.content,
        sender: 'me',
        timestamp: new Date(response.sent_at)
      };
      return newMessage;
    } finally {
      setIsSending(false);
    }
  };
  return { sendMessage, isSending };
};

const useMarkAsRead = (user: any) => {
  return { markAsRead: async (threadId: string) => {} };
};

// ============================================================================
// Main Component
// ============================================================================

export const Inbox = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { threads, setThreads, isLoading, error, fetchThreads } = useThreads(user);
  const { sendMessage, isSending } = useSendMessage(user);
  const { markAsRead } = useMarkAsRead(user);

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    if (location.state?.startNewConversation && location.state?.targetId && user) {
       const targetId = location.state.targetId.toString();
       setActiveThreadId(targetId);
       
       setThreads(prev => {
          if (prev.find(p => p.id === targetId)) return prev;
          return [{
             id: targetId,
             listing: { id: location.state.listingId.toString(), title: location.state.listingTitle, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop' },
             otherUser: { name: location.state.targetName, avatar: location.state.targetAvatar, isAnonymous: false, isOnline: true },
             messages: [],
             unreadCount: 0,
             lastUpdated: new Date()
          }, ...prev];
       });
       // Clear location state after setting
       window.history.replaceState({}, document.title);
    }
  }, [location.state, user]);

  useEffect(() => {
    const fetchFullThread = async () => {
       if (activeThreadId && user) {
          try {
            const data = await apiFetch(`/api/messages/${activeThreadId}`);
            setThreads(prev => prev.map(t => {
              if (t.id === activeThreadId) {
                 return {
                   ...t,
                   messages: data.map((m: any) => ({
                     id: m.id.toString(),
                     text: m.content,
                     sender: m.sender_id === user.id ? 'me' : 'other',
                     timestamp: new Date(m.sent_at)
                   }))
                 };
              }
              return t;
            }));
          } catch (e) {}
       }
    };
    fetchFullThread();
  }, [activeThreadId, user, fetchThreads]);

  // Scroll to bottom when opening thread or receiving new messages
  useEffect(() => {
    if (activeThreadId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThreadId, activeThread?.messages.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeThreadId) return;

    const currentThread = threads.find(t => t.id === activeThreadId);
    const listingId = currentThread?.listing?.id || "1";
    const message = await sendMessage(activeThreadId, newMessage, listingId);

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastUpdated: new Date(),
          messages: [...t.messages, message]
        };
      }
      return t;
    }));
    setNewMessage('');
  };

  const handleSelectThread = async (threadId: string) => {
    await markAsRead(threadId);
    setThreads(prev => prev.map(t => 
      t.id === threadId ? { ...t, unreadCount: 0 } : t
    ));
    setActiveThreadId(threadId);
  };

  const handleBackToList = () => {
    setActiveThreadId(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading messages</p>
          <p className="text-sm text-[var(--text-muted)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[600px] overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-main)]">Messages</h1>
        <div className="hidden md:block text-sm text-[var(--text-muted)]">
          {calculateUnreadCount(threads) > 0 
            ? `${calculateUnreadCount(threads)} unread messages` 
            : 'All caught up'}
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden relative">
        
        {/* Left Sidebar: Thread List */}
        <div className={`
          w-full md:w-1/3 lg:w-80 flex flex-col glass-panel overflow-hidden transition-all duration-300 absolute md:relative z-10 h-full
          ${activeThreadId ? '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100' : 'translate-x-0 opacity-100'}
        `}>
          <div className="p-4 border-b border-[var(--border)]">
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="input text-sm py-2"
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-[var(--text-muted)]">Loading...</div>
              </div>
            ) : threads.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-center p-4">
                <p className="text-[var(--text-muted)]">No messages yet</p>
              </div>
            ) : (
              threads.map(thread => (
                <ThreadListItem
                  key={thread.id} // to be fixed
                  thread={thread}
                  isActive={activeThreadId === thread.id}
                  onSelect={handleSelectThread}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Chat Interface */}
        <div className={`
          flex-1 glass-panel flex flex-col overflow-hidden transition-all duration-300 absolute md:relative inset-0 z-20 bg-[var(--background)] md:bg-transparent
          ${activeThreadId ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 md:opacity-100 md:translate-x-0'}
        `}>
          {activeThread ? (
            <>
              <ThreadHeader thread={activeThread} onBack={handleBackToList} />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--background)]/30">
                {activeThread.messages.map((msg, idx) => {
                  const isMe = msg.sender === 'me';
                  const showTime = idx === 0 || (msg.timestamp.getTime() - activeThread.messages[idx-1].timestamp.getTime() > 1000 * 60 * 15);

                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isMe={isMe}
                      showTimestamp={showTime}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <MessageInput
                value={newMessage}
                onChange={setNewMessage}
                onSubmit={handleSendMessage}
                disabled={isSending}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>

      </div>
    </div>
  );
};