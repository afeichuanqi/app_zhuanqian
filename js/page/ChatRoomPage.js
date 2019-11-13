import React, {Component} from 'react';
import {View, Text, Dimensions, TouchableOpacity, StatusBar} from 'react-native';
import {ChatScreen} from '../common/Chat-ui';
import {theme} from '../appSet';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import goback from '../res/svg/goback.svg';
import message_more from '../res/svg/message_more.svg';
import SvgUri from 'react-native-svg-uri';
import NavigationUtils from '../navigator/NavigationUtils';
import {getCurrentTime} from '../util/CommonUtils';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class ChatRoomPage extends React.Component {
    state = {
        messages: [
            {
                id: `1`,
                type: 'text',
                content: 'hello world',
                targetId: '12345678',
                chatInfo: {
                    avatar: require('../res/img/touxiang1.png'),
                    id: '12345678',
                    nickName: 'Test',
                },
                renderTime: true,
                sendStatus: 0,
                time: '1542006036549',
            },
            {
                id: `2`,
                type: 'text',
                content: 'hi/{se}',
                targetId: '12345678',
                chatInfo: {
                    avatar: require('../res/img/touxiang1.png'),
                    id: '12345678',
                    nickName: 'Test',
                },
                renderTime: true,
                sendStatus: 0,
                time: '1542106036549',
            },
            {
                id: `3`,
                type: 'image',
                content: {
                    uri: 'https://upload-images.jianshu.io/upload_images/11942126-044bd33212dcbfb8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/240',
                    width: 100,
                    height: 80,
                },
                targetId: '12345678',
                chatInfo: {
                    avatar: require('../res/img/touxiang1.png'),
                    id: '12345678',
                    nickName: 'Test',
                },
                renderTime: false,
                sendStatus: 0,
                time: '1542106037000',
            },
            {
                id: `4`,
                type: 'text',
                content: '你好/{weixiao}你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好',
                targetId: '88886666',
                chatInfo: {
                    avatar: require('../res/img/touxiang1.png'),
                    id: '12345678',
                },
                renderTime: true,
                sendStatus: -2,
                time: '1542177036549',
            },
        ],
        // chatBg: require('../../source/bg.jpg'),
        inverted: false,  // require
        voiceHandle: true,
        currentTime: 0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: '',
        voicePlaying: false,
        voiceLoading: false,
    };


    sendMessage = (type, content, isInverted) => {
        console.log(type, content, isInverted, 'msg');
    };
    _goBackClick = () => {
        NavigationUtils.goBack(this.props.navigation);
    };

    render() {
        let statusBar = {
            hidden: false,
        };

        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        StatusBar.setBarStyle('dark-content',true)
        StatusBar.setBackgroundColor(theme,true)
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '李凯', message_more);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}

                {TopColumn}

                <View style={{flex: 1}}>
                    <ChatScreen
                        inputOutContainerStyle={{
                            borderColor: 'rgba(0,0,0,1)', borderTopWidth: 0.2, shadowColor: '#c7c7c7',
                            shadowRadius: 3,
                            shadowOpacity: 1,
                            shadowOffset: {w: 1, h: 1},
                            elevation: 10,//安卓的阴影
                        }}
                        // inputStyle={{borderRadius:3}}
                        placeholder={''}
                        useVoice={false}
                        ref={(e) => this.chat = e}
                        messageList={this.state.messages}
                        // androidHeaderHeight={androidHeaderHeight}
                        sendMessage={this.sendMessage}
                        renderMessageTime={this.renderMessageTime}
                        pressAvatar={this._pressAvatar}
                    />
                </View>

            </SafeAreaViewPlus>
        );
    }

    _pressAvatar = () => {
        NavigationUtils.goPage({}, 'ShopInfoPage');
    };
    renderMessageTime = (time) => {
        return <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
            <Text style={{color: '#333', fontSize: 11, opacity: 0.7}}>{getCurrentTime(parseInt(time))}</Text>
        </View>;
    };
}
