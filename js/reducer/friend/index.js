import Types from '../../action/Types';

const defaultContent = {
    friendArr: [],
    unMessageLength: 0,
};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.MESSAGE_FRIEND_ALL :
            // const temArr = [...state.friendArr];
            // this.temArr=
            const temArr = data.friendArr;
            return {
                ...state,
                friendArr: temArr,
            };
        case Types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS :
            let temArr1 = [...state.friendArr];
            const unFriendArr = data.friendArr;
            let unMessageLength = 0;

            for (let i = 0; i < unFriendArr.length; i++) {
                const item = unFriendArr[i];
                if (item.unReadLength) {//获取总得好友消息数
                    unMessageLength += item.unReadLength;
                }
                //查找以前列表是否有好友信息
                const index = temArr1.findIndex(d => d.id === item.userid);
                if (index != -1) {//找到了
                    const item1 = temArr1[index];//取他的item
                    item1.unReadLenth = item.unReadLength;//设置此item的未读消息数
                    temArr1[index] = item1;//放回原处

                } else {//没找到此好友
                    temArr1.unshift({
                        id: item.userid,
                        username: item.username,
                        avatar_url: item.avatar_url,
                        msg: item.msg,
                        sendDate: item.sendDate,
                        msg_type: item.msg_type,
                        unReadLength: item.unReadLength,
                        msgId: item.msgId,
                    });
                    //加入新的元素

                }
            }
            // console.log(temArr1,"temArr1temArr1");
            temArr1 = temArr1.sort((data1, data2) => {
                if (!data1.unReadLenth) {
                    data1.unReadLenth = 0;
                }
                if (!data2.unReadLenth) {
                    data2.unReadLenth = 0;
                }
                return data2.unReadLenth - data1.unReadLenth;
            });
            return {
                ...state,
                friendArr: temArr1,
                unMessageLength,
            };
        case Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS ://设置好友的未读消息数
            let temArr2 = [...state.friendArr];
            let nowUnMessageLength = state.unMessageLength;
            const originalFriendIndex = temArr2.findIndex(d => d.id === data.fromUserid);
            const originalFriendUnReadLen = temArr2[originalFriendIndex].unReadLenth;

            for (let i = 0; i < temArr2.length; i++) {
                const item = temArr2[i];
                // console.log(temArr2,"data.fromUseriddata.fromUserid");
                if (item.id == data.fromUserid) {

                    item.unReadLenth = 0;
                    temArr2[i] = item;
                }
            }
            temArr2 = temArr2.sort((data1, data2) => {
                if (!data1.unReadLenth) {
                    data1.unReadLenth = 0;
                }
                if (!data2.unReadLenth) {
                    data2.unReadLenth = 0;
                }
                return data2.unReadLenth - data1.unReadLenth;
            });
            return {
                ...state,
                friendArr: temArr2,
                unMessageLength: nowUnMessageLength - originalFriendUnReadLen,
            };
        case Types.MESSAGE_FROMOF_USERID_Friend:
            let temArr3 = [...state.friendArr];
            let NewUnReadLength = state.unMessageLength + 1;
            const fromUserIndex = temArr3.findIndex(d => d.id == data.fromUserid);

            if (fromUserIndex != -1) {//找到了此用户
                const item = temArr3[fromUserIndex];
                item.msg_type = data.msg_type;
                item.msg = data.content;
                item.sendDate = data.sendDate;
                item.unReadLenth = item.unReadLenth + 1;
                temArr3[fromUserIndex] = item;

            } else {
                temArr3.push({
                    id: parseInt(data.fromUserid),
                    username: data.username,
                    avatar_url: data.avatar_url,
                    msg: data.content,
                    sendDate: data.sendDate,
                    msg_type: data.msg_type,
                    msgId: data.msgId,
                    unReadLenth: 1,

                });
            }

            return {
                ...state,
                friendArr: temArr3,
                unMessageLength: NewUnReadLength,
            };
        case Types.MESSAGE_SET_MSG_ID_READ_SUCCESS:
            let temArr4 = [...state.friendArr];
            let NewUnReadLength1 = state.unMessageLength == 0 ? 0 : state.unMessageLength - 1;
            const fromUserIndex1 = temArr4.findIndex(d => d.id == data.fromUserid);
            if (fromUserIndex1 != -1) {
                const item1 = temArr4[fromUserIndex1];
                if (item1.unReadLenth != 0) {
                    item1.unReadLenth = item1.unReadLenth - 1;
                }
                temArr4[fromUserIndex1] = item1;
            }


            return {
                ...state,
                friendArr: temArr4,
                unMessageLength: NewUnReadLength1,
            };
        default:
            return state;
    }
}
