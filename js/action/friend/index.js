import Types from '../Types';

/**
 * TOKEN验证
 * @returns {{theme: *, type: string}}
 */
// 收到查询所有好友消息
export function onSelectAllFriend(friendArr) {
    // console.log(code, 'code');
    return {type: Types.MESSAGE_FRIEND_ALL, data: {friendArr}};
}

// 收到查询所有好友未读消息
export function onSelectAllFriendUnRead(friendArr) {
    // console.log(code, 'code');
    return {type: Types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS, data: {friendArr}};
}

// 设置当前的好友所有消息为已读
export function onSetAllFriendUnRead(fromUserid) {
    // console.log(code, 'code');
    return {type: Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS, data: {fromUserid}};
}

// 好友来了一条新的消息
export function onSetNewMsgForRromUserid(fromUserid_, msg_type_, content_, msgId_, sendDate_, ToUserId_, sendStatus_,username,avatar_url) {
    // console.log(code, 'code');
    return {
        type: Types.MESSAGE_FROMOF_USERID_Friend, data: {
            fromUserid: fromUserid_,
            msg_type: msg_type_,
            content: content_,
            msgId: msgId_,
            sendDate: sendDate_,
            ToUserId: ToUserId_,
            sendStatus: sendStatus_,
            username,
            avatar_url,

        },
    };
}
// 设置好友的一条消息已经读取
export function onSetFriendMsgIsRead(fromUserid) {
    // console.log(code, 'code');
    return {
        type: Types.MESSAGE_SET_MSG_ID_READ_SUCCESS, data: {
            fromUserid,
        },
    };
}
//将msgid设置为已读
// export function onSetMsgIdIsRead(msgId) {
//     // console.log(code, 'code');
//     return {type: Types.MESSAGE_SET_MSGID_IS_READ, data: {msgId}};
// }


