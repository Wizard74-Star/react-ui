// Environment configuration
// In production, these values should be set via environment variables
export const environment = {
  // Microsoft Azure App Registration Configuration
  clientId: import.meta.env.VITE_CLIENT_ID || '7fe36fe4-7928-482e-a808-1803f2c8c770',
  tenantId: import.meta.env.VITE_TENANT_ID || '25aceb65-e233-4a34-ac15-597ba6049a4f',
  
  // SharePoint Configuration
  sharePointSiteUrl: import.meta.env.VITE_SHAREPOINT_SITE_URL || 'https://transformr.sharepoint.com/sites/Kane-BMSHub',
  sharePointHubSiteUrl: import.meta.env.VITE_SHAREPOINT_HUB_SITE_URL || 'https://transformr.sharepoint.com/sites/Kane-BMSHub',
  
  // Microsoft 365 Agents Configuration
  agentsAppId: import.meta.env.VITE_AGENTS_APP_ID || 'your_agents_app_id_here',
  
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://your-api.azurewebsites.net',
  
  // Development mode
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
