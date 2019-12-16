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
    StatusBar, TextInput, ActivityIndicator,
} from 'react-native';
import {theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import FastImage from 'react-native-fast-image';
import Animated, {Easing} from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {getCurrentTime} from '../common/Chat-ui/app/chat/utils';
import ViewUtil from '../util/ViewUtil';
import jiaoliu from '../res/svg/jiaoliu.svg';
import BackPressComponent from '../common/BackPressComponent';
import {getUserAppealFriendList, setUserIdMessageIsRead} from '../util/AppService';

const {timing} = Animated;
const width = Dimensions.get('window').width;


class MessageAppealPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.task_id = this.params.task_id || 0;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        this.timer && clearInterval(this.timer);

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    render() {


        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            // showStatusBarHeight={true}
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        const {type} = this.params;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, type == 2 ? '申诉消息' : type == 3 ? '投诉消息' : type == 4 ? '聊天消息' : '', jiaoliu, null, null, null, () => {

        }, false);


        return (
            <View style={{flex: 1}}>
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <View style={{width: width, height: 30, paddingHorizontal: 10}}>

                        <TextPro
                            value={this.task_id}
                            onBlur={(text) => {
                                this.task_id = text;
                                this.forceUpdate();
                            }}
                        />
                    </View>
                    <MsgList task_id={this.task_id} type={type} userinfo={this.props.userinfo}/>
                </View>

            </View>
        );
    }

    animations = {
        val: new Animated.Value(1),
    };
}

class TextPro extends Component {
    state = {
        content: this.props.value,
    };

    render() {
        const {content} = this.state;

        return <TextInput
            placeholder={'请输入任务ID'}
            returnKeyType={'search'}
            style={{
                padding: 0,
                // borderWidth:0.3,
                // borderColor:'rgba(0,0,0,0.5)',
                height: 25,
                backgroundColor: '#f2f2f2',
                borderRadius: 3,
                paddingLeft: 5,
            }}
            value={content}
            onChangeText={(text) => {
                this.setState({
                    content: text,
                });
            }}
            onBlur={this._onBlur}
        />;
    }

    _onBlur = () => {
        this.props.onBlur(this.state.content);
    };
}


class MsgList extends Component {
    state = {
        friendData: [],
        isLoading: false,
        hideLoaded: true,
    };

    constructor(props) {
        super(props);
        this.page = {pageIndex: 20};
    }

    page: {
        pageIndex: 20
    };

    componentDidMount(): void {
        this.updatePage(true);
    }

    render() {
        // const friendData = this.props.friend.friendArr;

        const {isLoading, hideLoaded, friendData} = this.state;
        return <FlatList
            ListEmptyComponent={<EmptyComponent/>}

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

            // windowSize={300}
            onEndReachedThreshold={0.01}
            onMomentumScrollBegin={() => {
                this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
            }}
            ListFooterComponent={() => this.genIndicator(hideLoaded)}
            onEndReached={() => {
                console.log('onEndReached.....');
                setTimeout(() => {
                    // 等待页面布局完成以后，在让加载更多
                    if (this.canLoadMore) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }, 100);
            }}
        />;
    }

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.page.pageIndex < 40 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: 13}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    onLoading = () => {
        this.updatePage(false);
    };

    onRefresh = () => {
        this.updatePage(true);
    };
    updatePage = (refreshing) => {
        this.setState({
            isLoading: true,
        });
        const {userinfo, type} = this.props;
        if (refreshing) {
            this.page = {pageIndex: 20};
            this.setState({
                isLoading: true,
            });
        } else {
            this.page = {pageIndex: this.page.pageIndex + 20};
        }


        getUserAppealFriendList({columnType: type, pageIndex: this.page.pageIndex}, userinfo.token).then(result => {
            console.log(result, 'result\'');
            if (refreshing) {
                this.setState({
                    friendData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 20 ? false : true,
                });
            } else {
                const tmpArr = [...this.state.friendData];
                this.setState({
                    friendData: tmpArr.concat(result),
                    hideLoaded: result.length >= 20 ? false : true,
                });
            }
        }).catch(err => {
            this.setState({
                isLoading: false,
                hideLoaded: false,
            });
        });

    };
    _renderIndexPath = ({item, index}) => {
        return <MessageItemComponent token={this.props.userinfo.token}
                                     key={item.FriendId} item={item}/>;


    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
const MessagePageRedux = connect(mapStateToProps, mapDispatchToProps)(MessageAppealPage);

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

class MessageItemComponent extends PureComponent {

    static defaultProps = {
        titleFontSize: 15,
        marginHorizontal: 20,

    };

    constructor(props) {
        super(props);
        this.state = {
            unReadLength: this.props.item.unReadLength || 0,
        };
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
        const {item} = this.props;
        const {columnType, taskId, taskTitle, avatar_url, username, userid, sendFormId, unReadLength, FriendId} = item;
        if (unReadLength > 0) {
            // ChatSocket.setFromUserIdMessageIsRead(this.props.item.FriendId);
            setUserIdMessageIsRead({
                friendId: FriendId,
            }, this.props.token).then(result => {
                this.setState({
                    unReadLength: 0,
                });
            }).catch(msg => {

            });
        }

        const fromUserinfo = {
            avatar_url: avatar_url,
            id: userid,
            username: username,
            taskTitle: taskTitle,

        };
        NavigationUtils.goPage({
            fromUserinfo: fromUserinfo,
            columnType,
            task_id: taskId,
            taskTitle,
            sendFormId,
        }, 'ChatRoomPage');
    };

    render() {

        const scale = Animated.interpolate(this.animations.scale, {
            inputRange: [0, 1],
            outputRange: [0.99, 1],
            extrapolate: 'clamp',
        });
        const {titleFontSize, marginHorizontal, item} = this.props;
        const {avatar_url, columnType, msg, msg_type, username, taskUri} = item;
        const {unReadLength} = this.state;

        // console.log(taskUri,"taskUri");
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
                height: 70,
                // backgroundColor:'red',
            }}
            onPressIn={this._onPressIn}
            onPressOut={this._onPressOut}
        >
            <View style={{position: 'absolute', top: 10}}>
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: avatar_url}}
                    resizeMode={FastImage.stretch}
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

            {/*左上*/}
            <View style={{
                position: 'absolute',
                top: 10,
                left: 40,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text style={{
                    fontSize: 13,
                    color: 'black',
                    opacity: 0.9,
                    marginLeft: 10,
                }}>{username}</Text>
                <Text style={{marginLeft: 10, fontSize: 12, color: 'red', opacity: 0.5}}>{
                    columnType == 1 ? '任务咨询' : columnType == 2 ? '申诉' : columnType == 3 ? '投诉' : columnType == 4 ? '聊天' : ''
                }</Text>


            </View>

            {/*中间*/}
            <View style={{
                position: 'absolute',
                top: 30,
                left: 40,
                // height: 30,
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
                        width: (width - 100) / 2,
                    }}>{msg_type == 'text' ? msg : '[图片]'}</Text>
            </View>
            <View style={{
                position: 'absolute',
                bottom: 5,
                left: 50,
            }}>
                <Text style={{
                    fontSize: 10,
                    color: 'black',
                    opacity: 0.5,

                }}>{getCurrentTime(parseInt(item.sendDate))}</Text>
            </View>
            <FastImage
                style={{
                    position: 'absolute', right: 10,
                    top: 10,
                    backgroundColor: '#E8E8E8',
                    // 设置宽度
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                }}
                source={{uri: taskUri}}
                resizeMode={FastImage.stretch}
            />
        </AnimatedTouchableOpacity>;


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
