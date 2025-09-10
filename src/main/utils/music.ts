import fs from 'fs'
import axios from 'axios'

const Path = require('path')
const utf8 = require('utf8')
const cheerio = require('cheerio')

import { app, dialog, shell, type FileFilter, type OpenDialogOptions } from 'electron'

const cookie_val =
  'Cookie: bbs_sid=5pmb8jukg4d5ne9puo2apj6iai; Hm_lvt_4ab5ca5f7f036f4a4747f1836fffe6f2=1664547942; Hm_lpvt_4ab5ca5f7f036f4a4747f1836fffe6f2=1664770918;'

const encodeSearchUrl_0 = (key, baseUrl) => {
  return `${baseUrl}search.htm?keyword=${encodeURIComponent(key)}`
}

const parseSearchHtml_0 = (body, baseUrl) => {
  const $ = cheerio.load(body)

  return Array.from($('li.media.thread.tap'), (node) => {
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

    return {
      title,
      comment,
      tag,
      avatarLink: `${baseUrl}${avatarLink}`,
      link: `${baseUrl}${link}`
    }
  })
}

const parseMusicDetailHtml_0 = (body, baseUrl) => {
  const $ = cheerio.load(body)
  const cardNode = $('.col-lg-9.main > .card > .card-body')

  const result: any = {
    downloadLink: '',
    authorAvatar: '',
    title: '',
    singer: [],
    singerTagLink: '',
    authorName: '',
    updateDate: '',
    readCount: '',
    musicLyrics: [],
    recommend: [],
    comment: []
  }

  cardNode.each((card_i, card) => {
    const cardNode = $(card)

    if (card_i === 0) {
      const scriptNode = [...cardNode.find('#player4 ~ script')]
      const urlRegexp = /(?<=url:\s*['"])(.*?)(?=['"])/
      const script = $(scriptNode[scriptNode.length - 1])
      result.downloadLink = script?.text()?.toString()?.match(urlRegexp)?.[0] ?? ''

      cardNode.find('#player4 ~ p').each((i, p) => {
        if (p.children.length) {
          p.children.forEach((child) => {
            const lyrics = child.data?.toString()?.trim() ?? ''

            if (lyrics) {
              result.musicLyrics.push(lyrics)
            }
          })
        }
      })

      const titleNode = cardNode.find('.media:first')
      const authorAvatar = titleNode.find('img').attr('src')
      const title = titleNode.find('.media-body .break-all').text()

      const singerNode = titleNode.find('.media-body a.badge-primary')
      const singer = Array.from(singerNode).map((tag) => {
        const $node = $(tag)

        const singerName = $node.text()
        const singerTagLink = `${baseUrl}${$node.attr('href')}`

        return { singerName, singerTagLink }
      })

      const informationNode = titleNode.find('.d-flex.small')
      const authorName = informationNode.find('.username a.text-muted').text()
      const updateDate = informationNode.find('.date').text()
      const readCount = informationNode.find('.date').next().text()

      result.authorAvatar = `${baseUrl}${authorAvatar}`
      result.title = title
      result.singer = singer
      result.authorName = authorName
      result.updateDate = updateDate
      result.readCount = readCount
      return
    }

    if (card_i === 1) {
      const recommend = cardNode.find('li.text-truncate')

      recommend.each((i, li) => {
        const liNode = $(li)
        const date = liNode.find('span.float-right').text()

        const aNode = liNode.find('a')
        const link = `${baseUrl}${aNode.attr('href')}`
        const title = aNode.attr('title')

        result.recommend.push({ date, link, title })
      })

      return
    }

    const comment = cardNode.find('li.media')

    comment.each((i, li) => {
      const liNode = $(li)
      const avatarLink = `${baseUrl}${liNode.find('a:first img').attr('src')}`

      const userInfo = liNode.find('.media-body > .small.d-flex')
      const userName = userInfo.find('.username a.text-muted').text()
      const login = userInfo.find('.date.ml-2').text()
      const likeCount = userInfo.find('.haya-post-like .haya-post-like-post-user-count').text()

      const message = liNode.find('.media-body > .message .longenss').text()

      if (!userName && !login) {
        return
      }
      result.comment.push({ avatarLink, userName, login, likeCount, message })
    })
  })

  return result
}

const fetchPage = async (url) => {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Cookie: cookie_val,
      Accept: '*/*'
    }
  })

  return res.data ?? null
}

const downloadMp3 = async (url) => {
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

export const encodeSearchUrl = {
  0: encodeSearchUrl_0
}
export const parseSearchHtml = {
  0: parseSearchHtml_0
}

export const parseMusicDetailHtml = {
  0: parseMusicDetailHtml_0
}

export default {
  fetchPage,
  downloadMp3
}
