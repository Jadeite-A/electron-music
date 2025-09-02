// import Fs from 'fs'
// import Path from 'path'
// import log from 'electron-log'
// import { app, ipcMain } from 'electron'

// import VersionManager from '../versionManager'

// export const logsPath = Path.join(
//   app.getPath('appData'),
//   `../Local/Music/Logs/${VersionManager.version}`
// )

// const initLogger = (logId: string) => {
//   const logIns = log.create({ logId })
//   const time = new Date().toLocaleString()
//   logIns.transports.file.resolvePathFn = () => Path.join(logsPath, `./${logId}-${time}.log`)

//   return logIns
// }
// export const Logger = initLogger('main')

// // 全局捕获未处理的异常
// process.on('uncaughtException', (error) => {
//   Logger.error('Uncaught Exception:', error)
// })

// // 全局捕获未处理的 Promise 拒绝
// process.on('unhandledRejection', (reason, promise) => {
//   Logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
// })

// // const clearLogFile = (dir) => {
// //   Fs.readdir(dir, (err, files) => {
// //     if (err) {
// //       throw err;
// //     }

// //     files.forEach((file) => {
// //       const filePath = Path.join(dir, file);
// //       const stats: any = Fs.statSync(filePath);

// //       if (Path.extname(file) === '.log' && stats.mtime < twoDaysAgo) {
// //         Fs.unlink(filePath, (error) => {
// //           if (error) {
// //             throw error;
// //           }
// //           console.log(`已删除文件: ${file}`);
// //         });
// //       }
// //     });
// //   });
// // };
