import App from './App'
import { createSSRApp } from 'vue'
import { store } from './store'
import { i18n } from './locale'
import { initRequest } from './utils/request'
import uviewPlus from 'uview-plus'
import './uni.promisify.adaptor'

export function createApp() {
	
	const app = createSSRApp(App)
	
	app.use(store)         // Pinia 状态管理
	app.use(i18n)          // 国际化配置
	app.use(uviewPlus)     // UI 框架
	initRequest(app)       // 拦截器配置
	return {
		app
	}
}