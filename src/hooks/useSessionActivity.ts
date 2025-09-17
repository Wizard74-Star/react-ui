import { useEffect, useRef } from 'react';
import { SimpleAuthService } from '../services/simpleAuthService';
import { SessionStorageService } from '../services/sessionStorageService';

interface UseSessionActivityOptions {
  enabled?: boolean;
  extendThreshold?: number; // Time in minutes before extending session
  activityEvents?: string[];
}

/**
 * Hook to monitor user activity and automatically extend session
 */
export const useSessionActivity = (options: UseSessionActivityOptions = {}) => {
  const {
    enabled = true,
    extendThreshold = 30, // Extend session 30 minutes before expiry
    activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  } = options;

  const lastActivityRef = useRef<number>(Date.now());
  const extendTimerRef = useRef<NodeJS.Timeout | null>(null);
  const authService = SimpleAuthService.getInstance();

  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      
      // Check if we need to extend the session
      const sessionInfo = SessionStorageService.getSessionInfo();
      if (sessionInfo.hasSession && !sessionInfo.isExpired && sessionInfo.timeRemaining) {
        const minutesRemaining = sessionInfo.timeRemaining / (1000 * 60);
        
        // If less than threshold minutes remaining, extend the session
        if (minutesRemaining < extendThreshold) {
          console.log(`Extending session (${minutesRemaining.toFixed(1)} minutes remaining)`);
          authService.extendSession();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to tab, check session status
        const sessionInfo = SessionStorageService.getSessionInfo();
        if (sessionInfo.isExpired) {
          console.log('Session expired while tab was inactive');
          // Could trigger a re-authentication flow here
        }
      }
    };

    // Add activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Monitor visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up periodic session check
    const checkSession = () => {
      const sessionInfo = SessionStorageService.getSessionInfo();
      if (sessionInfo.hasSession && sessionInfo.isExpired) {
        console.log('Session expired, clearing data');
        SessionStorageService.clearAuthSession();
        // Could trigger logout here
      }
    };

    // Check session every 5 minutes
    const sessionCheckInterval = setInterval(checkSession, 5 * 60 * 1000);

    return () => {
      // Cleanup
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (extendTimerRef.current) {
        clearTimeout(extendTimerRef.current);
      }
      
      clearInterval(sessionCheckInterval);
    };
  }, [enabled, extendThreshold, activityEvents, authService]);

  // Return session utilities
  return {
    extendSession: () => authService.extendSession(),
    getSessionInfo: () => SessionStorageService.getSessionInfo(),
    clearSession: () => SessionStorageService.clearAuthSession(),
  };
};
