/**
 * API Client Utility for Messages
 * 
 * This file provides a ready-to-use API client for the messaging system.
 * Backend developers can use this as a reference or starting point.
 * 
 * Usage:
 * 1. Set REACT_APP_API_BASE_URL in your .env file
 * 2. Import this client in your hooks
 * 3. Replace TODO comments in Inbox.tsx and Thread.tsx with these functions
 */

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// ============================================================================
// Types (import from types.ts in production)
// ============================================================================

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date | string;
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
  lastUpdated: Date | string;
}

interface Listing {
  id: string | number;
  title: string;
  image: string;
  rent: number;
  address: string;
}

// ============================================================================
// Authentication Helper
// ============================================================================

/**
 * Get authentication token from storage
 * TODO: Replace with your actual auth implementation
 */
const getAuthToken = (): string | null => {
  // Option 1: localStorage
  return localStorage.getItem('authToken');
  
  // Option 2: sessionStorage
  // return sessionStorage.getItem('authToken');
  
  // Option 3: Cookie
  // return document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] || null;
  
  // Option 4: Context/Redux
  // return store.getState().auth.token;
};

// ============================================================================
// Base API Client
// ============================================================================

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build headers with authentication
   */
  private getHeaders(): HeadersInit {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// ============================================================================
// API Client Instance
// ============================================================================

const apiClient = new APIClient(API_BASE_URL);

// ============================================================================
// Messages API Functions
// ============================================================================

/**
 * Fetch all message threads for the current user
 * 
 * Usage in useThreads hook:
 * ```typescript
 * const data = await messagesAPI.getThreads();
 * setThreads(data);
 * ```
 */
export const getThreads = async (): Promise<Thread[]> => {
  return apiClient.get<Thread[]>('/api/messages/threads');
};

/**
 * Send a new message in a thread
 * 
 * Usage in useSendMessage hook:
 * ```typescript
 * const newMessage = await messagesAPI.sendMessage(threadId, text);
 * return newMessage;
 * ```
 */
export const sendMessage = async (threadId: string, text: string): Promise<Message> => {
  return apiClient.post<Message>(`/api/messages/threads/${threadId}/messages`, { text });
};

/**
 * Mark a thread as read
 * 
 * Usage in useMarkAsRead hook:
 * ```typescript
 * await messagesAPI.markThreadAsRead(threadId);
 * ```
 */
export const markThreadAsRead = async (threadId: string): Promise<void> => {
  return apiClient.post<void>(`/api/messages/threads/${threadId}/read`);
};

/**
 * Mark specific messages as read
 * 
 * Usage in Thread component:
 * ```typescript
 * await messagesAPI.markMessagesAsRead(messageIds);
 * ```
 */
export const markMessagesAsRead = async (messageIds: string[]): Promise<void> => {
  return apiClient.post<void>('/api/messages/read', { messageIds });
};

/**
 * Get a single thread by ID
 */
export const getThread = async (threadId: string): Promise<Thread> => {
  return apiClient.get<Thread>(`/api/messages/threads/${threadId}`);
};

/**
 * Delete a thread
 */
export const deleteThread = async (threadId: string): Promise<void> => {
  return apiClient.delete<void>(`/api/messages/threads/${threadId}`);
};

// ============================================================================
// Listings API Functions
// ============================================================================

/**
 * Fetch listing details by ID
 * 
 * Usage in useListing hook:
 * ```typescript
 * const listing = await listingsAPI.getListing(listingId);
 * setListing(listing);
 * ```
 */
export const getListing = async (listingId: string | number): Promise<Listing> => {
  return apiClient.get<Listing>(`/api/listings/${listingId}`);
};

// ============================================================================
// Export grouped API
// ============================================================================

export const messagesAPI = {
  getThreads,
  getThread,
  sendMessage,
  markThreadAsRead,
  markMessagesAsRead,
  deleteThread,
};

export const listingsAPI = {
  getListing,
};

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * EXAMPLE 1: Replace useThreads hook implementation
 * 
 * Before:
 * ```typescript
 * setThreads([]);
 * ```
 * 
 * After:
 * ```typescript
 * import { messagesAPI } from './api-client';
 * 
 * const data = await messagesAPI.getThreads();
 * setThreads(data);
 * ```
 */

/**
 * EXAMPLE 2: Replace useSendMessage hook implementation
 * 
 * Before:
 * ```typescript
 * const newMessage: Message = {
 *   id: `new-${Date.now()}`,
 *   text,
 *   sender: 'me',
 *   timestamp: new Date()
 * };
 * return newMessage;
 * ```
 * 
 * After:
 * ```typescript
 * import { messagesAPI } from './api-client';
 * 
 * const newMessage = await messagesAPI.sendMessage(threadId, text);
 * return newMessage;
 * ```
 */

/**
 * EXAMPLE 3: Replace useMarkAsRead hook implementation
 * 
 * Before:
 * ```typescript
 * // Empty function
 * ```
 * 
 * After:
 * ```typescript
 * import { messagesAPI } from './api-client';
 * 
 * await messagesAPI.markThreadAsRead(threadId);
 * ```
 */

/**
 * EXAMPLE 4: Replace useListing hook implementation
 * 
 * Before:
 * ```typescript
 * setListing({
 *   id: listingId,
 *   title: 'Loading...',
 *   image: '',
 *   rent: 0,
 *   address: ''
 * });
 * ```
 * 
 * After:
 * ```typescript
 * import { listingsAPI } from './api-client';
 * 
 * const listing = await listingsAPI.getListing(listingId);
 * setListing(listing);
 * ```
 */

// ============================================================================
// WebSocket Support (Optional)
// ============================================================================

/**
 * WebSocket client for real-time message updates
 * 
 * Usage:
 * ```typescript
 * const ws = createMessageWebSocket(userId, (message) => {
 *   // Handle incoming message
 *   updateThreads(message);
 * });
 * 
 * // Clean up on unmount
 * return () => ws.close();
 * ```
 */
export const createMessageWebSocket = (
  userId: string,
  onMessage: (message: Message) => void
): WebSocket => {
  const wsURL = API_BASE_URL.replace('http', 'ws');
  const token = getAuthToken();
  const ws = new WebSocket(`${wsURL}/messages?userId=${userId}&token=${token}`);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  return ws;
};

// ============================================================================
// Export default
// ============================================================================

export default {
  messages: messagesAPI,
  listings: listingsAPI,
  createMessageWebSocket,
};
