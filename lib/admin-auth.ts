const SESSION_KEY = 'portfolio_admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface LocalAdminSession {
  email: string;
  createdAt: number;
}

export function getAdminEmail(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sharfanusrath@gmail.com').trim().toLowerCase();
}

export function getAdminPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Sharfa@Admin2026';
}

export function validateLocalAdminCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === getAdminEmail() &&
    password === getAdminPassword()
  );
}

export function setLocalAdminSession(email: string): void {
  if (typeof window === 'undefined') return;

  const session: LocalAdminSession = {
    email: email.trim().toLowerCase(),
    createdAt: Date.now(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('local-auth-change'));
}

export function getLocalAdminSession(): LocalAdminSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as LocalAdminSession;
    if (!session?.email || !session?.createdAt) return null;

    if (Date.now() - session.createdAt > SESSION_MAX_AGE_MS) {
      clearLocalAdminSession();
      return null;
    }

    return session;
  } catch {
    clearLocalAdminSession();
    return null;
  }
}

export function clearLocalAdminSession(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('local-auth-change'));
}

export function isNetworkAuthError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('failed to fetch') ||
    lower.includes('network') ||
    lower.includes('fetch failed') ||
    lower.includes('could not resolve')
  );
}
