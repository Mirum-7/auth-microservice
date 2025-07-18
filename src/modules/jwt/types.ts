/**
 * JWT payload interface for access tokens
 */
export interface JwtPayload {
  /** User ID */
  userId: string;
  /** Username */
  username: string;
  /** Email */
  email: string;
  /** Token type */
  type: 'access' | 'refresh';
}

/**
 * JWT token pair response
 */
export interface JwtTokens {
  /** Access token (15 minutes) */
  accessToken: string;
  /** Refresh token (30 days) */
  refreshToken: string;
}

/**
 * JWT configuration options
 */
export interface JwtConfig {
  /** Secret key for signing tokens */
  secret: string;
  /** Access token expiration time */
  accessTokenExpiresIn: string;
  /** Refresh token expiration time */
  refreshTokenExpiresIn: string;
}

/**
 * Decoded JWT payload with standard fields
 */
export interface DecodedJwtPayload extends JwtPayload {
  /** Issued at timestamp */
  iat: number;
  /** Expiration timestamp */
  exp: number;
  /** Subject (user ID) */
  sub: string;
}