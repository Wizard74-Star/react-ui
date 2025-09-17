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

export interface LoginCredentials {
  email: string;
  password: string;
}

// Mock user database for demo purposes
const DEMO_USERS: UserProfile[] = [
  {
    id: '1',
    displayName: 'John Smith',
    mail: 'john.smith@company.com',
    userPrincipalName: 'john.smith@company.com',
    jobTitle: 'Senior Manager',
    officeLocation: 'Sydney Office',
    department: 'Business Management',
  },
  {
    id: '2',
    displayName: 'Sarah Johnson',
    mail: 'sarah.johnson@company.com',
    userPrincipalName: 'sarah.johnson@company.com',
    jobTitle: 'Project Coordinator',
    officeLocation: 'Melbourne Office',
    department: 'Operations',
  },
  {
    id: '3',
    displayName: 'Michael Brown',
    mail: 'michael.brown@company.com',
    userPrincipalName: 'michael.brown@company.com',
    jobTitle: 'Document Controller',
    officeLocation: 'Brisbane Office',
    department: 'Quality Assurance',
  },
];

export class SimpleAuthService {
  private static instance: SimpleAuthService;
  private currentUser: UserProfile | null = null;

  private constructor() {}

  public static getInstance(): SimpleAuthService {
    if (!SimpleAuthService.instance) {
      SimpleAuthService.instance = new SimpleAuthService();
    }
    return SimpleAuthService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Check for existing session in session storage
      if (SessionStorageService.hasValidSession()) {
        const savedUser = SessionStorageService.getUserProfile();
        if (savedUser) {
          this.currentUser = savedUser;
          console.log('Restored user session from session storage');
          return;
        }
      }
    } catch (error) {
      console.error('Failed to initialize simple auth service:', error);
      // Clear any corrupted session data
      SessionStorageService.clearAuthSession();
    }
  }

  public async login(credentials?: LoginCredentials): Promise<UserProfile> {
    try {
      let user: UserProfile;

      if (credentials) {
        // Validate credentials
        user = await this.validateCredentials(credentials);
      } else {
        // Demo login - use first user
        user = DEMO_USERS[0];
      }

      this.currentUser = user;

      // Save session to session storage (expires in 8 hours)
      const expiresAt = Date.now() + (8 * 60 * 60 * 1000);
      this.saveUserSession(user, 'demo-token', expiresAt);

      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  public async demoLogin(): Promise<UserProfile> {
    // Quick demo login without credentials
    return this.login();
  }

  private async validateCredentials(credentials: LoginCredentials): Promise<UserProfile> {
    // Simple validation - in real app, this would call an API
    const { email, password } = credentials;
    
    // Demo validation - accept any email from our demo users with password "password"
    const user = DEMO_USERS.find(u => u.mail.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('User not found');
    }

    if (password !== 'password' && password !== 'demo') {
      throw new Error('Invalid password');
    }

    return user;
  }

  public async logout(): Promise<void> {
    try {
      // Clear session storage
      SessionStorageService.clearAuthSession();
      this.currentUser = null;
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user even if logout fails
      SessionStorageService.clearAuthSession();
      this.currentUser = null;
      throw error;
    }
  }

  public async getUserProfile(): Promise<UserProfile> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }
    return this.currentUser;
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null && SessionStorageService.hasValidSession();
  }

  public async getAccessToken(): Promise<string> {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    
    // Return demo token
    return SessionStorageService.getAccessToken() || 'demo-access-token';
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

  /**
   * Get available demo users for login form
   */
  public getDemoUsers(): UserProfile[] {
    return DEMO_USERS;
  }
}
