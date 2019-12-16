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
// export function onSelectAllFriendUnRead(friendArr) {
//     return {type: Types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS, data: {friendArr:friendArr}};
// }

// 设置当前的好友所有消息为已读
export function onSetAllFriendUnRead(FriendId,columnType) {
    // console.log(code, 'code');
    return {type: Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS, data: {FriendId,columnType}};
}

// 设置其他类型未读消息数
export function onSetOtherTypeUnread(appeal2Unread, appeal3Unread) {
    // console.log(appeal1Unread, appeal2Unread, 'appeal1Unread,appeal2Unread');
    return {type: Types.FRIEND_SET_OTHER_MSG_UN_READ, data: {appeal_2: appeal2Unread, appeal_3: appeal3Unread}};
}
// 设置其他类型未读消息数
export function setAppeal_2IsRead() {
    // console.log(appeal1Unread, appeal2Unread, 'appeal1Unread,appeal2Unread');
    return {type: Types.FRIEND_SET_OTHER_MSG_UN_READ_APPEAL2, data: {}};
}
// 设置其他类型未读消息数
export function setAppeal_3IsRead() {
    // console.log(appeal1Unread, appeal2Unread, 'appeal1Unread,appeal2Unread');
    return {type: Types.FRIEND_SET_OTHER_MSG_UN_READ_APPEAL3, data: {}};
}

// 好友来了一条新的消息
export function onSetNewMsgForRromUserid(
    fromUserid_, msg_type_, content_, msgId_, sendDate_, ToUserId_, sendStatus_, username, avatar_url, FriendId, columnType, taskUri, taskId,
    isAddNewMsgLength = true,
) {
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
            FriendId,
            columnType,
            taskUri,
            taskId,
            isAddNewMsgLength,
        },
    };
}

// 设置好友的一条消息已经读取
export function onSetFriendMsgIsRead(FriendId) {
    console.log(FriendId, 'FriendId');
    return {
        type: Types.MESSAGE_SET_MSG_ID_READ_SUCCESS, data: {
            FriendId,
        },
    };
}

//好友队列初始化
export function onFriendInitialiZation() {
    return {
        type: Types.FRIEND_INIT,
        data: {},
    };
}

//将msgid设置为已读
// export function onSetMsgIdIsRead(msgId) {
//     // console.log(code, 'code');
//     return {type: Types.MESSAGE_SET_MSGID_IS_READ, data: {msgId}};
// }


