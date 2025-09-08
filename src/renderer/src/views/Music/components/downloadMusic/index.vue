<template>
  <splitpanes horizontal class="music-download-container">
    <splitpanes-pane>
      <el-tabs
        v-model="downloadMethod"
        tab-position="left"
        class="method-tab"
      >
        <el-tab-pane name="1" label="搜索下载">
          <search-music type="download"/>
        </el-tab-pane>
        <el-tab-pane name="2" label="批量下载">Config</el-tab-pane>
      </el-tabs>
    </splitpanes-pane>
    <splitpanes-pane size="30">1111</splitpanes-pane>
  </splitpanes>
</template>

<script setup lang="ts">
import { Splitpanes, SplitpanesPane } from '@components/splitpanes';

const downloadMethod = ref('1')
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
