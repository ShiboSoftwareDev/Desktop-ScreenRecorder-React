import { DesktopCapturerSource, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  videoSelectBtnClicked: () => ipcRenderer.send("videoSelectBtn-clicked"),
  sourceSelected: (callback: (value: DesktopCapturerSource) => void) =>
    ipcRenderer.on(
      "source-selected",
      (_event: object, value: DesktopCapturerSource) => callback(value)
    ),
  sendStream: (data: ArrayBuffer) => ipcRenderer.send("send-stream", data),
  clearListeners: () => ipcRenderer.removeAllListeners("source-selected"),
});
