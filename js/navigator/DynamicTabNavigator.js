/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Text, StatusBar, Dimensions, TouchableOpacity} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import IndexPage from '../page/IndexPage';
import TaskHallPage from '../page/TaskHallPage';
import {bottomTheme, theme} from '../appSet';
import MessagePage from '../page/MessagePage';
import MyPage from '../page/MyPage';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {TabView} from 'react-native-tab-view';
import hall from '../res/svg/indexPage/hall.svg';
import hallA from '../res/svg/indexPage/hallA.svg';
import home from '../res/svg/indexPage/home.svg';
import homeA from '../res/svg/indexPage/homeA.svg';
import message from '../res/svg/indexPage/message.svg';
import messageA from '../res/svg/indexPage/messageA.svg';
import my from '../res/svg/indexPage/my.svg';
import myA from '../res/svg/indexPage/myA.svg';
import {connect} from 'react-redux';
import actions from '../action';
import Global from '../common/Global';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import {equalsObj} from '../util/CommonUtils';

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
                <TabView
                    indicatorStyle={{backgroundColor: 'white'}}
                    navigationState={{index: navigationIndex, routes: navigationRoutes}}
                    renderScene={this.renderScene}
                    renderTabBar={() => null}
                    onIndexChange={(index) => {
                        this.setState({navigationIndex: index});
                    }}
                    initialLayout={{width}}
                    lazy={true}
                />
                <BottomBarRedux onPress={(index) => {
                    this.jumpTo(navigationRoutes[index].key);
                }} navigationIndex={navigationIndex} jumpTo={this.jumpTo} navigationRoutes={navigationRoutes}/>
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
    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {

        // -------------记录下当前的路由------------- //
        let {routes, type, key} = this.props.nav;
        const activeRouterName = routes[1].routes[routes[1].routes.length - 1].routeName;

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
            key = routes[1].routes[routes[1].index].key;
        }

        if (type === 'Navigation/BACK' && key === routes[1].routes[1].key) {//需要返回到主页面
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
                StatusBar.setBarStyle('dark-content', true);
                StatusBar.setBackgroundColor(theme, true);

            } else {
                StatusBar.setBarStyle('light-content', true);
                StatusBar.setBackgroundColor(bottomTheme, true);
            }
            return;
        }
        if ((type === 'Navigation/BACK' && key === routes[1].routes[2].key && routes[1].routes[1].routeName === 'TaskReleaseMana')
            ||
            (type === 'Navigation/BACK' && key === routes[1].routes[2].key && routes[1].routes[1].routeName === 'TaskOrdersMana')
        ) {
            StatusBar.setBarStyle('light-content', true);
            StatusBar.setBackgroundColor(bottomTheme, true);
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
        if (index === 0) {
            StatusBar.setBarStyle('dark-content', true);
            StatusBar.setBackgroundColor(theme, true);
        } else {
            StatusBar.setBarStyle('light-content', true);
            StatusBar.setBackgroundColor(bottomTheme, true);
        }

        // this.bottomBarOnPress(index);

        onPress(index);
        if (index === 3 ) { //我的栏目被单击
            const token = userinfo.token;
            onGetUserInFoForToken(token, (loginStatus, msg) => {
            });
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
        // console.log('我被render');
        const {navigationIndex} = this.props;
        const {unMessageLength, appeal_2, appeal_3, notice_arr} = this.props.friend;
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderTopWidth: 0.8,
            borderTopColor: '#c0c0c0',
        }}>
            {this._renderBottomBar(
                navigationIndex === 0 ? homeA : home,
                this._BottomBarClick,
                0,
                navigationIndex === 0 ? true : false,
                35,
            )

            }
            {this._renderBottomBar(
                navigationIndex === 1 ? hallA : hall,
                this._BottomBarClick,
                1,
                navigationIndex === 1 ? true : false,
                35,
            )}
            {this._renderBottomBar(
                navigationIndex === 2 ? messageA : message,
                this._BottomBarClick,
                2,
                navigationIndex === 2 ? true : false,
                37,
                unMessageLength ? unMessageLength : 0,
                (appeal_2 > 0 || appeal_3 > 0 || notice_arr[1] > 0 || notice_arr[2] > 0),
            )}
            {this._renderBottomBar(
                navigationIndex === 3 ? myA : my,
                this._BottomBarClick,
                3,
                navigationIndex === 3 ? true : false,
                37,
                0,
                (notice_arr[1] > 0 || notice_arr[2] > 0),
            )}
        </View>;
    }

    bottomBarOnPress = (index) => {


    };
    _renderBottomBar = (svgXmlData, onPress, key, isActive, size = 35, unReadLength = 0, isOtherUnRead = false) => {

        return <TouchableOpacity
            onPress={() => {
                onPress(key);
            }}
            style={{width: width / 4, height: 50, justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <SvgUri fill={isActive ? bottomTheme : 'rgba(0,0,0,0.5)'} width={size}
                        height={size}
                        svgXmlData={svgXmlData}
                        style={{marginBottom: 2}}
                />
                {unReadLength > 0 && <View style={{
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: -2, right: -8,
                    backgroundColor: 'red',
                    paddingHorizontal: 5,
                    borderWidth: 2,
                    borderColor: 'white',
                }}>
                    <Text style={{color: 'white', fontSize: 12}}>{unReadLength}</Text>
                </View>}
                {unReadLength == 0 && isOtherUnRead && <View style={{
                    position: 'absolute',
                    right: -3,
                    top: 0,
                    backgroundColor: 'red',
                    borderRadius: 8,
                    width: 13,
                    height: 13,
                    borderWidth: 3,
                    borderColor: 'white',
                }}/>

                }
            </View>


        </TouchableOpacity>;
    };
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
