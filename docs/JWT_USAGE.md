# JWT Service Usage Guide

## Overview

The JWT service provides token generation, validation, and cookie management for authentication in the auth microservice.

## Features

- **Access tokens**: 15-minute lifetime for API access
- **Refresh tokens**: 30-day lifetime for token renewal
- **httpOnly cookies**: Secure token storage with proper flags
- **Automatic refresh**: Guard automatically refreshes expired access tokens
- **Type safety**: Full TypeScript support with proper interfaces

## Environment Variables

```env
JWT_SECRET=your_secret_here
COOKIE_SECRET=your_cookie_secret_here
DOMAIN=.mirum7.dev
NODE_ENV=production
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user and set JWT cookies
- `POST /auth/login` - Login user and set JWT cookies
- `POST /auth/refresh` - Refresh access token using refresh token
- `POST /auth/logout` - Clear JWT cookies

### Example Usage

```typescript
// Protect a route with JWT authentication
@Controller('api')
@UseGuards(AuthGuard)
export class ApiController {
  @Get('public')
  getPublicData() {
    return { message: 'Public data' };
  }

  @Get('private')
  @Private() // Requires JWT authentication
  getPrivateData(@Req() request: Request) {
    return {
      userId: request.user?.userId,
      role: request.user?.role,
      data: 'Private data'
    };
  }
}
```

## Cookie Configuration

Cookies are set with the following security flags:
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` - HTTPS only (in production)
- `sameSite: 'strict'` - CSRF protection
- `domain` - Configured via environment variable

## Token Payload

### Access Token
```typescript
{
  userId: string;
  role?: string;
  type: 'access';
  iat: number;
  exp: number;
  sub: string;
}
```

### Refresh Token
```typescript
{
  userId: string;
  type: 'refresh';
  iat: number;
  exp: number;
  sub: string;
}
```

## Error Handling

The JWT guard automatically handles:
- Missing tokens
- Expired access tokens (auto-refresh)
- Invalid tokens
- Wrong token types

All JWT-related errors throw `UnauthorizedException` with descriptive messages.