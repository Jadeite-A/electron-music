<template>
  <splitpanes class="music-search-container">
    <splitpanes-pane size="85">
      <div class="search-box">
        <el-input v-model="searchText" class="input" />
        <el-button 
          type="primary"
          class="search"
          @click="handleSearch"
        >
          <el-icon class="icon"><use-search /></el-icon>
        </el-button>
      </div>
      <div class="search-result">
        <el-scrollbar height="100%" class="result-scroll">
          <div
            v-for="(item, index) in searchRes"
            :key="index"
            class="result-item"
            @click="() => handleChoice(item)"
          >
            <div class="avatar-container">
              <img 
                class="avatar" 
                :src="item.avatarLink" 
                alt=""
              >
            </div>
            <div class="information-container">
              <div class="title-container">
                <div class="title nowrap">{{ item.title }}</div>
                <!-- <el-icon 
                  class="download"
                  @click="() => handleChoice(item)"
                >
                  <use-download />
                </el-icon> -->
              </div>
              <div class="information">
                <div class="text">
                  <div class="flag"></div>
                  <span class="nowrap">{{ item.comment }}</span>
                </div>
                <div class="tag-count">
                  <el-icon><use-chat-line-round /></el-icon>
                  <span>{{ item.tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>

        <div class="tool-container"></div>
      </div>
    </splitpanes-pane>
    <splitpanes-pane>
      <!-- <el-button :disabled="!musicLink" @click="handleDownload">下载</el-button> -->
       <music-detail v-if="musicInfo" :data="musicInfo" />
    </splitpanes-pane>
  </splitpanes>
</template>

<script setup lang="ts">
import { Splitpanes, SplitpanesPane } from '@components/splitpanes';

import { sendSearch, sendChoice, sendDownload } from '@/service/music'

const props = defineProps<{
  type: string
}>();

const searchText = ref('');
const searchRes = ref<any[]>([]);
// const musicLink = ref('');

const handleSearch = () => {
  const searchKey = searchText.value.trim()

  sendSearch(searchKey)
};

window.electron.ipcRenderer.on('ms.main.fetch.page', (_event, data) => {
  searchRes.value = data
});

const musicInfo = ref<any>(null);

const handleChoice = (item) => {
  sendChoice(item.link)
}

window.electron.ipcRenderer.on('ms.main.fetch.music.info', (_event, data) => {
  musicInfo.value = data
});



// const handleDownload = () => {
//   sendDownload(musicLink.value)
// };
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
