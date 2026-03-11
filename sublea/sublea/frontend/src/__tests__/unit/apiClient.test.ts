/**
 * Unit Tests — src/api/client.ts

 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, ApiError } from '../../api/client';

// ── helpers 

function makeResponse(
  body: unknown,
  status = 200,
  ok = true
): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

// setup 

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

//  tests 

describe('apiFetch', () => {
  // Arrange: token in localStorage → Act: call endpoint → Assert: Authorization header is sent
  it('injects Bearer token from localStorage when present', async () => {
    // Arrange
    localStorage.setItem('authToken', 'local-token-xyz');
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(makeResponse({ ok: true }));

    // Act
    await apiFetch('/api/test');

    // Assert
    const [, options] = mockFetch.mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer local-token-xyz');
  });

  it('injects Bearer token from sessionStorage when localStorage is empty', async () => {
    // Arrange
    sessionStorage.setItem('authToken', 'session-token-xyz');
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(makeResponse({ data: 'ok' }));

    // Act
    await apiFetch('/api/test');

    // Assert
    const [, options] = mockFetch.mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer session-token-xyz');
  });

  it('sends no Authorization header when user is logged out', async () => {
    // Arrange — no token anywhere
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(makeResponse({ data: 'ok' }));

    // Act
    await apiFetch('/api/public');

    // Assert
    const [, options] = mockFetch.mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('always sets Content-Type to application/json', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(makeResponse({}));

    // Act
    await apiFetch('/api/test');

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('forwards custom method and headers from the call-site', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(makeResponse({}));

    // Act
    await apiFetch('/api/resource', {
      method: 'POST',
      headers: { 'X-Custom': 'yes' },
      body: JSON.stringify({ foo: 'bar' }),
    });

    // Assert
    const [, options] = vi.mocked(fetch).mock.calls[0];
    expect(options?.method).toBe('POST');
    const headers = options?.headers as Record<string, string>;
    expect(headers['X-Custom']).toBe('yes');
  });

  it('returns null for a 204 No Content response', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(makeResponse(null, 204, true));

    // Act
    const result = await apiFetch('/api/resource');

    // Assert
    expect(result).toBeNull();
  });

  it('returns parsed JSON on a successful 200 response', async () => {
    // Arrange
    const payload = { id: 1, title: 'Cool Listing' };
    vi.mocked(fetch).mockResolvedValue(makeResponse(payload));

    // Act
    const result = await apiFetch('/api/listings/1');

    // Assert
    expect(result).toEqual(payload);
  });
});

// api error

describe('ApiError — thrown on non-OK responses', () => {
  it('throws ApiError with the correct status code on a 400', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ detail: 'Bad request data' }, 400, false)
    );

    // Act & Assert
    await expect(apiFetch('/api/bad')).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Bad request data',
    });
  });

  it('throws ApiError with status 401 when the token is expired', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ detail: 'Token expired' }, 401, false)
    );

    // Act & Assert
    const err = await apiFetch('/api/protected').catch(e => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(401);
  });

  it('throws ApiError with status 500 on internal server error', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ detail: 'Internal Server Error' }, 500, false)
    );

    // Act & Assert
    await expect(apiFetch('/api/crash')).rejects.toMatchObject({ status: 500 });
  });

  it('falls back to a generic message when backend returns no detail or message', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({}, 503, false)
    );

    // Act & Assert
    await expect(apiFetch('/api/down')).rejects.toMatchObject({
      message: 'An unexpected API error occurred',
    });
  });

  it('parses a string-typed detail field correctly', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ detail: 'Email already registered' }, 409, false)
    );

    // Act & Assert
    const err = await apiFetch('/api/register').catch(e => e);
    expect(err.message).toBe('Email already registered');
  });

  it('ApiError carries the raw data payload on .data', async () => {
    // Arrange
    const raw = { detail: 'Not found', hint: 'check the id' };
    vi.mocked(fetch).mockResolvedValue(makeResponse(raw, 404, false));

    // Act & Assert
    const err = await apiFetch('/api/listings/999').catch(e => e);
    expect(err.data).toEqual(raw);
  });
});

// ApiError class

describe('ApiError class', () => {
  it('is an instance of Error', () => {
    const err = new ApiError('oops', 400, { detail: 'oops' });
    expect(err).toBeInstanceOf(Error);
  });

  it('sets name to "ApiError"', () => {
    const err = new ApiError('msg');
    expect(err.name).toBe('ApiError');
  });

  it('accepts undefined status and data gracefully', () => {
    const err = new ApiError('bare error');
    expect(err.status).toBeUndefined();
    expect(err.data).toBeUndefined();
  });
});
