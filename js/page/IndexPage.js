/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Linking, DeviceInfo, Image,
} from 'react-native';
import {theme, bottomTheme} from '../appSet';
import Carousel from '../common/Carousel';
import FastImage from 'react-native-fast-image';
import TabBar from '../common/TabBar';
import Animated, {Easing} from 'react-native-reanimated';
import SvgUri from 'react-native-svg-uri';
import NavigationUtils from '../navigator/NavigationUtils';
import {TabView} from 'react-native-tab-view';
import search from '../res/svg/search.svg';
import FlatListCommonUtil from './IndexPage/FlatListCommonUtil';
import {connect} from 'react-redux';
import ChatSocket from '../util/ChatSocket';
import SecondListComponent from './IndexPage/SecondListComponent';
import Global from '../common/Global';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import {getLunboList} from '../util/AppService';
import {equalsObj} from '../util/CommonUtils';
import FastImagePro from '../common/FastImagePro';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import JPush from 'jpush-react-native';

import Toast from 'react-native-root-toast';
import actions from '../action';
import {onSetUpdateToast} from '../action/appsetting';
const {timing} = Animated;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const lunboHeight = height / 4;
const topIputHeight = (Platform.OS === 'ios') ? 35 : 35;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 40 : 20;//状态栏的高度
let jumpTo = null;

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        jumpTo = this.props.jumpTo;
        this.state = {
            navigationIndex: 0,
            navigationRoutes: [
                {key: 'first', title: '推荐'},
                {key: 'second', title: '最新'},
            ],
        };
    }

    // comp

    componentDidMount() {
        Global.token = this.props.userinfo.token;
        Global.dispatch = this.props.dispatch;
        ChatSocket.connectionServer();
        if (this.props.userinfo.userid) {
            JPush.setAlias({
                alias: `jiguang_${this.props.userinfo.userid}`,
                sequence: 1,
            });
        }
        setTimeout(()=>{
            if(!this.props.appSetting.isUpdateToast){
                Toast.show('V1.0.4升级成功');
                this.props.onSetUpdateToast(true)
            }
        },2000)

    }

    position = new Animated.Value(0);

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    animations = {
        val: new Animated.Value(0),
    };
    _avatarClick = () => {
        const {userinfo} = this.props;
        if (!userinfo.login) {
            NavigationUtils.goPage({}, 'LoginPage');
        } else {
            NavigationUtils.goPage({}, 'AccountSetting');
        }
    };

    render() {
        const {navigationRoutes, navigationIndex} = this.state;
        // console.log(navigationRoutes);
        const searchWidth = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [wp(97), wp(65)],
            extrapolate: 'clamp',
        });
        this.translateY = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [0, -(hp(4.5))],
            extrapolate: 'clamp',
        });
        const svgTop = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [hp(8.4), hp(2.9)],
            extrapolate: 'clamp',
        });

        const {userinfo} = this.props;
        return (
            <View
                style={{flex: 1}}
            >
                <View style={{
                    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
                }}/>
                {/*{navigationBar}*/}
                {/*顶部搜索栏样式*/}
                {/*<Toast*/}
                {/*    position={'center'}*/}
                {/*    ref={ref => this.toast = ref}*/}
                {/*/>*/}

                <View style={{flex: 1}}>
                    <View style={{
                        paddingHorizontal: 10,
                        paddingTop: 15,
                        paddingBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        zIndex: 2,
                        elevation: 0.2,
                        backgroundColor: theme,
                        height: hp(8),
                    }}>
                        <AnimatedTouchableOpacity
                            activeOpacity={1}
                            onPress={this.SearchOnFocus}
                            style={{
                                height: hp(5),
                                width: searchWidth, backgroundColor: 'rgba(0,0,0,0.05)',
                                alignItems: 'center',
                                borderRadius: 10, flexDirection: 'row',
                                overflow: 'hidden',

                            }}>
                            <SvgUri style={{
                                marginHorizontal: 8,
                            }} width={hp(2)} height={hp(2)} svgXmlData={search}/>
                            <Text style={{color: 'rgba(0,0,0,0.2)', fontSize:hp(1.9)}}>任务标题、任务ID、用户名</Text>
                        </AnimatedTouchableOpacity>

                        <TabBar
                            style={{
                                height: hp(4),
                                paddingLeft: 10,
                            }}
                            position={this.position}
                            contentContainerStyle={{paddingTop: 7}}
                            routes={navigationRoutes}
                            index={navigationIndex}
                            sidePadding={0}
                            handleIndexChange={this.handleIndexChange}
                            bounces={true}
                            titleMarginHorizontal={8}
                            activeStyle={{fontSize: hp(2), color: [0, 0, 0]}}
                            inactiveStyle={{fontSize: hp(1.8), color: [95, 95, 95], height: 10}}
                            indicatorStyle={{height: 3, backgroundColor: bottomTheme, borderRadius: 3}}
                        />

                    </View>


                    {/*rn0.6bug多且行且珍惜*/}
                    <TabView

                        // ref={ref => this.tabView = ref}
                        indicatorStyle={{backgroundColor: 'white'}}
                        navigationState={{index: navigationIndex, routes: navigationRoutes}}
                        renderScene={this.renderScene}
                        position={this.position}
                        renderTabBar={() => null}
                        onIndexChange={index => {
                            Global.IndexPage_Index = index;
                            this.setState({
                                navigationIndex: index,
                            });
                        }}
                        initialLayout={{width}}
                        lazy={true}
                    />
                    <Animated.View style={{
                        width,
                        height: hp(4),
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: hp(8.2),
                        transform: [{translateY: this.translateY}],
                    }}>
                        <TabBar
                            style={{
                                height: hp(4),
                                paddingLeft: 10,
                            }}
                            position={this.position}
                            contentContainerStyle={{paddingTop: hp(0.6)}}
                            routes={navigationRoutes}
                            index={navigationIndex}
                            sidePadding={0}
                            handleIndexChange={this.handleIndexChange}
                            bounces={true}
                            titleMarginHorizontal={15}
                            activeStyle={{fontSize: hp(2.4), color: [0, 0, 0]}}
                            inactiveStyle={{fontSize: hp(2.2), color: [95, 95, 95], height: 10}}
                            indicatorStyle={{height: 3, backgroundColor: bottomTheme, borderRadius: 3}}
                        />
                    </Animated.View>
                    {/*头像组件*/}
                    <AnimatedTouchableOpacity
                        onPress={this._avatarClick}
                        style={{position: 'absolute', top: 0,
                            transform: [{translateY: svgTop}]
                            , zIndex: 3, right: 10, elevation: 1}}>
                        {/*<Image*/}
                        <FastImage
                            style={{
                                backgroundColor: '#E8E8E8',
                                // 设置宽度
                                width: hp(3),
                                height: hp(3),
                                borderRadius: hp(3)/2, zIndex: 3, elevation: 1,
                            }}
                            source={userinfo.login ? {uri: userinfo.avatar_url} : require('../res/img/no_login.png')}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                    </AnimatedTouchableOpacity>
                </View>

            </View>
        );
    }

    handleIndexChange = (index) => {
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <FristListComponent
                    translateY={this.translateY}
                    showAnimated={this.showAnimated}
                />;
            case 'second':
                return <SecondListComponent
                    translateY={this.translateY}
                    showAnimated={this.showAnimated}
                />;

        }
    };
    AnimatedIsshow = false;
    showAnimated = (show) => {
        if (show) {
            if (!this.AnimatedIsshow) {
                timing(this.animations.val, {
                    duration: 300,
                    toValue: 1,
                    easing: Easing.inOut(Easing.ease),
                }).start();
                this.AnimatedIsshow = true;

            }
        } else {
            if (this.AnimatedIsshow) {
                timing(this.animations.val, {
                    duration: 300,
                    toValue: 0,
                    easing: Easing.inOut(Easing.ease),
                }).start();
                this.AnimatedIsshow = false;
            }
        }
    };

    SearchOnFocus = () => {
        NavigationUtils.goPage({}, 'SearchPage');
    };
}

