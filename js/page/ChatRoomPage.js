import React from 'react';
import {View, Text, StatusBar, Dimensions, Platform, TouchableOpacity} from 'react-native';
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
import {createAppealInfo, isFriendChat, selectSimpleTaskInfo, uploadQiniuImage} from '../util/AppService';
import actions from '../action';
import ImageViewerModal from '../common/ImageViewerModal';
import Toast from '../common/Toast';
import BackPressComponent from '../common/BackPressComponent';

const {width, height} = Dimensions.get('window');

class TaskInfo extends React.Component {
    state = {
        taskInfo: {},
    };

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.task_id != nextProps.task_id
            || this.state.taskInfo != nextState.taskInfo
        ) {
            return true;
        }
        return false;
    }

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
                    style={{height: 50, width: 50, backgroundColor: 5, borderRadius: 3}}
                    source={{uri: taskInfo.task_uri}}
                    resizeMode={Image.resizeMode.stretch}
                />
                <View style={{marginLeft: 10, justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 15}}>¥ {parseFloat(taskInfo.reward_price).toFixed(2)}</Text>
                    <Text style={{fontSize: 11, color: 'rgba(0,0,0,0.5)'}}>{taskInfo.task_title}</Text>
                    <Text style={{
                        fontSize: 11,
                        color: 'rgba(0,0,0,0.5)',
                    }}>
                        {columnType === 1 ? '任务咨询' : columnType === 2 ? '申诉' : columnType === 3 ? '投诉' : columnType === 4 ? '聊天' : ''}
                    </Text>

                </View>
            </View>
            <View style={{height: 60, justifyContent: 'flex-start'}}>
                <TouchableOpacity
                    onPress={() => {
                        if (columnType == 2) {
                            NavigationUtils.goPage({sendFormId: this.props.sendFormId}, 'TaskRejectDetailsPage');
                        } else {
                            NavigationUtils.goPage({test: false, task_id: this.props.task_id}, 'TaskDetails');
                        }

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
                    <Text style={{color: 'white', fontSize: 12}}>{columnType == 2 ? '任务来往' : '查看详情'}</Text>
                </TouchableOpacity>

            </View>

        </View>;
    }
}

class ChatRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        const {columnType, task_id, fromUserinfo, taskUri, sendFormId} = this.params;
        // this={...this,...}
        this.columnType = columnType;
        this.task_id = task_id;
        this.fromUserinfo = fromUserinfo;
        this.taskUri = taskUri;
        this.sendFormId = sendFormId;
    }

    pageCount = 10;
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount(): void {
        this.backPress.componentDidMount();
        this._updatePage();


    }

    _updatePage = () => {
        //初始化申诉或者投诉信息
        if (this.columnType == 2 || this.columnType == 3) { //诉求信息
            console.log({
                columnType: this.columnType,
                taskid: this.task_id,
                toUserid: this.fromUserinfo.id,
                task_form_id: this.sendFormId,
            });
            createAppealInfo({
                columnType: this.columnType,
                taskid: this.task_id,
                toUserid: this.fromUserinfo.id,
                task_form_id: this.sendFormId,
            }, this.props.userinfo.token).then(result => {
                if (result.haveToDo == 0 || !result.guzhuUserId) {
                    this.toast.show('您与雇主并无任务来往,会话创建失败');
                    return;
                }
                console.log(result);
                if (result.id) {
                    this.guzhuUserId = result.guzhuUserId;
                    this.haveToDo = result.haveToDo;
                    this.FriendId = result.id;

                    ChatSocket.selectAllMsgForFromUserid(this.FriendId, this.pageCount);
                }

            }).catch(msg => {
                this.toast.show(msg);

            });
            return;
        }


        isFriendChat({
            columnType: this.columnType,
            taskid: this.task_id,
            toUserid: this.fromUserinfo.id,
        }, this.props.userinfo.token).then(result => {
            if (result.haveToDo == 0 || !result.guzhuUserId) {
                this.toast.show('您与雇主并无任务来往,会话创建失败');
                return;
            }
            if (result.id) {
                this.guzhuUserId = result.guzhuUserId;
                this.haveToDo = result.haveToDo;
                this.FriendId = result.id;
                ChatSocket.selectAllMsgForFromUserid(this.FriendId, this.pageCount);
            }

        }).catch(msg => {
            this.toast.show(msg);

        });
    };
    state = {};
    imageArr = [];

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
        ChatSocket.setMsgIdIsRead(this.FriendId, this.fromUserinfo.id);
    }


    getMessages = () => {
        const tmpArr = [];

        this.props.message.msgArr.forEach((item, index, arrs) => {
            if (item.FriendId == this.FriendId) {
                const PreviousIndex = tmpArr.length;
                let renTime = true;
                if (PreviousIndex != 0) {
                    const interval = parseInt(item.sendDate) - parseInt(tmpArr[PreviousIndex - 1].time);
                    if (interval < 100000) {
                        renTime = false;
                    }
                }
                if (item.msg_type == 'image') {
                    const url = item.content;
                    if (url.indexOf('file://') === -1) {
                        const findindex = this.imageArr.findIndex(item => item.url == url);
                        if (findindex === -1) {
                            this.imageArr.push({url});
                        }
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
            if (index === arrs.length - 1) {//最后一条
                if (arrs.length < 10 && arrs.length > 0) {
                    tmpArr.push({
                        id: -10,
                        type: 'system',
                        content: '为了确保您的资金安全，请遵守平台交易规范，一定要在平台内完成支付',
                        title: '安全交易规范',
                        chatInfo: {
                            avatar: this.fromUserinfo.avatar_url,
                            id: parseInt(this.fromUserinfo.id),
                            nickName: this.fromUserinfo.username,
                        },
                    });
                }
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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, this.fromUserinfo.username, message_more, null, null, null, () => {
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
                    {this.task_id && <TaskInfo
                        task_id={this.task_id}
                        userinfo={userinfo}
                        columnType={this.columnType}
                        appealClick={this._appealClick}
                        sendFormId={this.sendFormId}
                    />}

                    <ChatScreen
                        onEndReachedThreshold={0.3}
                        systemClick={() => {
                            // NavigationUtils
                            NavigationUtils.goPage({type: 2}, 'UserProtocol');
                        }}
                        allPanelAnimateDuration={0}
                        loadHistory={this.onRefresh}
                        inverted={true}
                        inputOutContainerStyle={{
                            borderColor: 'rgba(0,0,0,1)',
                            borderTopWidth: Platform.OS == 'android' ? 0.2 : 0.1,
                            shadowColor: '#cdcdcd',
                            shadowRadius: 1,
                            shadowOpacity: 1,
                            shadowOffset: {w: 1, h: 1},
                            elevation: 1,//安卓的阴影
                        }}
                        renderLoadEarlier={() => {
                            return <View style={{height: 80}}/>;
                        }}
                        userProfile={{id: userinfo.userid, avatar: userinfo.avatar_url, username: userinfo.username}}
                        placeholder={'想咨询TA点什么呢'}
                        useVoice={false}
                        ref={(e) => this.chat = e}
                        messageList={this.getMessages()}
                        sendMessage={this.sendMessage}
                        showUserName={true}
                        pressAvatar={this._pressAvatar}
                        guzhuInfo={{guzhuUserId: this.guzhuUserId, haveToDo: this.haveToDo}}
                        onMessagePress={(type, index, content) => {
                            if (type == 'image') {

                                this._imgViewModel.show(this.imageArr, content);
                            }
                        }}
                        panelSource={[{
                            icon: <Image source={require('../res/img/photo.png')} style={{width: 30, height: 30}}/>,
                            title: '照片',
                            onPress: () => {
                                ImagePicker.openPicker({
                                    width: Platform.OS === 'ios' ? 1800 : 600,
                                    height: Platform.OS === 'ios' ? 1200 : 400,
                                    cropping: true,
                                    mediaType: 'photo',
                                    cropperChooseText: '确认',
                                    cropperCancelText: '取消',
                                    cropperToolbarTitle: '选择图片',
                                    freeStyleCropEnabled: true,
                                    showCropGuidelines: true,
                                    compressImageQuality: 0.7,
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
                                        // cropping: true,
                                        mediaType: 'photo',
                                        cropperChooseText: '确认',
                                        cropperCancelText: '取消',
                                        cropperToolbarTitle: '选择图片',
                                        freeStyleCropEnabled: true,
                                        showCropGuidelines: true,
                                        compressImageQuality: 0.7,
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
        if (!this.FriendId) {
            this.show('重新打开会话试试 ～ ～');
            return;
        }
        if (this.haveToDo == 1) {
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
                ChatSocket.sendImageMsgToUserId(userId, toUserid, 'image', url, uuid, userinfo.username, userinfo.avatar_url, FriendId, columnType, this.taskUri, this.task_id, this.fromUserinfo);
            });
        }

    };
    sendMessage = (type, content) => {
        if (!this.FriendId) {
            this.show('重新打开会话试试 ～ ～');
            return;
        }
        if (this.haveToDo == 1) {
            const FriendId = this.FriendId;
            const {userinfo} = this.props;
            const userId = userinfo.userid;
            const columnType = this.columnType;
            let toUserid = this.fromUserinfo.id;
            if (userId == toUserid) {
                return;
            }
            const uuid = getUUID();
            // console.log(this.fromUserinfo,"this.fromUserinfo");
            ChatSocket.sendMsgToUserId(userId, toUserid, type, content, uuid, userinfo.username, userinfo.avatar_url, FriendId, columnType, this.taskUri, this.task_id, this.fromUserinfo);
        }

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
