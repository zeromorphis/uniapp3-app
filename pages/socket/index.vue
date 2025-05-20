<!-- pages/page-a.vue -->
<template>
	<view class="container">
		<text>Page A 收到：{{ msg }}</text>
		<button @tap="sendMsg">发送消息</button>
	</view>
</template>

<script lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import { onLoad, onShow,onUnload, onHide, onPullDownRefresh } from "@dcloudio/uni-app";
	import { useSocketStoreWithOut } from '@/store/modules/socket';
	export default {
		setup() {

			const useSocketStore = useSocketStoreWithOut();

			const msg = ref('');
			
			onMounted(() => {
				useSocketStore.initSocket('wss://echo.websocket.org')
			
				useSocketStore.onMessage((msg) => {
					console.log('📩 收到消息:', msg)
					msg.value = JSON.stringify(msg)
				})
			});
			
			const sendMsg = () => {
				useSocketStore.send({ page: 'A', text: 'Hello from Page A' });
			};
			
			onBeforeUnmount(() => {
				// 可选：如果你希望在页面销毁时关闭连接
				// useSocketStore.close();
			});
			
			onUnload(() => {
				useSocketStore.close();
			});
			
			return {
				msg,
				sendMsg,
			}
		}
	}
</script>