// API configuration and utility functions

/**
 * Get the API base URL dynamically based on current host
 * This ensures both localhost and network IP access work correctly
 */
function getApiBaseUrl(): string {
  // If running on server-side (SSR), use environment variable
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8001";
  }

  // On client-side, detect current host and construct API URL
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  // If accessing via localhost, use localhost for API
  if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    return "http://localhost:8001";
  }
  
  // If accessing via network IP, use the same IP for API
  // This handles cases like http://192.168.1.4:3782
  return `http://${currentHost}:8001`;
}

// Get API base URL - dynamic detection for client-side, env var for server-side
export const API_BASE_URL = getApiBaseUrl();

/**
 * Construct a full API URL from a path
 * @param path - API path (e.g., '/api/v1/knowledge/list')
 * @returns Full URL (e.g., 'http://localhost:8001/api/v1/knowledge/list')
 */
export function apiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Remove trailing slash from base URL if present
  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${base}${normalizedPath}`;
}

/**
 * Construct a WebSocket URL from a path
 * @param path - WebSocket path (e.g., '/api/v1/solve')
 * @returns WebSocket URL (e.g., 'ws://localhost:8001/api/v1/ws')
 */
export function wsUrl(path: string): string {
  // Security Hardening: Convert http to ws and https to wss.
  // In production environments (where API_BASE_URL starts with https), this ensures secure websockets.
  const base = API_BASE_URL.replace(/^http:/, "ws:").replace(/^https:/, "wss:");

  // Remove leading slash if present to avoid double slashes
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Remove trailing slash from base URL if present
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;

  return `${normalizedBase}${normalizedPath}`;
}
