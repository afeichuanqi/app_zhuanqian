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
export function bindPhoneForUserId(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/bindPhoneForUserId', data);
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
export function changeWechatInfoForUserid(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/changeWechatInfoForUserid', data);
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
export function changeSinaInfoForUserid(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/changeSinaInfoForUserid', data);
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
export function changeQQInfoForUserid(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/changeQQInfoForUserid', data);
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
export function cancelAuthorize(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/cancelAuthorize', data);
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
export function setInvitationCode(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/setInvitationCode', data);
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
 * 用户微信授权
 * @returns {Promise<any> | Promise<*>}
 */
export function authorizeLogin(data) {
    return new Promise(async function (resolve, reject) {
        try {
            const ret = await http.post('user/authorizeLogin', data);
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
 * 用户新浪授权
 * @returns {Promise<any> | Promise<*>}
 */
export function authorizeSinaLogin(data) {
    return new Promise(async function (resolve, reject) {
        try {
            const ret = await http.post('user/authorizeSinaLogin', data);
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
 * 用户QQ授权
 * @returns {Promise<any> | Promise<*>}
 */
export function authorizeQQLogin(data) {
    return new Promise(async function (resolve, reject) {
        try {
            const ret = await http.post('user/authorizeQQLogin', data);
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
export function getNewTaskId() {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;

            const ret = await http.get('user/getNewTaskId');
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
export function getInvitationCode(token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setGetHeader('token',token)
            const ret = await http.get('user/getInvitationCode');
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
                    if (ret.key) {
                        resolve(`${subUrl}${ret.key}`);
                    }
                } else {
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
 * 驳回用户的提交任务
 */
export function TaskTurnDownTaskFrom(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/TaskTurnDownTaskFrom', data);
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
 * 查询任务表的任务信息
 */
export function selectTaskInfo_(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectTaskInfo_', data);
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
 *增加任务数
 */
export function addUserTaskNum(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/addUserTaskNum', data);
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
 *查询任务已经完成列表
 */
export function selectSendFormTaskList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectSendFormTaskList', data);
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
 *查询任务已经报名列表
 */
export function selectSignUpList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectSignUpList', data);
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
 *查询所有关注和粉丝
 */
export function selectAttentionFanList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectAttentionFanList', data);
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
 *更新用户任务价格
 */
export function updateUserTaskPrice(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/updateUserTaskPrice', data);
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
            http.setPostHeader('token', token);
            // let body = new FormData();
            // const key = `${new Date().getTime()}.${data.mime}`;
            // body.append('key', key);
            // body.append('file', {
            //     type: `image/${data.mime}`,
            //     uri: data.uri,
            //     name: key,
            // });

            const ret = await http.post('user/uploadAvatar', data, true);
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
export function uploadUserinfoBgImg(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);

            const ret = await http.post('user/uploadUserinfoBgImg', data, true);
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
 * 举报用户
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function getAppSoftText(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/getAppSoftText', data);
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
 * 查询用户帐单
 */
export function selectBillForUserId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectBillForUserId', data);
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
 * 查询用户提现信息
 */
export function getUserWithDrawInfo(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/getUserWithDrawInfo', data);
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
 * 查询用户帐单
 */
export function selectFavoriteForUserId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectFavoriteForUserId', data);
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
 * 提现用户帐单
 */
export function userWithDrawMoney(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/userWithDrawMoney', data);
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
 * 查询用户帐单
 */
export function setUserWithDrawInfo(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/setUserWithDrawInfo', data);
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
 * 查询用户屏蔽列表
 */
export function selectBlackList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectBlackList', data);
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
 * 查询所有推荐任务
 */
export function selectAllRecommendTask(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // http.setPostHeader('token', token);
            const ret = await http.get('user/selectAllRecommendTask', data);
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
 * 查询所有反馈记录
 */
export function selectFeedbackList(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectFeedbackList', data);
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
 * 刷新任务
 */
export function updateTaskUpdateTime(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/updateTaskUpdateTime', data);
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
 * 获取所有任务
 */
export function getAllTask(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // http.setPostHeader('token', token);
            const ret = await http.post('user/getAllTask', data);
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
 * 获取所有新手任务
 */
export function getAllTaskForNewEr(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // http.setPostHeader('token', token);
            const ret = await http.post('user/getAllTaskForNewEr', data);
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
 * 获取所有任务
 */
export function getLunboList(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // http.setPostHeader('token', token);
            const ret = await http.get('user/getLunboList',data);
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
 * 最新首页
 */
export function getBestNewTask(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // http.setPostHeader('token', token);
            const ret = await http.get('user/getBestNewTask', data);
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
 * 获取app配置
 */
export function getAppSetting() {
    return new Promise(async function (resolve, reject) {
        try {
            const ret = await http.get('user/getAppSetting', {});
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
 * 设置用户任务的置顶
 */
export function userSetTaskTop(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/userSetTaskTop', data);
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
 * 设置用户任务的推荐
 */
export function userSetTaskRecommend(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/userSetTaskRecommend', data);
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
 * 取消用户报名资格
 */
export function cancelUserSignUp(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/cancelUserSignUp', data);
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
 * 查询用户接单
 */
export function selectOrderTasks(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
                const ret = await http.post('user/selectOrderTasks', data);
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
 * 获取所有诉求消息
 */
export function getUserAppealFriendList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
                const ret = await http.post('user/getUserAppealFriendList', data);
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
 * 获取支付宝支付info
 */
export function alipaySignOrder(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
                const ret = await http.post('pay/alipaySignOrder', data);
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
 * 获取支付宝支付info
 */
export function applePayConfirmOrder(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
                const ret = await http.post('pay/notice/applePayConfirmOrder', data);
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
 * 获取微信支付info
 */
export function wechatSignOrder(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
                const ret = await http.post('pay/wechatSignOrder', data);
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
 * 重新做此任务
 */
export function userRedoTask(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/userRedoTask', data);
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
 * 重新做此任务
 */
export function userGiveUpTask(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/userGiveUpTask', data);
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
 * 查询提交信息
 */
export function selectOrderTaskInfo(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectOrderTaskInfo', data);
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
 * 查询提交信息
 */
export function setUserIdMessageIsRead(data,token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/setUserIdMessageIsRead', data);
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
 * 查询提交信息
 */
export function selectAppealNum(token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setGetHeader('token', token);
            const ret = await http.get('user/selectAppealNum');
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
 * 查询任务简单信息
 */
export function selectSimpleTaskInfo(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectSimpleTaskInfo', data);
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
 * 下架任务
 */
export function stopDownUserTask(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/stopDownUserTask', data);
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
 * 生成需要的表单信息
 */
export function genTaskReleaseInfoData(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/genTaskReleaseInfoData', data);
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
 * 暂停任务
 */
export function stopUserTask(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/stopUserTask', data);
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
 * // 查询该任务做的所有信息
 */
export function createAppealInfo(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/createAppealInfo', data);
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
export function isFriendChat(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/isFriendChat', data);
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
 * 获取用户信息
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function getUserInfoForToken(token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setGetHeader('token', token);
            const ret = await http.get('user/getUserInfo');
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
 * 查询用户店铺详情
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function selectShopInfoForUserId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectShopInfoForUserId', data);
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
 * 提交用户反馈记录
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function saveFeedBack(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/saveFeedBack', data);
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
 * 查询用户所有浏览历史
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function getAllViewHistorys(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/getAllViewHistorys', data);
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
 * 查询用户所有浏览历史
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function getAllOrderForType(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/getAllOrderForType', data);
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
 * 查询用户所有浏览历史
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function userBuyOrder(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/userBuyOrder', data);
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
 * 查询用户所有浏览历史
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function deleteViewHistory(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/deleteViewHistory', data);
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
 * 查询用户店铺详情
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function getHotTasks(data) {
    return new Promise(async function (resolve, reject) {
        try {
            // http.setGetHeader('token', token);
            const ret = await http.get('user/getHotTasks',data);
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
 * 获取搜索内容
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function getSearchContent(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/getSearchContent', data);
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
 * 获取热门任务
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function getNoticeList(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/getNoticeList', data);
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
 * 设置某一类型的消息被读取
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function updateNoticeIsReadForType(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/updateNoticeIsReadForType', data);
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
 * 查询用户任务收藏状态
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function selectUserIsFavoriteTask(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectUserIsFavoriteTask', data);
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
 * 设置用户收藏状态
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function setUserFavoriteTask(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/setUserFavoriteTask', data);
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
 * 查询用户店铺详情
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function selectTaskListForUserId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            http.setPostHeader('token', token);
            const ret = await http.post('user/selectTaskListForUserId', data);
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
 * 修改任务
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function updateTaskReleaseData(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/updateTaskReleaseData', data);
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
 * 删除任务
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function deleteTaskRelease(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/deleteTaskRelease', data);
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

/**
 * 关注用户
 * @param data
 * @param token
 * @returns {Promise<any> | Promise<*>}
 */
export function attentionUserId(data, token) {
    return new Promise(async function (resolve, reject) {
        try {
            // const params = `userName=${username}&passWord=${password}&email=${email}`;
            http.setPostHeader('token', token);
            const ret = await http.post('user/attentionUserId', data);
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
