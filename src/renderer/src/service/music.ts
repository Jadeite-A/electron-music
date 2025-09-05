export const sendSearch = (key) => {
  window.electron.ipcRenderer.send('ms.render.music.search', key)
}

export const sendChoice = (options) => {
  window.electron.ipcRenderer.send('ms.render.music.choice', options)
}

export const sendDownload = (link) => {
  window.electron.ipcRenderer.send('ms.render.music.download', link)
}

export default {}
