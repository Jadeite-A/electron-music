import Store from 'electron-store'

import Path from 'path'
import { app, ipcMain } from 'electron'

const defaultData = {
  global: {},
  music: {
    listening: {},
    download: {
      urls: ['https://www.hifini.com.cn/'],
      output: Path.join(app.getPath('userData'), './Local/Output'),
      input: Path.join(app.getPath('userData'), './Local/Input'),
      sleep: 3 * 10 ** 3,
      fileType: '.mp3',
      useDefault: true,
      namingRules: 'name - author'
    },
    summary: {}
  }
}

const store: any = new Store({
  defaults: defaultData
})

ipcMain.handle('store-get', (_, key) => store.get(key))
ipcMain.handle('store-set', (_, key, value) => store.set(key, value))

export default store
