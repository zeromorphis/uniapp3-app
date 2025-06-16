<!--
 * @Author: YT
 * @Date: 2025-05-20 12:04:01
 * @LastEditors: YT
 * @LastEditTime: 2025-06-16 15:07:24
 * @Description: 当时只道是寻常
 * @FilePath: \start\uniapp3-app\pages\socket\index.vue
-->
<template>
	<view class="container" style="padding: 20px;">
		<text style="font-weight: bold;">WebSocket 状态: {{ isConnected ? '已连接' : '未连接' }}</text>
		<text style="margin-top: 10px;">收到消息: {{ msgData.message }}</text>
		<text style="margin-top: 10px;">收到消息1: {{ msgData.message1 }}</text>
		<text style="margin-top: 10px;">收到消息2: {{ msgData.message2 }}</text>
		<up-button @tap="sendTestMsg" style="margin-top: 10px;" type="primary">发送测试消息</up-button>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import { onLoad, onUnload } from "@dcloudio/uni-app";
	import { useSocketStoreWithOut } from '@/store/modules/socket'

	const socketStore = useSocketStoreWithOut()

	const isConnected = ref(false);//WebSocket连接状态
	const msgData = reactive({
		message:'暂无消息',
		message1:'暂无消息',
		message2:'暂无消息',
	})

	// 监听 WebSocket 事件
	function setupSocketListeners() {
		socketStore.on('open', () => {
			console.log('✅ WebSocket 连接成功')
			isConnected.value = true
		})
		socketStore.on('close', () => {
			console.warn('⚠️ WebSocket 连接关闭')
			isConnected.value = false
		})
		socketStore.on('error', (err) => {
			console.error('❌ WebSocket 连接错误', err)
			isConnected.value = false
		})
		socketStore.on('message', (data) => {
			console.log('📩 收到消息:', data)
			if (typeof data === 'object' && data.text) {
				msgData.message = data.text
			} else {
				msgData.message = JSON.stringify(data)
			}
		})
		socketStore.on("chatMessage1", (data) => {
			console.log(`${data.user} 说: ${data.text}`);
			if (typeof data === 'object' && data.text) {
				msgData.message1 = `${data.user} 说: ${data.text}`
			} else {
				msgData.message1 = JSON.stringify(data)
			}
		});
		socketStore.on("chatMessage2", (data) => {
			console.log(`${data.user} 说: ${data.text}`);
			if (typeof data === 'object' && data.text) {
				msgData.message2 = `${data.user} 说: ${data.text}`
			} else {
				msgData.message2 = JSON.stringify(data)
			}
		});
	}

	function sendTestMsg() {
		if (!isConnected.value) {
			console.warn('⛔ WebSocket 未连接，不能发送消息')
			return
		}
		socketStore.send({ text: 'Hello from Page Socket', timestamp: Date.now() })
		socketStore.emit("chatMessage1", { user: "张三", text: "你好！哈哈哈" })
		socketStore.emit("chatMessage2", { user: "李四", text: "你好！啊啊啊" })
	}

	// 页面挂载时初始化连接，并启动心跳检测，默认心跳30秒一次
	onLoad(() => {
		socketStore.initSocket('wss://echo.websocket.org', true, 10000)
		setupSocketListeners()
	});

	// 页面卸载时关闭连接并停止心跳
	onUnload(() => {
		socketStore.close()
	})
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
	}

	button {
		background-color: #007AFF;
		color: white;
		padding: 10px;
		border-radius: 6px;
	}
</style>