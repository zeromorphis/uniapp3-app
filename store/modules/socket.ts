import { defineStore } from 'pinia'
import { store } from '@/store'

type MessageHandler = (data: any) => void

export const useSocketStore = defineStore('socket', {
  state: () => ({
    url: '' as string,
    isConnected: false,
    socketTask: null as UniApp.SocketTask | null,
    reconnectTimer: null as ReturnType<typeof setTimeout> | null,
    messageHandler: null as MessageHandler | null,
  }),

  actions: {
    initSocket(url: string) {
      if (this.isConnected) return
      this.url = url

      // 建立连接
      this.socketTask = uni.connectSocket({ url })

      uni.onSocketOpen(() => {
        console.log('✅ WebSocket 连接成功')
        this.isConnected = true
        this.clearReconnect()
      })

      uni.onSocketMessage((res) => {
        try {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          this.messageHandler?.(data)
        } catch (e) {
          console.warn('❗消息解析失败', res.data)
        }
      })

      uni.onSocketClose(() => {
        console.warn('⚠️ WebSocket 连接关闭')
        this.isConnected = false
        this.tryReconnect()
      })

      uni.onSocketError((err) => {
        console.error('❌ WebSocket 错误', err)
        this.isConnected = false
        this.tryReconnect()
      })
    },

    send(data: any) {
      const payload = JSON.stringify(data)

      if (this.isConnected) {
        if (this.socketTask && typeof this.socketTask.send === 'function') {
          this.socketTask.send({ data: payload })
        } else {
          uni.sendSocketMessage({ data: payload })
        }
      } else {
        console.warn('⛔ WebSocket 未连接，发送失败')
      }
    },

    onMessage(handler: MessageHandler) {
      this.messageHandler = handler
    },

    close() {
      this.clearReconnect()
      this.isConnected = false
      this.socketTask = null
      uni.closeSocket()
    },

    tryReconnect() {
      if (this.reconnectTimer || !this.url) return
      console.log('🔁 尝试重连中...')
      this.reconnectTimer = setTimeout(() => {
        this.initSocket(this.url)
      }, 3000)
    },

    clearReconnect() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    }
  }
})

export function useSocketStoreWithOut() {
  return useSocketStore(store)
}
