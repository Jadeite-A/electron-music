import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    openExternalLink: (url: string) => void
    Logger: {
      info: (message: any, data?: any) => void
      error: (message: any, data?: any) => void
      warn: (message: any, data?: any) => void
    }
    eStore: any
  }
}
