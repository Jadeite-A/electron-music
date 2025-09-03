import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/src/dark/css-vars.scss'
// import '@/assets/common/iconfont/iconfont.css';

import ContextMenuCtx from '@components/ContextMenu/index.vue'
import stores from '@/stores'
import { getPosInfo } from '@components/ContextMenu/index'

const ContextMenu = (options: Record<string, any>) => {
  return new Promise(() => {
    const { x, y, clientY } = options
    const { displayX, displayY, direction } = getPosInfo(x, y, clientY, options)
    const ContextMenuInstance = createApp(ContextMenuCtx, {
      ...options,
      x: displayX,
      y: displayY,

      direction: direction
    })
      .use(stores)
      .use(ElementPlus)

    // Unmount the component
    const unmount = () => {
      ContextMenuInstance.unmount()

      const container = document.querySelector('.__context__menu__container')
      container?.remove()
      document.body.removeEventListener('pointerdown', unmount)
    }

    // A parent node is automatically created to contain the component.
    const parentNode = document.createElement('div')
    parentNode.className = '__context__menu__container'

    // Add the parent node to body.
    document.body.appendChild(parentNode)

    document.body.addEventListener('pointerdown', unmount)

    // Mount this component to parent node.
    ContextMenuInstance.mount(parentNode)
  })
}

export default ContextMenu
