import axios from 'axios'
import fs from 'fs'
const Path = require('path')
const utf8 = require('utf8')
const cheerio = require('cheerio')
import { app, dialog, shell, type FileFilter, type OpenDialogOptions } from 'electron'

const cookie_val =
  'Cookie: bbs_sid=5pmb8jukg4d5ne9puo2apj6iai; Hm_lvt_4ab5ca5f7f036f4a4747f1836fffe6f2=1664547942; Hm_lpvt_4ab5ca5f7f036f4a4747f1836fffe6f2=1664770918;'

export const fetchPage = async (url) => {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Cookie: cookie_val,
      Accept: '*/*'
    }
  })

  return res.data ?? null
}

export const parseSearchHtml = (body) => {
  const $ = cheerio.load(body)

  return [
    ...$('li.media.thread.tap').map((i, node) => {
      const li = $(node)

      const avatarLink = li.find('img').attr('src')
      const mediaBody = li.find('.media-body')

      const linkA = mediaBody.find('.subject a')
      const link = linkA.attr('href')
      const title = linkA.text()

      const information = mediaBody.find('.d-flex.justify-content-between')
      const comment = information
        .find('div:first')
        .text()
        .replace(/\\[tn]/gi, '')
      const tag = information.find('span:last').text()

      return { avatarLink, link, title, comment, tag }
    })
  ]
}

export const parseMusicHtml = (body) => {
  const $ = cheerio.load(body)

  // 下载链接
  const scriptNode = [...$('#player4 ~ script')]
  const urlRegexp = /(?<=url:\s*['"])(.*?)(?=['"])/
  const script = $(scriptNode[scriptNode.length - 1])
  const downloadLink = script?.text()?.toString()?.match(urlRegexp)?.[0] ?? ''
  // console.log('🐦‍🔥 downloadLind', downloadLink)

  // bo
  const playerInfo = {
    img: '',
    title: '',
    author: '',
    time: ''
  }
  // // const playerNode = [...$('#player4')]
  // const playerNode = $('#player4')
  // const playerImg = $('#player4 .aplayer-pic')
  // playerInfo.img =
  //   $(playerImg[0])
  //     .attr('style')
  //     ?.match(/url\('(.+?)'\)/)?.[1] ?? ''
  // console.log('🐦‍🔥 playerImg', playerInfo)

  // playerInfo.title = playerNode.find('.aplayer-info .aplayer-title').text()
  // playerInfo.author = playerNode.find('.aplayer-info .aplayer-author').text()

  // playerInfo.time = playerNode.find('.aplayer-info .aplayer-controller .aplayer-dtime').text()

  // let musicLyrics: string[] = []
  // const lyricsNode = [...$('#player4 ~ p')]

  // for (let index = 0; index < lyricsNode.length; index++) {
  //   const $p = $(lyricsNode[index])
  //   if (!$p.text()) {
  //     continue
  //   }
  //   musicLyrics = [
  //     ...$p.children().map((i, item) => {
  //       return $(item).text()
  //     })
  //   ]
  //   break
  // }

  // console.log('🐦‍🔥 musicLyrics', musicLyrics)

  // $('#player4').each((i, node) => {
  //   const item = $(node)

  //   const img = item.find('.aplayer-pic')
  //   const title = item.find('.aplayer-title')
  //   const author = item.find('.aplayer-author')
  //   const time = item.find('.aplayer-dtime')

  //   playerInfo.img = $(img).attr('style')
  //   playerInfo.title = title[0].data
  //   playerInfo.author = author[0].data
  //   playerInfo.time = time[0].data
  // })
  // $('div.aplayer').each((i, node) => {
  //   // playerInfo.title = node.data
  //   const div = $(node)

  //   const aaa = div.data
  //   console.log('🐦‍🔥 aaa', aaa, div.find('.aplayer-title').length)
  // })
  // $('.aplayer-author').each((i, node) => {
  //   playerInfo.author = node.data
  // })
  // $('.aplayer-dtime').each((i, node) => {
  //   playerInfo.time = node.data
  // })

  // console.log('🐦‍🔥 node', $('.aplayer'))
  // const playerNode = [...$('#player4 .aplayer-title')]
  // const player = $(playerNode[0])

  // playerInfo.title = $('.aplayer .aplayer-music').text()

  // const style = playerNode.find('.aplayer-pic').attr('style') || ''
  // const img = style.match(/url\(["']?(.*?)["']?\)/i)?.[1] ?? ''
  // const title = playerNode.find('.aplayer-title')
  // const author = playerNode.find('.aplayer-author')
  // const time = playerNode.find('.aplayer-dtime')
  // const playerInfo = { img, title, author, time }

  let musicLyrics: any[] = []
  $('#player4 ~ p').each((i, p) => {
    if (p.children.length) {
      const infos = p.children.map((child) => child.data).filter((child) => child)
      musicLyrics.push(infos)
    }
  })

  return {
    musicLyrics,
    playerInfo,
    downloadLink
  }
}

export const downloadMp3 = async (url) => {
  dialog.showOpenDialog({ filters: [], properties: ['openDirectory'] }).then(async (result) => {
    const { canceled, filePaths } = result

    if (canceled || !filePaths.length) {
      return
    }

    const writer = fs.createWriteStream(Path.join(filePaths[0], '111.mp3'))
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        Cookie: cookie_val,
        'User-Agent': 'Mozilla/5.0'
      }
    })

    response.data.pipe(writer)

    return await new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({ code: 'success' }))
      writer.on('error', (err) => reject({ code: 'error', error: err }))
    })
  })
}
