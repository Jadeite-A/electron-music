import { contextBridge, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import Path from 'path'
import log from 'electron-log'

// Custom APIs for renderer
const api = {}
const systemLog = log.create({ logId: 'system' })

const ipcRenderer = electronAPI.ipcRenderer
let logsPath = ''
ipcRenderer.send('ms.preload.getLogsPath')

ipcRenderer.on('ms.main.logsPath', (_event, _logsPath) => {
  logsPath = _logsPath
  systemLog.transports.file.resolvePathFn = () => Path.join(_logsPath, `./renderer-system.log`)
})

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

const eStore = {
  get: (key: string) => ipcRenderer.invoke('store-get', key),
  set: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value)
  // get: (key: string) => EStore.get(key),
  // set: (key: string, value: any) => EStore.set(key, value)
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
    contextBridge.exposeInMainWorld('eStore', eStore)
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
  // @ts-ignore (define in dts)
  window.Logger = Logger
  // @ts-ignore (define in dts)
  window.eStore = eStore
}
