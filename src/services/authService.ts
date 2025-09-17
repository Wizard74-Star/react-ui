import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, sharePointScopes } from '../config/authConfig';
import { Microsoft365Service } from './teamsService';
import { SessionStorageService, AuthSession } from './sessionStorageService';

export interface UserProfile {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle?: string;
  officeLocation?: string;
  department?: string;
}

export class AuthService {
  private static instance: AuthService;
  private msalInstance: PublicClientApplication;
  private microsoft365Service: Microsoft365Service;
  private currentUser: UserProfile | null = null;

  private constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
    this.microsoft365Service = Microsoft365Service.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await this.msalInstance.initialize();
      
      // Initialize Microsoft 365 service
      await this.microsoft365Service.initialize();
      
      // Check for existing session in session storage first
      if (SessionStorageService.hasValidSession()) {
        const savedUser = SessionStorageService.getUserProfile();
        if (savedUser) {
          this.currentUser = savedUser;
          console.log('Restored user session from session storage');
          return;
        }
      }
      
      // Check if user is already logged in via MSAL
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        this.currentUser = await this.getUserProfile();
        
        // Save to session storage for future use
        if (this.currentUser) {
          this.saveUserSession(this.currentUser);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      // Clear any corrupted session data
      SessionStorageService.clearAuthSession();
      throw error;
    }
  }

  public async login(): Promise<UserProfile> {
    try {
      // Check if running in Microsoft 365 environment
      if (this.microsoft365Service.isInitialized()) {
        return await this.loginInMicrosoft365();
      } else {
        return await this.loginInBrowser();
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  private async loginInMicrosoft365(): Promise<UserProfile> {
    try {
      // Use MSAL for authentication in Microsoft 365 environment
      const accounts = this.msalInstance.getAllAccounts();
      let response;
      
      if (accounts.length > 0) {
        // Try silent authentication first
        response = await this.msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
      } else {
        // Use popup authentication
        response = await this.msalInstance.loginPopup(loginRequest);
      }
      
      // Get user profile from Microsoft Graph
      const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${response.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user profile');
      }

      const userData = await userResponse.json();
      this.currentUser = {
        id: userData.id,
        displayName: userData.displayName,
        mail: userData.mail,
        userPrincipalName: userData.userPrincipalName,
        jobTitle: userData.jobTitle,
        officeLocation: userData.officeLocation,
        department: userData.department,
      };

      // Update Microsoft 365 service context
      this.microsoft365Service.updateContext({
        id: userData.id,
        tenantId: userData.tenantId || 'unknown',
        userPrincipalName: userData.userPrincipalName,
      });

      // Save session to session storage
      this.saveUserSession(this.currentUser, response.accessToken, response.expiresOn?.getTime());

      return this.currentUser;
    } catch (error) {
      console.error('Microsoft 365 login failed:', error);
      throw error;
    }
  }

  private async loginInBrowser(): Promise<UserProfile> {
    try {
      const response = await this.msalInstance.loginPopup(loginRequest);
      this.currentUser = await this.getUserProfile();
      
      // Save session to session storage
      if (this.currentUser) {
        this.saveUserSession(this.currentUser, response.accessToken, response.expiresOn?.getTime());
      }
      
      return this.currentUser;
    } catch (error) {
      console.error('Browser login failed:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      // Clear session storage first
      SessionStorageService.clearAuthSession();
      
      if (this.microsoft365Service.isInitialized()) {
        // In Microsoft 365 environment, we can't directly logout, just clear local state
        this.currentUser = null;
        return;
      }

      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await this.msalInstance.logoutPopup({
          account: accounts[0],
          postLogoutRedirectUri: window.location.origin,
        });
      }
      this.currentUser = null;
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear session storage even if logout fails
      SessionStorageService.clearAuthSession();
      this.currentUser = null;
      throw error;
    }
  }

  public async getUserProfile(): Promise<UserProfile> {
    try {
      let token: string;

      if (this.microsoft365Service.isInitialized()) {
        // Use MSAL for token acquisition in Microsoft 365 environment
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          throw new Error('No user logged in');
        }
        const response = await this.msalInstance.acquireTokenSilent({
          scopes: sharePointScopes,
          account: accounts[0],
        });
        token = response.accessToken;
      } else {
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          throw new Error('No user logged in');
        }

        const response = await this.msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        token = response.accessToken;
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }

      const userData = await response.json();
      return {
        id: userData.id,
        displayName: userData.displayName,
        mail: userData.mail,
        userPrincipalName: userData.userPrincipalName,
        jobTitle: userData.jobTitle,
        officeLocation: userData.officeLocation,
        department: userData.department,
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  public async getAccessToken(scopes: string[] = sharePointScopes): Promise<string> {
    try {
      // Try to get token from session storage first
      const savedToken = SessionStorageService.getAccessToken();
      if (savedToken) {
        const session = SessionStorageService.getAuthSession();
        // Check if token is still valid (not expired)
        if (session && session.expiresAt && session.expiresAt > Date.now()) {
          return savedToken;
        }
      }

      // If no valid token in storage, get new one from MSAL
      let response;
      if (this.microsoft365Service.isInitialized()) {
        // Use MSAL for authentication instead of Teams SDK
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          throw new Error('No user logged in');
        }
        response = await this.msalInstance.acquireTokenSilent({
          scopes: scopes,
          account: accounts[0],
        });
      } else {
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          throw new Error('No user logged in');
        }

        response = await this.msalInstance.acquireTokenSilent({
          scopes: sharePointScopes,
          account: accounts[0],
        });
      }

      // Update session storage with new token
      if (response.accessToken) {
        SessionStorageService.updateAccessToken(
          response.accessToken, 
          response.expiresOn?.getTime()
        );
      }

      return response.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw error;
    }
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public async checkPermissions(): Promise<boolean> {
    try {
      // Check if user has necessary permissions for SharePoint access
      const token = await this.getAccessToken();
      const response = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  /**
   * Save user session to session storage
   */
  private saveUserSession(user: UserProfile, accessToken?: string, expiresAt?: number): void {
    try {
      const session: AuthSession = {
        user,
        accessToken,
        expiresAt,
        loginTime: Date.now(),
      };
      
      SessionStorageService.saveAuthSession(session);
    } catch (error) {
      console.error('Failed to save user session:', error);
    }
  }

  /**
   * Get session information for debugging
   */
  public getSessionInfo() {
    return SessionStorageService.getSessionInfo();
  }

  /**
   * Extend current session timeout
   */
  public extendSession(): void {
    SessionStorageService.extendSession();
  }
}
