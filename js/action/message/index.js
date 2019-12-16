import Types from '../Types';

/**
 * TOKEN验证
 * @returns {{theme: *, type: string}}
 */
// VERIFY_IDENTIDY 验证结果
export function verifyIdentIdy(code) {
    // console.log(code, 'code');
    return {type: Types.VERIFY_IDENTIDY, data: {identIdy: code}};
}

// //连接成功
// export function setConnectionStatus(code) {
//     return {type: Types.SET_CONN_CODE, data: {conn_status: code}};
// }

//收到消息
export function onMessageFrom(fromUserid, msg_type, content, msgId, sendDate, ToUserId, sendStatus,FriendId) {
    return {
        type: Types.MESSAGE_FROMOF_USERID,
        data: {fromUserid, msg_type, content, msgId, sendDate, ToUserId, sendStatus,FriendId},
    };
}

//向本地插入数据
export function onAddMesage(fromUserid, msg_type, content, ToUserId, uuid,sendDate,FriendId) {
    return {
        type: Types.MESSAGE_ADD_NEW,
        data: {fromUserid, msg_type, content, ToUserId, sendStatus: 0, uuid,sendDate,FriendId},
    };
}

//消息是否发送成功回调
export function onSetMsgStatus(uuid, msgId, sendDate, sendStatus) {
    return {
        type: Types.MESSAGE_SET_STATUS,
        data: {uuid, msgId, sendDate, sendStatus},
    };
}
//图片消息是否发送成功回调
export function onSetImageMsgStatus(uuid, msgId, sendDate, sendStatus,content) {
    return {
        type: Types.MESSAGE_FORIMAGE_SENDTO_USERID_SUCCESS,
        data: {uuid, msgId, sendDate, sendStatus,content},
    };
}
//消息队列初始化
export function onMessageInitialiZation() {
    return {
        type: Types.MESSAGE_INIT,
        data: {},
    };
}
//图片是否发送成功回调
// export function onSetMsgImageStatus(uuid, msgId, sendDate, sendStatus,data,token) {
//     return dispatch => {
//         uploadMsgImage(data, token).then((data) => {
//             callback(true, data);
//             // console.log(data, 'data');
//             dispatch({
//                 type: Types.UPLOAD_AVATAR_SUCCESS,
//                 data: {avatar_url: data.imageUrl},
//             });
//         }).catch((msg) => {
//             callback(false, {msg});
//         });
//
//     };
//     // return {
//     //     type: Types.MESSAGE_SET_STATUS,
//     //     data: {uuid, msgId, sendDate, sendStatus},
//     // };
// }
//获取所有消息
export function onGetMegForUserid(msgArr) {
    return {
        type: Types.MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS,
        data: {msgArr},
    };
}
// //发送消息
// export function onMessageTo(fromUserid, msg_type, content, msgId, sendDate) {
//     return dispatch => {
//         dispatch({type: Types.MESSAGE_FROMOF_USERID, data: {fromUserid, msg_type, content, msgId,sendDate}});
//     };
// }
