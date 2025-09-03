import { ObjectDirective, h } from 'vue'
import { ElPopover, ElConfigProvider } from 'element-plus'
import app from '@/main'
import directives from '../index'

const createPopover = (el, binding) => {
  // 获取渲染内容及配置项
  let popoverContent = ''
  let popoverOptions: Record<string, any> = {}
  let popperClass = 'default-pop'
  if (el._popoverUnmount) {
    el._popoverUnmount()
  }
  if (typeof binding.value === 'object') {
    const { content, component, options } = binding.value
    popoverContent = content || component
    popoverOptions = {
      ...options,
      'popper-class': options?.['popper-class']
        ? (popperClass += ` ${options['popper-class']}`)
        : popperClass
    }
  } else if (typeof binding.value === 'string') {
    popoverContent = binding.value
  }

  if (!popoverContent) {
    return
  }
  if (!el.popoverInstance) {
    const popoverApp = createApp({
      setup() {
        // 假设我们要动态修改弹出框的内容
        const content = ref(popoverContent)
        const disabled = ref(popoverOptions.disabled)

        const disabledProvide = (value: boolean) => {
          disabled.value = value // 更新内容
        }

        const updateContent = (newContent) => {
          content.value = newContent // 更新内容
        }

        return {
          content,
          disabled,
          updateContent,
          disabledProvide
        }
      },
      render() {
        return h(
          ElConfigProvider,
          { namespace: 'lx' },
          {
            default: () =>
              h(
                ElPopover,
                {
                  trigger: 'hover',
                  'show-after': 300,
                  width: 'auto',
                  teleported: false,
                  virtualRef: el,
                  virtualTriggering: true,
                  placement: binding?.arg ?? 'top',
                  ...popoverOptions,
                  disabled: this.disabled,
                  visible: true
                },
                {
                  default: () => {
                    if (typeof binding.value === 'object' && binding.value.component) {
                      return h(this.content)
                    }
                    return h('span', { innerHTML: this.content })
                  }
                }
              )
          }
        )
      }
    })

    if (app) {
      // 从当前实例的上下文中获取全局组件
      const globalComponents = app._context.components

      // 注册全局组件到新应用实例
      Object.entries(globalComponents).forEach(([name, component]) => {
        popoverApp.component(name, component)
      })

      directives.install(popoverApp)
    }

    const popoverContainer = document.createElement('div')
    popoverContainer.classList.add('helper-tip-container')
    document.body.appendChild(popoverContainer)
    const popoverInstance = popoverApp.mount(popoverContainer)
    el.popoverInstance = popoverInstance
    // render(popoverVNode, container);
    // el._popoverCleanup = () => {
    // popoverContainer && document.body.removeChild(popoverContainer);
    // };

    el._popoverUnmount = () => {
      el.popoverInstance = null
      popoverApp.unmount()
      popoverContainer &&
        document.body.contains(popoverContainer) &&
        document.body.removeChild(popoverContainer)
    }
  } else {
    el.popoverInstance.disabledProvide(!!binding.value.options?.disabled)
    el.popoverInstance.updateContent(popoverContent)
  }
}

const registerHoverEvent = (el, binding) => {
  const onEnter = () => {
    createPopover(el, binding)
  }
  const onLeave = () => {
    const unmount = el._popoverUnmount
    el._popoverUnmount = null
    unmount && unmount()
  }
  el.addEventListener('mouseenter', onEnter)
  el.addEventListener('mouseleave', onLeave)
  el.__hoverEnter__ = onEnter
  el.__hoverLeave__ = onLeave
}

const removeHoverEvent = (el) => {
  el.removeEventListener('mouseenter', el.__hoverEnter__)
  el.removeEventListener('mouseleave', el.__hoverLeave__)
  delete el.__hoverEnter__
  delete el.__hoverLeave__
}

const helperTip: ObjectDirective = {
  updated: (el, binding) => {
    if (
      !binding.value ||
      (typeof binding.value !== 'string' && !binding.value.component && !binding.value.content)
    ) {
      // 如果没传值，卸载弹出窗
      if (el._popoverUnmount) {
        el._popoverUnmount()
        el._popoverUnmount = null
      }
      removeHoverEvent(el)
      return
    }
    removeHoverEvent(el)
    registerHoverEvent(el, binding)
  },

  mounted: (el: any, binding: any) => {
    registerHoverEvent(el, binding)
    // el.addEventListener('click', () => {
    //   if (el._popoverHidden) {
    //     el._popoverHidden();
    //   }
    // });
  },
  beforeUnmount(el) {
    el._popoverUnmount && el._popoverUnmount()
    el.popoverInstance = null
    el.removeEventListener('mouseenter', el.__hoverEnter__)
    el.removeEventListener('mouseleave', el.__hoverLeave__)
    delete el.__hoverEnter__
    delete el.__hoverLeave__
  }
}

export default helperTip
