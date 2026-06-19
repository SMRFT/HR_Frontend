const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Define any secure APIs you want to expose to the React app here
  platform: process.platform,
});
