import React from 'react';
import {View, Text, StatusBar, Dimensions, Platform, TouchableOpacity, ActivityIndicator} from 'react-native';
import {ChatScreen} from '../common/Chat-ui';
import {theme, bottomTheme} from '../appSet';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import message_more from '../res/svg/message_more.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import {equalsObj, getUUID, renderEmoji} from '../util/CommonUtils';
import {connect} from 'react-redux';
import ChatSocket from '../util/ChatSocket';
import Image from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {createAppealInfo, isFriendChat, selectSimpleTaskInfo, uploadQiniuImage} from '../util/AppService';
import actions from '../action';
import ImageViewerModal from '../common/ImageViewerModal';
import Toast from 'react-native-root-toast';
import BackPressComponent from '../common/BackPressComponent';
import EventBus from '../common/EventBus';
import SkeletonPlaceholder from '../common/SkeletonPlaceholder';
import {ImgOption} from '../common/PickerImage';
import AnimatedFadeIn from '../common/AnimatedFadeIn';
import Global from '../common/Global';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import nodeEmoji from 'node-emoji';

const {width} = Dimensions.get('window');

class ChatRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        const {columnType, task_id, fromUserinfo, taskUri, sendFormId} = this.params;
        this.columnType = columnType;
        this.task_id = task_id;
        this.fromUserinfo = fromUserinfo;
        this.taskUri = taskUri;
        this.sendFormId = sendFormId;
        Global.onNewMessage = (msgType, FriendId, username, content, columnType, taskId, fromUserinfo, taskUri, sendFormId) => {
            if (this.FriendId !== FriendId) {
                this.newMessage.show(username, content, () => {
                    ChatSocket.setFromUserIdMessageIsRead(this.FriendId, this.columnType);


                    if (msgType == 1) {
                        this.columnType = columnType;
                        this.task_id = taskId;
                        this.fromUserinfo = fromUserinfo;
                        this.taskUri = taskUri;
                        this.sendFormId = sendFormId;
                        if (fromUserinfo.id.indexOf('admin') !== -1) {
                            Toast.show('管理员消息', {position: Toast.positions.CENTER});
                        } else {
                            this._updatePage();
                        }


                    } else if (msgType == 2) {
                        let pageName = '', navigationIndex = 0, type = FriendId;
                        if (type > 0 && type <= 3) {
                            pageName = 'TaskReleaseMana';
                            navigationIndex = type - 1;

                        } else if (type > 3 && type <= 8) {
                            pageName = 'TaskOrdersMana';
                            navigationIndex = type - 4;
                        }
                        if (pageName.length > 0) {
                            NavigationUtils.goPage({navigationIndex}, pageName);
                        }
                    }
                });
            }


        };
        ChatSocket.setMsgLength(0);
    }

    pageCount = 10;
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount(): void {
        this.props.onSetMessageLoad(true);

        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this.backPress.componentDidMount();
        this._updatePage();
    }

    _updatePage = () => {
        //初始化申诉或者投诉信息
        if (this.columnType == 2 || this.columnType == 3) { //诉求信息
            createAppealInfo({
                columnType: this.columnType,
                taskid: this.task_id,
                toUserid: this.fromUserinfo.id,
                task_form_id: this.sendFormId,
            }, this.props.userinfo.token).then(result => {
                this.appealInfo = result.appealInfo;
                if (result.haveToDo == 0 || !result.guzhuUserId) {
                    Toast.show('您与雇主并无任务来往,会话创建失败', {position: Toast.positions.CENTER});
                    this.props.onSetMessageLoad(false);
                    return;
                }
                if (result.id) {
                    this.guzhuUserId = result.guzhuUserId;
                    this.haveToDo = result.haveToDo;
                    this.FriendId = result.id;
                    ChatSocket.selectAllMsgForFromUserId(this.FriendId, this.pageCount);
                    this.props.onSetAllFriendUnRead(this.FriendId, this.columnType);
                } else {
                    this.props.onSetMessageLoad(false);
                }

            }).catch(msg => {
                this.props.onSetMessageLoad(false);
                Toast.show(msg, {position: Toast.positions.CENTER});
            });

        } else { //咨询信息
            isFriendChat({
                columnType: this.columnType,
                taskid: this.task_id,
                toUserid: this.fromUserinfo.id,
                sendFormId: this.sendFormId,
            }, this.props.userinfo.token).then(result => {
                if (result.haveToDo == 0 || !result.guzhuUserId) {
                    Toast.show('您与雇主并无任务来往,会话创建失败', {position: Toast.positions.CENTER});
                    this.props.onSetMessageLoad(false);
                    return;
                }
                if (result.id) {
                    this.guzhuUserId = result.guzhuUserId;
                    this.haveToDo = result.haveToDo;
                    this.FriendId = result.id;
                    ChatSocket.selectAllMsgForFromUserId(this.FriendId, this.pageCount);
                    // ChatSocket.setFromUserIdMessageIsRead(this.FriendId, this.columnType);
                    this.props.onSetAllFriendUnRead(this.FriendId, this.columnType);
                } else {
                    this.props.onSetMessageLoad(false);
                }

            }).catch(msg => {
                this.props.onSetMessageLoad(false);
                msg.length > 0 && Toast.show(msg, {position: Toast.positions.CENTER});
            });
        }


    };
    state = {};
    imageArr = [];

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
        if (this.FriendId) {
            ChatSocket.setFromUserIdMessageIsRead(this.FriendId, this.columnType);
        }

        if (this.columnType == 1 || this.columnType == 5) {

        } else if (this.columnType == 2 || this.columnType == 3) { //诉求信息
            EventBus.getInstance().fireEvent(`update_message_appeal_${this.columnType}_page`, {//刷新列表
            });
        }
        Global.onNewMessage = null;
    }


    getMessages = () => {
        const tmpArr = [];
        this.imageArr = [];
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
                const fromId = item.fromUserid;
                let chatInfo = {
                    avatar: this.fromUserinfo.avatar_url,
                    id: this.fromUserinfo.id,
                    nickName: this.fromUserinfo.username,
                };
                let isAdmin = false;
                if (fromId.toString().startsWith('admin|')) {

                    const userinfos = fromId.split('|');
                    if (userinfos.length == 1) {
                        userinfos.push('18'); //userId
                        userinfos.push('客服');//username
                        userinfos.push('http://wenjian.5irenqi.com/admin_ava');//avatar_url
                    }
                    const userId = userinfos[1];
                    const username = userinfos[2];
                    const avatar_url = userinfos[3];
                    chatInfo = {
                        avatar: avatar_url,
                        id: userId,
                        nickName: username,
                    };
                    isAdmin = true;
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
                    targetId: item.fromUserid,
                    chatInfo: chatInfo,
                    isAdmin: isAdmin,
                    renderTime: renTime,
                    sendStatus: parseInt(item.sendStatus),
                    time: item.sendDate,
                });
            }
            if (index === arrs.length - 1) {//最后一条
                if (arrs.length < 10) {
                    if (this.columnType == 1) {
                        tmpArr.push({
                            id: -1,
                            type: 'system',
                            content: '安全交易规范|为了确保您的资金安全，请遵守平台交易规范，一定要在平台内完成支付|了解更多安全交易规范',

                            chatInfo: {
                                avatar: this.fromUserinfo.avatar_url,
                                id: parseInt(this.fromUserinfo.id),
                                nickName: this.fromUserinfo.username,
                            },
                            onClick: () => {
                                NavigationUtils.goPage({type: 2}, 'UserProtocol');
                            },
                        });
                    } else if (this.columnType == 2 || this.columnType == 3) {
                        tmpArr.push({
                            id: -2,
                            type: 'system',
                            content: `确保${this.columnType == 2 ? '申诉' : '投诉'}正常进行|为了确保【${this.columnType == 2 ? '申诉' : '投诉'}】正常进行，请双方诉求前先仔细沟通，诉求中请素质交流|了解诉求须知`,

                            chatInfo: {
                                avatar: this.fromUserinfo.avatar_url,
                                id: parseInt(this.fromUserinfo.id),
                                nickName: this.fromUserinfo.username,
                            },
                            onClick: () => {
                                NavigationUtils.goPage({type: 2}, 'UserProtocol');
                            },
                        });
                    } else if (this.columnType == 5) {
                        tmpArr.push({
                            id: -3,
                            type: 'system',
                            content: '驳回沟通注意事项|当提交任务被驳回时,您可以在此页面仔细询问雇主是否达到要求,善于理解、沟通、素质交流|',
                            chatInfo: {
                                avatar: this.fromUserinfo.avatar_url,
                                id: parseInt(this.fromUserinfo.id),
                                nickName: this.fromUserinfo.username,
                            },
                            onClick: null,
                        });
                    }

                }
            }
        });

        return tmpArr;
    };

    onRefresh = () => {
        //当消息等于10条 和还有新得消息的时候 才让加载更多
        if (this.getMessages().length >= 10 && this.props.message.msgIsLoad) {
            this.pageCount += 10;
            this.props.onSetMessageLoad(true);
            ChatSocket.selectAllMsgForFromUserId(this.FriendId, this.pageCount);
        }

    };
    _appealClick = () => {
        this.columnType = 2;
        this._updatePage(this.columnType, this.task_id, this.fromUserinfo.id);
    };
    msgArr = [];

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.message.msgIsLoad !== nextProps.message.msgIsLoad ||
            this.msgArr != nextProps.message.msgArr
        ) {
            if (!equalsObj(this.msgArr, nextProps.message.msgArr)) {
                this.msgArr = nextProps.message.msgArr;
            }
            return true;
        }
        return false;
    }

    render() {
        // console.log('render');
        const {userinfo, message} = this.props;
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;


        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, this.fromUserinfo.username, message_more, null, 'black', 16, () => {
            NavigationUtils.goPage({fromUserinfo: this.fromUserinfo}, 'ChatSettings');
        });
        const msgList = this.getMessages();
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    {this.task_id && <TaskInfo

                        appealInfo={this.appealInfo}
                        task_id={this.task_id}
                        userinfo={userinfo}
                        columnType={this.columnType}
                        appealClick={this._appealClick}
                        sendFormId={this.sendFormId}
                        guzhuUserId={this.guzhuUserId}
                    />}
                    {/*//当首次显示的时候 顶部的显示*/}
                    {(message.msgIsLoad && msgList.length === 0) && <LoadIng isAbsolute={true}/>}
                    <NewMessage
                        ref={ref => this.newMessage = ref}
                    />
                    <ChatScreen
                        rightMessageTextStyle={{color: 'black'}}
                        leftMessageTextStyle={{color: 'black'}}
                        renderLoadEarlier={() => {
                            // console.log(msgList.length);
                            if (msgList.length === 0) { //当首次显示的时候 下面的不显示
                                return null;
                            }
                            // console.log(message.msgIsLoad, 'message.msgIsLoad');
                            if (message.msgIsLoad) {
                                return <LoadIng/>;
                            } else {
                                return <LoadIng showNoMore={true}/>;
                            }

                        }}
                        renderErrorMessage={(messageStatus) => {
                            let statusText = '';
                            if (messageStatus === -1) {
                                statusText = '您被对方屏蔽,关系异常';
                            } else if (messageStatus === -2) {
                                statusText = '您与对方并无好友关系';
                            } else if (messageStatus === -3) {
                                statusText = '此好友会话状态被关闭';
                            } else {
                                return null;
                            }
                            return <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginHorizontal: 80,
                                backgroundColor: '#c8c8c8',
                                paddingVertical: 3,
                                borderRadius: 40,
                                marginBottom: 10,
                            }}>
                                <Text style={{color: 'rgba(255,255,255,1)', fontSize: 12}}>{statusText}</Text>
                            </View>;

                        }}
                        onEndReachedThreshold={0.3}
                        allPanelAnimateDuration={0}
                        loadHistory={this.onRefresh}
                        inverted={true}
                        inputOutContainerStyle={{
                            backgroundColor: 'white',
                        }}

                        userProfile={{
                            id: userinfo.userid,
                            avatar: userinfo.avatar_url,
                            username: userinfo.username,
                        }}
                        placeholder={'想咨询TA点什么呢'}
                        useVoice={false}
                        ref={(e) => this.chat = e}
                        messageList={msgList}
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
                            icon: <Image source={require('../res/img/photo.png')}
                                         style={{width: wp(8), height: wp(8)}}/>,
                            title: '照片',
                            onPress: () => {
                                ImagePicker.openPicker(ImgOption).then(image => {
                                    this._imgSelect(image);
                                }).catch(err => {
                                });
                            },
                        },
                            {
                                icon: <Image source={require('../res/img/take_phone.png')}
                                             style={{width: wp(8), height: wp(8)}}/>,
                                title: '拍照',
                                onPress: () => {
                                    ImagePicker.openCamera(ImgOption).then(image => {
                                        this._imgSelect(image);
                                    });
                                },
                            },
                        ]}
                    />
                    <ImageViewerModal statusBarType={'dark'} ref={ref => this._imgViewModel = ref}/>
                </View>

            </SafeAreaViewPlus>
        )
            ;
    }

    _imgSelect = (image) => {

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
            onAddMesage(userId, 'image', path, toUserid, uuid, new Date().getTime().toString(), FriendId);//插入一条临时图片数据
            uploadQiniuImage(token, 'chatImage', mime, path).then(url => {
                ChatSocket.sendImageMsgToUserId(userId, toUserid, 'image', url, uuid, userinfo.username, userinfo.avatar_url, FriendId, columnType, this.taskUri, this.task_id, this.fromUserinfo, this.sendFormId);
            });
        } else {
            if (!this.FriendId) {
                Toast.show('重新打开会话试试 ～ ～', {position: Toast.positions.CENTER});
                return;
            }
        }

    };
    sendMessage = (type, content) => {

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
            // let content_=content;
            // console.log(nodeEmoji.hasEmoji(content));
            // if(nodeEmoji.hasEmoji(content)){
            //     content_=nodeEmoji.unemojify(content)
            // }
            ChatSocket.sendMsgToUserId(userId, toUserid, type, nodeEmoji.unemojify(content), uuid, userinfo.username, userinfo.avatar_url, FriendId, columnType, this.taskUri, this.task_id, this.fromUserinfo, this.sendFormId);
        } else {
            if (!this.FriendId) {
                Toast.show('重新打开会话试试 ～ ～', {position: Toast.positions.CENTER});
            }
        }

    };
    _pressAvatar = (isSelf, targetId, isAdmin) => {
        // console.log(isSelf, targetId,isAdmin, 'isSelf, targetId,isAdmin');
        if (!isAdmin) {
            NavigationUtils.goPage({userid: targetId}, 'ShopInfoPage');
        } else {
            const userinfos = targetId.split('|');
            NavigationUtils.goPage({customerInfo: userinfos}, 'CustomerServiceIndex');
        }

    };

}

