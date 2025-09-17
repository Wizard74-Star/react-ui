export interface Microsoft365Context {
  userObjectId: string;
  tenantId: string;
  userPrincipalName: string;
  isInTeams: boolean;
  isInOutlook: boolean;
  isInWeb: boolean;
}

export class Microsoft365Service {
  private static instance: Microsoft365Service;
  private context: Microsoft365Context | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): Microsoft365Service {
    if (!Microsoft365Service.instance) {
      Microsoft365Service.instance = new Microsoft365Service();
    }
    return Microsoft365Service.instance;
  }

  public async initialize(): Promise<boolean> {
    try {
      this.initialized = true;
      
      // Detect the current environment
      const isInTeams = this.detectTeamsEnvironment();
      const isInOutlook = this.detectOutlookEnvironment();
      const isInWeb = !isInTeams && !isInOutlook;
      
      this.context = {
        userObjectId: 'context-will-be-set-after-auth',
        tenantId: 'context-will-be-set-after-auth',
        userPrincipalName: 'context-will-be-set-after-auth',
        isInTeams,
        isInOutlook,
        isInWeb,
      };

      console.log('Microsoft 365 Service initialized:', {
        isInTeams,
        isInOutlook,
        isInWeb
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize Microsoft 365 Service:', error);
      return false;
    }
  }

  private detectTeamsEnvironment(): boolean {
    // Check if running in Microsoft Teams
    return (
      window.parent !== window ||
      window.location.href.includes('teams.microsoft.com') ||
      window.location.href.includes('teams.live.com') ||
      document.referrer.includes('teams.microsoft.com')
    );
  }

  private detectOutlookEnvironment(): boolean {
    // Check if running in Outlook
    return (
      window.location.href.includes('outlook.office.com') ||
      window.location.href.includes('outlook.live.com') ||
      document.referrer.includes('outlook.office.com')
    );
  }

  public getContext(): Microsoft365Context | null {
    return this.context;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public updateContext(userInfo: { id: string; tenantId: string; userPrincipalName: string }): void {
    if (this.context) {
      this.context.userObjectId = userInfo.id;
      this.context.tenantId = userInfo.tenantId;
      this.context.userPrincipalName = userInfo.userPrincipalName;
    }
  }

  public async showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): Promise<void> {
    try {
      // Use browser notification API if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('BMS Microsoft 365 App', {
          body: message,
          icon: '/favicon.ico'
        });
      } else {
        // Fallback to console log
        console.log(`BMS Microsoft 365 App [${type.toUpperCase()}]:`, message);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
      console.log('BMS Microsoft 365 App:', message);
    }
  }

  public async openDialog(url: string, title: string, width?: number, height?: number): Promise<void> {
    try {
      // Use window.open for dialog functionality
      const popup = window.open(
        url, 
        title, 
        `width=${width || 600},height=${height || 400},scrollbars=yes,resizable=yes`
      );
      
      if (!popup) {
        throw new Error('Popup blocked by browser');
      }
    } catch (error) {
      console.error('Failed to open dialog:', error);
      // Fallback to window.open
      window.open(url, title, `width=${width || 600},height=${height || 400}`);
    }
  }

  public getEnvironmentInfo(): { isInTeams: boolean; isInOutlook: boolean; isInWeb: boolean } {
    return {
      isInTeams: this.context?.isInTeams || false,
      isInOutlook: this.context?.isInOutlook || false,
      isInWeb: this.context?.isInWeb || false,
    };
  }
}
