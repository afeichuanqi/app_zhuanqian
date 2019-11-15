import React from 'react';
import {View, Text, Dimensions, StatusBar} from 'react-native';
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

class ChatRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.pageCount = 10;
    }

    componentDidMount(): void {
        const {fromUserinfo} = this.params;
        ChatSocket.selectAllMsgForFromUserid(fromUserinfo.id, this.pageCount);
    }

    state = {};

    _goBackClick = () => {
        NavigationUtils.goBack(this.props.navigation);
    };

    getMessages = () => {
        const tmpArr = [];
        console.log(this.props.message.msgArr, 'this.props.message.msgArr');
        const {fromUserinfo} = this.params;
        const {userinfo} = this.props;
        this.props.message.msgArr.forEach((item) => {
            if ((item.fromUserid == fromUserinfo.id && item.ToUserId == userinfo.userid)
                || (item.fromUserid == userinfo.userid && item.ToUserId == fromUserinfo.id)
            ) {
                tmpArr.push({
                    id: item.msgId,
                    type: item.msg_type,
                    content: item.content,
                    targetId: parseInt(item.fromUserid),
                    chatInfo: {
                        avatar: fromUserinfo.avatar_url,
                        id: parseInt(fromUserinfo.id),
                        nickName: fromUserinfo.username,
                    },
                    renderTime: true,
                    sendStatus: parseInt(item.sendStatus),
                    time: item.sendDate+'000',
                });
                if (item.un_read == 0) {//未读消息 设置未已经读取
                    ChatSocket.setMsgIdIsRead(item.msgId, item.fromUserid);

                }


            }

        });
        console.log();
        return tmpArr;
    };

    onRefresh = () => {
        this.pageCount += 10;
        const {fromUserinfo} = this.params;
        ChatSocket.selectAllMsgForFromUserid(fromUserinfo.id, this.pageCount);
    };

    render() {
        const {fromUserinfo} = this.params;
        const {userinfo} = this.props;
        let statusBar = {
            hidden: false,
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, fromUserinfo.username, message_more);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}

                {TopColumn}

                <View style={{flex: 1}}>
                    <ChatScreen
                        loadHistory={() => {
                            console.log('我被触发');
                        }}
                        onRefresh={this.onRefresh}
                        loading={false}
                        inputOutContainerStyle={{
                            borderColor: 'rgba(0,0,0,1)', borderTopWidth: 0.2, shadowColor: '#c7c7c7',
                            shadowRadius: 3,
                            shadowOpacity: 1,
                            shadowOffset: {w: 1, h: 1},
                            elevation: 10,//安卓的阴影
                        }}
                        userProfile={{id: userinfo.userid, avatar: userinfo.avatar_url}}
                        // inputStyle={{borderRadius:3}}
                        placeholder={''}
                        useVoice={false}
                        ref={(e) => this.chat = e}
                        messageList={this.getMessages()}
                        // androidHeaderHeight={androidHeaderHeight}
                        sendMessage={this.sendMessage}
                        // renderMessageTime={this.renderMessageTime}
                        pressAvatar={this._pressAvatar}
                    />
                </View>

            </SafeAreaViewPlus>
        );
    }

    sendMessage = (type, content, isInverted) => {
        const {userinfo} = this.props;
        const userId = userinfo.userid;
        const {fromUserinfo} = this.params;
        let toUserid = fromUserinfo.id;
        const uuid = getUUID();
        const isSuccess = ChatSocket.sendMsgToUserId(userId, toUserid, type, content, uuid, userinfo.username, userinfo.avatar_url);
        if (isSuccess) {

        }
    };
    _pressAvatar = () => {
        NavigationUtils.goPage({}, 'ShopInfoPage');
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
const mapDispatchToProps = dispatch => ({});
const ChatRoomPageRedux = connect(mapStateToProps, mapDispatchToProps)(ChatRoomPage);
export default ChatRoomPageRedux;
