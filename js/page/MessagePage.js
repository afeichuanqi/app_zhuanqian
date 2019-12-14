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
    Image,
} from 'react-native';
import {bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
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
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';

const {timing} = Animated;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


class MessagePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {
        ChatSocket.selectAllFriendMessage(20);

    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);

    }

    render() {
        const RefreshHeight = Animated.interpolate(this.animations.val, {
            inputRange: [-200, -0.1, 0],
            outputRange: [300, 30, 0],
            extrapolate: 'clamp',
        });

        let statusBar = {
            hidden: false,
            // backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
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
                    zIndex: 3,
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
        const {columnUnreadLength} = this.props;
        // console.log(columnUnreadLength, 'columnUnreadLength');
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
            <MessageColumnItem type={0} unReadLength={columnUnreadLength[0]} svgXmlData={message_xitong}
                               title={'通知消息'}/>
            <MessageColumnItem type={1} columnType={2} unReadLength={columnUnreadLength[1]} svgXmlData={zaixiankefu}
                               title={'工作邀约'}
                               size={48}/>
            <MessageColumnItem type={2} columnType={3} unReadLength={columnUnreadLength[2]} svgXmlData={huodongxiaoxi}
                               title={'诉求消息'}
                               size={42}/>
            <MessageColumnItem type={3} columnType={4} unReadLength={columnUnreadLength[3]} svgXmlData={huodongxiaoxi}
                               title={'在线客服'}/>
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

    componentDidMount(): void {
        EventBus.getInstance().addListener(EventTypes.scroll_top_for_page, this.listener = data => {
            const {pageName} = data;
            if (pageName == `MessagePage`) {
                // this.flatList.get
                this.flatList.getNode().scrollToOffset({animated: true, viewPosition: 0, index: 0});
            }
        });
    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
    }

    constructor(props) {
        super(props);
        this.page = {pageCount: 20};
    }

    filterFriend = (friendArr, type) => {
        let tmpArr = [];

        for (let i = 0; i < friendArr.length; i++) {
            if (friendArr[i].columnType == type) {
                tmpArr.push(friendArr[i]);
            }
        }
        return tmpArr;
    };

    render() {
        const friendData = this.props.friend.friendArr;
        const columnUnreadLength = this.props.friend.columnUnreadLength;
        const {isLoading, hideLoaded} = this.state;
        return <AnimatedFlatList
            ListEmptyComponent={<EmptyComponent height={height - 210}/>}
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

                    <MessageColumn columnUnreadLength={columnUnreadLength}/>
                    <View style={{height: 70}}/>
                </View>

            }
            style={{
                flex: 1,

            }}
            ref={ref => this.flatList = ref}
            data={this.filterFriend(friendData, 1)}
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
            onMomentumScrollBegin={() => {
                this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
            }}
            onEndReached={() => {
                // 等待页面布局完成以后，在让加载更多
                setTimeout(() => {
                    if (this.canLoadMore) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }, 100);
            }}
            windowSize={300}
            onEndReachedThreshold={0.01}
        />;
    }

    // getData = (refreshing) => {
    //     if (refreshing) {
    //         this.page = {pageIndex: 0};
    //         this.setState({
    //             isLoading: true,
    //         });
    //     } else {
    //         this.page = {pageIndex: this.page.pageIndex + 1};
    //     }
    //     if (refreshing) {
    //         ChatSocket.selectAllFriendMessage();
    //         this.setState({
    //             taskData: result,
    //             isLoading: false,
    //             hideLoaded: result.length >= 10 ? false : true,
    //         });
    //     } else {
    //
    //     }
    // };

    onRefresh = () => {
        ChatSocket.selectAllFriendMessage(this.page.pageCount);
    };
    _renderIndexPath = ({item, index}) => {
        return <MessageItemComponent key={item.FriendId} item={item}/>;

    };

    onLoading = () => {
        this.page.pageCount = this.page.pageCount + 20;
        ChatSocket.selectAllFriendMessage(this.page.pageCount);
    };
}

