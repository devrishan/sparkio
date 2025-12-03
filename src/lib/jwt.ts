import jwt from 'jsonwebtoken';

// Support both new format (JWT_ACCESS_TOKEN_SECRET) and legacy format (JWT_SECRET)
const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback-secret-change-in-production';

if (!process.env.JWT_ACCESS_TOKEN_SECRET && !process.env.JWT_SECRET) {
  // In production, you should fail fast during startup if these are missing.
  console.warn('JWT secrets are not set. Using fallback secret. This is insecure for production!');
}

export interface JwtAccessPayload {
  sub: string; // user id
  role: string;
  type: 'access';
}

export interface JwtRefreshPayload {
  sub: string; // user id
  sid: string; // session id
  type: 'refresh';
}

export function signAccessToken(payload: Omit<JwtAccessPayload, 'type'>): string {
  const ttlSeconds = Number(process.env.JWT_ACCESS_TOKEN_TTL_SECONDS ?? 900);
  return jwt.sign({ ...payload, type: 'access' as const }, ACCESS_SECRET, {
    expiresIn: ttlSeconds,
  });
}

export function signRefreshToken(payload: Omit<JwtRefreshPayload, 'type'>): string {
  const ttlSeconds = Number(process.env.JWT_REFRESH_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 30);
  return jwt.sign({ ...payload, type: 'refresh' as const }, REFRESH_SECRET, {
    expiresIn: ttlSeconds,
  });
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  // Handle mock tokens when in mock mode
  if (process.env.USE_MOCK_DATA === 'true' && token.startsWith('mock_jwt_')) {
    // Token format: mock_jwt_${userId}_${timestamp}
    // Remove 'mock_jwt_' prefix
    const withoutPrefix = token.replace('mock_jwt_', '');
    // Split by last underscore to separate userId and timestamp
    const lastUnderscoreIndex = withoutPrefix.lastIndexOf('_');
    const userId = lastUnderscoreIndex > 0 
      ? withoutPrefix.substring(0, lastUnderscoreIndex)
      : withoutPrefix.split('_')[0]; // Fallback if no timestamp
    
    // Return a mock payload
    return {
      sub: userId,
      role: 'USER',
      type: 'access',
    };
  }
  
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtAccessPayload;
  } catch (error) {
    // If verification fails but we're in mock mode, still allow mock tokens
    if (process.env.USE_MOCK_DATA === 'true') {
      // Try to extract userId from token format
      if (token.includes('_')) {
        const parts = token.split('_');
        // Try to find a reasonable userId (skip common prefixes)
        const userId = parts.find(p => p.startsWith('user')) || parts[0] || 'user_demo';
        return {
          sub: userId,
          role: 'USER',
          type: 'access',
        };
      }
    }
    throw error;
  }
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtRefreshPayload;
}


