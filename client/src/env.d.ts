/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_REACT_APP_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_APP_ID: string
  readonly VITE_MESSAGING_SENDER_ID: string
  readonly VITE_STORAGE_BUCKET: string
  readonly VITE_PROJECT_ID: string
  readonly VITE_AUTH_DOMAIN: string
  readonly VITE_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
