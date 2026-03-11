const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface FetchOptions extends RequestInit {
    
}
// represents e.g, post, (body, headers), get, (headers)

export class ApiError extends Error {
    public status?: number;
    public data?: any;

    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

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
        const errorData = await response.json().catch(() => ({}));
        
        let errorMessage = "An unexpected API error occurred";
        if (errorData.detail) {
            errorMessage = typeof errorData.detail === 'string' 
                ? errorData.detail 
                : JSON.stringify(errorData.detail);
        } else if (errorData.message) {
            errorMessage = errorData.message;
        }

        throw new ApiError(errorMessage, response.status, errorData);
    }

    // 204 No Content (e.g. DELETE) — no body to parse
    if (response.status === 204) {
        return null;
    }

    return response.json();
}