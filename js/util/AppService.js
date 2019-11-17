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
export function uploadMsgImage(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/uploadMsgImage', data);
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

/**
 * 查询是否黑名单
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function selectIsBeBlackList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectIsBeBlackList', data);
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
/**
 * 举报用户
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function insertReportList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/insertReportList', data);
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
/**
 * 加入黑名单
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function setToBlackList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/setToBlackList', data);
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
