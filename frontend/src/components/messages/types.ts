import React from 'react';

/**
 * Centralized type definitions for the messaging system
 * 
 * These types should be shared between frontend and backend to ensure consistency.
 * Consider moving these to a shared types package if using a monorepo.
 */

// ============================================================================
// Core Message Types
// ============================================================================

/**
 * Represents a single message in a conversation
 */
export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date | string; // ISO 8601 string from API, Date object in frontend
}

/**
 * Extended message format used by Thread component
 * This format includes more detailed sender information
 */
export interface DetailedMessage {
  id: string;
  sender_id: string;
  content: string;
  sent_at: Date | string; // ISO 8601 string from API, Date object in frontend
  read: boolean;
}

// ============================================================================
// User Types
// ============================================================================

/**
 * Represents the other user in a conversation
 */
export interface ThreadUser {
  name: string;
  avatar?: string;
  isAnonymous: boolean;
  isOnline: boolean;
}

// ============================================================================
// Listing Types
// ============================================================================

/**
 * Minimal listing information shown in message threads
 */
export interface ThreadListing {
  id: string;
  title: string;
  image: string;
}

/**
 * Full listing information used in Thread component header
 */
export interface Listing {
  id: string | number;
  title: string;
  image: string;
  rent: number;
  address: string;
}

// ============================================================================
// Thread Types
// ============================================================================

/**
 * Represents a complete message thread/conversation
 */
export interface Thread {
  id: string;
  listing: ThreadListing;
  otherUser: ThreadUser;
  messages: Message[];
  unreadCount: number;
  lastUpdated: Date | string; // ISO 8601 string from API, Date object in frontend
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request body for sending a new message
 */
export interface SendMessageRequest {
  text: string;
}

/**
 * Response from sending a message
 */
export interface SendMessageResponse extends Message {}

/**
 * Response from fetching all threads
 */
export interface GetThreadsResponse {
  threads: Thread[];
  totalUnread: number;
}

/**
 * Request body for marking messages as read
 */
export interface MarkAsReadRequest {
  messageIds: string[];
}

/**
 * Response from fetching a single listing
 */
export interface GetListingResponse extends Listing {}

// ============================================================================
// Component Prop Types
// ============================================================================

/**
 * Props for the Thread component
 */
export interface ThreadProps {
  listingId: string | number;
  messages: DetailedMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => Promise<void>;
  onMarkAsRead?: (messageIds: string[]) => void;
  className?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for useThreads hook
 */
export interface UseThreadsReturn {
  threads: Thread[];
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Return type for useSendMessage hook
 */
export interface UseSendMessageReturn {
  sendMessage: (threadId: string, text: string) => Promise<Message>;
  isSending: boolean;
  isLoading: boolean;
}

/**
 * Return type for useMarkAsRead hook
 */
export interface UseMarkAsReadReturn {
  markAsRead: (threadId: string) => Promise<void>;
}

/**
 * Return type for useListing hook
 */
export interface UseListingReturn {
  listing: Listing | null;
  isLoading: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Type guard to check if a message is from the current user
 */
export type MessageSender = 'me' | 'other';

/**
 * Grouped messages by date for display purposes
 */
export type GroupedMessages = Record<string, Message[]>;

/**
 * Grouped detailed messages by date for Thread component
 */
export type GroupedDetailedMessages = Record<string, DetailedMessage[]>;

// ============================================================================
// API Error Types
// ============================================================================

/**
 * Standard API error response
 */
export interface APIError {
  message: string;
  code?: string;
  statusCode?: number;
}

// ============================================================================
// WebSocket Types (Optional - for real-time updates)
// ============================================================================

/**
 * WebSocket message event types
 */
export enum WebSocketEventType {
  NEW_MESSAGE = 'new_message',
  MESSAGE_READ = 'message_read',
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  TYPING = 'typing'
}

/**
 * WebSocket message payload
 */
export interface WebSocketMessage {
  type: WebSocketEventType;
  threadId: string;
  data: Message | { userId: string } | { isTyping: boolean };
}
