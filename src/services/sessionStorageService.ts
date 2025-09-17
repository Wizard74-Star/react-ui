import { UserProfile } from './simpleAuthService';

export interface AuthSession {
  user: UserProfile;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  loginTime: number;
}

export class SessionStorageService {
  private static readonly SESSION_KEY = 'bms_auth_session';
  private static readonly TOKEN_KEY = 'bms_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'bms_refresh_token';
  private static readonly USER_KEY = 'bms_user_profile';
  private static readonly SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  /**
   * Save authentication session to session storage
   */
  public static saveAuthSession(session: AuthSession): void {
    try {
      const sessionData = {
        ...session,
        loginTime: Date.now(),
      };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      
      // Also save individual components for easy access
      if (session.user) {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(session.user));
      }
      if (session.accessToken) {
        sessionStorage.setItem(this.TOKEN_KEY, session.accessToken);
      }
      if (session.refreshToken) {
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, session.refreshToken);
      }

      console.log('Auth session saved to session storage');
    } catch (error) {
      console.error('Failed to save auth session:', error);
    }
  }

  /**
   * Get authentication session from session storage
   */
  public static getAuthSession(): AuthSession | null {
    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionData) {
        return null;
      }

      const session: AuthSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (this.isSessionExpired(session)) {
        console.log('Session expired, clearing storage');
        this.clearAuthSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to get auth session:', error);
      this.clearAuthSession(); // Clear corrupted data
      return null;
    }
  }

  /**
   * Get user profile from session storage
   */
  public static getUserProfile(): UserProfile | null {
    try {
      const userData = sessionStorage.getItem(this.USER_KEY);
      if (!userData) {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Get access token from session storage
   */
  public static getAccessToken(): string | null {
    try {
      return sessionStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token from session storage
   */
  public static getRefreshToken(): string | null {
    try {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Update access token in session storage
   */
  public static updateAccessToken(token: string, expiresAt?: number): void {
    try {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      
      // Update the main session data
      const session = this.getAuthSession();
      if (session) {
        session.accessToken = token;
        if (expiresAt) {
          session.expiresAt = expiresAt;
        }
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      }
    } catch (error) {
      console.error('Failed to update access token:', error);
    }
  }

  /**
   * Check if user has a valid session
   */
  public static hasValidSession(): boolean {
    const session = this.getAuthSession();
    return session !== null && !this.isSessionExpired(session);
  }

  /**
   * Check if session is expired
   */
  private static isSessionExpired(session: AuthSession): boolean {
    const now = Date.now();
    
    // Check token expiration if available
    if (session.expiresAt && session.expiresAt < now) {
      return true;
    }
    
    // Check session timeout (8 hours)
    if (session.loginTime && (now - session.loginTime) > this.SESSION_TIMEOUT) {
      return true;
    }
    
    return false;
  }

  /**
   * Clear all authentication data from session storage
   */
  public static clearAuthSession(): void {
    try {
      sessionStorage.removeItem(this.SESSION_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
      console.log('Auth session cleared from session storage');
    } catch (error) {
      console.error('Failed to clear auth session:', error);
    }
  }

  /**
   * Get session info for debugging
   */
  public static getSessionInfo(): {
    hasSession: boolean;
    isExpired: boolean;
    loginTime?: Date;
    timeRemaining?: number;
    user?: UserProfile;
  } {
    const session = this.getAuthSession();
    
    if (!session) {
      return { hasSession: false, isExpired: false };
    }

    const now = Date.now();
    const timeRemaining = session.loginTime ? 
      Math.max(0, this.SESSION_TIMEOUT - (now - session.loginTime)) : 0;

    return {
      hasSession: true,
      isExpired: this.isSessionExpired(session),
      loginTime: session.loginTime ? new Date(session.loginTime) : undefined,
      timeRemaining,
      user: session.user,
    };
  }

  /**
   * Extend session timeout (reset login time)
   */
  public static extendSession(): void {
    const session = this.getAuthSession();
    if (session) {
      session.loginTime = Date.now();
      this.saveAuthSession(session);
      console.log('Session extended');
    }
  }
}
