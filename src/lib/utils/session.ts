/**
 * Retrieves or initializes an anonymous persistent session ID for the browser.
 * Ensures alerts and preferences persist without requiring account registration.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';

  const STORAGE_KEY = 'campus_space_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}
