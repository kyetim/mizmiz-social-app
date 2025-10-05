export interface RegisterDto {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
}

export interface LoginDto {
    email: string
    password: string
}

export interface JwtPayload {
    userId: string
    iat?: number
    exp?: number
}

