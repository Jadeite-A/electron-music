import { defineStore, acceptHMRUpdate } from 'pinia'
import UUID from '@utils/uuid'
import dayjs from 'dayjs'

export const useMessageStore = defineStore('useDataSetStore', {
  state: (): Record<string, any> => ({
    music: []
  }),
  getters: {
    msSuccess(state) {
      return state.music.filter((item) => item.type === 'success')
    },
    msFailure(state) {
      return state.music.filter((item) => item.type !== 'success')
    }
  },
  actions: {
    add(item, type: 'music') {
      const list = this[type]
      if (!list) {
        throw new Error(' xxxx')
      }

      const id = UUID.uuid()
      const timestamp = new Date().getTime()
      const displayTime = dayjs(timestamp).format('MM-DD HH:mm:ss')

      list.unshift({
        ...item,
        id,
        timestamp,
        displayTime
      })
    },
    clear(type: 'music') {
      const list = this[type]
      if (!list) {
        throw new Error(' xxxx')
      }
      list.length = 0
    },
    exportTo(type) {
      console.log('🐦‍🔥 导出', type)
    }
  }
})

/**
 * ===== Hot Module Replacement =====
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot))
}
