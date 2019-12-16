import Types from '../../action/Types';

const defaultContent = {
    identIdy: false,
    msgArr: [],
};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    // console.log(action, 'actionaction');
    switch (type) {
        case Types.VERIFY_IDENTIDY :
            return {
                ...state,
                identIdy: data.identIdy,
            };
        case Types.MESSAGE_FROMOF_USERID://来自好友消息
            const temArr = [...state.msgArr];
            temArr.push({
                    fromUserid: data.fromUserid,
                    msg_type: data.msg_type,
                    content: data.content,
                    msgId: data.msgId,
                    sendDate: data.sendDate,
                    ToUserId: data.ToUserId,
                    sendStatus: data.sendStatus,
                    FriendId: data.FriendId,
                    un_read: 0,
                },
            );
            return {
                ...state,
                msgArr: temArr,
            };
        case Types.MESSAGE_ADD_NEW://我发送的消息加入列表
            const temArr1 = [...state.msgArr];
            // console.log(data.sendDate,"sendDate")
            temArr1.push({
                fromUserid: data.fromUserid,
                msg_type: data.msg_type,
                content: data.content,
                sendDate: data.sendDate,
                ToUserId: data.ToUserId,
                sendStatus: data.sendStatus,
                uuid: data.uuid,
                FriendId: data.FriendId,

            });
            console.log(temArr1, 'temArr1');
            return {
                ...state,
                msgArr: temArr1,
            };
        case Types.MESSAGE_SET_STATUS://消息加状态
            const temArr__ = [...state.msgArr];
            const index = temArr__.findIndex(d => d.uuid === data.uuid);
            // console.log(temArr__,"indexindex");
            const temJson = temArr__[index];
            temJson.msgId = data.msgId;
            temJson.sendDate = data.sendDate;
            temJson.sendStatus = data.sendStatus;
            temArr__[index] = temJson;
            return {
                ...state,
                msgArr: temArr__,
            };
        case Types.MESSAGE_FORIMAGE_SENDTO_USERID_SUCCESS://图片消息加状态
            const temArr2 = [...state.msgArr];
            const index2 = temArr2.findIndex(d => d.uuid === data.uuid);
            // console.log(temArr__,"indexindex");
            const temJson2 = temArr2[index2];
            temJson2.msgId = data.msgId;
            temJson2.sendDate = data.sendDate;
            temJson2.sendStatus = data.sendStatus;
            temJson2.content = data.content;
            temArr2[index] = temJson2;
            return {
                ...state,
                msgArr: temArr2,
            };
        case Types.MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS:

            return {
                ...state,
                msgArr: data.msgArr,
            };
        case Types.MESSAGE_INIT://初始化消息队列
            return {
                ...state,
                conn_status: false,
                identIdy: false,
                msgArr: [],
            };
        default:
            return state;
    }
}
