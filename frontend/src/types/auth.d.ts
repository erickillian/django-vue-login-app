

interface AuthError {
    message: string;
    code: string;
    param: string;
}

interface AuthErrorResponse {
    errors: AuthError[];
    detail?: string;
    status?: number;
    data?: {
        flows?: AuthFlow[];
    }
    meta?: {
        is_authenticated?: boolean;
    };
}

interface AuthFlow {
    id: string;
    is_pending?: boolean;
}
