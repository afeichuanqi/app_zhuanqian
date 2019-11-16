import Types from '../../action/Types';

const defaultContent = {
    conn_status: false,
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
        case Types.SET_CONN_CODE :
            return {
                ...state,
                conn_status: data.conn_status,
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
                    un_read: 0,
                },
            );
            return {
                ...state,
                msgArr: temArr,
            };
        case Types.MESSAGE_ADD_NEW://我发送的消息加入列表
            // console.log('我触发了MESSAGE_FROMOF_USERID');
            const temArr1 = [...state.msgArr];
            temArr1.push({
                fromUserid: data.fromUserid,
                msg_type: data.msg_type,
                content: data.content,
                ToUserId: data.ToUserId,
                sendStatus: data.sendStatus,
                uuid: data.uuid,
            });
            return {
                ...state,
                msgArr: temArr1,
            };
        case Types.MESSAGE_SET_STATUS://消息加状态
            const temArr__ = [...state.msgArr];
            const index = temArr__.findIndex(d => d.uuid === data.uuid);
            const temJson = temArr__[index];
            temJson.msgId = data.msgId;
            temJson.sendDate = data.sendDate;
            temJson.sendStatus = data.sendStatus;
            temArr__[index] = temJson;
            return {
                ...state,
                msgArr: temArr__,
            };
        case Types.MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS:

            return {
                ...state,
                msgArr: data.msgArr,
            };
        default:
            return state;
    }
}
