
interface User {
    color_mode: string;
    date_joined: string;
    display_name: string;
    email: string;
    full_name: string;
    slug: string;
}

interface UserErrors {
    color_mode?: string[];
    full_name?: string[];
}