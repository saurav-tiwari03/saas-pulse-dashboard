import { User, Role } from "@prisma/client";

/**
 * User without sensitive fields (password)
 */
export type SafeUser = Omit<User, "password">;

/**
 * User creation input
 */
export interface CreateUserInput {
  email: string;
  name?: string;
  password: string;
  role?: Role;
}

/**
 * User update input
 */
export interface UpdateUserInput {
  email?: string;
  name?: string;
  isActive?: boolean;
  role?: Role;
}

/**
 * JWT token payload
 */
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Token with expiration
 */
export interface TokenWithExpiry {
  token: string;
  expirationDate: Date;
}

/**
 * OTP verification result
 */
export interface OTPVerificationResult {
  valid: boolean;
  reason?: "no_otp_found" | "invalid_otp" | "expired_otp";
}
