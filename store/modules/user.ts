/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-14 20:56:23
 * @LastEditors: ZT
 * @LastEditTime: 2023-12-08 10:21:53
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { setStorage, getStorageSync, removeStorage } from "@/utils/storage";

interface UserState {
	address : string | undefined; //当前钱包连接地址
	balance : number | undefined; //当前钱包连接地址
}

export const useUserStore = defineStore({
	id: "user",
	state: () : UserState => ({
		address: getStorageSync("address") || undefined,
		balance: getStorageSync("balance") || undefined,
	}),
	getters: {
		hasAddress() : boolean {
			return this.address ? true : false;
		},
	},
	actions: {
		// 钱包地址
		SET_ADDRESS(address : string) {
			this.address = address || undefined;
			setStorage("address", address);
		},
		// 余额
		SET_BALANCE(balance : number) {
			this.balance = balance || undefined;
			setStorage("balance", balance);
		},
		// 钱包退出操作
		disconnectWallet() {
			this.address = undefined;
			this.balance = undefined;
			removeStorage("address");
			removeStorage("balance");
		},
	},
});

export function useUserStoreWithOut() {
	return useUserStore(store);
}