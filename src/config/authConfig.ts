import { Configuration, PopupRequest } from '@azure/msal-browser';
import { environment } from './environment';

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: environment.clientId,
    authority: `https://login.microsoftonline.com/${environment.tenantId}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    allowNativeBroker: false, // Disable native broker for SPA
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // LogLevel.Error
            console.error(message);
            return;
          case 1: // LogLevel.Warning
            console.warn(message);
            return;
          case 2: // LogLevel.Info
            console.info(message);
            return;
          case 3: // LogLevel.Verbose
            console.debug(message);
            return;
        }
      },
    },
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: ['User.Read'],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMePhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
};

// SharePoint specific scopes
export const sharePointScopes = [
  'https://graph.microsoft.com/Sites.Read.All',
  'https://graph.microsoft.com/Sites.ReadWrite.All',
  'https://graph.microsoft.com/Sites.Manage.All',
  'https://graph.microsoft.com/Sites.FullControl.All',
];

// Teams specific scopes
export const teamsScopes = [
  'https://graph.microsoft.com/AppCatalog.Read.All',
  'https://graph.microsoft.com/Team.ReadBasic.All',
  'https://graph.microsoft.com/TeamMember.Read.All',
];
