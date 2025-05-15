/*
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-05-25 16:17:01
 * @LastEditors: 言棠
 * @LastEditTime: 2022-06-26 19:33:14
 */
import { http } from 'uview-plus'
import { useAppStoreWithOut } from '@/store/modules/app';
import { useUserStoreWithOut } from '@/store/modules/user';
import { getStorageSync } from "@/utils/storage";

// const baseURL : any = 'http://192.168.1.32:10589';
const baseURL : any = 'http://192.168.0.106:12345';

// 创建请求实例
const initRequest = (vm) => {
	http.setConfig((defaultConfig) => {
		/* defaultConfig 为默认全局配置 */
		defaultConfig.baseURL = baseURL /* 根域名 */
		return defaultConfig
	});

	// 请求拦截器
	http.interceptors.request.use((config : any) => {
		// JWT鉴权处理
		const useAppStore = useAppStoreWithOut();
		const useUserStore = useUserStoreWithOut();
		config.header["Accept-Language"] = useAppStore.language;

		if (useUserStore.hasAddress) {
			config.header["Authorization"] = getStorageSync(useUserStore.address);
		}
		return config
	}, (error : any) => {
		// 对请求错误做些什么
		console.log('发请求错误', error)
		return Promise.reject(error)
	});

	// 响应拦截器
	http.interceptors.response.use((response : any) => {
		const res : any = response.data;
		if (res.code == 200) {
			return res
		} else {
			showError(res)
			return Promise.reject(res)
		}
	}, (error : any) => {
		console.log(error) // for debug
		const badMessage : any = error.msg || error
		const code = parseInt(badMessage.toString().replace('Error: Request failed with status code ', ''))
		showError({ code, message: badMessage })
		return Promise.reject(error)
	})
};

// 错误处理
function showError(error : any) {
	switch (error.code) {
		case '401'://令牌过期
			console.log('令牌过期')
			break;
		default:
			console.warn(error.msg || error.message || `后端接口${error.code}异常`);
			break;
	}
}

export {
	initRequest
}