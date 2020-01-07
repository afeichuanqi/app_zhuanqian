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


// 设置当前的好友所有消息为已读
export function onSetAllFriendUnRead(FriendId, columnType) {
    // console.log(code, 'code');
    if (columnType == 1 || columnType == 5) {
        return {type: Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS, data: {FriendId, columnType}};
    } else {
        return {type: '', data: {}};
    }


}

// 设置其他类型未读消息数
export function onSetOtherTypeUnread(appeal2Unread, appeal3Unread,noticeArr) {
    return {type: Types.FRIEND_SET_OTHER_MSG_UN_READ, data: {appeal_2: appeal2Unread, appeal_3: appeal3Unread,noticeArr}};
}

// 设置其他类型未读消息数
export function setAppeal_2IsRead() {
    return {type: Types.FRIEND_SET_OTHER_MSG_UN_READ_APPEAL2, data: {}};
}

// 设置其他类型未读消息数
export function setAppeal_3IsRead() {
    return {type: Types.FRIEND_SET_OTHER_MSG_UN_READ_APPEAL3, data: {}};
}

// 好友来了一条新的消息
export function onSetNewMsgForRromUserid(
    fromUserid_, msg_type_, content_, msgId_, sendDate_, ToUserId_, sendStatus_, username, avatar_url, FriendId, columnType, taskUri, taskId,
    isAddNewMsgLength = true, sendFormId,
) {

    if (columnType == 1 || columnType == 5) {
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
                sendFormId,
            },
        };
    } else {
        if (isAddNewMsgLength) {
            if (columnType == 2) {
                return {type: Types.FRIEND_SET_APPEAL_2_MSG_UN_READ, data: {}};
            } else if (columnType == 3) {
                return {type: Types.FRIEND_SET_APPEAL_3_MSG_UN_READ, data: {}};
            } else {
                return {type: '', data: {}};
            }
        } else {
            return {type: '', data: {}};
        }

    }

}

// // 设置好友的一条消息已经读取
// export function onSetFriendMsgIsRead(FriendId) {
//     return {
//         type: Types.MESSAGE_SET_MSG_ID_READ_SUCCESS, data: {
//             FriendId,
//         },
//     };
// }

//好友队列初始化
export function onFriendInitialiZation() {
    return {
        type: Types.FRIEND_INIT,
        data: {},
    };
}

// 设置系统消息
export function onSetNoticeMsg(type) {
    return {type: Types.NEW_NOTICE_MSG, data: {type}};
}

// 设置系统消息
export function onSetNoticeMsgIsRead(type) {
    return {type: Types.SET_NEW_NOTICE_MSG_IS_READ, data: {type}};
}
// 设置系统消息
export function onSetNoticeMsgIsAllRead() {
    return {type: Types.SET_NEW_NOTICE_MSG_IS_ALL_READ, data: {}};
}

