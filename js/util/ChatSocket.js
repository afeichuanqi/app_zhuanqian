import types from '../action/Types';
import Message from '../action';
import {Platform} from 'react-native';

class ChatSocket {
    connectionstatus = false;
    verifyIdentIdy = false;

    connctionServer = (dispatch, token) => {
        // console.log('constructor：我被创建');
        dispatch(Message.onChangeSocketStatue('正在连接...'));
        const URL = Platform.OS === 'android' ? 'ws://10.0.2.2:433/' : 'ws://localhost:433/';
        const ws = new WebSocket(URL);
        // this.store = createStore(reducer);
        this.dispatch = dispatch;
        this.token = token;
        ws.onopen = () => {
            dispatch(Message.onChangeSocketStatue(''));
            this.connectionstatus = true;
            // this.store.dispatch();
            this.verifyIdentidy(token);
            dispatch(Message.setConnectionStatus(true));
        };
        ws.onmessage = (evt) => {
            const msgData = JSON.parse(evt.data);
            const {type, data} = msgData;
            switch (type) {
                case types.VERIFY_IDENTIDY:
                    const {msg, status} = data;
                    dispatch(Message.verifyIdentIdy(status));
                    if (status === 0) {
                        dispatch(Message.onChangeSocketStatue(''));
                        this.verifyIdentIdy = true;
                    } else {
                        dispatch(Message.onChangeSocketStatue('未登录'));
                        this.verifyIdentIdy = false;
                    }
                    break;
                case types.MESSAGE_FROMOF_USERID://收到消息
                    dispatch(Message.onMessageFrom(data.fromUserid, data.msg_type,
                        data.content, data.msgId, data.sendDate, data.ToUserId, data.sendStatus));//发送给消息列表

                    dispatch(Message.onSetNewMsgForRromUserid(data.fromUserid, data.msg_type, data.content, data.msgId, data.sendDate, data.ToUserId, data.sendStatus, data.username, data.avatar_url));//发送给好友列表
                    break;
                case types.MESSAGE_SENDTO_USERID_STATUS://消息回调

                    const {
                        msgId,
                        sendStatus,
                        sendDate,
                        uuid,
                    } = data;
                    dispatch(Message.onSetMsgStatus(uuid, msgId, sendDate, sendStatus));
                    break;
                case types.MESSAGE_FRIEND_ALL:
                    // console.log('所有好友回调');
                    // const {friend} = data;
                    if (data.friend && data.friend.length > 0) {
                        dispatch(Message.onSelectAllFriend(data.friend));
                    }

                    //收到回调进行未读消息数回调
                    this.selectAllFriendUnReadMessageLength();
                    break;
                case types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS:
                    console.log("data.friendUnReadCountArr",data);
                    if (data.friendUnReadCountArr && data.friendUnReadCountArr.length > 0) {
                        dispatch(Message.onSelectAllFriendUnRead(data.friendUnReadCountArr));
                    }

                    break;
                case types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS:
                    dispatch(Message.onSetAllFriendUnRead(data.fromUserid));
                    break;
                case types.MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS:
                    if (data.msgArr && data.msgArr.length > 0) {
                        dispatch(Message.onGetMegForUserid(data.msgArr));
                    }

                    break;
                case types.MESSAGE_SET_MSG_ID_READ_SUCCESS:
                    dispatch(Message.onSetFriendMsgIsRead(data.fromUserid));
                    break;


            }
        };
        //连接关闭的时候触发
        ws.onclose = () => {
            dispatch(Message.onChangeSocketStatue('连接已关闭'));
            this.connectionstatus = false;
            Message.setConnectionStatus(false);
        };
        ws.onerror = () => {
            dispatch(Message.onChangeSocketStatue('错误连接'));
            this.connectionstatus = false;
            Message.setConnectionStatus(false);
        };
        this.ws = ws;
    };

    //验证身份
    verifyIdentidy = (token) => {
        // console.log(this.connectionstatus);

        this.sendToServer(types.VERIFY_IDENTIDY, {
            token,
        });
    };
    //查询所有好友消息
    selectAllFriendMessage = () => {
        this.sendToServer(types.MESSAGE_SELECT_ALL, {});
    };
    //设置信息id已读取
    setMsgIdIsRead = (msgId, fromUserid) => {
        this.sendToServer(types.MESSAGE_SET_MSG_ID_READ, {msgId, fromUserid});
    };
    //获取userid所有消息
    selectAllMsgForFromUserid = (fromUserid, pageCount) => {
        this.sendToServer(types.MESSAGE_GET_FRIENDUSERID_ALL_MES, {fromUserid, pageCount});
    };
    //查询未读消息数
    selectAllFriendUnReadMessageLength = () => {
        this.sendToServer(types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH, {});
    };
    //设置我和fromuserinf的消息为已经读区
    setFromUserIdMessageIsRead = (fromUserid) => {
        this.sendToServer(types.MESSAGE_SET_USER_ID_IS_READ, {
            fromUserid,
        });
    };
    //发送消息给指定用户
    sendMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid, username, avatar_url) => {
        if (!this.connectionstatus) {
            return false;
        }
        if (!this.verifyIdentIdy) {
            return false;
        }
        this.sendToServer(types.MESSAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid, username, avatar_url,
        });
        this.dispatch(Message.onAddMesage(fromUserid, msg_type, content, toUserid, uuid));
        // this.dispatch(Message.onMessageFrom(fromUserid, msg_type, content, msgId, sendDate, ToUserId, sendStatus));
        return true;
    };
    sendToServer = (type, data) => {
        if (!this.connectionstatus) {
            this.connctionServer(this.dispatch, this.token);
            return;
        }
        if (!this.verifyIdentidy) {
            if (!this.token || this.token == '') {
                return;
            }
            this.verifyIdentidy(this.token);
            return;
        }
        const msgData = {
            type, data,
        };
        const msgStr = JSON.stringify(msgData);
        try {
            this.ws.send(msgStr);
        } catch (e) {
            this.dispatch(Message.onChangeSocketStatue('异常代码:000X1'));
        }

    };
}


// const ChatSocketRedux = connect(mapStateToProps, mapDispatchToProps)(ChatSocket);
const ChatSocketSinge = new ChatSocket();
export default ChatSocketSinge;
