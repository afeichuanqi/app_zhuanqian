/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    StyleSheet,
} from 'react-native';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import SvgUri from 'react-native-svg-uri';
import message_xitong from '../res/svg/message_xitong.svg';
import zaixiankefu from '../res/svg/zaixiankefu.svg';
import huodongxiaoxi from '../res/svg/huodongxiaoxi.svg';
import FastImage from 'react-native-fast-image';
import Animated, {Easing} from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';
import EmptyComponent from '../common/EmptyComponent';
import ChatSocket from '../util/ChatSocket';
import {connect} from 'react-redux';
import {getCurrentTime} from '../common/Chat-ui/app/chat/utils';
import {test111} from '../util/AppService';

const {timing} = Animated;
const width = Dimensions.get('window').width;


class MessagePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {
        ChatSocket.selectAllFriendMessage();
        // test111('https://api.chaofun.co/user/get_constant?user_id=54&timestamp=1573785160314&device_width=375&image_size_times=-1&token=d5e02b310508b76a7ebbfa7006b74c5c')
        // test111('https://api.chaofun.co/user/get_constant?user_id=54&timestamp=1573785160314&device_width=375&image_size_times=-1&token=d5e02b310508b76a7ebbfa7006b74c5c')
        // test111('https://api.chaofun.co/user/get_constant?user_id=54&timestamp=1573785160314&device_width=375&image_size_times=-1&token=d5e02b310508b76a7ebbfa7006b74c5c')
        // test111('https://api.chaofun.co/user/get_constant?user_id=54&timestamp=1573785160314&device_width=375&image_size_times=-1&token=d5e02b310508b76a7ebbfa7006b74c5c')
        // test111('https://api.chaofun.co/user/get_constant?user_id=54&timestamp=1573785160314&device_width=375&image_size_times=-1&token=d5e02b310508b76a7ebbfa7006b74c5c')

    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);

    }

    render() {
        const RefreshHeight = Animated.interpolate(this.animations.val, {
            inputRange: [-200,-0.1, 0],
            outputRange: [300, 30,0],
            extrapolate: 'clamp',
        });

        let statusBar = {
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
            // barStyle: 'dark-content',
            // translucent:true
        };
        let navigationBar = <NavigationBar
            // showStatusBarHeight={true}
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        const {unMessageLength} = this.props.friend;
        const {statusText} = this.props.socketStatus;

        return (
            <View style={{flex: 1}}>
                {navigationBar}
                <Animated.View
                    // ref={ref => this.zhedangRef = ref}
                    style={{
                        backgroundColor: bottomTheme,
                        height: RefreshHeight,
                        width,
                        position: 'absolute',
                        top: 50,
                        // zIndex:1,
                    }}>
                </Animated.View>
                <View style={{
                    height: 40,
                    width,
                    backgroundColor: bottomTheme,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex:3,
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 17,
                    }}>互动{statusText != '' ? `(${statusText})` : unMessageLength ? unMessageLength > 0 ? `(${unMessageLength})` : '' : ''}</Text>
                </View>

                <MsgList friend={this.props.friend} RefreshHeight={this.animations.val}/>

            </View>
        );
    }

    animations = {
        val: new Animated.Value(1),
    };
}

class MessageColumn extends PureComponent {
    render() {
        return <View style={{
            width: width - 20,
            height: 100,
            backgroundColor: 'white',
            position: 'absolute',
            top: 0,
            borderRadius: 10,
            shadowColor: '#d9d9d9',
            shadowRadius: 5,
            shadowOpacity: 1,
            shadowOffset: {w: 1, h: 1},
            elevation: 3,//安卓的阴影
            flexDirection: 'row',
            justifyContent: 'space-around',
        }}>
            <MessageColumnItem svgXmlData={message_xitong} title={'通知消息'}/>
            <MessageColumnItem svgXmlData={zaixiankefu} title={'互动消息'} size={48}/>
            <MessageColumnItem svgXmlData={huodongxiaoxi} title={'活动消息'} size={42}/>
            <MessageColumnItem/>
        </View>;
    }
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MsgList extends Component {
    state = {
        friendData: [],
        isLoading: false,
        hideLoaded: true,
    };
    params = {
        pageIndex: 0,
    };

    render() {
        const friendData = this.props.friend.friendArr;
        const {isLoading, hideLoaded} = this.state;
        return <AnimatedFlatList
            ListEmptyComponent={<EmptyComponent/>}
            ListHeaderComponent={
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        height: 35,
                        width,
                        backgroundColor: bottomTheme,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,

                    }}/>

                    <MessageColumn/>
                    <View style={{height: 70}}/>
                </View>

            }
            style={{
                flex: 1,

            }}
            ref={ref => this.flatList = ref}
            data={friendData}
            scrollEventThrottle={1}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={() => this.onRefresh()}
                />
            }
            onScroll={Animated.event([
                {
                    nativeEvent: {
                        contentOffset: {y: this.props.RefreshHeight},
                    },
                },
            ])}
            windowSize={300}
            onEndReachedThreshold={0.01}
        />;
    }

    onRefresh = () => {
        this.setState({
            isLoading: true,
        });
        ChatSocket.selectAllFriendMessage();
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
        }, 1000);
    };
    _renderIndexPath = ({item, index}) => {
        return <MessageItemComponent item={item}/>;
    };

    onLoading = () => {
        this.setState({
            hideLoaded: false,
        });
        const data = [...this.state.friendData];
        // data.push([...data]);
        let tmpData = [];
        for (let i = 0; i < 10; i++) {
            console.log(i);
            tmpData.push({id: 10004, name: 'aluo', message: '你好啊'});
        }
        setTimeout(() => {
            this.setState({
                friendData: data.concat(tmpData),
            }, () => {

            });
        }, 2000);

    };
}

