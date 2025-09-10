import fs from 'fs'
import Path from 'path'
import ipcMain from './ipcMain'
import { app, dialog, shell, type FileFilter, type OpenDialogOptions } from 'electron'
import { logsPath } from './mainLogger'
import EStore from './electronStore'

import MusicTools, { encodeSearchUrl, parseSearchHtml, parseMusicDetailHtml } from './utils/music'

// ipcMain.on('ms.render.choose.file', (_event, service: string, type = [], options: any) => {
//   const filters: FileFilter[] = []

//   type.length &&
//     filters.push({
//       name: 'fileType',
//       extensions: type
//     })

//   dialog
//     .showOpenDialog({
//       filters, // 传递文件筛选器
//       properties: ['openFile']
//       // defaultPath: options && options.defaultPath ? options.defaultPath : null
//     })
//     .then((result) => {
//       if (!result.canceled && result.filePaths.length > 0) {
//         fs.readFile(result.filePaths[0], (err, data) => {
//           if (err) {
//             console.error(err)
//             return
//           }

//           const fileName = Path.basename(result.filePaths[0])

//           ipcMain.sendMessage(
//             `lx.main.choose.file${options && options.token ? '-' + options.token : ''}`,
//             {
//               service,
//               fileContent: data,
//               fileName: fileName,
//               options,
//               file: result,
//               filePath: result.filePaths[0]
//             }
//           )
//         })
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//     })
// })

// ipcMain.on('ms.render.choose.directory', (_event, options: any) => {
//   const { token } = options
//   let defaultPath: string | undefined = options.defaultPath
//   if (defaultPath) {
//     defaultPath = Path.join(app.getPath('appData'), defaultPath)
//   }

//   const filters: FileFilter[] = []
//   const properties: OpenDialogOptions['properties'] = ['openDirectory']

//   dialog
//     .showOpenDialog({ filters, properties, defaultPath })
//     .then((result) => {
//       const { canceled, filePaths } = result

//       if (canceled || !filePaths.length) {
//         return
//       }

//       ipcMain.sendMessage(`lx.main.choose.directory${token ? '-' + token : ''}`, {
//         options,
//         file: result,
//         filePath: result.filePaths[0]
//       })
//     })
//     .catch((err) => {
//       console.error(err)
//     })
// })

// ipcMain.on('ms.preload.getLogsPath', (event) => {
//   event.reply('ms.main.logsPath', logsPath)
// })

ipcMain.on('ms.render.music.search', async (event, searchKey, baseUrlInd = 0) => {
  try {
    const urls = EStore.get('music.download.urls')
    const baseUrl = urls[baseUrlInd]
    console.log('🐦‍🔥 baseUrl', baseUrl, baseUrlInd)
    const url = encodeSearchUrl[baseUrlInd](searchKey, baseUrl)

    if (!url) {
      return
    }
    // const url = `${baseUrl}search.htm?keyword=${encodeURIComponent(searchKey)}`
    // const url = 'https://www.hifini.com.cn/search.htm?keyword=%E8%8F%8A%E8%8A%B1%E5%8F%B0'
    const res = await MusicTools.fetchPage(url)

    if (res) {
      const pageList = parseSearchHtml[baseUrlInd](res, baseUrl)
      console.log('🐦‍🔥 pageList', pageList)

      ipcMain.sendMessage('ms.main.fetch.page', pageList)
    }
  } catch (error) {
    console.log('error', error)
  }
})

ipcMain.on('ms.render.music.choice', async (event, url, baseUrlInd = 0) => {
  // const { url } = options
  const urls = EStore.get('music.download.urls')
  const baseUrl = urls[baseUrlInd]

  const res = await MusicTools.fetchPage(url)

  if (res) {
    const data = parseMusicDetailHtml[baseUrlInd](res, baseUrl)

    ipcMain.sendMessage('ms.main.fetch.music.info', data)
  }
})
