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

/**
 * 用户报名
 * @returns {Promise<any> | Promise<*>}
 */
export function startSignUpTask(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/startSignUpTask', data);
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
 * 用户提交任务
 * @returns {Promise<any> | Promise<*>}
 */
export function sendTaskStepForm(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/sendTaskStepForm', data);
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
 * 本地上传到七牛云
 */
export function uploadQiniuImage(Usertoken, modalName, mime, uri) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setGetHeader('token', Usertoken);
            const ret = await http.get('user/getQiniuToken');
            if (ret && ret.status == 0) {
                const resData = ret.data;
                const {token, uploadUrl, subUrl} = resData;
                if (token && uploadUrl && subUrl) {
                    const key = `${modalName}_${new Date().getTime()}.${mime}`;
                    let body = new FormData();
                    body.append('token', token);
                    body.append('key', key);
                    body.append('file', {
                        type: `image/${mime}`,
                        uri: uri,
                        name: key,
                    });
                    const ret = await http.post_(uploadUrl, body);
                    console.log(ret,"ret")
                    if (ret.key) {
                        resolve(`${subUrl}${ret.key}`);
                    }
                }else{
                    reject('获取错误');
                }

            } else {
                reject(ret && ret.msg);
            }
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 用户任务状态
 * @returns {Promise<any> | Promise<*>}
 */
export function selectUserStatusForTaskId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectUserStatusForTaskId', data);
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

// export function uploadMsgImage(data, token) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             http.setPostHeader('token', token);
//             const ret = await http.post('user/uploadMsgImage', data);
//             if (ret && ret.status == 0) {
//                 resolve(ret && ret.data);
//             } else {
//                 reject(ret && ret.msg);
//             }
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

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
 * 查询发单类型数据
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function selectTaskReleaseData(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setGetHeader('token', token);
            const ret = await http.get('user/selectTaskReleaseData');
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
 * 查询任务是否已经报名
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function selectUserIsSignUp(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectUserIsSignUp', data);
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
 * 查询用户发单
 */
export function selectTaskReleaseList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectTaskReleaseList', data);
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
 * // 查询该任务做的所有信息
 */
export function selectSendFormForTaskId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectSendFormForTaskId', data);
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
 * // 审核通过该用户的接单
 */
export function passTaskForSendFormTaskId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/passTaskForSendFormTaskId', data);
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

/**
 * 发布任务
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function addTaskReleaseData(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/addTaskReleaseData', data);
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
 * 查询任务
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function selectTaskInfo(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectTaskInfo', data);
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
