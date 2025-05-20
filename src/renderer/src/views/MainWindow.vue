<template>
  <img
    alt="logo"
    class="logo"
    src="./assets/electron.svg"
  >
  <div class="creator">
    Powered by electron-vite
  </div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">
    Please try pressing <code>F12</code> to open the devTool
  </p>
  <div class="actions">
    <div class="action">
      <a
        href="https://electron-vite.org/"
        target="_blank"
        rel="noreferrer"
      >Documentation</a>
    </div>
    <div class="action">
      <a
        target="_blank"
        rel="noreferrer"
        @click="ipcHandle"
      >Send IPC</a>
    </div>
  </div>
  <ul class="versions">
    <li class="electron-version">
      Electron v{{ versions.electron }}
    </li>
    <li class="chrome-version">
      Chromium v{{ versions.chrome }}
    </li>
    <li class="node-version">
      Node v{{ versions.node }}
    </li>
  </ul>
</template>
<script setup lang="ts">
const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
 
const versions = reactive({ ...window.electron.process.versions });
</script>
