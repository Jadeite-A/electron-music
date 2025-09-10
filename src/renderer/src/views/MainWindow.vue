<template>
  <div class="main-container">
    <div v-if="!networkStatus" class="network-status">No Internet</div>
    <div class="custom-tabs-header">
      <div
        v-for="tab in mainCategory.options"
        :key="tab.name"
        class="custom-tab-item"
        :class="{ 'is-active': tab.name === mainCategory.active }"
        @click="() => handleTabChange(tab)"
      >
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </div>
    <div class="tab-content"><router-view /></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter();

const mainCategory = reactive({
  active: 1,
  options: [
    {
      name: 1,
      path: '/',
      label: '音乐'
    },
    {
      name: 2,
      path: '/video',
      label: '视频'
    },
    {
      name: 3,
      path: '/settings',
      label: '设置'
    }
  ]
})

const handleTabChange = (tab) => {
  const { name, path } = tab;

  if (name === mainCategory.active) {
    return;
  }

  mainCategory.active = name;
  router.push(path)
};

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

<style scoped lang="scss">
@use '@/assets/common/css/variables.scss' as *;

.main-container {
  position: relative;
  z-index: 1;

  height: 100%;
  
  background-color: $color-gray-f8f8f8;

  .network-status {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;

    line-height: 50px;
    font-size: $font-size-large;

    text-align: center;
    color: $color-white;
    background: $color-danger;
  }

  .custom-tabs-header {
    display: flex;
    
    border-top: 1px solid $color-gray-ccc;
    border-bottom: 1px solid $color-gray-ccc;

    .custom-tab-item {
      position: relative;
      padding: .5em;
      min-width: 4em;

      text-align: center;

      cursor: pointer;
      border-right: 1px solid $color-gray-ccc;

      &.is-active {
        cursor: unset;
        background-color: $color-white;

        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 1px;
          background-color: $color-white;
        }
      }
    }
  }

  .tab-content {
    height: calc(100% - 30px);

    background-color: $color-white;
  }
}

</style>
