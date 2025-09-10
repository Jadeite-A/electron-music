<template>
  <div class="music-detail-container">
    <el-scrollbar height="100%">
      <div class="header">
        <div class="author-avatar">
          <img :src="pageData.authorAvatar" alt="" class="avatar">
        </div>
        <div class="music-detail">
          <div class="detail-title">{{ pageData.title }}</div>
          <div class="singer-box">
            <div
              v-for="(singer, index) in data.singer"
              :key="index"
              class="singer-item"
            >{{ singer.singerName }}</div>
          </div>
          <div class="detail-content">
            <div class="author-name">{{ pageData.authorName }}</div>
            <div class="music-date">
              <el-icon class="clock-icon"><use-clock /></el-icon>
              <div class="date">{{  pageData.updateDate }}</div>
            </div>
            <div class="read-count">
              <el-icon class="icon"><use-view /></el-icon>
              <div class="count">{{ pageData.readCount }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="song-detail">
        <div class="music-player">
          <div class="player"></div>
          <el-button 
            type="primary"
            class="download"
          >
            <el-icon class="icon"><use-download /></el-icon>
          </el-button>
        </div>
        <div class="lyrics-container">
          <template v-if="pageData.musicLyrics.length">
            <div
              v-for="(lyrics, index) in pageData.musicLyrics"
              :key="index"
              class="lyrics-item"
            >
              {{ lyrics }}
            </div>
          </template>
          
          <template v-else>
            <div class="lyrics-item">暂无歌词</div>
          </template>
        </div>
        </div>
      <div class="recommend" v-if="pageData.recommend.length">
        <div class="title">相关推荐</div>
        <div class="recommend-container">
          <div
            v-for="(item, index) in pageData.recommend"
            :key="index"
            class="recommend-item"
          >
            <el-icon class="caret-icon"><use-caret-right /></el-icon>
            <div
              class="info nowrap" 
              @click="() => handleJump(item.link)"
            >
              {{ item.title }}
            </div>
            <div class="date">{{ item.date }}</div>
          </div>
        </div>
      </div>
      <div class="comment" v-if="pageData.comment.length">
        <div class="title">最新评论</div>
        <div class="comment-container">
          <div
            v-for="(item, index) in pageData.comment"
            :key="index"
            class="comment-item"
          >
            <div class="avatar-box">
              <img :src="item.avatarLink" alt="" class="avatar">
            </div>
            <div class="comment-content">
              <div class="label-box">
                <div class="content-left">
                  <div class="user-name">{{ item.userName }}</div>
                  <div class="user-login">{{ item.login }}</div>
                  <div class="user-like">
                    <el-icon class="like-icon"><use-star /></el-icon>
                    <div class="count">{{ item.likeCount }}</div>
                  </div>
                </div>
                <div class="content-right">
                  <template v-if="index === 0">沙发</template>
                  <template v-else-if="index === 1">椅子</template>
                  <template v-else-if="index === 2">板凳</template>
                  <template v-else>#{{ index + 1 }}</template>
                </div>
              </div>
              <div class="message">{{ item.message }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
// import Lodash from 'lodash';
// import i18n from '@utils/i18n';
import { sendSearch, sendChoice, sendDownload } from '@/service/music'

const props = defineProps<{
  data: any
}>();

const pageData = ref(props.data);

watch(
  props.data,
  (newVal) => {
    pageData.value = newVal;
  }
);

const handleJump = (link) => {
  sendChoice(link)
}
window.electron.ipcRenderer.on('ms.main.fetch.music.info', (_event, data) => {
  pageData.value = data
});

</script> 

<style scoped lang="scss">
@use './index.scss';
</style>
