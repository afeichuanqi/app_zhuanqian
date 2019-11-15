import types from '../action/Types';
import Message from '../action';
import {onSelectAllFriend} from '../action/friend';
// import { createStore } from 'redux';
// import reducer from '../reducer';
class ChatSocket {
    connectionstatus = false;
    verifyIdentIdy = false;

    connctionServer = (dispatch, token) => {
        console.log('constructor：我被创建');
        const ws = new WebSocket('ws://localhost:433/');
        // this.store = createStore(reducer);
        this.dispatch = dispatch;
        ws.onopen = () => {
            console.log('连接成功');
            this.connectionstatus = true;
            // this.store.dispatch();
            this.verifyIdentidy(token);
            dispatch(Message.setConnectionStatus(true));
        };
        ws.onmessage = (evt) => {
            const received_msg = evt.data;
            const msgData = JSON.parse(evt.data);
            // console.log(msgData, 'msgData');
            const {type, data} = msgData;
            switch (type) {
                case types.VERIFY_IDENTIDY:
                    const {msg, status} = data;
                    dispatch(Message.verifyIdentIdy(status));
                    if (status === 0) {
                        this.verifyIdentIdy = true;
                    } else {
                        this.verifyIdentIdy = false;
                    }
                    break;
                case types.MESSAGE_FROMOF_USERID://收到消息
                    const {
                        fromUserid_,
                        msg_type_,
                        content_,
                        msgId_,
                        sendDate_,
                        ToUserId_,
                        sendStatus_,
                    } = data;
                    dispatch(Message.onMessageFrom(fromUserid_, msg_type_, content_, msgId_, sendDate_, ToUserId_, sendStatus_));
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
                    dispatch(Message.onSelectAllFriend(data.friend));
                    console.log(data.friend, 'data.friend');
                    //收到回调进行未读消息数回调
                    this.selectAllFriendUnReadMessageLength();
                    break;
                case types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS:
                    dispatch(Message.onSelectAllFriendUnRead(data.friendUnReadCountArr));
                    break;
                case types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS:
                    dispatch(Message.onSetAllFriendUnRead(data.fromUserid));

                    break;

                // dispatch


            }
        };
        //连接关闭的时候触发
        ws.onclose = () => {
            console.log('连接已关闭...');
            this.connectionstatus = false;
            Message.setConnectionStatus(false);
        };
        ws.onerror = () => {
            console.log('通信发生错误时触发');
            this.connectionstatus = false;
            Message.setConnectionStatus(false);
        };
        this.ws = ws;
    };

    //验证身份
    verifyIdentidy = (token) => {
        // console.log(this.connectionstatus);
        if (!this.connectionstatus) {
            return '未连接成功';
        }
        this.sendToServer(types.VERIFY_IDENTIDY, {
            token,
        });
    };
    //查询所有好友消息
    selectAllFriendMessage = () => {
        this.sendToServer(types.MESSAGE_SELECT_ALL, {});
    };
    //查询未读消息数
    selectAllFriendUnReadMessageLength = () => {
        this.sendToServer(types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH, {});
    };
    //设置我和fromuserinf的消息为已经读区
    setFromUserIdMessageIsRead = (fromUserid) => {
        console.log(fromUserid,"fromUseridfromUserid");
        this.sendToServer(types.MESSAGE_SET_USER_ID_IS_READ, {
            fromUserid,
        });
    };
    //发送消息给指定用户
    sendMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid) => {
        if (!this.connectionstatus) {
            return false;
        }
        if (!this.verifyIdentIdy) {
            return false;
        }
        this.sendToServer(types.MESSAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid,
        });
        this.dispatch(Message.onAddMesage(fromUserid, msg_type, content, toUserid, uuid));
        // this.dispatch(Message.onMessageFrom(fromUserid, msg_type, content, msgId, sendDate, ToUserId, sendStatus));
        return true;
    };
    sendToServer = (type, data) => {
        const msgData = {
            type, data,
        };
        const msgStr = JSON.stringify(msgData);
        console.log(msgStr);
        this.ws.send(msgStr);
    };
}


// const ChatSocketRedux = connect(mapStateToProps, mapDispatchToProps)(ChatSocket);
const ChatSocketSinge = new ChatSocket();
export default ChatSocketSinge;