const mapStateToProps = state => ({
    friend: state.friend,
    socketStatus: state.socketStatus,
});
const mapDispatchToProps = dispatch => ({});
const MessagePageRedux = connect(mapStateToProps, mapDispatchToProps)(MessagePage);


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
            ChatSocket.setFromUserIdMessageIsRead(this.props.item.FriendId);
        }
        const {item} = this.props;
        const {columnType, taskId, taskTitle, avatar_url, username, userid} = item;
        // console.log("item",item);
        const fromUserinfo = {
            avatar_url: avatar_url,
            id: userid,
            username: username,
            taskTitle: taskTitle,

        };
        NavigationUtils.goPage({fromUserinfo: fromUserinfo, columnType, task_id: taskId, taskTitle}, 'ChatRoomPage');
    };

    render() {

        const scale = Animated.interpolate(this.animations.scale, {
            inputRange: [0, 1],
            outputRange: [0.99, 1],
            extrapolate: 'clamp',
        });
        const {marginHorizontal, item} = this.props;
        const {avatar_url, columnType, msg, msg_type, taskId, taskTitle, unReadLength, username, taskUri} = item;
        // console.log(taskUri,"taskUri");
        return <AnimatedTouchableOpacity
            onPress={this._onPress}
            activeOpacity={1}
            style={{

                flexDirection: 'row',
                marginHorizontal: marginHorizontal,
                paddingVertical: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                transform: [{scale}],
                height: 70,
                alignItems: 'center',
                justifyContent: 'space-between',
                // backgroundColor:'red',
            }}
            onPressIn={this._onPressIn}
            onPressOut={this._onPressOut}
        >
            <View>
                <View style={{flexDirection: 'row'}}>
                    <View>
                        <FastImage
                            style={[styles.imgStyle]}
                            source={{uri: avatar_url}}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                        {unReadLength ? unReadLength > 0 && <View style={{
                            borderRadius: 10, justifyContent: 'center', alignItems: 'center',
                            position: 'absolute', top: -5, right: -5, backgroundColor: 'red', paddingHorizontal: 5,
                            // paddingVertical:1,
                        }}>
                            <Text style={{
                                fontSize: 10,
                                color: 'white',
                            }}>{unReadLength}</Text>
                        </View> : null}
                    </View>
                    <View style={{justifyContent: 'space-around'}}>
                        {/*左上*/}
                        <View style={{
                            // position: 'absolute',
                            // top: 10,
                            // left: 40,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: 13,
                                color: 'black',
                                opacity: 0.9,
                                marginLeft: 10,
                            }}>{username}</Text>
                            <Text style={{marginLeft: 10, fontSize: 12, color: 'black', opacity: 0.5}}>{
                                columnType == 1 ? `任务咨询 - 任务ID:${taskId}` : columnType == 2 ? '申诉' : columnType == 3 ? '投诉' : columnType == 4 ? '聊天' : ''
                            }</Text>


                        </View>
                        {/*中间*/}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={{
                                fontSize: 12,
                                color: 'black',
                                opacity: 0.6,
                                marginLeft: 10,
                                width: (width - 100) / 2,
                            }}>{msg_type == 'text' ? msg : '[图片]'}
                        </Text>
                    </View>

                </View>


                <View style={{
                    marginLeft: 50,
                    marginTop: 5,
                }}>
                    <Text style={{
                        fontSize: 10,
                        color: 'black',
                        opacity: 0.5,

                    }}>{getCurrentTime(parseInt(item.sendDate))}</Text>
                </View>
            </View>
            <FastImage
                style={{
                    backgroundColor: '#9d9d9d',
                    // 设置宽度
                    width: 55,
                    height: 55,
                    borderRadius: 2,
                }}
                source={{uri: taskUri}}
                resizeMode={FastImage.resizeMode.stretch}
            />


        </AnimatedTouchableOpacity>;


    }


}

class MessageColumnItem extends PureComponent {
    static defaultProps = {
        title: '系统通知',
        type: 0,
    };

    render() {


        const {title, unReadLength, type} = this.props;
        let source = null;

        if (type == 0) {
            source = require('../res/img/message_zixun.png');
        } else if (type == 1) {
            source = require('../res/img/message_shensu.png');
        } else if (type == 2) {
            source = require('../res/img/message_tousu.png');
        } else if (type == 3) {
            source = require('../res/img/message_liaotian.png');
        }
        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({type: this.props.columnType}, 'MessageTypePage');
            }}
            activeOpacity={0.6}
            style={{width: 80, height: 100, justifyContent: 'center', alignItems: 'center'}}>
            <View>

                <Image source={source} style={{

                    width: 40, height: 40,

                    backgroundColor: 'white',
                }}/>

                {/*</View>*/}

                {/*<SvgUri style={{*/}
                {/*    */}
                {/*}} width={size} height={size} svgXmlData={svgXmlData}/>*/}
                {unReadLength ? unReadLength > 0 && <View style={{
                    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: -5, right: -5, backgroundColor: 'red', paddingHorizontal: 5,
                    // paddingVertical:1,
                }}>
                    <Text style={{
                        fontSize: 10,
                        color: 'white',
                    }}>{unReadLength}</Text>
                </View> : null}
            </View>

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
        width: 40,
        height: 40,
        borderRadius: 3,
        // 设置高度
        // height:150
    },
});
