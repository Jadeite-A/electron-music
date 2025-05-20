import fs from "fs";
import Path from "path";
import ipcMain from "./ipcMain";
import {
  app,
  dialog,
  shell,
  type FileFilter,
  type OpenDialogOptions,
} from "electron";

ipcMain.on(
  "lx.render.choose.file",
  (_event, service: string, type = [], options: any) => {
    const filters: FileFilter[] = [];

    type.length &&
      filters.push({
        name: "fileType",
        extensions: type,
      });

    dialog
      .showOpenDialog({
        filters, // 传递文件筛选器
        properties: ["openFile"],
        // defaultPath: options && options.defaultPath ? options.defaultPath : null
      })
      .then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
          fs.readFile(result.filePaths[0], (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

            const fileName = Path.basename(result.filePaths[0]);

            ipcMain.sendMessage(
              `lx.main.choose.file${options && options.token ? "-" + options.token : ""}`,
              {
                service,
                fileContent: data,
                fileName: fileName,
                options,
                file: result,
                filePath: result.filePaths[0],
              },
            );
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
);

ipcMain.on("lx.render.choose.directory", (_event, options: any) => {
  const { token } = options;
  let defaultPath: string | undefined = options.defaultPath;
  if (defaultPath) {
    defaultPath = Path.join(app.getPath("appData"), defaultPath);
  }

  const filters: FileFilter[] = [];
  const properties: OpenDialogOptions["properties"] = ["openDirectory"];

  dialog
    .showOpenDialog({ filters, properties, defaultPath })
    .then((result) => {
      const { canceled, filePaths } = result;

      if (canceled || !filePaths.length) {
        return;
      }

      ipcMain.sendMessage(
        `lx.main.choose.directory${token ? "-" + token : ""}`,
        {
          options,
          file: result,
          filePath: result.filePaths[0],
        },
      );
    })
    .catch((err) => {
      console.error(err);
    });
});
