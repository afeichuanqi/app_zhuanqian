/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
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
import Animated from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';
import EmptyComponent from '../common/EmptyComponent';
import ChatSocket from '../util/ChatSocket';
import {connect} from 'react-redux';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import {selectAppealNum} from '../util/AppService';
import actions from '../action';
import MessageItemComponent from './MessagePage/MessageItemComponent';
import {equalsObj} from '../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ToastSelect from '../common/ToastSelect';

const {width, height} = Dimensions.get('window');


class MessagePage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const translateY = Animated.interpolate(this.animations.val, {
            inputRange: [-height, 0, height],
            outputRange: [height, 0, -height],
            extrapolate: 'clamp',
        });
        let statusBar = {
            hidden: false,
        };
        let navigationBar = <NavigationBar
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
                        height,
                        width,
                        position: 'absolute',
                        top: -height + 70,
                        transform: [{translateY: translateY}],
                        // zIndex:1,
                    }}>
                </Animated.View>
                <View style={{
                    height: 50,
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

                <MsgList
                    setAppeal_2IsRead={this.props.setAppeal_2IsRead}
                    setAppeal_3IsRead={this.props.setAppeal_3IsRead}
                    onSetOtherTypeUnread={this.props.onSetOtherTypeUnread}
                    userinfo={this.props.userinfo}
                    friend={this.props.friend} RefreshHeight={this.animations.val}

                />

            </View>
        );
    }

    animations = {
        val: new Animated.Value(1),
    };
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
        this.timer = setTimeout(() => {
            this.onRefresh();
        }, 1000);


        EventBus.getInstance().addListener(EventTypes.scroll_top_for_page, this.listener = data => {
            const {pageName} = data;
            if (pageName == `MessagePage`) {
                this.flatList.getNode().scrollToOffset({animated: true, viewPosition: 0, index: 0});
            }
        });
        EventBus.getInstance().addListener(EventTypes.update_message_page, this.listener1 = data => {
            this.onRefresh();
        });
    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
        EventBus.getInstance().removeListener(this.listener1);
        this.timer && clearTimeout(this.timer);
    }

    constructor(props) {
        super(props);
        this.page = {pageCount: 20};
    }


    render() {
        const friendData = this.props.friend.friendArr;
        const {isLoading} = this.state;
        return <AnimatedFlatList

            ListEmptyComponent={<EmptyComponent type={2} height={height - 210}/>}
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

                    <MessageColumnRedux/>
                    <View style={{height: 75}}/>
                </View>

            }
            style={{
                height: '100%',

            }}
            ref={ref => this.flatList = ref}
            data={friendData}
            scrollEventThrottle={1}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            refreshControl={
                <RefreshControl
                    progressViewOffset={hp(8)}
                    refreshing={isLoading}
                    onRefresh={this.onRefresh}
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
                    if (this.canLoadMore && friendData.length >= 20) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }, 100);
            }}
            windowSize={300}
            onEndReachedThreshold={0.3}
        />;
    }


    onRefresh = () => {
        selectAppealNum(this.props.userinfo.token).then(result => {
            this.props.onSetOtherTypeUnread(result.appeal2UnReadLength, result.appeal3UnReadLength, result.noticeArr);
        });
        ChatSocket.verifyIdentity();
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
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onSetOtherTypeUnread: (app2, app3, noticeArr) => dispatch(actions.onSetOtherTypeUnread(app2, app3, noticeArr)),
});
const MessagePageRedux = connect(mapStateToProps, mapDispatchToProps)(MessagePage);