class FristListComponent extends PureComponent {

    scrollY = new Animated.Value(0);
    _onScroll = (event) => {
        const items = this.flatList.getItemLength();
        // console.log(items);
        if (items < 3) {
            return;
        }

        const y = event.nativeEvent.contentOffset.y;

        const {showAnimated} = this.props;
        if (Platform.OS === 'android') {

            if ((this.nowY <= 0 || y <= 0) && this.AnimatedIsshow) {
                showAnimated(false);
                return;
            }
            if (y < this.nowY) {
                showAnimated(false);
            }
            if (y > this.nowY) {
                showAnimated(true);
            }
        } else {
            if (y > this.nowY && y > 0) {
                showAnimated(true);
            }
            //
            if (y < this.nowY) {
                showAnimated(false);
            }
        }
        this.nowY = y;
    };

    componentDidMount() {
        EventBus.getInstance().addListener(EventTypes.scroll_top_for_page, this.listener = data => {
            const {pageName} = data;
            if (pageName == `IndexPage_0`) {
                this.flatList.scrollToTop_();
                this.props.showAnimated(false);
            }
        });
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }

    onMomentumScrollEnd = (e) => {
        if (Platform.OS === 'ios') {
            this.nowY = e.nativeEvent.contentOffset.y;
        }

    };

