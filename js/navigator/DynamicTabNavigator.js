/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Text, StatusBar, Dimensions, TouchableOpacity, Image, BackHandler} from 'react-native';
import Animated from 'react-native-reanimated';
import IndexPage from '../page/IndexPage';
import TaskHallPage from '../page/TaskHallPage';
import {bottomTheme, theme} from '../appSet';
import MessagePage from '../page/MessagePage';
import MyPage from '../page/MyPage';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {TabView} from 'react-native-tab-view';
import {connect} from 'react-redux';
import actions from '../action';
import Global from '../common/Global';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import {equalsObj} from '../util/CommonUtils';
import ImageViewerModal from '../common/ImageViewerModal';
import ChatSocket from '../util/ChatSocket';
import BackPressComponent from '../common/BackPressComponent';

const {SpringUtils, spring} = Animated;
type Props = {};

const {width, height} = Dimensions.get('window');

class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {
            navigationIndex: 0,
            navigationRoutes: [
                {key: 'index', title: '推荐'},
                {key: 'hall', title: '最新'},
                {key: 'message', title: '最新'},
                {key: 'my', title: '最新'},
            ],
        };
    }

    render() {

        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                <ImageViewerModal ref={ref => Global.imageViewModal = ref}/>
                <TabView
                    indicatorStyle={{backgroundColor: 'white'}}
                    navigationState={{index: navigationIndex, routes: navigationRoutes}}
                    renderScene={this.renderScene}
                    renderTabBar={() => null}
                    onIndexChange={(index) => {
                        if (navigationIndex !== index) {
                            this.setState({navigationIndex: index});
                            if (index === 0) {
                                StatusBar.setBarStyle('dark-content', false);
                                StatusBar.setBackgroundColor(theme, false);
                            } else {
                                StatusBar.setBarStyle('light-content', false);
                                StatusBar.setBackgroundColor(bottomTheme, false);
                            }
                        }

                    }}
                    initialLayout={{width}}
                    lazy={false}
                    timingConfig={{duration: 1}}
                    // swipeEnabled={false}
                />
                <BottomBarRedux onPress={(index) => {
                    // console.log(index);
                    // console.log('BottomBarRedux',index);
                    this.jumpTo(navigationRoutes[index].key);
                    // this.setState({navigationIndex: index});
                }} navigationIndex={navigationIndex}/>
            </SafeAreaViewPlus>

        );
    }

    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'index':
                return <IndexPage/>;
            case 'hall':
                return <TaskHallPage/>;
            case 'message':
                return <MessagePage/>;
            case 'my':
                return <MyPage/>;
        }
    };
}

