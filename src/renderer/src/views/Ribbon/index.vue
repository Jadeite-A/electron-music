<template>
  <div class="ribbon-container">
    <div
      v-for="(item, index) in options"
      :key="item.name"
      class="ribbon-item"
      :class="{
        'is-active': active === index
      }"
      @click="active = index"
    >
      <div class="svg-container"></div>
      <div class="label">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import Lodash from 'lodash';
import Constant from './data'

const props = defineProps<{
  type: string
}>();

// const options = reactive(Constant[props.type])
const options = computed(() => Constant[props.type] ?? []);

const active = defineModel<number>({
  required: false,
  default: 0
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
