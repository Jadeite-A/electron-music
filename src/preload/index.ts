import { contextBridge, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import log from 'electron-log'

// Custom APIs for renderer
const api = {}

const systemLog = log.create({ logId: 'system' })
const Logger = {
  info: (message, data?: any) => {
    systemLog.info(
      `[${new Date().toLocaleString()}]: ${message}${data ? '\n ============ information ============\n' + JSON.stringify(data) : ''}`
    )
  },
  error: (message, data?: any) => {
    systemLog.error(
      `[${new Date().toLocaleString()}]: ${message}${data ? '\n ============ information ============\n' + JSON.stringify(data) : ''}`
    )
  },
  warn: (message, data?: any) => {
    systemLog.warn(
      `[${new Date().toLocaleString()}]: ${message}${data ? '\n ============ information ============\n' + JSON.stringify(data) : ''}`
    )
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('openExternalLink', (url) => shell.openExternal(url))

    contextBridge.exposeInMainWorld('Logger', Logger)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.openExternalLink = (url) => shell.openExternal(url)
}