    render() {
        // console.log('render');
        const columnTop = Animated.interpolate(this.scrollY, {
            inputRange: [-hp(100), 0, hp(30)],
            outputRange: [hp(134), hp(34), hp(7)],
            extrapolate: 'clamp',
        });
        return <Animated.View style={{
            transform: [{translateY: this.props.translateY}],
        }}>
            <View style={{height: hp(2)}}/>
            <FlatListCommonUtil

                EmptyHeight={height - hp(43)}
                statusBarType={'dark'}
                pageSize={30}
                // type={2}
                ref={ref => this.flatList = ref}
                style={{zIndex: -100, elevation: -100}}
                onScrollBeginDrag={this._onScroll}
                onScrollEndDrag={this._onScroll}
                onMomentumScrollEnd={this.onMomentumScrollEnd}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {y: this.scrollY},
                        },
                    },
                ])}
                onRefresh={() => {
                    this.lunboComponent.updatePage();
                }}
                ListHeaderComponent={<LunBoComponent ref={ref => this.lunboComponent = ref}/>}
            />
            <Animated.View style={{
                width, height: hp(4.5), position: 'absolute', top: -hp(3), alignItems: 'flex-start', justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.9)', transform: [{translateY: columnTop}],
            }}>
                <View style={{
                    alignItems: 'center',
                    paddingHorizontal: 5,
                    flexDirection: 'row',
                    top: hp(0.5),
                    justifyContent: 'center',
                    paddingLeft: 20,
                }}>
                    <Image
                        resizeMode={'stretch'}
                        style={{
                            height: hp(1.8),
                            width: hp(1.5),

                        }}
                        source={require('../res/img/indexPage/tuijian.png')}
                    />
                    <Text
                        style={{
                            fontSize: hp(2.1),
                            color: bottomTheme,
                            marginLeft: 3,
                        }}>为您推荐</Text>
                </View>
            </Animated.View>
        </Animated.View>;
    }
}

class LunBoComponent extends React.Component {
    updatePage = () => {
        getLunboList({
            platform: Platform.OS,
            iosV: Global.apple_pay,
            androidV: Global.android_pay,
        }).then(result => {
            this.setState({
                lunboData: result,
            });
        });
    };
    state = {
        lunboData: [{
            id: -1,
            page_name: '',
            params: {},
            image_url: '',
        }],
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !equalsObj(this.state.lunboData, nextState.lunboData);
    }

    componentDidMount() {
        this.updatePage();
        EventBus.getInstance().addListener(EventTypes.change_for_apple, this.listener = data => {
            this.updatePage();
        });
    }

    componentWillUnmount(): * {
        EventBus.getInstance().removeListener(this.listener);
    }

    _renderItem = ({item, index}) => {

        const source = item.image_url.startsWith('http') ? {uri: `${item.image_url}`} : {uri: `http://images.easy-z.cn/yaoqingsongdali.png`};
        return <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => {
                //console.log(item);
                if (item.type == 1) {
                    if (item.page_name.indexOf('indexPage') !== -1 && item.page_name.indexOf('-') !== -1) {
                        const pageArray = item.page_name.split('-');
                        jumpTo(pageArray[1]);
                    } else {
                        NavigationUtils.goPage(JSON.parse(item.params), item.page_name);
                    }


                } else if (item.type == 2) {
                    Linking.canOpenURL(item.page_name).then(supported => {
                        if (!supported) {
                        } else {
                            Linking.openURL(item.page_name);
                        }
                    });
                }
            }}
        >
            <FastImagePro
                loadingType={1}
                loadingWidth={100}
                loadingHeight={100}
                style={[styles.imgStyle, {height: '100%', width: '100%'}]}
                source={source}
                resizeMode={FastImage.resizeMode.stretch}
                key={index}
            />
        </TouchableOpacity>
            ;
    };

    render() {
        const containerWidth = width - 20;
        const {lunboData} = this.state;
        return <View style={{
            alignItems: 'center',
            height: hp(32.5),
            paddingTop: hp(3.5),
            backgroundColor: theme,
            width: width,
            // marginBottom:hp(2.5),
        }}>

            {/*轮播图*/}
            <Carousel
                style={styles.carousel}
                timeout={6000}
                data={lunboData}
                renderItem={this._renderItem}
                itemWidth={containerWidth}
                containerWidth={containerWidth}
                separatorWidth={0}
                pagingEnable={true}
                paginationDefaultColor={'rgba(255,255,255,1)'}
                paginationActiveColor={bottomTheme}
            />


            <View style={{height: hp(4)}}/>
            {/*<View style={{height: 15, width, backgroundColor: '#f5f5f5'}}/>*/}
        </View>;
    }
}


const mapStateToProps = state => ({
    userinfo: state.userinfo,
    appSetting:state.appSetting
});
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    onSetUpdateToast: (bool) => dispatch(actions.onSetUpdateToast(bool)),
});
const HomePageRedux = connect(mapStateToProps, mapDispatchToProps)(HomePage);
const styles = StyleSheet.create({
    carousel: {
        flex: 1,
    },
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: width,
        borderRadius: 10,
        // 设置高度
        // height:150
    },
});
export default HomePageRedux;
;
