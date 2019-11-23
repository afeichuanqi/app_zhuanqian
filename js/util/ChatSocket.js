import types from '../action/Types';
import Message from '../action';
import {Platform} from 'react-native';
import ReconnectingWebSocket from './ReconnectingWebSocket';

class ChatSocket {
    connectionstatus = false;
    verifyIdentIdy = false;
    setDispatch = (dispatch) => {
        this.dispatch = dispatch;
    };
    connctionServer = (token) => {
        if (typeof this.dispatch != 'function') {
            return;
        }
        this.dispatch(Message.onChangeSocketStatue('正在连接...'));
        const URL = Platform.OS === 'android' ? 'ws://10.0.2.2:433/' : 'ws://localhost:433/';
        const ws = new ReconnectingWebSocket(URL);
        // this.store = createStore(reducer);
        this.token = token;
        ws.onopen = () => {
            // console.log('打开连接');
            this.dispatch(Message.onChangeSocketStatue(''));
            this.connectionstatus = true;
            this.verifyIdentidy(token);
            this.dispatch(Message.setConnectionStatus(true));
        };

        ws.onmessage = (evt) => {
            const msgData = JSON.parse(evt.data);
            const {type, data} = msgData;
            switch (type) {
                case types.VERIFY_IDENTIDY:
                    const {msg, status} = data;
                    this.dispatch(Message.verifyIdentIdy(status));
                    if (status === 0) {
                        this.dispatch(Message.onChangeSocketStatue(''));
                        this.verifyIdentIdy = true;
                    } else {
                        this.dispatch(Message.onChangeSocketStatue('未登录'));
                        this.verifyIdentIdy = false;
                    }
                    break;
                case types.MESSAGE_FROMOF_USERID://收到消息
                    // console.log('收到消息MESSAGE_FROMOF_USERID');
                    this.dispatch(Message.onMessageFrom(data.fromUserid, data.msg_type,
                        data.content, data.msgId, data.sendDate, data.ToUserId, data.sendStatus,data.FriendId));//发送给消息列表

                    this.dispatch(Message.onSetNewMsgForRromUserid(data.fromUserid, data.msg_type, data.content, data.msgId, data.sendDate, data.ToUserId, data.sendStatus, data.username, data.avatar_url,data.FriendId,data.columnType,data.taskUri));//发送给好友列表
                    break;
                case types.MESSAGE_SENDTO_USERID_STATUS://消息回调

                    const {
                        msgId,
                        sendStatus,
                        sendDate,
                        uuid,
                    } = data;
                    this.dispatch(Message.onSetMsgStatus(uuid, msgId, sendDate, sendStatus));
                    break;
                case types.MESSAGE_FRIEND_ALL:
                    let friendArr = [];
                    if (data.friend && data.friend.length > 0) {
                        friendArr = data.friend;
                    }
                    this.dispatch(Message.onSelectAllFriend(friendArr));
                    //收到回调进行未读消息数回调
                    // this.selectAllFriendUnReadMessageLength();
                    break;
                // case types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS:
                //     let friendUnReadCountArr = [];
                //
                //     if (data.friendUnReadCountArr && data.friendUnReadCountArr.length > 0) {
                //         friendUnReadCountArr = data.friendUnReadCountArr;
                //     }
                //     this.dispatch(Message.onSelectAllFriendUnRead(friendUnReadCountArr));
                //     break;
                case types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS:
                    this.dispatch(Message.onSetAllFriendUnRead(data.FriendId));
                    break;
                case types.MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS:
                    if (data.msgArr && data.msgArr.length > 0) {
                        this.dispatch(Message.onGetMegForUserid(data.msgArr));
                    }

                    break;
                case types.MESSAGE_SET_MSG_ID_READ_SUCCESS:
                    this.dispatch(Message.onSetFriendMsgIsRead(data.FriendId));
                    break;
                case types.MESSAGE_FORIMAGE_SENDTO_USERID_SUCCESS:
                    this.dispatch(Message.onSetImageMsgStatus(data.uuid, data.msgId, data.sendDate, data.sendStatus, data.content));
                    break;


            }
        };
        //连接关闭的时候触发
        ws.onclose = () => {
            this.connectionstatus = false;
            Message.setConnectionStatus(false);
            if (typeof this.dispatch != 'function') {
                return;
            }
            this.dispatch(Message.onChangeSocketStatue('连接中...'));

        };
        ws.onerror = () => {
            this.connectionstatus = false;
            Message.setConnectionStatus(false);
            if (typeof this.dispatch != 'function') {
                return;
            }
            this.dispatch(Message.onChangeSocketStatue('错误连接'));
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
    setMsgIdIsRead = (FriendId,toUserid) => {
        this.sendToServer(types.MESSAGE_SET_MSG_ID_READ, {FriendId,toUserid});
    };
    //获取userid所有消息
    selectAllMsgForFromUserid = (friendId, pageCount) => {
        this.sendToServer(types.MESSAGE_GET_FRIENDUSERID_ALL_MES, {friendId, pageCount});
    };
    //查询未读消息数
    // selectAllFriendUnReadMessageLength = () => {
    //     this.sendToServer(types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH, {});
    // };
    //设置我和fromuserinf的消息为已经读区
    setFromUserIdMessageIsRead = (FriendId) => {
        this.sendToServer(types.MESSAGE_SET_USER_ID_IS_READ, {
            FriendId,
        });
    };
    //发送消息给指定用户
    sendMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid, username, avatar_url,FriendId,columnType,taskUri) => {
        if (!this.connectionstatus) {
            return false;
        }
        if (!this.verifyIdentIdy) {
            return false;
        }
        this.sendToServer(types.MESSAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid, username, avatar_url,FriendId,columnType,taskUri
        });
        this.dispatch(Message.onSetNewMsgForRromUserid(fromUserid, msg_type, content, '', new Date().getTime(), fromUserid, 0,username,avatar_url,FriendId,columnType,taskUri));
        this.dispatch(Message.onAddMesage(fromUserid, msg_type, content, toUserid, uuid, new Date().getTime(),FriendId));

        // this.dispatch(Message.onMessageFrom(fromUserid, msg_type, content, msgId, sendDate, ToUserId, sendStatus));
        return true;
    };
    //发送图片消息给指定用户
    sendImageMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid, username, avatar_url,FriendId,columnType,taskUri) => {
        if (!this.connectionstatus) {
            return false;
        }
        if (!this.verifyIdentIdy) {
            return false;
        }

        this.sendToServer(types.MESSAGE_FORIMAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid, username, avatar_url,FriendId,columnType,taskUri
        });
        this.dispatch(Message.onSetNewMsgForRromUserid(fromUserid, msg_type, content, '', new Date().getTime(), fromUserid, 0,username,avatar_url,FriendId,columnType,taskUri));//发送一个消息给好友列表 提示有新消息
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
        if (typeof this.dispatch != 'function') {
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
