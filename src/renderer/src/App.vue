<template>
  <el-config-provider>
    <div v-if="!networkStatus" class="network-status">No Internet</div>
    <div class="app-container">
      <ribbon />
      <splitpanes horizontal class="main">
        <splitpanes-pane>
          <router-view />
        </splitpanes-pane>
        <splitpanes-pane size="15">1111</splitpanes-pane>
      </splitpanes>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
// import Lodash from 'lodash';
import { Splitpanes, Pane as SplitpanesPane } from '@components/splitpanes';

// Network status listener
const networkStatus = ref(true);
window.addEventListener('online', () => {
  if (!networkStatus.value) {
    networkStatus.value = true;
  }
});
window.addEventListener('offline', () => {
  if (networkStatus.value) {
    networkStatus.value = false;
  }
});

</script>

<style lang="scss">
@use '@/assets/common/css/index';
</style>

<style scoped lang="scss">
@use '@/assets/common/css/variables.scss' as *;
.network-status {
  height: 50px;

  line-height: 50px;
  font-size: $font-size-large;

  text-align: center;
  color: $color-white;
  background: $color-danger;
}

.app-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: calc(100% - 30px);

  background-color: $color-gray-f8f8f8;

  .main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: none;

    .splitpanes__pane {
      background-color: inherit;
    }
  }
}
</style>

