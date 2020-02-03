import types from '../action/Types';
import Message from '../action';
import Global from '../common/Global';
import ReconnectingWebSocket from 'reconnecting-websocket';
class ChatSocket {

    isVerifyIdentIdy = false;
    historyMegLen = 0;
    connectionServer = () => {
        //心跳包
        const heartCheck = {
            timeout: 5000,//default 10s
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function () {
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start: function () {
                let self = this;
                this.timeoutObj = setTimeout(function () {
                    Global.ws.send('ping');
                    self.serverTimeoutObj = setTimeout(function () {
                        // Global.ws.close();
                        // Global.connectionstatus = false;
                        // if (typeof Global.dispatch != 'function') {
                        //     return;
                        // }
                        // Global.dispatch(Message.onChangeSocketStatue('刷新重连...'));
                        // Toast.show('聊天连接已经断开了哦 ~ ~');
                    }, self.timeout);
                }, this.timeout);
            },
        };
        if (typeof Global.dispatch != 'function') {
            return;
        }
        // const URL = 'ws://d53feb71b6a1b222.natapp.cc:65530/';
        const URL = 'ws://chat.easy-z.cn/';
        // const URL = 'ws://localhost:433/';

        Global.ws = !Global.ws ? new ReconnectingWebSocket(URL) : Global.ws;
        Global.ws.addEventListener('open', () => {
            Global.dispatch(Message.onChangeSocketStatue(''));
            Global.connectionstatus = true;
            this.verifyIdentity();//重新被链接时再次验证身份
            Global.ws.send('ping');
            heartCheck.reset().start();
        });
        Global.ws.addEventListener('message', (evt) => {
            const msgText = evt.data;
            if (msgText === 'pong') {
                heartCheck.reset().start();
                return;
            }
            // console.log(msgText);
            const msgData = JSON.parse(msgText);
            const {type, data} = msgData;
            switch (type) {
                case types.VERIFY_IDENTIDY:
                    const {msg, status} = data;
                    Global.dispatch(Message.verifyIdentIdy(status));
                    if (status === 0) {
                        this.isVerifyIdentIdy = true;
                    } else {
                        this.isVerifyIdentIdy = false;
                    }
                    break;
                case types.MESSAGE_FROMOF_USERID://收到消息
                    Global.dispatch(Message.onMessageFrom(data.fromUserid, data.msg_type,
                        data.content, data.msgId, data.sendDate, data.ToUserId, data.sendStatus, data.FriendId));//发送给消息列表
                    let content1 = '';
                    if (data.msg_type == 'text') {
                        content1 = data.content;
                    } else if (data.msg_type == 'image') {
                        content1 = '[图片]';
                    } else if (data.msg_type == 'system') {
                        content1 = '[系统消息]';
                    }
                    Global.onNewMessage && Global.onNewMessage(
                        1,
                        data.FriendId,
                        data.username,
                        content1,
                        data.columnType,
                        data.taskId,
                        {
                            avatar_url: data.avatar_url,
                            id: data.fromUserid,
                            username: data.username,
                            taskTitle: '',

                        },
                        data.taskUri,
                        data.sendFormId,
                    );
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

                    break;
                case types.MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS:
                    if (this.historyMegLen + 10 > data.msgArr.length
                    ) {
                        Global.dispatch(Message.onSetMessageLoad(false));
                    }
                    if (data.msgArr && data.msgArr.length > 0) {
                        this.historyMegLen = data.msgArr.length;
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
                    Global.token = '';
                    Global.dispatch(Message.onMessageInitialiZation());
                    Global.dispatch(Message.onFriendInitialiZation());

                    break;
                case types.NOTICE_USER_MESSAGE://收到系统消息

                    let userName = '', content = '';
                    if (data.type > 0 && data.type <= 3) {
                        userName = '发布消息';
                        content = '您收到一条发布消息';

                    } else if (data.type > 3 && data.type <= 8) {
                        userName = '接单消息';
                        content = '您收到一条接单消息';
                    }
                    Global.onNewMessage && Global.onNewMessage(2, data.type, userName, content);
                    Global.dispatch(Message.onSetNoticeMsg(data.type));
                    break;


            }
        });
        Global.ws.addEventListener('close',(e) => {
            // console.log(e);
            // // Toast.show('聊天连接已经断开了哦 ~ ~ ~');
            Global.connectionstatus = false;
            if (typeof Global.dispatch != 'function') {
                return;
            }
            Global.dispatch(Message.onChangeSocketStatue('重新连接中 (¬､¬)'));

        });
        Global.ws.addEventListener('error', (e) => {
            // console.log('onerror', e);
            // // Toast.show('聊天连接发生错误 ~ ~');
            // // console.log(e);
            Global.connectionstatus = false;
            if (typeof Global.dispatch != 'function') {
                return;
            }
            Global.dispatch(Message.onChangeSocketStatue('重新连接中 (¬､¬)'));
        });
    };

    //验证身份
    verifyIdentity = () => {
        if (Global.ws.readyState === 2 || Global.ws.readyState === 3) {
            Global.ws.reconnect();
        }
        if (!Global.connectionstatus) {
            return;
        }
        if (!Global.token || Global.token.length === 0) {
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
            if (Global.connectionstatus && Global.ws.readyState == 1) {
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
    //获取userid所有消息
    selectAllMsgForFromUserId = (friendId, pageCount) => {

        this.sendToServer(types.MESSAGE_GET_FRIENDUSERID_ALL_MES, {friendId, pageCount});

    };
    setMsgLength = (historyMegLen) => {
        this.historyMegLen = historyMegLen;
    };
    //设置我和fromuserinf的消息为已经读区
    setFromUserIdMessageIsRead = (FriendId, columnType) => {
        Global.dispatch(Message.onSetAllFriendUnRead(FriendId, columnType));
        this.sendToServer(types.MESSAGE_SET_USER_ID_IS_READ, {
            FriendId,
            columnType: columnType,
        });

    };
    //发送消息给指定用户
    sendMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, fromUserinfo, sendFormId) => {
        Global.dispatch(Message.onSetNewMsgForRromUserid(fromUserinfo.id, msg_type, content, '', new Date().getTime().toString(), fromUserid, 0, fromUserinfo.username, fromUserinfo.avatar_url, FriendId, columnType, taskUri, taskId, false, sendFormId));
        Global.dispatch(Message.onAddMesage(fromUserid, msg_type, content, toUserid, uuid, new Date().getTime().toString(), FriendId));
        this.sendToServer(types.MESSAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, sendFormId,
        });
        return true;
    };

    //发送图片消息给指定用户
    sendImageMsgToUserId = (fromUserid, toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, sendFormId) => {
        Global.dispatch(Message.onSetNewMsgForRromUserid(fromUserid, msg_type, content, '', new Date().getTime().toString(), fromUserid, 0, username, avatar_url, FriendId, columnType, taskUri, taskId, false, sendFormId));//发送一个消息给好友列表 提示有新消息
        this.sendToServer(types.MESSAGE_FORIMAGE_SENDTO_USERID, {
            toUserid, msg_type, content, uuid, username, avatar_url, FriendId, columnType, taskUri, taskId, sendFormId,
        });


        return true;
    };
    sendToServer = (type, data) => {
        // console.log(Global.ws.readyState);
        if (!Global.connectionstatus && Global.ws.readyState == 3) {
            Global.dispatch(Message.onChangeSocketStatue('正在连接...'));
            Global.ws.reconnect();
            return;
        }
        if (!this.isVerifyIdentIdy) {
            if (!Global.token || Global.token == '') {
                // Global.dispatch(Message.onChangeSocketStatue('离线'));
                return;
            }
            this.verifyIdentity();
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
            // console.log(Global.ws, 'Global.ws');
            if (Global.connectionstatus && Global.ws.readyState == 1) {
                Global.ws.send(msgStr);
            }
        } catch (e) {
            Global.dispatch(Message.onChangeSocketStatue('异常代码:000X1'));
        }
    };
}

const ChatSocketSinge = new ChatSocket();
export default ChatSocketSinge;
