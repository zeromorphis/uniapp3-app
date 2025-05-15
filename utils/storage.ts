/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 人人都说顶峰相见，路边的水沟人满为患
 * @Date: 2022-04-15 09:38:02
 * @LastEditTime: 2022-06-26 18:24:38
 */
// 存local-异步
const setStorage = (key: string, value: any) => {
	return uni.setStorage({
		key: key,
		data: value,
		success: (success: any) => {
			return success;
		},
		fail: (error: any) => {
			return error;
		},
	});
};
// 取local-异步
const getStorage = (key: string): any => {
	return uni.getStorage({
		key: key,
		success: (success: any) => {
			return success;
		},
		fail: (error: any) => {
			return error;
		},
	});
};
// 删local-异步
const removeStorage = (key: string): any => {
	return uni.removeStorage({
		key: key,
		success: (success: any) => {
			return success;
		},
		fail: (error: any) => {
			return error;
		},
	});
};
// 清空local-异步
const clearStorage = (): any => {
	return uni.clearStorage();
};
// 异步获取当前 storage 的相关信息
const getStorageInfo = (): any => {
	return uni.getStorageInfo({
		success: (success: any) => {
			return success;
		},
		fail: (error: any) => {
			return error;
		},
	});
};


// 存local-同步
const setStorageSync = (key: string, value: any) => {
	try {
		return uni.setStorageSync(key, value);
	} catch (e) {
		return e;
	}
};
// 取local-同步
const getStorageSync = (key: string): any => {
	try {
		return uni.getStorageSync(key);
	} catch (e) {
		return e;
	}
};
// 删local-同步
const removeStorageSync = (key: string): any => {
	try {
		return uni.removeStorageSync(key);
	} catch (e) {
		return e;
	}
};
// 清空local-同步
const clearStorageSync = (): any => {
	try {
		return uni.clearStorageSync();
	} catch (e) {
		return e;
	}
};
// 同步获取当前 storage 的相关信息
const getStorageInfoSync = (): any => {
	try {
		return uni.getStorageInfoSync();
	} catch (e) {
		return e;
	}
};


export {
	// 异步
	setStorage,
	getStorage,
	removeStorage,
	clearStorage,
	getStorageInfo,
	// 同步
	setStorageSync,
	getStorageSync,
	removeStorageSync,
	clearStorageSync,
	getStorageInfoSync,
}