class LoadIng extends React.Component {
    static defaultProps = {
        isAbsolute: false,
        showNoMore: false,
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.isAbsolute !== nextProps.isAbsolute
            || this.props.showNoMore !== nextProps.showNoMore
        ) {
            return true;
        }

        return false;
    }

    render() {
        const {isAbsolute, showNoMore} = this.props;
        console.log('render');
        return <View style={[{
            zIndex: 1000, alignItems: 'center',
            justifyContent: 'center', width,
            marginVertical: 10,
        }, isAbsolute && {position: 'absolute', top: 90}]}>
            {showNoMore ? <Text style={{color: 'rgba(0,0,0,0.5)', marginLeft: 5, fontSize: hp(1.6)}}>没有更多了
                (¬､¬) </Text> : <View style={{flexDirection: 'row'}}>
                <ActivityIndicator
                    size="small" color={'black'}/>
                <Text style={{color: 'rgba(0,0,0,0.5)', marginLeft: 5}}>加载中...</Text>
            </View>}

        </View>;
    }
}

class TaskInfo extends React.Component {
    state = {
        taskInfo: {},
    };

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (
            this.props.task_id != nextProps.task_id
            || this.props.sendFormId != nextProps.sendFormId
            || this.props.guzhuUserId != nextProps.guzhuUserId
            || !equalsObj(this.state.taskInfo, nextState.taskInfo)
        ) {
            return true;
        }
        return false;
    }

    componentDidMount(): void {
        selectSimpleTaskInfo({task_id: this.props.task_id}, this.props.userinfo.token).then(taskInfo => {
            this.setState({
                taskInfo,
            });
        });

    }

    render() {
        const {taskInfo} = this.state;
        const {columnType, appealInfo} = this.props;
        if (!taskInfo.task_uri) {
            return <SkeletonPlaceholder minOpacity={0.2}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 80}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{height: wp(14), width: wp(14), backgroundColor: 5, borderRadius: 3, marginLeft: 10}}/>
                        <View style={{justifyContent: 'space-around', marginLeft: 10}}>
                            <View style={{height: 15, width: 30}}/>
                            <View style={{height: 13, width: 100}}/>
                            <View style={{height: 11, width: 30}}/>

                        </View>
                    </View>
                    <View style={{height: 60, justifyContent: 'flex-end', marginRight: 10}}>
                        <View style={{
                            height: 25,
                            width: 60,
                            borderRadius: 3,
                        }}/>
                    </View>
                </View>
            </SkeletonPlaceholder>;
        }
        let statusText = '';
        if (columnType === 1) {
            statusText = '任务咨询';
        } else if (columnType === 2) {
            statusText = '申诉';
        } else if (columnType === 3) {
            statusText = '投诉';
        } else if (columnType === 4) {
            statusText = '聊天';
        } else if (columnType === 5) {
            statusText = '驳回沟通';
        }
        if (appealInfo) {
            const {appeal_status} = appealInfo;
            if (appeal_status == 0) {
                statusText += '';
            } else if (appeal_status == -1) {
                statusText += '被驳回,会话状态被关闭';
            } else if (appeal_status == 1) {
                statusText += '已成立,会话状态已关闭';
            }
        }

        return <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: this.props.task_id}, 'TaskDetails');
            }}
            style={{
                height: 80, width, backgroundColor: 'white', zIndex: 1,
                paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', flexDirection: 'row',
                borderBottomWidth: 0.3, borderBottomColor: '#d0d0d0',
            }}>
            <View style={{flexDirection: 'row'}}>
                <Image
                    style={{height: wp(14), width: wp(14)}}
                    source={{uri: taskInfo.task_uri}}
                    resizeMode={Image.resizeMode.stretch}
                />
                <View style={{marginLeft: 10, justifyContent: 'space-between', height: wp(15), width: wp(57)}}>
                    <Text style={{
                        fontSize:20,
                        color: 'black',
                    }}>¥ {parseFloat(taskInfo.reward_price).toFixed(2)}</Text>
                    <Text numberOfLines={2} style={{fontSize: hp(2.0), opacity: 0.5, color: 'black'}}>
                        {taskInfo && renderEmoji(`${taskInfo.task_title}`, [], 13, 0, 'black').map((item, index) => {
                            return item;
                        })}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                        <AnimatedFadeIn>
                            <Text style={{
                                fontSize: 13, opacity: 0.5, color: 'black',

                            }}>
                                {statusText}
                            </Text>
                        </AnimatedFadeIn>
                    </View>
                </View>
            </View>
            <View style={{height: wp(15), justifyContent: 'flex-end'}}>
                <TouchableOpacity
                    onPress={() => {
                        if (columnType == 2 || columnType == 3 || columnType == 5) {
                            NavigationUtils.goPage({sendFormId: this.props.sendFormId}, 'TaskRejectDetailsPage');
                        }

                        if (columnType == 1) {

                            NavigationUtils.goPage({test: false, task_id: this.props.task_id}, 'TaskDetails');
                        }

                    }
                    }
                    style={{
                        height: hp(3.4),
                        width: wp(17),
                        backgroundColor: 'red',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 3,
                        marginTop: 20,
                    }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 14,
                    }}>{(columnType == 2 || columnType == 3 || columnType == 5) ? '任务来往' : '查看详情'}</Text>
                </TouchableOpacity>

            </View>

        </TouchableOpacity>;
    }
}

