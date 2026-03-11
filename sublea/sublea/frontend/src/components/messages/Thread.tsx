import { useState, useEffect, useRef } from 'react';
import type { FormEvent, KeyboardEvent, RefObject, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  sent_at: string | Date;
  read: boolean;
}

interface Listing {
  id: string | number;
  title: string;
  image: string;
  rent: number;
  address: string;
}

interface ThreadProps {
  listingId: string | number;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => Promise<void>;
  onMarkAsRead?: (messageIds: string[]) => void;
  className?: string;
}

interface MessageGroupProps {
  date: string;
  messages: Message[];
  currentUserId: string;
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  currentUserId: string;
}

interface ListingHeaderProps {
  listing: Listing;
}

interface MessageInputFormProps {
  newMessage: string;
  isSending: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

// Utility Functions

const formatTime = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const groupMessagesByDate = (messages: Message[]): Record<string, Message[]> => {
  return messages.reduce((groups, message) => {
    const date = new Date(message.sent_at).toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric',
      year: new Date(message.sent_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);
};

// API Integration Layer (Ready for Backend)

/**
 * Hook to fetch listing details
 */
const useListing = (listingId: string | number) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch(`/api/listings/${listingId}`);
        setListing({
          id: data.id,
          title: data.title,
          image: data.images && data.images.length > 0 ? data.images[0] : '',
          rent: data.rent,
          address: data.address
        });
      } catch (err) {
        console.error("Failed to fetch thread listing details", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  return { listing, isLoading };
};

// Sub-Components

const ListingHeader = ({ listing }: ListingHeaderProps) => {
  return (
    <div className="flex-shrink-0 p-4 border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md z-10 sticky top-0">
      <Link to={`/listings/${listing.id}`} className="flex items-center gap-3 group">
        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
          {listing.image && (
            <img 
              src={listing.image} 
              alt={listing.title} 
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-[var(--text-main)] truncate group-hover:text-[var(--primary)] transition-colors">
            {listing.title}
          </h3>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {listing.address} • <span className="font-medium text-[var(--text-main)]">${listing.rent}/mo</span>
          </p>
        </div>
        <div className="hidden sm:block">
          <button className="btn btn-outline text-xs py-1.5 px-3">View Details</button>
        </div>
      </Link>
    </div>
  );
};

const UserAvatar = ({ showAvatar }: { showAvatar: boolean }) => {
  return (
    <div className="w-8 h-8 flex-shrink-0">
      {showAvatar && (
        <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

const ReadReceipt = ({ isRead }: { isRead: boolean }) => {
  if (isRead) {
    return (
      <span aria-label="Read">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      </span>
    );
  }

  return (
    <span aria-label="Delivered">
      <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
};

const MessageBubble = ({ message, isMe, showAvatar, currentUserId }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 group`}>
      {!isMe && <UserAvatar showAvatar={showAvatar} />}

      <div className={`
        max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative break-words
        ${isMe 
          ? 'bg-[var(--primary)] text-white rounded-tr-none' 
          : 'bg-[var(--surface)] text-[var(--text-main)] border border-[var(--border)] rounded-tl-none'}
      `}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={`
          text-[10px] mt-1 flex items-center justify-end gap-1
          ${isMe ? 'text-white/70' : 'text-[var(--text-muted)]'}
        `}>
          {formatTime(message.sent_at)}
          {isMe && <ReadReceipt isRead={message.read} />}
        </div>
      </div>
    </div>
  );
};

const DateSeparator = ({ date }: { date: string }) => {
  return (
    <div className="flex justify-center">
      <span className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--surface)] px-2 py-1 rounded-full border border-[var(--border)] uppercase tracking-wider">
        {date}
      </span>
    </div>
  );
};

const MessageGroup = ({ date, messages, currentUserId }: MessageGroupProps) => {
  return (
    <div className="space-y-4">
      <DateSeparator date={date} />
      <div className="space-y-2">
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === currentUserId;
          const showAvatar = !isMe && (index === 0 || messages[index - 1].sender_id === currentUserId);

          return (
            <MessageBubble
              key={msg.id} // TO BE CHANGED
              message={msg}
              isMe={isMe}
              showAvatar={showAvatar}
              currentUserId={currentUserId}
            />
          );
        })}
      </div>
    </div>
  );
};

const EmptyMessagesState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] space-y-2 opacity-60">
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p className="text-sm">Start the conversation</p>
    </div>
  );
};

const MessageInputForm = ({ 
  newMessage, 
  isSending, 
  onMessageChange, 
  onSubmit, 
  onKeyDown, 
  textareaRef 
}: MessageInputFormProps) => {
  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onMessageChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md sticky bottom-0 z-20">
      <form onSubmit={onSubmit} className="relative flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleInput}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="input pr-12 resize-none min-h-[44px] max-h-32 py-2.5 bg-[var(--background)] border-[var(--border)] focus:border-[var(--primary)] w-full scrollbar-hide"
          />
          <button 
            type="button"
            className="absolute left-2 bottom-2 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--surface)] transition-colors hidden sm:block"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={!newMessage.trim() || isSending}
          className={`
            btn btn-primary rounded-full p-3 h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 transition-all
            ${!newMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-md'}
          `}
        >
          {isSending ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 transform rotate-90 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

// 
// Main Component

export const Thread = ({ 
  listingId, 
  messages, 
  currentUserId, 
  onSendMessage,
  onMarkAsRead,
  className = ''
}: ThreadProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { listing, isLoading } = useListing(listingId);
  const groupedMessages = groupMessagesByDate(messages);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark unread messages as read
  useEffect(() => {
    const unreadMessages = messages
      .filter(m => !m.read && m.sender_id !== currentUserId)
      .map(m => m.id);

    if (unreadMessages.length > 0 && onMarkAsRead) {
      const timer = setTimeout(() => {
        onMarkAsRead(unreadMessages);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, currentUserId, onMarkAsRead]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isLoading || !listing) {
    return (
      <div className={`flex items-center justify-center h-full bg-[var(--background)] ${className}`}>
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-[var(--background)] ${className}`}>
      
      <ListingHeader listing={listing} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
        {Object.keys(groupedMessages).length === 0 ? (
          <EmptyMessagesState />
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <MessageGroup
              key={date} // TO BE FIXED
              date={date}
              messages={dateMessages}
              currentUserId={currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInputForm
        newMessage={newMessage}
        isSending={isSending}
        onMessageChange={setNewMessage}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        textareaRef={textareaRef}
      />

    </div>
  );
};