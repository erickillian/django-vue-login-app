

interface AuthError {
    message: string;
    code: string;
    param: string;
}

interface AuthErrorResponse {
    errors: AuthError[];
    detail?: string;
    status?: number;
}