class NewMessage extends React.Component {
    state = {
        userName: '',
        msg: '',
        isShow: false,
    };
    show = (userName, msg, callBack) => {
        this.callBack = callBack;
        this.setState({userName, msg, isShow: true}, () => {
            setTimeout(() => {
                this.setState({
                    isShow: false,
                });
            }, 3000);

        });
    };


    render() {
        const {isShow, userName, msg} = this.state;
        if (!isShow) {
            return null;
        }
        return <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                this.setState({
                    isShow: false,
                });
                this.callBack();
            }}
            style={{
                position: 'absolute',
                top: 80,
                left: 0,
                height: 30,
                width: width,
                backgroundColor: 'white',
                zIndex: 10,
                justifyContent: 'center',
                alignItems: 'center',

            }}>
            <Text style={{color: bottomTheme, fontSize: wp(3.4)}}>{userName}:{msg}</Text>
        </TouchableOpacity>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
    message: state.message,
});
const mapDispatchToProps = dispatch => ({

    onAddMesage: (fromUserid, msg_type, content, ToUserId, uuid, sendDate, FriendId) => dispatch(actions.onAddMesage(fromUserid, msg_type, content, ToUserId, uuid, sendDate, FriendId)),
    onSetAllFriendUnRead: (FriendId, columnType) => dispatch(actions.onSetAllFriendUnRead(FriendId, columnType)),
    onSetMessageLoad: (loading) => dispatch(actions.onSetMessageLoad(loading)),
});
const ChatRoomPageRedux = connect(mapStateToProps, mapDispatchToProps)(ChatRoomPage);
export default ChatRoomPageRedux;
