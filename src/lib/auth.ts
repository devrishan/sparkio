/**
 * Frontend Mock Authentication Utilities
 * Provides login, logout, session management, and auto-login functionality
 * Uses localStorage and /api/mocks/* endpoints
 */

const STORAGE_KEYS = {
  TOKEN: 'mockToken',
  USER: 'mockUser',
  EXPIRES_AT: 'mockExpiresAt',
} as const;

export interface MockSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    wallet: number;
    referral_code?: string;
  };
  token: string;
  expiresAt: number;
}

/**
 * Check if we're in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get mock token from localStorage
 */
export function getMockToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

/**
 * Set mock token in localStorage
 */
function setMockToken(token: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('[Auth] Failed to set token:', error);
  }
}

/**
 * Get user from localStorage
 */
export function getMockUser(): MockSession['user'] | null {
  if (!isBrowser()) return null;
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Set user in localStorage
 */
function setMockUser(user: MockSession['user']): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('[Auth] Failed to set user:', error);
  }
}

/**
 * Get expiresAt from localStorage
 */
function getMockExpiresAt(): number | null {
  if (!isBrowser()) return null;
  try {
    const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    if (!expiresAtStr) return null;
    return parseInt(expiresAtStr, 10);
  } catch {
    return null;
  }
}

/**
 * Set expiresAt in localStorage
 */
function setMockExpiresAt(expiresAt: number): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
  } catch (error) {
    console.error('[Auth] Failed to set expiresAt:', error);
  }
}

/**
 * Clear all mock auth data from localStorage
 */
function clearMockAuth(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  } catch (error) {
    console.error('[Auth] Failed to clear auth data:', error);
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(expiresAt: number | null): boolean {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt;
}

/**
 * Login with email and password
 * Calls /api/mocks/login and stores session data
 */
export async function login(email: string, password: string): Promise<{ success: boolean; session?: MockSession; error?: string }> {
  try {
    const response = await fetch('/api/mocks/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Login failed' }));
      return { success: false, error: data.error || 'Login failed' };
    }

    const data = await response.json();
    const session: MockSession = {
      user: data.user,
      token: data.token,
      expiresAt: data.expiresAt,
    };

    // Store in localStorage
    setMockToken(session.token);
    setMockUser(session.user);
    setMockExpiresAt(session.expiresAt);

    return { success: true, session };
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error during login' 
    };
  }
}

/**
 * Register new user
 * Calls /api/mocks/register and stores session data
 */
export async function register(email: string, password: string, username?: string, referralCode?: string): Promise<{ 
  success: boolean; 
  session?: MockSession; 
  error?: string 
}> {
  try {
    const response = await fetch('/api/mocks/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        email, 
        password, 
        username: username || email.split('@')[0],
        referral_code: referralCode,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Registration failed' }));
      return { success: false, error: data.error || 'Registration failed' };
    }

    const data = await response.json();
    const session: MockSession = {
      user: data.user,
      token: data.token,
      expiresAt: data.expiresAt,
    };

    // Store in localStorage
    setMockToken(session.token);
    setMockUser(session.user);
    setMockExpiresAt(session.expiresAt);

    return { success: true, session };
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error during registration' 
    };
  }
}

/**
 * Get current session
 * First checks localStorage, then fetches from /api/mocks/session if needed
 */
export async function getSession(): Promise<MockSession | null> {
  // First try localStorage
  const token = getMockToken();
  const user = getMockUser();
  const expiresAt = getMockExpiresAt();

  if (token && user && expiresAt && !isTokenExpired(expiresAt)) {
    return { user, token, expiresAt };
  }

  // If no valid session in localStorage, try to fetch from API
  if (token) {
    try {
      const response = await fetch('/api/mocks/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'x-mock-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const session: MockSession = {
          user: data.user,
          token: data.token,
          expiresAt: data.expiresAt,
        };

        // Update localStorage
        setMockToken(session.token);
        setMockUser(session.user);
        setMockExpiresAt(session.expiresAt);

        return session;
      }
    } catch (error) {
      console.error('[Auth] Failed to fetch session:', error);
    }
  }

  // No valid session found
  clearMockAuth();
  return null;
}

/**
 * Logout - clear localStorage and redirect to login
 */
export function logout(redirectTo: string = '/login'): void {
  clearMockAuth();
  
  // Clear cookies by calling logout endpoint (if exists) or just redirect
  if (isBrowser()) {
    // Clear cookie by setting empty value with past expiry
    document.cookie = 'mockToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirect
    window.location.href = redirectTo;
  }
}

/**
 * Auto-login - check for existing session and restore it
 * Returns session if valid, null otherwise
 */
export async function autoLogin(): Promise<MockSession | null> {
  if (!isBrowser()) return null;

  const token = getMockToken();
  
  if (!token) {
    return null;
  }

  // Check if expired
  const expiresAt = getMockExpiresAt();
  if (expiresAt && isTokenExpired(expiresAt)) {
    clearMockAuth();
    return null;
  }

  // Try to get session
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    console.error('[Auth] Auto-login error:', error);
    clearMockAuth();
    return null;
  }
}

/**
 * Check if user is authenticated (has valid token and not expired)
 */
export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  
  const token = getMockToken();
  const expiresAt = getMockExpiresAt();
  
  if (!token || !expiresAt) {
    return false;
  }
  
  return !isTokenExpired(expiresAt);
}
