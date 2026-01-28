// Inital setup to mirror models.py


export interface BaseEntity {
    id: number;
    created_at: string;
}

export interface User extends BaseEntity {
    email: string;
    is_verified: boolean;
    gender?: string | null;
    age?: number | null;
    
    // initial setup for lease preferences
    gender_preference?: string | null;
    age_preference_min?: number | null;
    age_preference_max?: number | null;
    cleaning_habit?: string | null;
    smoking_habit?: string | null;
    pet_preference?: string | null;
    drinking_habit?: string | null;
    noise_tolerance?: string | null;
    profile_picture?: string | null;
    bio?: string | null;
}

export interface Listing extends BaseEntity {
    user_id: number;
    title: string;
    description: string;
    rent: number;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    bedrooms: number;
    bathrooms: number;
    roommate_count: number;
    available_from: string;
    available_to?: string | null;
    images?: string | null;
    deleted_at?: string | null;
    anonymous_lister: boolean;

    owner?: User;

}

export interface Message extends BaseEntity {
    sender_id: number;
    recipient_id: number;
    listing_id: number;
    content: string;
    read: boolean;
    sent_at: string;
}

export interface Verification extends BaseEntity {
    user_id: number;
    code: string;
    expires_at: string;
    verified: boolean;
}