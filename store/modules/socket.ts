import { defineStore } from 'pinia'
import { store } from '@/store'

type EventHandler = (...args : any[]) => void

export const useSocketStore = defineStore('socket', {
	state: () => ({
		url: '' as string,
		socketTask: null as UniApp.SocketTask | null,
		isConnected: false,
		reconnectTimer: null as ReturnType<typeof setTimeout> | null,
		heartbeatTimer: null as ReturnType<typeof setInterval> | null,
		listeners: {} as Record<string, EventHandler[]>
	}),
	actions: {
		initSocket(url : string, enableHeartbeat = true, heartbeatInterval = 30000) {
			if (this.isConnected) {
				console.log('⚠️ WebSocket 已连接，无需重复连接')
				return
			}
			this.url = url
			console.log('🌐 尝试连接 WebSocket：', url)

			this.socketTask = uni.connectSocket({ url })

			uni.onSocketOpen(() => {
				console.log('✅ WebSocket 连接成功')
				this.isConnected = true
				this.clearReconnect()
				this.emit('open')
				if (enableHeartbeat) this.startHeartbeat(heartbeatInterval)
			})

			uni.onSocketMessage((res) => {
				let data = res.data
				try {
					if (typeof data === 'string') data = JSON.parse(data)
				} catch (e) {
					console.warn('❗消息解析失败，非JSON格式:', data)
				}
				this.emit('message', data)
			})

			uni.onSocketClose(() => {
				console.warn('⚠️ WebSocket 连接关闭')
				this.isConnected = false
				this.emit('close')
				this.tryReconnect()
				this.stopHeartbeat()
			})

			uni.onSocketError((err) => {
				console.error('❌ WebSocket 连接错误', err)
				this.isConnected = false
				this.emit('error', err)
				this.tryReconnect()
				this.stopHeartbeat()
			})
		},

		send(data : any) {
			if (!this.isConnected) {
				console.warn('⛔ WebSocket 未连接，发送失败')
				return
			}
			const json = JSON.stringify(data)
			if (this.socketTask && typeof this.socketTask.send === 'function') {
				this.socketTask.send({ data: json })
				console.log('📤 发送消息:', json)
			} else {
				uni.sendSocketMessage({ data: json })
				console.log('📤 发送消息(备用方式):', json)
			}
		},

		close() {
			console.log('🛑 关闭 WebSocket 连接')
			this.clearReconnect()
			this.stopHeartbeat()
			this.isConnected = false
			this.socketTask = null
			uni.closeSocket()
		},

		tryReconnect() {
			if (this.reconnectTimer || !this.url) return
			console.log('🔁 WebSocket 断开，尝试重连...')
			this.reconnectTimer = setTimeout(() => {
				this.initSocket(this.url)
			}, 3000)
		},

		clearReconnect() {
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer)
				this.reconnectTimer = null
			}
		},

		startHeartbeat(interval : number) {
			this.stopHeartbeat()
			console.log(`💓 开始心跳检测，每 ${interval} ms 发送一次ping`)
			this.heartbeatTimer = setInterval(() => {
				this.send({ type: 'ping', time: Date.now() })
			}, interval)
		},

		stopHeartbeat() {
			if (this.heartbeatTimer) {
				clearInterval(this.heartbeatTimer)
				this.heartbeatTimer = null
				console.log('💔 停止心跳检测')
			}
		},

		on(event : string, handler : EventHandler) {
			if (!this.listeners[event]) this.listeners[event] = []
			this.listeners[event].push(handler)
		},

		off(event : string, handler : EventHandler) {
			const list = this.listeners[event]
			if (!list) return
			const index = list.indexOf(handler)
			if (index !== -1) list.splice(index, 1)
		},

		emit(event : string, ...args : any[]) {
			const list = this.listeners[event]
			if (list) list.forEach(fn => fn(...args))
		}
	}
})

export function useSocketStoreWithOut() {
	return useSocketStore(store)
}