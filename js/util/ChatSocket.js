import types from '../action/Types';
import Message from '../action';
import ReconnectingWebSocket from './ReconnectingWebSocket';
import Global from '../common/Global';

class ChatSocket {
    connectionstatus = false;
    isVerifyIdentIdy = false;

    connctionServer = () => {
        if (typeof Global.dispatch != 'function') {
            return;
        }
        const URL = 'ws://d53feb71b6a1b222.natapp.cc:65530/';
        // const URL = 'ws://localhost:433/';
        Global.ws = !Global.ws ? new ReconnectingWebSocket(URL) : Global.ws;
        Global.ws.onopen = () => {
            Global.dispatch(Message.onChangeSocketStatue(''));
            Global.connectionstatus = true;
            this.verifyIdentidy();//重新被链接时再次验证身份
        };

        Global.ws.onmessage = (evt) => {
            const msgData = JSON.parse(evt.data);
            const {type, data} = msgData;
            switch (type) {
                case types.VERIFY_IDENTIDY:
                    const {msg, status} = data;
                    Global.dispatch(Message.verifyIdentIdy(status));
                    if (status === 0) {
                        // Global.dispatch(Message.onChangeSocketStatue(''));
                        this.isVerifyIdentIdy = true;
                    } else {
                        // Global.dispatch(Message.onChangeSocketStatue(''));
                        this.isVerifyIdentIdy = false;
                    }
                    break;
                case types.MESSAGE_FROMOF_USERID://收到消息
                    Global.dispatch(Message.onMessageFrom(data.fromUserid, data.msg_type,
                        data.content, data.msgId, data.sendDate, data.ToUserId, data.sendStatus, data.FriendId));//发送给消息列表

                    Global.dispatch(Message.onSetNewMsgForRromUserid(data.fromUserid, data.msg_type, data.content, data.msgId, data.sendDate, data.ToUserId, data.sendStatus, data.username, data.avatar_url, data.FriendId, data.columnType, data.taskUri, data.taskId, true, data.sendFormId));//发送给好友列表
                    break;
                case types.MESSAGE_SENDTO_USERID_STATUS://消息回调

                    const {
                        msgId,
                        sendStatus,
                        sendDate,
                        uuid,
                    } = data;
                    Global.dispatch(Message.onSetMsgStatus(uuid, msgId, sendDate, sendStatus));
                    break;
                case types.MESSAGE_FRIEND_ALL:
                    let friendArr = [];
                    if (data.friend && data.friend.length > 0) {
                        friendArr = data.friend;
                    }
                    Global.dispatch(Message.onSelectAllFriend(friendArr));
                    //收到回调进行未读消息数回调
                    break;
                case types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS:
                    Global.dispatch(Message.onSetAllFriendUnRead(data.FriendId, data.columnType));
                    break;
                case types.MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS:
                    if (data.msgArr && data.msgArr.length > 0) {
                        Global.dispatch(Message.onGetMegForUserid(data.msgArr));
                    }
                    break;
                // case types.MESSAGE_SET_MSG_ID_READ_SUCCESS:
                //     Global.dispatch(Message.onSetFriendMsgIsRead(data.FriendId));
                //     break;
                case types.MESSAGE_FORIMAGE_SENDTO_USERID_SUCCESS:
                    Global.dispatch(Message.onSetImageMsgStatus(data.uuid, data.msgId, data.sendDate, data.sendStatus, data.content));
                    break;
                case types.ACCOUNT_QUIT_RESPONSE://收到退出账号消息
                    Global.dispatch(Message.onMessageInitialiZation());
                    Global.dispatch(Message.onFriendInitialiZation());
                    Global.token = '';
                    break;
                case types.NOTICE_USER_MESSAGE://收到系统消息
                    Global.dispatch(Message.onSetNoticeMsg(data.type));
                    break;


            }
        };
        //连接关闭的时候触发
        Global.ws.onclose = (e) => {
            Global.connectionstatus = false;
            if (typeof Global.dispatch != 'function') {
                return;
            }
            Global.dispatch(Message.onChangeSocketStatue(''));

        };
        Global.ws.onerror = () => {
            Global.connectionstatus = false;
            if (typeof Global.dispatch != 'function') {
                return;
            }
            Global.dispatch(Message.onChangeSocketStatue('错误连接'));
        };
    };

