/*
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-18 15:23:57
 * @LastEditors: 言棠
 * @LastEditTime: 2022-07-03 15:14:05
 */
import type { App } from "vue";
import { createI18n } from 'vue-i18n' // import from runtime only

// User defined lang
import en from './en.json'
import zh from './zh.json'
import { useAppStoreWithOut } from '@/store/modules/app';

const useAppStore = useAppStoreWithOut();

export const messages = {
	en: en,
	zh: zh,
}

let i18nConfig = {
	locale: useAppStore.language,
	messages,
	fallbackLocale: 'en',
}

const i18n = createI18n(i18nConfig)

export { i18n };