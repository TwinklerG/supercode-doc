import request from '../../utils/request'

import {USER_MODULE,MGR_USER_MODULE} from '../../api/_prefix'

// 创建用户
export function createUser(data: {
    username: string
    password: string
    email: string
    nickname: string
}) {
    return request.post(`${MGR_USER_MODULE}/create`, data)
}

//修改信息
export function changeUserData(data: {
    username: string
    email: string
    nickname: string
}) {
    return request.post(`${USER_MODULE}`, data)
}

//获取用户信息
export interface UserInfo {
    username: string;
    email: string;
    nickname: string;
    role: string;
}

interface ApiResponse<T> {
    code: number;
    msg: string | null;
    data: T | null;
}

export function getUserData() {
    return request.get<ApiResponse<UserInfo>>(`${USER_MODULE}`);
}

// 删除用户
export function deleteUser(username: string) {
    return request.delete(`${MGR_USER_MODULE}/${username}`)
}