    //验证身份
    verifyIdentidy = () => {
        // console.log(Global.ws.readyState, 'Global.ws.readyState');
        if (!Global.connectionstatus) {
            return;
        }
        const msgData = {
            type: types.VERIFY_IDENTIDY,
            data: {
                token: Global.token,
            },
        };
        const msgStr = JSON.stringify(msgData);
        try {
            if (Global.connectionstatus) {
                Global.ws.send(msgStr);
            }
        } catch (e) {
            Global.dispatch(Message.onChangeSocketStatue('异常代码:000X1'));
        }
    };
    //查询所有好友消息
    selectAllFriendMessage = (pageCount) => {
        this.sendToServer(types.MESSAGE_SELECT_ALL, {pageCount});
    };
    //退出当前账号
    quitAccount = () => {
        this.sendToServer(types.ACCOUNT_QUIT, {});
    };
    //设置信息id已读取
    // setMsgIdIsRead = (FriendId, toUserid) => {
    //     this.sendToServer(types.MESSAGE_SET_MSG_ID_READ, {FriendId, toUserid});
    // };
    //获取userid所有消息
    selectAllMsgForFromUserid = (friendId, pageCount) => {

        this.sendToServer(types.MESSAGE_GET_FRIENDUSERID_ALL_MES, {friendId, pageCount});
    };
    //设置我和fromuserinf的消息为已经读区
    setFromUserIdMessageIsRead = (FriendId, columnType) => {
        this.sendToServer(types.MESSAGE_SET_USER_ID_IS_READ, {
            FriendId,
            columnType: columnType,
            // columnType
        });
    };
    //发送消息给指定用户
    sendMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, fromUserinfo, sendFormId) => {
        Global.dispatch(Message.onSetNewMsgForRromUserid(fromUserinfo.id, msg_type, content, '', new Date().getTime(), fromUserid, 0, fromUserinfo.username, fromUserinfo.avatar_url, FriendId, columnType, taskUri, taskId, false, sendFormId));
        Global.dispatch(Message.onAddMesage(fromUserid, msg_type, content, toUserid, uuid, new Date().getTime(), FriendId));
        this.sendToServer(types.MESSAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, sendFormId,
        });
        return true;
    };

    //发送图片消息给指定用户
    sendImageMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, sendFormId) => {
        Global.dispatch(Message.onSetNewMsgForRromUserid(fromUserid, msg_type, content, '', new Date().getTime(), fromUserid, 0, username, avatar_url, FriendId, columnType, taskUri, taskId, false, sendFormId));//发送一个消息给好友列表 提示有新消息
        this.sendToServer(types.MESSAGE_FORIMAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, sendFormId,
        });


        return true;
    };
    sendToServer = (type, data) => {
        if (!Global.connectionstatus) {
            Global.dispatch(Message.onChangeSocketStatue('正在连接...'));
            Global.ws.reconnect();
            return;
        }
        if (!this.isVerifyIdentIdy) {
            if (!Global.token || Global.token == '') {
                // Global.dispatch(Message.onChangeSocketStatue('离线'));
                return;
            }
            this.verifyIdentidy();
            return;
        }
        if (!Global.token || Global.token == '') {
            // Global.dispatch(Message.onChangeSocketStatue(''));
            return;
        }
        if (typeof Global.dispatch != 'function') {
            return;
        }
        const msgData = {
            type, data,
        };

        const msgStr = JSON.stringify(msgData);
        try {
            if (Global.connectionstatus) {
                Global.ws.send(msgStr);
            }
        } catch (e) {
            Global.dispatch(Message.onChangeSocketStatue('异常代码:000X1'));
        }
    };
}

const ChatSocketSinge = new ChatSocket();
export default ChatSocketSinge;
