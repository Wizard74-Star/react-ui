/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string
  readonly VITE_TENANT_ID: string
  readonly VITE_SHAREPOINT_SITE_URL: string
  readonly VITE_SHAREPOINT_HUB_SITE_URL: string
  readonly VITE_AGENTS_APP_ID: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