class MessageColumn extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.friend.appeal_2 != nextProps.friend.appeal_2
            || (this.props.friend.appeal_3 != nextProps.friend.appeal_3
                || !equalsObj(this.props.friend.notice_arr, nextProps.friend.notice_arr))
        ) {
            return true;
        }
        return false;

    }

    render() {
        const {appeal_2, appeal_3, notice_arr} = this.props.friend;
        const {setAppeal_2IsRead, setAppeal_3IsRead, onSetNoticeMsgIsAllRead} = this.props;
        // console.log(notice_arr,"notice_arr");
        const noticeIsNew = notice_arr.find(item => item > 0);
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

            <MessageColumnItem type={0} onSetNoticeMsgIsAllRead={onSetNoticeMsgIsAllRead}
                               unReadNum={noticeIsNew ? 1 : 0}
                               title={'通知消息'}/>
            <MessageColumnItem setMsgAllRead={setAppeal_2IsRead} type={1} columnType={2}
                               unReadNum={appeal_2}
                               title={'申诉消息'}
                               size={48}/>
            <MessageColumnItem setMsgAllRead={setAppeal_3IsRead} type={2} columnType={3}
                               unReadNum={appeal_3}
                               title={'投诉消息'}
                               size={42}/>
            <MessageColumnItem toastSelect={this.toastSelect} type={3} columnType={4} unReadNum={0}
                               title={'在线客服'}/>

        </View>;
    }
}

const mapStateToProps_ = state => ({
    friend: state.friend,
});
const mapDispatchToProps_ = dispatch => ({
    setAppeal_2IsRead: () => dispatch(actions.setAppeal_2IsRead()),
    setAppeal_3IsRead: () => dispatch(actions.setAppeal_3IsRead()),
    onSetNoticeMsgIsAllRead: () => dispatch(actions.onSetNoticeMsgIsAllRead()),
});
const MessageColumnRedux = connect(mapStateToProps_, mapDispatchToProps_)(MessageColumn);

class MessageColumnItem extends Component {
    static defaultProps = {
        title: '系统通知',
        type: 0,
    };

    constructor(props) {
        super(props);
        this.state = {
            unReadNum: this.props.unReadNum,
        };
    }


    componentWillReceiveProps(nextProps) {
        if (this.state.unReadNum !== nextProps.unReadNum) {
            this.setState({
                unReadNum: nextProps.unReadNum,
            });
        }
    }

    render() {


        const {title, type} = this.props;
        const {unReadNum} = this.state;
        let source = null;

        if (type == 0) {
            source = require('../res/img/message/message_xitong.png');
        } else if (type == 1) {
            source = require('../res/img/message/message_shensu.png');
        } else if (type == 2) {
            source = require('../res/img/message/message_tousu.png');
        } else if (type == 3) {
            source = require('../res/img/message/message_liaotian.png');
        }
        return <TouchableOpacity
            onPress={() => {
                const {type} = this.props;

                if (type == 1 || type == 2) {
                    if (unReadNum > 0) {
                        this.props.setMsgAllRead();
                    }
                    NavigationUtils.goPage({type: this.props.columnType}, 'MessageAppealPage');
                }
                if (type == 0) {
                    this.props.onSetNoticeMsgIsAllRead();
                    NavigationUtils.goPage({}, 'SystemNotificationPage');
                }
                if (type == 3) {
                    this.toastSelect.show();
                }
            }}
            activeOpacity={0.6}
            style={{width: 80, height: 100, justifyContent: 'center', alignItems: 'center'}}>
            <View>

                <Image source={source}
                       resizeMode={'stretch'}
                       style={{

                           width: wp(13), height: wp(13),

                           backgroundColor: 'white',

                       }}/>

                {unReadNum > 0 ? <View style={{
                    borderRadius: 10,
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: 'red',
                    width: 13,
                    height: 13,
                    borderWidth: 2,
                    borderColor: 'white',
                }}/> : null}
            </View>

            <Text style={{
                fontSize: hp(2),
                color: 'black',
                opacity: 0.8,
                marginTop: 10,

            }}>{title}</Text>
            {type === 3 && <ToastSelect
                rightTitle={'确认'}
                sureClick={() => {
                    this.toastSelect.hide();
                }}
                ref={ref => this.toastSelect = ref}>
                <View style={{
                    backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                    paddingTop: 10,

                }}>
                    <Text style={styles.textStyle}>官方QQ:1412894</Text>
                    <Text style={styles.textStyle}>官方微信:qingfengkjkj</Text>
                </View>
            </ToastSelect>}
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: hp(2.1),
        width: width - 80,
        color: 'rgba(0,0,0,0.9)',
        lineHeight: 25,
    },
});
export default MessagePageRedux;
