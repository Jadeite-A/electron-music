<template>
  <!-- <router-view /> -->
   <div class="app-container">
    <main-window />
   </div>
  <!-- <el-config-provider>
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
  </el-config-provider> -->
  <!-- <div class="app-container">
    <div v-if="!networkStatus" class="network-status">No Internet</div>
    <ribbon />
    <router-view />
  </div> -->
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@use '@/assets/common/css/index';
</style>


<style scoped lang="scss">
.app-container {
  height: 100%;
}
</style>