import Types from '../../action/Types';

const defaultContent = {
    friendArr: [],
    unMessageLength: 0,
    columnUnreadLength: [0, 0, 0, 0],
    appeal_2: 0,
    appeal_3: 0,

};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.MESSAGE_FRIEND_ALL :
            const temArr = data.friendArr;
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

        case Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS ://设置好友的未读消息数
            let temArr2 = [...state.friendArr];
            let nowUnMessageLength = state.unMessageLength;
            const FriendIdIndex = temArr2.findIndex(d => d.FriendId === data.FriendId);
            if (FriendIdIndex !== -1 && data.columnType == 1) {
                const originalFriendUnReadLen = temArr2[FriendIdIndex].unReadLength;
                temArr2[FriendIdIndex].unReadLength = 0;
                temArr2 = temArr2.sort((data1, data2) => {
                    return data2.unReadLength - data1.unReadLength;
                });
                return {
                    ...state,
                    friendArr: temArr2,
                    unMessageLength: nowUnMessageLength - originalFriendUnReadLen,
                };
            } else {
                return {
                    ...state,
                };
            }
        case Types.FRIEND_SET_OTHER_MSG_UN_READ:
            return {
                ...state,
                appeal_2: data.appeal_2,
                appeal_3: data.appeal_3,
            };
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
            if (data.columnType == 1) {
                let temArr3 = [...state.friendArr];
                let NewUnReadLength = data.isAddNewMsgLength ? state.unMessageLength + 1 : state.unMessageLength;
                const fromUserIndex = temArr3.findIndex(d => d.FriendId == data.FriendId);

                if (fromUserIndex != -1) {//找到了此用户
                    // console.log
                    const item = temArr3[fromUserIndex];
                    item.msg_type = data.msg_type;
                    item.msg = data.content;
                    item.sendDate = data.sendDate;
                    item.unReadLength = data.fromUserid != data.ToUserId && data.isAddNewMsgLength && item.unReadLength + 1;
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
                        unReadLength: data.fromUserid != data.ToUserId ? data.isAddNewMsgLength ? 1 : 0 : 0,
                        FriendId: data.FriendId,
                        columnType: data.columnType,
                        taskUri: data.taskUri,
                        taskId: data.taskId,

                    });
                }
                temArr3 = temArr3.sort((data1, data2) => {
                    return data2.sendDate - data1.sendDate;
                });
                return {
                    ...state,
                    friendArr: temArr3,
                    unMessageLength: NewUnReadLength,
                };
            } else {
                let state_ = {};
                if (data.columnType == 2) {
                    state_ = {
                        ...state,
                        appeal_2: data.fromUserid != data.ToUserId ? data.isAddNewMsgLength ? state.appeal_2 + 1 : 0 : 0,
                    };
                } else if (data.columnType == 3) {
                    state_ = {
                        ...state,
                        appeal_3: data.fromUserid != data.ToUserId ? data.isAddNewMsgLength ? state.appeal_3 + 1 : 0 : 0,
                    };
                } else {
                    state_ = {
                        ...state,
                    };
                }
                return state_;
            }

        case Types.MESSAGE_SET_MSG_ID_READ_SUCCESS:
            let temArr4 = [...state.friendArr];
            let NewUnReadLength1;
            const fromUserIndex1 = temArr4.findIndex(d => d.FriendId == data.FriendId);
            if (fromUserIndex1 != -1) {
                const item1 = temArr4[fromUserIndex1];
                NewUnReadLength1 = state.unMessageLength - item1.unReadLength;
                item1.unReadLength = 0;
                temArr4[fromUserIndex1] = item1;
                return {
                    ...state,
                    friendArr: temArr4,
                    unMessageLength: NewUnReadLength1,
                };
            } else {
                return {
                    ...state,
                };
            }


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
