/**
 * Integration Tests — AuthContext + useAuth hook
*/

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';
import { mockUser, mockApiToken } from '../fixtures';

//  mock apiFetch so tests don't hit the real backend 
vi.mock('../../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/client')>();
  return {
    ...actual,
    apiFetch: vi.fn(),
  };
});

import { apiFetch } from '../../api/client';
const mockApiFetch = vi.mocked(apiFetch);

// test consumer component 

// A minimal component that reads from AuthContext and exposes buttons
// so we can trigger login/logout in tests.
function TestConsumer() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <span data-testid="user-name">{user ? user.first_name : 'logged-out'}</span>
      <span data-testid="user-email">{user?.email ?? ''}</span>
      <button onClick={() => login(mockApiToken, mockUser)}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

function renderWithAuth(ui: React.ReactNode = <TestConsumer />) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

//  setup / teardown 

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

//  tests 

describe('AuthContext — initial mount', () => {
  it('shows loading initially then resolves to logged-out when no token', async () => {
    // Arrange — no token, apiFetch should not be called
    mockApiFetch.mockResolvedValue(undefined);

    // Act
    renderWithAuth();

    // Assert — loading disappears and user is null
    await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('logged-out'));
  });

  it('fetches the user profile on mount when a token is in localStorage', async () => {
    // Arrange
    localStorage.setItem('authToken', mockApiToken);
    mockApiFetch.mockResolvedValue(mockUser);

    // Act
    renderWithAuth();

    // Assert
    await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Jane'));
  });
});

describe('AuthContext — login()', () => {
  it('stores the token in localStorage and populates user state', async () => {
    // Arrange — no active session, fetchUser resolves to null-path
    mockApiFetch.mockResolvedValue(undefined);
    renderWithAuth();
    await waitFor(() => screen.getByTestId('user-name'));

    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    });

    // Assert
    expect(localStorage.getItem('authToken')).toBe(mockApiToken);
    expect(screen.getByTestId('user-name')).toHaveTextContent('Jane');
    expect(screen.getByTestId('user-email')).toHaveTextContent('jane@uoregon.edu');
  });
});

describe('AuthContext — logout()', () => {
  it('clears localStorage AND sessionStorage and resets user to null', async () => {
    // Arrange — user is already logged in
    localStorage.setItem('authToken', mockApiToken);
    sessionStorage.setItem('authToken', mockApiToken);
    mockApiFetch.mockResolvedValue(mockUser);
    renderWithAuth();
    await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Jane'));

    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
    });

    // Assert
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(sessionStorage.getItem('authToken')).toBeNull();
    expect(screen.getByTestId('user-name')).toHaveTextContent('logged-out');
  });
});

describe('AuthContext — fetchUser() error handling', () => {
  it('clears token and sets user to null on a 401 from /api/users/me', async () => {
    // Arrange — stale token in storage
    localStorage.setItem('authToken', 'expired-token');
    mockApiFetch.mockRejectedValue(new ApiError('Token expired', 401));

    // Act
    renderWithAuth();

    // Assert — error clears token and user stays null
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(screen.getByTestId('user-name')).toHaveTextContent('logged-out');
    });
  });
});

describe('useAuth — guard', () => {
  it('throws when useAuth is called outside <AuthProvider>', () => {
    // Suppress the expected React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Naked() {
      useAuth(); // should throw
      return null;
    }

    expect(() => render(<Naked />)).toThrow('useAuth must be used within an AuthProvider');
    spy.mockRestore();
  });
});
