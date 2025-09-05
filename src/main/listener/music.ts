import fs from 'fs'
import Path from 'path'
import ipcMain from '../ipcMain'
import axios from 'axios'

import { Logger } from '../mainLogger'
import { fetchPage, parseSearchHtml, parseMusicHtml, downloadMp3 } from './tools'

const baseUrl = 'https://www.hifini.com.cn/'

ipcMain.on('ms.render.music.search', async (event, searchKey) => {
  try {
    const url = `${baseUrl}search.htm?keyword=${encodeURIComponent(searchKey)}`
    // const url = 'https://www.hifini.com.cn/search.htm?keyword=%E8%8F%8A%E8%8A%B1%E5%8F%B0'
    const res = await fetchPage(url)

    const data: any = {
      data: [],
      baseUrl
    }

    if (res) {
      data.data = parseSearchHtml(res)
    }
    ipcMain.sendMessage('ms.main.fetch.page', data)
  } catch (error) {
    console.log('error', error)
  }
})

ipcMain.on('ms.render.music.choice', async (event, options) => {
  const { url } = options

  const res = await fetchPage(url)

  if (res) {
    const data = parseMusicHtml(res)

    ipcMain.sendMessage('ms.main.fetch.music.info', data)
  }
})

ipcMain.on('ms.render.music.download', async (event, link) => {
  console.log('🐦‍🔥 link', link)
  downloadMp3(link)
})
