import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService, UserProfile } from '../services/authService';
import { Microsoft365Service } from '../services/teamsService';
import { SessionStorageService } from '../services/sessionStorageService';
import { useSessionActivity } from '../hooks/useSessionActivity';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  sessionInfo: ReturnType<typeof SessionStorageService.getSessionInfo>;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState(() => SessionStorageService.getSessionInfo());

  const authService = AuthService.getInstance();
  const microsoft365Service = Microsoft365Service.getInstance();

  // Use session activity hook to monitor user activity
  const { extendSession: extendSessionHook } = useSessionActivity({
    enabled: user !== null,
    extendThreshold: 30, // Extend session when 30 minutes remain
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize services
        await authService.initialize();
        await microsoft365Service.initialize();

        // Check if user is already authenticated
        if (authService.isAuthenticated()) {
          const userProfile = authService.getCurrentUser();
          setUser(userProfile);
          setSessionInfo(SessionStorageService.getSessionInfo());
        } else {
          // Try to get user profile if already logged in
          try {
            const userProfile = await authService.getUserProfile();
            setUser(userProfile);
            setSessionInfo(SessionStorageService.getSessionInfo());
          } catch (error) {
            // User not logged in, this is expected
            console.log('User not authenticated');
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userProfile = await authService.login();
      setUser(userProfile);
      setSessionInfo(SessionStorageService.getSessionInfo());

      // Show success notification in Microsoft 365
      if (microsoft365Service.isInitialized()) {
        await microsoft365Service.showNotification('Successfully logged in!', 'success');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
      
      // Show error notification in Microsoft 365
      if (microsoft365Service.isInitialized()) {
        await microsoft365Service.showNotification('Login failed. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.logout();
      setUser(null);
      setSessionInfo(SessionStorageService.getSessionInfo());

      // Show success notification in Microsoft 365
      if (microsoft365Service.isInitialized()) {
        await microsoft365Service.showNotification('Successfully logged out!', 'success');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const extendSession = () => {
    extendSessionHook();
    setSessionInfo(SessionStorageService.getSessionInfo());
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    logout,
    error,
    sessionInfo,
    extendSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