class BottomBar extends Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    componentDidMount(): void {
        this.backPress.componentDidMount();
    }

    onBackPress = () => {
        const {nav} = this.props;
        if (nav.routes[0].index === 0) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                console.log('exitApp');
                BackHandler.exitApp();
                return false;
            }
            this.lastBackPressed = Date.now();
            return true;//默认行为
        }
        return true;//默认行为
    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {

        // -------------记录下当前的路由------------- //
        let {routes, type, key} = this.props.nav;

        const activeRouterName = routes[0].routes[routes[0].routes.length - 1].routeName;

        if (activeRouterName == 'HomePage') {
            if (nextProps.navigationIndex === 0) {

                Global.activeRouteName = 'IndexPage';
            }
            if (nextProps.navigationIndex === 1) {
                Global.activeRouteName = 'TaskHallPage';
            }
            if (nextProps.navigationIndex === 2) {
                Global.activeRouteName = 'MessagePage';
            }
            if (nextProps.navigationIndex === 3) {
                Global.activeRouteName = 'MyPage';
            }
        } else {
            Global.activeRouteName = activeRouterName;
        }
        // -------------End记录下当前的路由------------- //

        if (!key || key.length === 0) {
            key = routes[0].routes[routes[0].index].key;
        }
        if (type === 'Navigation/BACK' && key === routes[0].routes[1].key) {//需要返回到主页面

            // console.log(this.props.navigationIndex, 'this.props.navigationIndex');
            // -------------记录下当前的路由------------- //
            if (nextProps.navigationIndex === 0) {
                Global.activeRouteName = 'IndexPage';
            }
            if (nextProps.navigationIndex === 1) {
                Global.activeRouteName = 'TaskHallPage';
            }
            if (nextProps.navigationIndex === 2) {
                Global.activeRouteName = 'MessagePage';
            }
            if (nextProps.navigationIndex === 3) {
                Global.activeRouteName = 'MyPage';
            }
            // -------------End记录下当前的路由------------- //
            if (this.props.navigationIndex === 0) {//判断回到主页面的哪个栏目
                StatusBar.setBarStyle('dark-content', false);
                StatusBar.setBackgroundColor(theme, false);

            } else {
                StatusBar.setBarStyle('light-content', false);
                StatusBar.setBackgroundColor(bottomTheme, false);
            }
            return;
        }
        if ((type === 'Navigation/BACK' && routes[0].routes[2] && key === routes[0].routes[2].key && routes[0].routes[1].routeName === 'TaskReleaseMana')
            ||
            (type === 'Navigation/BACK' && routes[0].routes[2] && key === routes[0].routes[2].key && routes[0].routes[1].routeName === 'TaskOrdersMana')
        ) {
            StatusBar.setBarStyle('light-content', false);
            StatusBar.setBackgroundColor(bottomTheme, false);
        }
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.navigationIndex !== nextProps.navigationIndex
            || (this.props.friend && (this.props.friend.unMessageLength !== nextProps.friend.unMessageLength))
            || (this.props.friend && (this.props.friend.appeal_3 !== nextProps.friend.appeal_3))
            || (this.props.friend && (this.props.friend.appeal_2 !== nextProps.friend.appeal_2))
            || !equalsObj(this.props.friend.notice_arr, nextProps.friend.notice_arr)
        ) {
            return true;
        }
        return false;

    }

    _BottomBarClick = (index) => {
        const {onPress, onGetUserInFoForToken, userinfo, navigationIndex} = this.props;

        onPress(index);
        if (index === 3 && this.props.navigationIndex !== index) { //我的栏目被单击
            const token = userinfo.token;
            onGetUserInFoForToken(token, (loginStatus, msg) => {
            });
        }
        if (index === 2) { //消息栏目被单击
            if (this.props.userinfo.token && this.props.userinfo.token.length > 0 && !ChatSocket.isVerifyIdentIdy) {
                Global.token = this.props.userinfo.token;
                ChatSocket.verifyIdentidy();
            }
        }
        if (index === navigationIndex) { //按下了相同的底部导航
            let pageName = '';

            if (index === 0) {
                pageName = `IndexPage_${Global.IndexPage_Index}`;
            } else if (index === 1) {
                pageName = `TaskHallPage_${Global.TaskHallPage_Index}`;
            } else if (index === 2) {
                pageName = `MessagePage`;
            }
            pageName.length > 0 && EventBus.getInstance().fireEvent(EventTypes.scroll_top_for_page, {
                pageName,
            });//页面跳转到顶部

        }
    };

    render() {
        const {navigationIndex} = this.props;
        const {unMessageLength, appeal_2, appeal_3, notice_arr} = this.props.friend;
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderTopWidth: 0.8,
            borderTopColor: '#c0c0c0',
        }}>
            <BottomBarItem
                source={navigationIndex === 0 ? require('../res/img/bottomBarIcon/homeC.png') : require('../res/img/bottomBarIcon/home.png')}
                onPress={this._BottomBarClick}
                index={0}
                navigationIndex={navigationIndex}
                isActive={navigationIndex === 0 ? true : false}
            />
            <BottomBarItem
                source={navigationIndex === 1 ? require('../res/img/bottomBarIcon/hallC.png') : require('../res/img/bottomBarIcon/hall.png')}
                onPress={this._BottomBarClick}
                index={1}
                navigationIndex={navigationIndex}
                isActive={navigationIndex === 1 ? true : false}
            />
            <BottomBarItem
                source={navigationIndex === 2 ? require('../res/img/bottomBarIcon/messageC.png') : require('../res/img/bottomBarIcon/message.png')}
                onPress={this._BottomBarClick}
                index={2}
                isActive={navigationIndex === 2 ? true : false}
                unReadLength={unMessageLength > 0 ? unMessageLength : 0}
                isOtherUnRead={(appeal_2 > 0 || appeal_3 > 0 || notice_arr[1] > 0 || notice_arr[2] > 0)}
            />
            <BottomBarItem
                source={navigationIndex === 3 ? require('../res/img/bottomBarIcon/myC.png') : require('../res/img/bottomBarIcon/my.png')}
                onPress={this._BottomBarClick}
                index={3}
                isActive={navigationIndex === 3 ? true : false}
                unReadLength={0}
                isOtherUnReaxd={(notice_arr[1] > 0 || notice_arr[2] > 0)}
            />
        </View>;
    }

}

