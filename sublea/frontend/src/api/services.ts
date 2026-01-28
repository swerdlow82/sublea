import apiClient from "./client";
import type {Listing, User} from "../types";



// to test connection to backend endpoint
export const HealthService = {
    check: () => apiClient.get<{ status: string; message: string }>("/"),
};



// temporary placeholder for future auth endpoints
export const AuthService = {
    login: (credentials: {email: string; password: string }) =>
        apiClient.post('/auth/login', credentials),
    register: (userData: {email: string; password: string }) =>
        apiClient.post('/auth/register', userData),
};

export const ListingService = {
    getAll: () => apiClient.get<Listing[]>("/listings"),
    getOne: (id: number) => apiClient.get<Listing>(`/listings/${id}`),
    create: (listing: Partial<Listing>) => apiClient.post("/listings", listing),
};

