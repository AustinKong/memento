import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  'journal:save': (content: string, date: string): void => {
    ipcRenderer.invoke('journal:save', content, date);
  },
  'journal:getByDate': (date: string): Promise<string> => {
    return ipcRenderer.invoke('journal:getByDate', date);
  },
  'test:ping': (): Promise<string> => ipcRenderer.invoke('test:ping')
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
