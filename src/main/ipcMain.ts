import { ipcMain, BrowserWindow } from "electron";

const on = (channel: string, callback) => {
  ipcMain.on(channel, (event, ...args) => {
    try {
      const result = callback(event, ...args);
      event.reply(`${channel}-reply`, result);
    } catch (error: any) {
      event.reply(`${channel}-reply`, { error: error.message });
    }
  });
};

const handle = ipcMain.handle;

const sendMessage = (channel: string, data?: any) => {
  let currentWindow = BrowserWindow.getFocusedWindow() as BrowserWindow;

  if (!currentWindow) {
    currentWindow = BrowserWindow.getAllWindows()[0] as BrowserWindow;
  }

  currentWindow.webContents.send(channel, data);
};

export default {
  on,
  handle,
  sendMessage,
};
