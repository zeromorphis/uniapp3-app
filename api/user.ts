/*
 * @Descripttion: YT
 * @version: 1.0.0
 * @Author: 言棠
 * @Date: 2021-12-30 17:13:17
 * @LastEditors: 言棠
 * @LastEditTime: 2022-06-26 19:40:29
 */
import { http } from 'uview-plus'

enum Api {
	registerInitMember = "/membeService/member/initMember",
	getTeamInfo = "/membeService/member/getTeamInfo",
	createOrder = "/membeService/member/createOrder",
	getUserInfo = "/membeService/member/getUserInfo",
}



export function loginApi(params : any) {
	return http.post(
		'/auth/login',
		params
	)
}

/** 邀请注册api */
export function registerInitMemberApi(params : any) {
	return http.post(
		Api.registerInitMember,
		params
	)
}

/** 获取用户信息api */
export function getTeamInfoApi() {
	return http.get(
		Api.getTeamInfo,
	)
}

/** 购买api */
export function createOrderApi(params : any) {
	return http.post(
		Api.createOrder,
		params
	)
}

/** 购买api */
export function getUserInfoApi(data : any) {
	return http.get(
		Api.getUserInfo,
		data
	)
}