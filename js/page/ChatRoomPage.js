import React from 'react';
import {View, Text, StatusBar, Dimensions} from 'react-native';
import {ChatScreen} from '../common/Chat-ui';
import {theme} from '../appSet';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import message_more from '../res/svg/message_more.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import {getUUID} from '../util/CommonUtils';
import {connect} from 'react-redux';
import message from '../reducer/message';
import ChatSocket from '../util/ChatSocket';
import Image from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {isFriendChat, uploadQiniuImage} from '../util/AppService';
import actions from '../action';
import ImageViewerModal from '../common/ImageViewerModal';

class ChatRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.pageCount = 10;
        this.unReadArr = [];
    }

    componentDidMount(): void {
        const {fromUserinfo, columnType, task_id} = this.params;
        isFriendChat({
            columnType,
            taskid: task_id,
            toUserid: fromUserinfo.id,
        }, this.props.userinfo.token).then(result => {
            if (result.id) {
                this.FriendId = result.id;
                console.log(this.FriendId, 'this.chatId ');
                ChatSocket.selectAllMsgForFromUserid(this.FriendId, this.pageCount);
            }

        });


    }

    state = {};
    componentWillUnmount(): void {
        const {fromUserinfo,} = this.params;
        ChatSocket.setMsgIdIsRead(this.FriendId,fromUserinfo.id);
    }

    _goBackClick = () => {
        NavigationUtils.goBack(this.props.navigation);
    };
    getMessages = () => {
        const tmpArr = [];
        const {fromUserinfo} = this.params;
        const {userinfo} = this.props;
        this.props.message.msgArr.forEach((item) => {
            console.log(item.FriendId,"FriendId");
            console.log(this.FriendId,"this.FriendId");
            if (item.FriendId == this.FriendId) {
                const PreviousIndex = tmpArr.length;
                let renTime = true;
                if (PreviousIndex != 0) {
                    const interval = parseInt(item.sendDate) - parseInt(tmpArr[PreviousIndex - 1].time);
                    if (interval < 100000) {
                        renTime = false;
                    }
                }
                tmpArr.push({
                    id: item.msgId ? item.msgId : item.uuid,
                    type: item.msg_type,
                    content: item.msg_type == 'image' ?
                        {
                            uri: item.content,
                            width: 100,
                            height: 80,
                        }
                        : item.content,
                    targetId: parseInt(item.fromUserid),
                    chatInfo: {
                        avatar: fromUserinfo.avatar_url,
                        id: parseInt(fromUserinfo.id),
                        nickName: fromUserinfo.username,
                    },
                    renderTime: renTime,
                    sendStatus: parseInt(item.sendStatus),
                    time: item.sendDate,
                });

                // if (item.FriendId == this.FriendId && item.un_read == 0) { //未读消息 设置未已经读取
                //     if (this.unReadArr.findIndex((n) => n == item.msgId) == -1) {//防止多次去增加服务器负担
                //
                //         this.unReadArr.push(item.msgId);
                //     }
                // }
            }
        });
        return tmpArr;
    };

    onRefresh = () => {
        this.pageCount += 10;
        const {fromUserinfo} = this.params;
        ChatSocket.selectAllMsgForFromUserid( this.FriendId, this.pageCount);
    };

    render() {
        const {fromUserinfo} = this.params;
        const {userinfo} = this.props;
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, fromUserinfo.username, message_more, null, null, null, () => {
            NavigationUtils.goPage({fromUserinfo: this.params.fromUserinfo}, 'ChatSettings');
        });
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <ChatScreen
                        // loadHistory={this.onRefresh}
                        inverted={1}
                        inputOutContainerStyle={{
                            borderColor: 'rgba(0,0,0,1)', borderTopWidth: 0.2, shadowColor: '#c7c7c7',
                            shadowRadius: 3,
                            shadowOpacity: 1,
                            shadowOffset: {w: 1, h: 1},
                            elevation: 2,//安卓的阴影
                        }}
                        userProfile={{id: userinfo.userid, avatar: userinfo.avatar_url}}
                        placeholder={''}
                        useVoice={false}
                        ref={(e) => this.chat = e}
                        messageList={this.getMessages()}
                        sendMessage={this.sendMessage}
                        pressAvatar={this._pressAvatar}
                        onMessagePress={(type, index, content) => {
                            console.log('消息被单击');
                            if (type == 'image') {
                                console.log(content);
                                this._imgViewModel.show({
                                    url: content,
                                });
                            }
                        }}
                        panelSource={[{
                            icon: <Image source={require('../res/img/photo.png')} style={{width: 30, height: 30}}/>,
                            title: '照片',
                            onPress: () => {
                                ImagePicker.openPicker({
                                    width: 300,
                                    height: 400,
                                    cropping: false,
                                    // includeBase64: true,
                                }).then(image => {
                                    this._imgSelect(image);
                                });
                            },
                        },
                            {
                                icon: <Image source={require('../res/img/take_phone.png')}
                                             style={{width: 30, height: 30}}/>,
                                title: '拍照',
                                onPress: () => {
                                    ImagePicker.openCamera({
                                        width: 300,
                                        height: 400,
                                        cropping: false,
                                    }).then(image => {
                                        this._imgSelect(image);
                                    });
                                },
                            },
                        ]}
                    />
                    <ImageViewerModal ref={ref => this._imgViewModel = ref}/>
                </View>

            </SafeAreaViewPlus>
        );
    }

    _imgSelect = (image) => {
        const FriendId = this.FriendId;
        const {userinfo, onAddMesage} = this.props;//我的用户信息
        const userId = userinfo.userid;
        const token = userinfo.token;
        const {fromUserinfo,columnType,taskTitle} = this.params;//他的用户信息
        let toUserid = fromUserinfo.id;
        if (userId == toUserid) {
            return;
        }
        const uuid = getUUID();//获取一条uuid
        let mime = image.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const path = `file://${image.path}`;
        onAddMesage(userId, 'image', path, toUserid, uuid, new Date().getTime(),FriendId);//插入一条临时图片数据
        uploadQiniuImage(token, 'chatImage', mime, path).then(url => {
            ChatSocket.sendImageMsgToUserId(userId, toUserid, 'image', url, uuid, userinfo.username, userinfo.avatar_url,FriendId,columnType,taskTitle);
        });
    };
    sendMessage = (type, content) => {
        const FriendId = this.FriendId;
        // columnType,taskTitle
        // const {fromUserinfo, columnType, task_id} = this.params;
        const {userinfo} = this.props;
        const userId = userinfo.userid;
        const {fromUserinfo,columnType,taskTitle} = this.params;
        let toUserid = fromUserinfo.id;
        console.log(taskTitle,"taskTitletaskTitletaskTitle");
        if (userId == toUserid) {
            return;
        }
        const uuid = getUUID();
        ChatSocket.sendMsgToUserId(userId, toUserid, type, content, uuid, userinfo.username, userinfo.avatar_url, FriendId,columnType,taskTitle);
    };
    _pressAvatar = () => {
        const {fromUserinfo} = this.params;
        NavigationUtils.goPage({fromUserinfo}, 'ShopInfoPage');
        // console.log(data1,data2);
    };
    renderMessageTime = (time) => {
        return <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
            <Text style={{color: '#333', fontSize: 11, opacity: 0.7}}>{time}</Text>
        </View>;
    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
    message: state.message,
});
const mapDispatchToProps = dispatch => ({
    onAddMesage: (fromUserid, msg_type, content, ToUserId, uuid, sendDate,FriendId) => dispatch(actions.onAddMesage(fromUserid, msg_type, content, ToUserId, uuid, sendDate,FriendId)),
});
const ChatRoomPageRedux = connect(mapStateToProps, mapDispatchToProps)(ChatRoomPage);
export default ChatRoomPageRedux;
