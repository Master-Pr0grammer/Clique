interface User {
    uid: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    rcs_id: string;
    is_admin: boolean;
    profile_image?: string; // Optional property for image URL or base64
    graduation_year: number;
    major: string;
}