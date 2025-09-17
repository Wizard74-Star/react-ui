# BMS Microsoft 365 App

A Microsoft 365 application for centralized SharePoint document management, built with React, MSAL authentication, and Microsoft 365 Agents SDK.

## Features

- **MSAL Authentication**: Secure authentication using Microsoft Authentication Library
- **Microsoft 365 Agents SDK**: Native Microsoft 365 integration with proper SDK support
- **Document Approvers Management**: Bulk and individual document approver management
- **Review Metrics**: Track documents coming up for review or overdue
- **Outstanding Approvals**: View and manage pending approvals
- **SharePoint Integration**: Full SharePoint REST API integration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Microsoft Azure App Registration
- Microsoft Teams Developer Account
- SharePoint site with BMS structure

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **MSAL (Microsoft Authentication Library)** - Authentication
- **Microsoft 365 Agents SDK** - Microsoft 365 integration
- **Microsoft Graph API** - User and SharePoint data access

## Setup Instructions

### 1. Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Configure:
   - Name: "BMS Teams App"
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: Web - `https://your-app-url.azurewebsites.net`
5. Note down the **Application (client) ID** and **Directory (tenant) ID**

### 2. API Permissions

Add the following Microsoft Graph permissions:
- `User.Read` (Delegated)
- `Sites.Read.All` (Delegated)
- `Sites.ReadWrite.All` (Delegated)
- `Sites.Manage.All` (Delegated)
- `Sites.FullControl.All` (Delegated)
- `Team.ReadBasic.All` (Delegated)
- `TeamMember.Read.All` (Delegated)

Grant admin consent for all permissions.

### 3. Authentication Configuration

1. Create a `.env` file in the root directory
2. Update the following values:
   ```
   VITE_CLIENT_ID=your_client_id_here
   VITE_TENANT_ID=your_tenant_id_here
   VITE_SHAREPOINT_SITE_URL=https://yourtenant.sharepoint.com/sites/bms
   VITE_SHAREPOINT_HUB_SITE_URL=https://yourtenant.sharepoint.com/sites/bms
   VITE_AGENTS_APP_ID=your_agents_app_id_here
   VITE_API_BASE_URL=https://your-api.azurewebsites.net
   ```

   **Note**: Vite uses `VITE_` prefix for environment variables instead of `REACT_APP_`

### 4. Teams App Manifest

1. Update `teamsAppManifest/manifest.json`:
   - Replace `YOUR_TEAMS_APP_ID` with your Teams app ID
   - Replace `YOUR_APP_URL` with your deployed app URL
   - Replace `YOUR_CLIENT_ID` with your Azure app client ID
2. Add app icons (`color.png` and `outline.png`) to the manifest folder

### 5. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Azure App Service

1. Create an Azure App Service
2. Configure deployment from GitHub/Azure DevOps
3. Set environment variables in App Service configuration
4. Deploy the built React app

### Teams App Deployment

1. Package the Teams app manifest:
   ```bash
   # Create a zip file with manifest.json and icons
   zip -r bms-teams-app.zip teamsAppManifest/
   ```

2. Upload to Teams:
   - Go to Microsoft Teams
   - Navigate to "Apps" > "Manage your apps" > "Upload an app"
   - Select "Upload a custom app"
   - Upload the zip file

## Architecture

### Authentication Flow

1. **Teams Context**: App initializes with Teams SDK
2. **MSAL Integration**: Uses MSAL for token acquisition
3. **Graph API**: Accesses Microsoft Graph for user data
4. **SharePoint API**: Uses SharePoint REST API for document management

### Key Components

- `AuthProvider`: Context provider for authentication state
- `AuthService`: Service for handling authentication logic
- `TeamsService`: Service for Teams SDK integration
- `LoginPage`: Login interface
- `Dashboard`: Main application interface

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── AuthProvider.tsx # Authentication context
│   ├── LoginPage.tsx    # Login interface
│   └── Dashboard.tsx    # Main dashboard
├── config/              # Configuration files
│   └── authConfig.ts    # MSAL configuration
├── services/            # Service classes
│   ├── authService.ts   # Authentication service
│   └── teamsService.ts  # Teams SDK service
├── App.tsx              # Main app component
└── index.tsx            # App entry point
```

### Adding New Features

1. Create new components in `src/components/`
2. Add new services in `src/services/`
3. Update routing in `App.tsx`
4. Add new tabs to Teams manifest if needed

## Security Considerations

- All API calls use proper authentication tokens
- Sensitive data is not stored in localStorage
- App follows Microsoft security best practices
- Proper error handling and user feedback

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check client ID and tenant ID configuration
2. **Teams Integration Issues**: Ensure proper manifest configuration
3. **SharePoint Access**: Verify API permissions and site access
4. **CORS Issues**: Configure proper domains in Azure App Registration

### Debug Mode

Enable debug logging by setting:
```javascript
// In authConfig.ts
system: {
  loggerOptions: {
    loggerCallback: (level, message, containsPii) => {
      console.log(message); // Enable for debugging
    },
  },
}
```

## Support

For technical support or questions, contact the development team or refer to the Microsoft Teams and SharePoint documentation.

## License

This project is proprietary software developed for Transformr's BMS implementation.