class BottomBarItem extends Component {
    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.unReadLength != nextProps.unReadLength
            || this.props.isOtherUnRead != nextProps.isOtherUnRead
            || this.props.isActive != nextProps.isActive
        ) {
            return true;
        }
        return false;
    }

    onPress = () => {
        const {onPress, index} = this.props;
        this.props.onPress(index);
    };
    animations = {
        scale: new Animated.Value(1),
    };
    onPressIn = () => {
        if(!this.props.isActive){
            this._anim = spring(this.animations.scale, SpringUtils.makeConfigFromBouncinessAndSpeed({
                ...SpringUtils.makeDefaultConfig(),
                bounciness: 13,
                speed: 20,
                toValue:0.7,
            })).start(() => {

            });
            setTimeout(()=>{
                this._anim = spring(this.animations.scale, SpringUtils.makeConfigFromBouncinessAndSpeed({
                    ...SpringUtils.makeDefaultConfig(),
                    bounciness: 30,
                    speed: 10,
                    toValue:1,
                })).start(() => {

                });
            },100)
        }

    };

    render() {
        const {source, unReadLength = 0, isOtherUnRead = false} = this.props;
        return <TouchableOpacity
            activeOpacity={1}
            onPress={this.onPress}
            onPressIn={this.onPressIn}
            // onPressOut={this.onPressOut}
            style={{
                width: width / 4,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',

            }}>
            <Animated.View
                style={{transform: [{scale: this.animations.scale}]}}
            >
                <Image
                    style={{height: 25, width: 25}}
                    source={source}
                />
                {unReadLength == 0 && isOtherUnRead && <View style={{
                    position: 'absolute',
                    right: -5,
                    top: -5,
                    backgroundColor: 'red',
                    borderRadius: 8,
                    width: 13,
                    height: 13,
                    borderWidth: 3,
                    borderColor: 'white',
                }}/>}
                {unReadLength > 0 && <View style={{
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: -8, right: -11,
                    backgroundColor: 'red',
                    paddingHorizontal: 5,
                    borderWidth: 2,
                    borderColor: 'white',
                }}>
                    <Text style={{color: 'white', fontSize: 12}}>{unReadLength}</Text>
                </View>}

            </Animated.View>


        </TouchableOpacity>;
    }
}

const mapStateToProps = state => ({
    friend: state.friend,
    nav: state.nav,
    userinfo: state.userinfo,

});
const mapDispatchToProps = dispatch => ({
    onGetUserInFoForToken: (token, callback) => dispatch(actions.onGetUserInFoForToken(token, callback)),
});
const BottomBarRedux = connect(mapStateToProps, mapDispatchToProps)(BottomBar);
export default DynamicTabNavigator;
