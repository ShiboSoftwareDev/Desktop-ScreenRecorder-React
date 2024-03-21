// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  videoSelectBtnClicked: () => ipcRenderer.send("videoSelectBtn-clicked"),
  sourceSelected: (callback) =>
    ipcRenderer.on("source-selected", (_event, value) => callback(value)),
  sendStream: (something) => ipcRenderer.send("send-stream", something),
  clearListeners: () => ipcRenderer.removeAllListeners("source-selected"),
});
