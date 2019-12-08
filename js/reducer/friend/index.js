import Types from '../../action/Types';

const defaultContent = {
    friendArr: [],
    unMessageLength: 0,
    columnUnreadLength: [0, 0, 0, 0],


};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.MESSAGE_FRIEND_ALL :
            const temArr = data.friendArr;
            // const columnUnreadLength1 = [0, 0, 0, 0];

            let unMessageLength = 0;

            for (let i = 0; i < temArr.length; i++) {
                const item = temArr[i];
                const {unReadLength, columnType} = item;

                unMessageLength += unReadLength;
                // columnUnreadLength1[parseInt(columnType) - 1] = columnUnreadLength1[parseInt(columnType) - 1] + unReadLength;
            }
            // console.log(columnUnreadLength1, 'columnUnreadLength1');
            return {
                ...state,
                friendArr: temArr,
                unMessageLength,
                // columnUnreadLength: columnUnreadLength1,
            };

        case Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS ://设置好友的未读消息数
            let temArr2 = [...state.friendArr];
            // let column1 = state.column1;
            // const columnUnreadLength2 = [...state.columnUnreadLength];
            let nowUnMessageLength = state.unMessageLength;
            const FriendIdIndex = temArr2.findIndex(d => d.FriendId === data.FriendId);
            const originalFriendUnReadLen = temArr2[FriendIdIndex].unReadLength;

            //设置分类消息数
            // columnUnreadLength2[parseInt(temArr2[FriendIdIndex].columnType) - 1] -= temArr2[FriendIdIndex].unReadLength;

            temArr2[FriendIdIndex].unReadLength = 0;
            temArr2 = temArr2.sort((data1, data2) => {
                return data2.unReadLength - data1.unReadLength;
            });
            return {
                ...state,
                friendArr: temArr2,
                unMessageLength: nowUnMessageLength - originalFriendUnReadLen,
                // columnUnreadLength: columnUnreadLength2,
            };
        case Types.MESSAGE_FROMOF_USERID_Friend:
            // const columnUnreadLength3 = [...state.columnUnreadLength];
            let temArr3 = [...state.friendArr];
            let NewUnReadLength = state.unMessageLength + 1;
            const fromUserIndex = temArr3.findIndex(d => d.FriendId == data.FriendId);

            if (fromUserIndex != -1) {//找到了此用户
                const item = temArr3[fromUserIndex];
                item.msg_type = data.msg_type;
                item.msg = data.content;
                item.sendDate = data.sendDate;
                // ite
                item.unReadLength = data.fromUserid != data.ToUserId && item.unReadLength + 1;
                temArr3[fromUserIndex] = item;
                // columnUnreadLength3[parseInt(item.columnType) - 1] += data.fromUserid != data.ToUserId ? 1 : 0;
            } else {
                // columnUnreadLength3[parseInt(data.columnType) - 1] += data.fromUserid != data.ToUserId ? 1 : 0;
                temArr3.push({
                    userid: data.fromUserid,
                    username: data.username,
                    avatar_url: data.avatar_url,
                    msg: data.content,
                    sendDate: data.sendDate,
                    msg_type: data.msg_type,
                    msgId: data.msgId,
                    unReadLength: data.fromUserid != data.ToUserId ? 1 : 0,
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
                // columnUnreadLength: columnUnreadLength3,
            };
        case Types.MESSAGE_SET_MSG_ID_READ_SUCCESS:
            // const columnUnreadLength4 = [...state.columnUnreadLength];
            let temArr4 = [...state.friendArr];
            let NewUnReadLength1 = state.unMessageLength == 0 ? 0 : state.unMessageLength - 1;
            const fromUserIndex1 = temArr4.findIndex(d => d.FriendId == data.FriendId);
            if (fromUserIndex1 != -1) {
                const item1 = temArr4[fromUserIndex1];
                item1.unReadLength = 0;
                temArr4[fromUserIndex1] = item1;
                // columnUnreadLength4[parseInt(item1.columnType) - 1] -= item1.unReadLength;
            }


            return {
                ...state,
                friendArr: temArr4,
                unMessageLength: NewUnReadLength1,
                // columnUnreadLength: columnUnreadLength4,
            };
        default:
            return state;
    }
}
