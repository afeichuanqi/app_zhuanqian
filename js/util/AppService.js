import http from './net/Axios';

export function sendSms(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            const ret = await http.post('user/sendSms', data);
            if (ret && ret.status == 0) {
                resolve(ret && ret.msg);
            } else {
                reject(ret && ret.msg);
            }
        } catch (error) {
            reject(error);
        }
    });


}

export function verifyCode(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            const ret = await http.post('user/verifyCode', data);
            if (ret && ret.status == 0) {
                resolve(ret && ret.data);
            } else {
                reject(ret && ret.msg);
            }
        } catch (error) {
            reject(error);
        }
    });


}

export function uploadAvatar(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/uploadAvatar', data);
            if (ret && ret.status == 0) {
                resolve(ret && ret.data);
            } else {
                reject(ret && ret.msg);
            }
        } catch (error) {
            reject(error);
        }
    });


}

export function setUserData(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/setUserData', data);
            if (ret && ret.status == 0) {
                resolve(ret && ret.data);
            } else {
                reject(ret && ret.msg);
            }
        } catch (error) {
            reject(error);
        }
    });


}

export function getUserInfo(token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setGetHeader('token', token);
            const ret = await http.get('user/getUserInfo');
            if (ret && ret.status == 0) {
                resolve(ret && ret);
            } else if (ret.status == 403) {
                resolve(ret && ret);
            } else {
                reject(ret && ret.msg);
            }
        } catch (error) {
            reject(error);
        }
    });


}
