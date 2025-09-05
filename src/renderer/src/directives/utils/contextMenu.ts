/**
 * ContextMenu Directive
 */

import {
  App,
  DirectiveBinding,
  createVNode,
  render,
  ComponentPublicInstance,
  ObjectDirective,
  VNodeProps
} from 'vue'

import ContextMenu from '@components/ContextMenu/index.vue'
import { getPosInfo } from '@components/ContextMenu/index'
import type { ContextMenuOptions } from '@components/ContextMenu/types'

ContextMenu.install = (app: App): void => {
  app.component(ContextMenu.name as string, ContextMenu)
}

const CustomContextMenu = (options: ContextMenuOptions) => {
  const className = '__context__menu__container'
  let container: HTMLElement = document.createElement('div')
  if (document.querySelector(`.${className}`)) {
    container = document.querySelector(`.${className}`) as HTMLElement
    // If an old instance was displayed in the document already, remove it first.
    document.body.removeChild(container)
  }

  container = document.createElement('div')

  container.className = className

  const vmm = createVNode(ContextMenu, options as VNodeProps, null)
  render(vmm, container)
  document.body.appendChild(container)
  return vmm.component?.proxy as ComponentPublicInstance<typeof ContextMenu>
}

type ContextMenuListenFn = (e: MouseEvent) => void

let ContextMenuCtx: any = null

let contextMenuEvent: ContextMenuListenFn

const vContextMenu: ObjectDirective = {
  // called before bound element's attributes
  // or event listeners are applied
  // created(el: HTMLElement, binding: DirectiveBinding) {
  // },
  // // called right before the element is inserted into the DOM.
  // beforeMount(el, binding, vnode, prevVnode) {
  // },
  // called when the bound element's parent component
  // and all its children are mounted.
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    if (value) {
      el.removeEventListener('contextmenu', contextMenuEvent)
      contextMenuEvent = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const { x, y, clientY } = e
        const { displayX, displayY, direction } = getPosInfo(x, y, clientY, value)

        ContextMenuCtx = CustomContextMenu({
          el,
          ...value,
          x: displayX,
          y: displayY,
          direction
        })

        const closeEvent = (ev: MouseEvent | TouchEvent | Event) => {
          ev.stopPropagation()
          ev.preventDefault()
          el.removeEventListener('pointerdown', closeEvent)
          document.body.removeEventListener('pointerdown', closeEvent)

          const parentNode = document.querySelector('.__context__menu__container') as Node
          parentNode && document.body.removeChild(parentNode)
        }

        setTimeout(() => {
          el.addEventListener('pointerdown', closeEvent)
          document.body.addEventListener('pointerdown', closeEvent)
        }, 200)
      }

      el.addEventListener('contextmenu', contextMenuEvent)
    } else {
      throw new Error('At least set one menu item!')
      // console.error('At least set one menu item!');
    }
  },
  // // called before the parent component is updated
  beforeUpdate(el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value) {
      return
    }

    if (!binding.value.useUpdate) {
      return
    }
    const { value } = binding
    if (value) {
      el.removeEventListener('contextmenu', contextMenuEvent)
      contextMenuEvent = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const { x, y, clientY } = e
        const { displayX, displayY, direction } = getPosInfo(x, y, clientY, value)
        ContextMenuCtx = null

        ContextMenuCtx = CustomContextMenu({
          el,
          ...value,
          x: displayX,
          y: displayY,
          direction
        })

        ContextMenuCtx.$forceUpdate()

        const closeEvent = (ev: MouseEvent | TouchEvent | Event) => {
          ev.stopPropagation()
          ev.preventDefault()

          el.removeEventListener('pointerdown', closeEvent)
          document.body.removeEventListener('pointerdown', closeEvent)
          // ContextMenuCtx.close();
          const parentNode = document.querySelector('.__context__menu__container') as Node
          parentNode && document.body.removeChild(parentNode)
        }

        setTimeout(() => {
          el.addEventListener('pointerdown', closeEvent)
          document.body.addEventListener('pointerdown', closeEvent)
        }, 200)
      }

      el.addEventListener('contextmenu', contextMenuEvent)
    } else {
      throw new Error('At least set one menu item!')
      // console.error('At least set one menu item!');
    }
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('contextmenu', contextMenuEvent)
  }
}

export default vContextMenu
