import Types from '../Types';

/**
 * TOKEN验证
 * @returns {{theme: *, type: string}}
 */
// VERIFY_IDENTIDY 验证结果
export function verifyIdentIdy(code) {
    console.log(code, 'code');
    return {type: Types.VERIFY_IDENTIDY, data: {identIdy: code}};
}

//连接成功
export function setConnectionStatus(code) {
    return {type: Types.SET_CONN_CODE, data: {conn_status: code}};
}

//收到消息
export function onMessageFrom(fromUserid, msg_type, content, msgId, sendDate, ToUserId, sendStatus) {
    // console.log('我被触发11222');
    return {
        type: Types.MESSAGE_FROMOF_USERID,
        data: {fromUserid, msg_type, content, msgId, sendDate, ToUserId, sendStatus},
    };
}

//向本地插入数据
export function onAddMesage(fromUserid, msg_type, content, ToUserId, uuid) {
    // console.log('我被触发11222');
    return {
        type: Types.MESSAGE_ADD_NEW,
        data: {fromUserid, msg_type, content, ToUserId, sendStatus: 0, uuid},
    };
}

//消息是否发送成功回调
export function onSetMsgStatus(uuid, msgId, sendDate, sendStatus) {
    // console.log('我被触发11222');
    return {
        type: Types.MESSAGE_SET_STATUS,
        data: {uuid, msgId, sendDate, sendStatus},
    };
}

// //发送消息
// export function onMessageTo(fromUserid, msg_type, content, msgId, sendDate) {
//     return dispatch => {
//         dispatch({type: Types.MESSAGE_FROMOF_USERID, data: {fromUserid, msg_type, content, msgId,sendDate}});
//     };
// }
