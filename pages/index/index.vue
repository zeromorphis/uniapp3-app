<template>
	<view class="container">
		<view class="navbar">
			<view class="navbar-wrap">
				<view class="left">
					<image src="@/static/image/home/logo.png" mode="heightFix"></image>
				</view>
				<view class="right" @click="onLocaleChange()">
					<text class="text">{{t('home.language')}}</text>
					<image src="@/static/image/home/switch.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="exhibition-board">
			<up-button @click="gotoSocketFun()" type="primary" text="socket"></up-button>
		</view>
		<view class="exhibition-board">
			<up-button @click="throttleFun()" type="primary" text="throttle节流"></up-button>
		</view>
		<view class="exhibition-board">
			<up-button @click="debounceFun()" type="primary" text="debounce防抖"></up-button>
		</view>
		<view class="exhibition-board">
			<up-button @click="loginFun()" type="primary" text="登录"></up-button>
		</view>
		<view v-if="isLoginWallet" class="exhibition-board">
			<up-button @click="disConnectWalletFun()" type="primary" :text="t('home.disconnect')"></up-button>
		</view>
		<view v-if="!isLoginWallet" class="exhibition-board">
			<up-button @click="connectWalletFun()" type="primary" :text="t('home.connect')"></up-button>
		</view>
		<view class="exhibition-board">
			<view class="num-box">
				<view class="top-box">
					<view class="code-wrap">
						<view class="tit">{{t('home.address')}}</view>
						<view class="code">{{ interceptStr(address,8)}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="exhibition-board">
			<view class="num-box">
				<view class="top-box">
					<view class="code-wrap">
						<view class="tit">{{t('home.balance')}}</view>
						<view class="code">{{ interceptDecimal(balance,12)}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive, computed, watch, toRefs, onBeforeMount, onMounted } from 'vue';
	import { onLoad, onShow, onHide, onPullDownRefresh } from "@dcloudio/uni-app";
	import { useAppStoreWithOut } from '@/store/modules/app';
	import { useUserStoreWithOut } from '@/store/modules/user';
	import { interceptStr, interceptDecimal } from '@/utils/tools';
	import { useI18n } from 'vue-i18n';
	import { throttle, debounce } from 'uview-plus';
	import { loginApi } from "@/api/user";
	import sdk from "@/sdk/chainweb3";
	
	sdk.chainWeb3.networkListening();

	const { t, locale } = useI18n();
	const userStore = useUserStoreWithOut();
	const appStore = useAppStoreWithOut();
	const isLoginWallet = computed<boolean>(() => userStore.hasAddress);
	const address = computed<string | undefined>(() => userStore.address);
	const balance = computed<number | undefined>(() => userStore.balance);

	const gotoSocketFun = () => {
		uni.navigateTo({
			url: '/pages/socket/index'
		});
	};

	// 节流，规定时间内，只触发一次，如果immediate为true，那么就会在第一次操作 触发回调，如果为false，就会在第5次操作触发回调。
	const throttleFun = () => {
		throttle(() => {
			console.log('节流');
		}, 2000, true)
	};

	// 防抖，在连续的操作中，无论进行了多长时间，只有某一次的操作后在指定的时间内没有再操作，这一次才被判定有效
	const debounceFun = () => {
		debounce(() => {
			console.log('防抖');
		}, 2000, false)
	};

	const loginFun = () => {
		const data = {
			username: 'YTZ',
			password: '123456'
		};
		loginApi(data).then((res : any) => {
			console.log(res);
		}).catch((err : any) => {
			console.error(err);
		});
	};

	// 钱包连接操作
	const connectWalletFun = async () => {
		await sdk.chainWeb3.connectWallet();
	}

	// 钱包断开操作
	const disConnectWalletFun = async () => {
		await sdk.chainWeb3.disconnectWallet();
	};

	// 多语言切换
	const onLocaleChange = async () => {
		if (appStore.language == 'en') {
			appStore.SET_LANGUAGE('zh');
			locale.value = 'zh';
			return
		}
		if (appStore.language == 'zh') {
			appStore.SET_LANGUAGE('en');
			locale.value = 'en';
			return
		}
	};

	// 监听是否连接了钱包，连接就初始化合约信息
	watch(() => userStore.hasAddress, async (newValue : any) => {
		console.log('APP-钱包是否连接：', newValue ? '是' : "否")
	}, { immediate: false, deep: false });

	onPullDownRefresh(() => {
		// // 处理刷新逻辑，例如重新获取数据
	});
</script>

<style lang="scss">
	.container {
		padding-top: 88rpx;

		.navbar {
			width: 100%;
			height: 88rpx;
			background: #F0F4FF;
			position: fixed;
			top: 0;
			z-index: 10;

			.navbar-wrap {
				height: 100%;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left,
				.right {
					display: flex;
					align-items: center;

					image {
						height: 60rpx;
					}
				}

				.right {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;
					line-height: 34rpx;

					image {
						width: 36rpx;
						margin-left: 12rpx;
					}
				}
			}

		}

		.exhibition-board {
			padding: 24rpx 20rpx 0;

			.num-box {
				background-image: url(@/static/image/home/bgi1.png);
				background-position: center center;
				background-size: cover;
				border-radius: 16rpx;
				padding: 30rpx;

				.top-box {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.code-wrap {
						display: flex;
						align-items: center;

						.tit {
							font-family: PingFang SC, PingFang SC;
							font-weight: 400;
							font-size: 24rpx;
							color: #FFFFFF;
							line-height: 34rpx;
							margin-right: 34rpx;
							opacity: 0.6;
						}

						.code {
							font-family: PingFang SC, PingFang SC;
							font-weight: bold;
							font-size: 40rpx;
							color: #FFFFFF;
							line-height: 56rpx;
						}
					}
				}
			}
		}

	}
</style>