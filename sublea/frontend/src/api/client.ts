const BACKEND_URL = "http://127.0.0.1:8000"

interface FetchOptions extends RequestInit {
    
}
// represents e.g, post, (body, headers), get, (headers)

export const apiFetch = async (
    endpoint: string,
    options: FetchOptions = {}
) => {

    const url = `${BACKEND_URL}${endpoint}`

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    // standard headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}) // if component passed headers, keep
    };

    // if user logged in add auth token
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // actual fetch call
    const response = await fetch(url, {
        ...options,
        headers,
    });

    // handle HTTP errors
    if (!response.ok) {
        const errorData = await response.json().catch( () => ({}));
        throw new Error(errorData.detail || "An unexpected API error occurred");

    }

    return response.json();
} 