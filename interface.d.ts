export interface IElectronAPI {
  sourceSelected: (callback: (value: DesktopCapturerSource) => void) => void;
  videoSelectBtnClicked: () => Promise<void>;
  sendStream: (buffer: ArrayBuffer) => void;
  clearListeners: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
