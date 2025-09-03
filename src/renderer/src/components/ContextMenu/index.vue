<template>
  <teleport
    :to="props.teleport"
    :disabled="!props.teleport"
  >
    <div
      v-bind="$attrs"
      ref="contextMenu"
      class="context-menu-layer"
      :class="{ menuScroll: options?.menuItems.length > 20 }"
    >
      <ul
        v-if="options.visible && options.menuItems && options.menuItems.length"
        class="menu-list"
      >
        <template
          v-for="(item, index) in options.menuItems"
          :key="index"
        >
          <!-- Separator -->
          <li
            v-if="
              item.type &&
                getShowStatus(item) &&
                (index !== 0 || index !== options.menuItems.length - 1)
            "
            class="separator"
          />
          <!-- Menu Item -->
          <li
            v-if="item.label && getShowStatus(item)"
            :key="(item.value || item.label) + index"
            class="menu-item"
            :class="{
              disabled: item.disabled,
              actived: item.subActived
            }"
            @pointerdown.stop.prevent="handleMenuClick(item)"
            @mouseenter="(e)=>onMouseEnter(e,item)"
            @mouseleave="omMouseLeave"
          >
            <template v-if="options.useIcon">
              <svg-icon
                v-if="item.svgIcon?.iconClass"
                class="menu-icon"
                :icon-class="item.svgIcon.iconClass"
                :size="item.svgIcon.size"
                :color="item.svgIcon.color"
              />
              <i
                v-if="item.icon"
                class="icon lx-icon menu-icon"
                :class="[item.icon]"
              />
            </template>
            <span
              class="menu-label"
              :title="item.label"
            >
              {{ item.label }}
            </span>

            <!-- Sub-Menu -->
            <template v-if="item.subItems && item.subItems.length && item.subItems.find(item=> item?.show ?? true)">
              <i
                class="lx-icon lx-icon-right"
                :class="{
                  'menu-icon__sub_right': props.direction === 'right',
                  'menu-icon__sub_left': props.direction === 'left'
                }"
              />
              <lxContextMenu
                v-if="item.subActived"
                class="sub-menu"
                :style="{
                  [props.direction === 'right' ? 'left' : 'right']: '100%',
                  top: item.offsetTop ? `${item.offsetTop}px` : '-6px'
                }"
                :menu-items="item.subItems"
                :use-icon="options.useIcon"
                :visible="true"
                :use-defaults-all="false"
                :direction="props.direction"
              />
            </template>
          </li>
        </template>
      </ul>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import Lodash from 'lodash';

defineOptions({
  name: 'LxContextMenu'
});

interface MenuItem {
  type?:string
  label: string
  value?: string
  icon?: string
  svgIcon?: any
  disabled?: boolean
  height?: string
  show?: boolean
  subItems?: Array<MenuItem>
  subActived?: boolean,
  offsetTop?: number,
  click?: () => void
}

interface ContextMenuOptions {
  visible?: boolean
  useUpdate?: boolean
  menuItems: Array<MenuItem>
  useIcon?: boolean
  useDefaultsAll?: boolean
  useDefaults?: string[]
  direction?: string
  teleport?: string | HTMLElement
  x?: number
  y?: number
}

const contextMenu = ref({});

const props = withDefaults(defineProps<ContextMenuOptions>(), {
  visible: false,
  useDefaultsAll: true,
  useIcon: true,
  useUpdate: false,
  menuItems: () => [],
  useDefaults: () => [],
  direction: undefined,
  teleport: undefined,
  x: undefined,
  y: undefined
});

// Get show status
const getShowStatus = (item: MenuItem) => {
  if (!Reflect.has(item, 'show')) {
    return true;
  }

  return item.show;
};

const handleMenuClick = (item: MenuItem) => {
  if (item.disabled) {
    return;
  }
  if (item.click && typeof item.click === 'function') {
    item.click();
  }

  // Destory instance and remove body click handle.
  close();
  document.body.onclick = null;
};

const defaultsItems: Array<MenuItem> = [
  {
    label: '复制',
    value: 'copy',
    icon: 'lx-icon-fuzhi',
    show: true,
    click: () => {
      document.execCommand('copy');
    }
  },
  {
    label: '粘贴',
    value: 'paste',
    icon: 'lx-icon-niantie',
    show: true,
    click: () => {
      document.execCommand('paste');
    }
  }
];

const options = reactive<ContextMenuOptions>(Lodash.merge({}, props as ContextMenuOptions));

if (options.useDefaultsAll || (options.useDefaults && options.useDefaults.length)) {
  let _defaults: Array<MenuItem> = [];

  if (options.useDefaultsAll) {
    _defaults = defaultsItems;
  } else {
    _defaults = defaultsItems.filter(({ value }) => value && options.useDefaults?.includes(value));
  }

  options.menuItems = [..._defaults, ...options.menuItems!];
}

const show = (x: number = props.x as number, y: number = props.y as number) => {
  const rawElement = contextMenu.value as HTMLElement;
  rawElement.style.left = x + 'px';
  rawElement.style.top = y + 'px';

  options.visible = true;

};
const close = () => {
  options.visible = false;

  const parentNode = document.querySelector('.__context__menu__container') as Node;
  parentNode && document.body.removeChild(parentNode);
};


const debounceTimer = ref();
const onMouseEnter = (e,menuItem: MenuItem) => {

  if (menuItem.disabled) return;

  // 先清除旧的防抖（避免快速切换 li）
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => {
    hoverEventHandler(e,menuItem);
  }, 100);
};

const omMouseLeave = () => {
  clearTimeout(debounceTimer.value);
};

const hoverEventHandler = (e,menuItem: MenuItem) => {
  if(menuItem.subItems?.length){
    //计算子菜单渲染的底部位置，做边界检测。超出则偏移回来保证全部展示
    const {top} = e.target.getBoundingClientRect();
    const subBottom = menuItem.subItems?.length * 24 + 10 + top;
    menuItem.offsetTop = subBottom > window.innerHeight ? window.innerHeight-subBottom-20 : -6;
  }

  options.menuItems!.forEach((_menuItem) => _menuItem.subActived = false);
  menuItem.subItems && menuItem.subItems.length && (menuItem.subActived = true);
};

onMounted(() => {
  show();
});

defineExpose({
  show,
  close
});
</script>

<style scoped lang="scss">
@use './index';
</style>
