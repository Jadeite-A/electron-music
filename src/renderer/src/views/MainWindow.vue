<template>
  <div v-if="networkStatus" class="network-status" @mousedown.stop="() => false" >No Internet</div>
</template>
<script setup lang="ts">


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
