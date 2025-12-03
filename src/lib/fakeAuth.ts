/**
 * Frontend-only fake authentication helper
 * Uses localStorage for development purposes only
 */

const STORAGE_KEY = "earniq_isLoggedIn";

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

/**
 * Login user (set logged in state)
 */
export function login(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, "true");
}

/**
 * Logout user (clear logged in state)
 */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get user role (determined by URL or default to member)
 */
export function getUserRole(): "member" | "admin" {
  if (typeof window === "undefined") return "member";
  const pathname = window.location.pathname;
  return pathname.startsWith("/admin") ? "admin" : "member";
}