const mapStateToProps = state => ({
    friend: state.friend,
    socketStatus: state.socketStatus,
});
const mapDispatchToProps = dispatch => ({});
const MessagePageRedux = connect(mapStateToProps, mapDispatchToProps)(MessagePage);

const topBottomVal = 20;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

class MessageItemComponent extends Component {

    static defaultProps = {
        titleFontSize: 15,
        marginHorizontal: 20,

    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    animations = {
        scale: new Animated.Value(1),
    };
    _onPressIn = () => {
        //隐藏box
        this._anim = timing(this.animations.scale, {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };
    _onPressOut = () => {
        //隐藏box
        this._anim = timing(this.animations.scale, {
            duration: 200,
            toValue: 1,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };
    _onPress = () => {
        if (this.props.item.unReadLength > 0) {
            ChatSocket.setFromUserIdMessageIsRead(this.props.item.id);
        }
        console.log(this.props.item,"this.props.item");
        NavigationUtils.goPage({fromUserinfo: this.props.item}, 'ChatRoomPage');
    };

    render() {

        const scale = Animated.interpolate(this.animations.scale, {
            inputRange: [0, 1],
            outputRange: [0.99, 1],
            extrapolate: 'clamp',
        });
        const {titleFontSize, marginHorizontal, item} = this.props;
        return <AnimatedTouchableOpacity
            onPress={this._onPress}
            activeOpacity={1}
            style={{

                flexDirection: 'row',
                marginHorizontal: marginHorizontal,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                transform: [{scale}],
                // backgroundColor:'red',
            }}
            onPressIn={this._onPressIn}
            onPressOut={this._onPressOut}
        >
            <View>
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: item.avatar_url}}
                    resizeMode={FastImage.stretch}
                />
                {item.unReadLength ? item.unReadLength > 0 && <View style={{
                    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: -5, right: -5, backgroundColor: 'red', paddingHorizontal: 5,
                    // paddingVertical:1,
                }}>
                    <Text style={{
                        fontSize: 10,
                        color: 'white',
                    }}>{item.unReadLength}</Text>
                </View> : null}

            </View>

            {/*左上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                left: 55,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text style={{
                    fontSize: titleFontSize,
                    color: 'black',
                    opacity: 0.9,
                    marginLeft: 10,
                }}>{item.username}</Text>
                <Text style={{marginLeft: 10, fontSize: 12, color: 'black', opacity: 0.5}}>互动消息</Text>

            </View>
            {/*左下*/}
            <View style={{
                position: 'absolute',
                bottom: topBottomVal,
                left: 55,
                flexDirection: 'row',
            }}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{
                        fontSize: 12,
                        color: 'black',
                        opacity: 0.6,
                        marginLeft: 10,
                        width: width - 100,
                    }}>{item.msg}</Text>
            </View>
            {/*右上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                right: 0,
            }}>
                <Text style={{
                    fontSize: 11,
                    color: 'black',
                    opacity: 0.5,

                }}>{getCurrentTime(parseInt(item.sendDate))}</Text>
            </View>

        </AnimatedTouchableOpacity>;


    }


}

class MessageColumnItem extends PureComponent {
    static defaultProps = {
        svgXmlData: message_xitong,
        title: '系统通知',
        size: 45,
    };

    render() {
        const {svgXmlData, title, size} = this.props;

        return <TouchableOpacity
            activeOpacity={0.6}
            style={{width: 80, height: 100, justifyContent: 'center', alignItems: 'center'}}>
            <SvgUri style={{
                shadowColor: '#c7c7c7',
                shadowRadius: 5,
                shadowOpacity: 1,
                shadowOffset: {w: 1, h: 1},
                elevation: 5,//安卓的阴影
            }} width={size} height={size} svgXmlData={svgXmlData}/>
            <Text style={{
                fontSize: 12,
                color: 'black',
                opacity: 0.8,
                marginTop: 5,

            }}>{title}</Text>
        </TouchableOpacity>;
    }
}


export default MessagePageRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 50,
        height: 50,
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
