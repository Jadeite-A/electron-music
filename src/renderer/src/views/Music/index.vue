<template>
  <div class="music-index">
    <ribbon
      v-model="current"
      type="music"
    />
    <download-music v-if="current === 1" />
    <template v-else>{{ current }}</template>
    
  </div>
</template>

<script setup lang="ts">

const current = ref(0);

</script>

<style scoped lang="scss">
@use './index.scss';

.music-index {
  height: 100%;

  padding: 10px;
}
</style>
