import React from 'react';
import {View, Text, StatusBar, Dimensions, TouchableOpacity} from 'react-native';
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
import {isFriendChat, selectSimpleTaskInfo, uploadQiniuImage} from '../util/AppService';
import actions from '../action';
import ImageViewerModal from '../common/ImageViewerModal';
import Toast from '../common/Toast';

const {width, height} = Dimensions.get('window');

class TaskInfo extends React.Component {
    state = {
        taskInfo: {},
    };

    componentDidMount(): void {
        selectSimpleTaskInfo({task_id: this.props.task_id}, this.props.userinfo.token).then(taskInfo => {
            // console.log(taskInfo);
            this.setState({
                taskInfo,
            });
        });
    }

    render() {
        const {taskInfo} = this.state;
        const {columnType} = this.props;

        return <View style={{
            height: 70, width, backgroundColor: 'white', position: 'absolute', zIndex: 1,
            paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', flexDirection: 'row',
            borderBottomWidth: 0.3, borderBottomColor: '#d0d0d0',
        }}>
            <View style={{flexDirection: 'row'}}>
                <Image
                    style={{height: 50, width: 50, backgroundColor: 5}}
                    source={{uri: taskInfo.task_uri}}
                    resizeMode={Image.resizeMode.stretch}
                />
                <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 15}}>¥ {parseFloat(taskInfo.reward_price).toFixed(2)}</Text>
                    <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.7)', marginTop: 3}}>{taskInfo.task_title}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 15, wdith: 50, marginTop: 3}}>
                        <Text style={{
                            fontSize: 12,
                            color: 'rgba(0,0,0,0.7)',

                        }}>{columnType === 1 ? '任务咨询' : columnType === 2 ? '申诉' : columnType === 3 ? '投诉' : columnType === 4 ? '聊天' : ''}</Text>
                        {/*<TouchableOpacity*/}
                        {/*    onPress={this.props.appealClick}*/}
                        {/*    style={{*/}
                        {/*        width: 40,*/}
                        {/*        height: 15,*/}
                        {/*        backgroundColor: 'red',*/}
                        {/*        justifyContent: 'center',*/}
                        {/*        alignItems: 'center',*/}
                        {/*        marginTop: 2,*/}
                        {/*        marginLeft: 10,*/}
                        {/*        borderRadius: 2,*/}
                        {/*    }}>*/}
                        {/*    <Text style={{fontSize: 12, color: 'white'}}>申诉</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>

                </View>
            </View>
            <View style={{height: 60, justifyContent: 'flex-start'}}>
                <TouchableOpacity
                    onPress={() => {
                        NavigationUtils.goPage({test: false, task_id: this.props.task_id}, 'TaskDetails');
                    }
                    }
                    style={{
                        height: 25,
                        width: 60,
                        backgroundColor: 'red',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 3,
                        marginTop: 20,
                    }}>
                    <Text style={{color: 'white', fontSize: 12}}>查看详情</Text>
                </TouchableOpacity>

            </View>

        </View>;
    }
}

class ChatRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.pageCount = 10;
        const {columnType, task_id, fromUserinfo, taskUri} = this.params;
        this.columnType = columnType;
        this.task_id = task_id;
        this.fromUserinfo = fromUserinfo;
        this.taskUri = taskUri;
    }

    componentDidMount(): void {


        this._updatePage(this.columnType, this.task_id, this.fromUserinfo.id);

    }

    _updatePage = (columnType, task_id, toUserid) => {
        // console.log(toUserid,"task_id");
        isFriendChat({
            columnType,
            taskid: task_id,
            toUserid: toUserid,
        }, this.props.userinfo.token).then(result => {
            console.log(result, 'result');
            if (result.id) {
                this.FriendId = result.id;
                // console.log(this.FriendId, 'this.chatId ');
                ChatSocket.selectAllMsgForFromUserid(this.FriendId, this.pageCount);
            }

        }).catch(msg=>{
            this.toast.show(msg);

        });
    };
    state = {};

    componentWillUnmount(): void {
        ChatSocket.setMsgIdIsRead(this.FriendId, this.fromUserinfo.id);
    }

    _goBackClick = () => {
        NavigationUtils.goBack(this.props.navigation);
    };
    getMessages = () => {
        const tmpArr = [];
        // const {fromUserinfo} = this.params;
        this.props.message.msgArr.forEach((item) => {
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
                        avatar: this.fromUserinfo.avatar_url,
                        id: parseInt(this.fromUserinfo.id),
                        nickName: this.fromUserinfo.username,
                    },
                    renderTime: renTime,
                    sendStatus: parseInt(item.sendStatus),
                    time: item.sendDate,
                });
            }
        });
        return tmpArr;
    };

    onRefresh = () => {
        if (this.getMessages().length >= 10) {
            this.pageCount += 10;
            ChatSocket.selectAllMsgForFromUserid(this.FriendId, this.pageCount);
        }

    };
    _appealClick = () => {
        // const {fromUserinfo, columnType, task_id} = this.params;
        this.columnType = 2;
        // this.task_id = task_id;
        this._updatePage(this.columnType, this.task_id, this.fromUserinfo.id);
    };

    render() {
        // const {fromUserinfo, task_id, columnType} = this.params;
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
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, this.fromUserinfo.username, message_more, null, null, null, () => {
            NavigationUtils.goPage({fromUserinfo: this.fromUserinfo}, 'ChatSettings');
        });
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <View style={{flex: 1}}>
                    <TaskInfo
                        task_id={this.task_id}
                        userinfo={userinfo}
                        columnType={this.columnType}
                        appealClick={this._appealClick}
                    />
                    <ChatScreen
                        loadHistory={this.onRefresh}
                        inverted={true}
                        inputOutContainerStyle={{
                            borderColor: 'rgba(0,0,0,1)', borderTopWidth: 0.2, shadowColor: '#c7c7c7',
                            shadowRadius: 3,
                            shadowOpacity: 1,
                            shadowOffset: {w: 1, h: 1},
                            elevation: 2,//安卓的阴影
                        }}
                        renderLoadEarlier={<View style={{height: 80}}/>}
                        userProfile={{id: userinfo.userid, avatar: userinfo.avatar_url}}
                        placeholder={''}
                        useVoice={false}
                        ref={(e) => this.chat = e}
                        messageList={this.getMessages()}
                        sendMessage={this.sendMessage}
                        pressAvatar={this._pressAvatar}
                        onMessagePress={(type, index, content) => {
                            if (type == 'image') {
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
        // const {fromUserinfo, taskUri} = this.params;//他的用户信息
        const columnType = this.columnType;
        let toUserid = this.fromUserinfo.id;
        if (userId == toUserid) {
            return;
        }
        const uuid = getUUID();//获取一条uuid
        let mime = image.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const path = `file://${image.path}`;
        onAddMesage(userId, 'image', path, toUserid, uuid, new Date().getTime(), FriendId);//插入一条临时图片数据
        uploadQiniuImage(token, 'chatImage', mime, path).then(url => {
            ChatSocket.sendImageMsgToUserId(userId, toUserid, 'image', url, uuid, userinfo.username, userinfo.avatar_url, FriendId, columnType, this.taskUri, this.task_id);
        });
    };
    sendMessage = (type, content) => {
        const FriendId = this.FriendId;
        const {userinfo} = this.props;
        const userId = userinfo.userid;
        const columnType = this.columnType;
        let toUserid = this.fromUserinfo.id;
        if (userId == toUserid) {
            return;
        }
        const uuid = getUUID();
        ChatSocket.sendMsgToUserId(userId, toUserid, type, content, uuid, userinfo.username, userinfo.avatar_url, FriendId, columnType, this.taskUri, this.task_id);
    };
    _pressAvatar = () => {
        NavigationUtils.goPage({userid: this.fromUserinfo.id}, 'ShopInfoPage');
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

    onAddMesage: (fromUserid, msg_type, content, ToUserId, uuid, sendDate, FriendId) => dispatch(actions.onAddMesage(fromUserid, msg_type, content, ToUserId, uuid, sendDate, FriendId)),
});
const ChatRoomPageRedux = connect(mapStateToProps, mapDispatchToProps)(ChatRoomPage);
export default ChatRoomPageRedux;
