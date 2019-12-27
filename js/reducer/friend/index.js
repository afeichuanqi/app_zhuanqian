import Types from '../../action/Types';

const defaultContent = {
    friendArr: [],
    unMessageLength: 0,
    columnUnreadLength: [0, 0, 0, 0],
    appeal_2: 0,
    appeal_3: 0,
    notice_arr: [0, 0, 0, 0],
};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.MESSAGE_FRIEND_ALL :
            const temArr = data.friendArr;
            //console.log('MESSAGE_FRIEND_ALL');
            let unMessageLength = 0;
            for (let i = 0; i < temArr.length; i++) {
                const item = temArr[i];
                const {unReadLength, columnType} = item;

                unMessageLength += unReadLength;
            }
            return {
                ...state,
                friendArr: temArr,
                unMessageLength,
            };

        case Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS ://设置好友的消息已经读取成功
            let temArr2 = [...state.friendArr];
            const FriendIdIndex = temArr2.findIndex(d => d.FriendId === data.FriendId);
            if (FriendIdIndex !== -1) {
                const originalFriendUnReadLen = temArr2[FriendIdIndex].unReadLength;
                temArr2[FriendIdIndex].unReadLength = 0;
                temArr2.sort((data1, data2) => {
                    return data2.sendDate - data1.sendDate;
                });
                return {
                    ...state,
                    friendArr: temArr2,
                    unMessageLength: state.unMessageLength - originalFriendUnReadLen,
                };
            }
            return {
                ...state,
            };

        case Types.FRIEND_SET_OTHER_MSG_UN_READ:
            return {
                ...state,
                appeal_2: data.appeal_2,
                appeal_3: data.appeal_3,
                notice_arr: data.noticeArr,
            };
        case Types.NEW_NOTICE_MSG:
            const tmp = [...state.notice_arr];
            //console.log(data.type);
            tmp[data.type] = 1;
            return {
                ...state,
                notice_arr: tmp,
            };

        case Types.SET_NEW_NOTICE_MSG_IS_READ:
            const tmp1 = [...state.notice_arr];
            tmp1[data.type] = 0;
            return {
                ...state,
                notice_arr: tmp1,
            };
        case Types.SET_NEW_NOTICE_MSG_IS_ALL_READ:
            return {
                ...state,
                notice_arr: [0, 0, 0, 0],
            };
        case Types.FRIEND_SET_APPEAL_2_MSG_UN_READ:
            return {
                ...state,
                appeal_2: 1,
            };
        case Types.FRIEND_SET_APPEAL_3_MSG_UN_READ:
            return {
                ...state,
                appeal_3: 1,
            };
        // case Types.
        case Types.FRIEND_SET_OTHER_MSG_UN_READ_APPEAL2:
            return {
                ...state,
                appeal_2: 0,
            };
        case Types.FRIEND_SET_OTHER_MSG_UN_READ_APPEAL3:
            return {
                ...state,
                appeal_3: 0,
            };
        case Types.MESSAGE_FROMOF_USERID_Friend:
            //console.log('MESSAGE_FROMOF_USERID_Friend');
            let temArr3 = [...state.friendArr];
            let NewUnReadLength = (data.fromUserid != data.ToUserId && data.isAddNewMsgLength) ? state.unMessageLength + 1 : state.unMessageLength;
            const fromUserIndex = temArr3.findIndex(d => d.FriendId == data.FriendId);

            if (fromUserIndex != -1) {//找到了此用户
                const item = temArr3[fromUserIndex];
                item.msg_type = data.msg_type;
                item.msg = data.content;
                item.sendDate = data.sendDate;
                item.unReadLength = (data.fromUserid != data.ToUserId && data.isAddNewMsgLength) ? item.unReadLength + 1 : item.unReadLength;
                temArr3[fromUserIndex] = item;
            } else {
                temArr3.push({
                    userid: data.fromUserid,
                    username: data.username,
                    avatar_url: data.avatar_url,
                    msg: data.content,
                    sendDate: data.sendDate,
                    msg_type: data.msg_type,
                    msgId: data.msgId,
                    unReadLength: (data.fromUserid != data.ToUserId && data.isAddNewMsgLength) ? 1 : 0,
                    FriendId: data.FriendId,
                    columnType: data.columnType,
                    taskUri: data.taskUri,
                    taskId: data.taskId,
                    sendFormId: data.sendFormId,

                });
            }
            temArr3.sort((data1, data2) => {
                return data2.sendDate - data1.sendDate;
            });
            return {
                ...state,
                friendArr: temArr3,
                unMessageLength: NewUnReadLength,
            };
        case Types.FRIEND_INIT:

            return {
                ...state,
                friendArr: [],
                unMessageLength: 0,
                columnUnreadLength: [0, 0, 0, 0],
            };
        default:
            return state;
    }
}
