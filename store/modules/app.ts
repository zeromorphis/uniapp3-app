/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-14 20:56:23
 * @LastEditors: ZT
 * @LastEditTime: 2023-12-08 14:29:27
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { setStorage } from "@/utils/storage";

interface AppState {
	language : string | undefined;
}

export const useAppStore = defineStore("app", {
	state: () : AppState => {
		return { 
			language: 'en',
		}
	},
	actions: {
		SET_LANGUAGE(language : string) {
			this.language = language || undefined;
			setStorage("language", language);
		},
	},
});

export function useAppStoreWithOut() {
	return useAppStore(store);
}