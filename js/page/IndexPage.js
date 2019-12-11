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


} from 'react-native';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
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

const {timing} = Animated;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const lunboHeight = height / 4;
const topIputHeight = (Platform.OS === 'ios') ? 35 : 35;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);


class HomePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {

        navigationIndex: 0,
        navigationRoutes: [
            {key: 'first', title: '推荐'},
            {key: 'second', title: '最新'},
        ],

    };

    componentDidMount() {
        ChatSocket.connctionServer(this.props.userinfo.token);

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
            // this.pickerImage.show();
            NavigationUtils.goPage({}, 'AccountSetting');
        }
    };

    render() {
        const {navigationRoutes, navigationIndex} = this.state;
        let statusBar = {
            // hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
            // barStyle: 'dark-content',
        };

        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        const searchWidth = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [width - 20, width - 150],
            extrapolate: 'clamp',
        });
        this.translateY = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [0, -30],
            extrapolate: 'clamp',
        });
        const svgTop = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [60, 20],
            extrapolate: 'clamp',
        });

        const {userinfo} = this.props;
        return (
            <View
                style={{flex: 1}}
            >
                {navigationBar}
                {/*顶部搜索栏样式*/}
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
                        height: 60,
                    }}>
                        <AnimatedTouchableOpacity
                            activeOpacity={1}
                            onPress={this.SearchOnFocus}
                            style={{
                                height: topIputHeight, width: searchWidth, backgroundColor: 'rgba(0,0,0,0.05)',
                                alignItems: 'center', borderRadius: 10, flexDirection: 'row',
                            }}>
                            <SvgUri style={{
                                marginHorizontal: 8,
                            }} width={19} height={19} svgXmlData={search}/>
                            <Text style={{color: 'rgba(0,0,0,0.4)'}}>搜索任务标题、任务ID、用户名</Text>
                        </AnimatedTouchableOpacity>

                        <TabBar
                            style={{
                                height: 30,
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
                            activeStyle={{fontSize: 14, color: [0, 0, 0]}}
                            inactiveStyle={{fontSize: 12, color: [95, 95, 95], height: 10}}
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
                        onIndexChange={index => this.setState({
                            navigationIndex: index,
                        })}
                        initialLayout={{width}}
                        lazy={true}
                    />
                    <Animated.View style={{
                        width,
                        height: 30,
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: 60,
                        transform: [{translateY: this.translateY}],
                    }}>
                        <TabBar
                            style={{
                                height: 28,
                                paddingLeft: 10,
                            }}
                            position={this.position}
                            contentContainerStyle={{paddingTop: 5}}
                            routes={navigationRoutes}
                            index={navigationIndex}
                            sidePadding={0}
                            handleIndexChange={this.handleIndexChange}
                            bounces={true}
                            titleMarginHorizontal={15}
                            activeStyle={{fontSize: 18, color: [0, 0, 0]}}
                            inactiveStyle={{fontSize: 14, color: [95, 95, 95], height: 10}}
                            indicatorStyle={{height: 3, backgroundColor: bottomTheme, borderRadius: 3}}
                        />
                    </Animated.View>
                    {/*头像组件*/}
                    <AnimatedTouchableOpacity
                        onPress={this._avatarClick}
                        style={{position: 'absolute', top: svgTop, zIndex: 3, right: 10, elevation: 1}}>
                        {/*<Image*/}
                        <FastImage
                            style={{
                                backgroundColor: '#E8E8E8',
                                // 设置宽度
                                width: 25,
                                height: 25,
                                borderRadius: 25, zIndex: 3, elevation: 1,
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
        // console.log(index);
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <FristListComponent
                    position={this.position}
                    onScroll={this._onScroll}
                    onLoad={this._onLoad}
                    translateY={this.translateY}
                    showAnimated={this.showAnimated}
                />;
            case 'second':
                return <SecondListComponent
                    position={this.position}
                    onScroll={this._onScroll}
                    onLoad={this._onLoad}
                    translateY={this.translateY}
                    showAnimated={this.showAnimated}
                />;

        }
    };
    flatListLoad = false;
    _onLoad = (refresh) => {
        this.flatListLoad = refresh;
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
    _iosShowAnimated = (y) => {
        if (y > this.nowY && y > 0) {

            if (!this.AnimatedIsshow) {
                timing(this.animations.val, {
                    duration: 300,
                    toValue: 1,
                    easing: Easing.inOut(Easing.ease),
                }).start();
                this.AnimatedIsshow = true;

            }
        }
        //
        if (y < this.nowY) {
            if (this.AnimatedIsshow) {
                // this.lastScrollTitle = Date.now();
                timing(this.animations.val, {
                    duration: 300,
                    toValue: 0,
                    easing: Easing.inOut(Easing.ease),
                }).start();
                this.AnimatedIsshow = false;
            }
        }


    };
    _androidShowAnimated = (y) => {
        // if (this.lastScrollTitle + 800 < Date.now()) {
        //     this.lastScrollTitle = Date.now();
        if ((this.nowY <= 0 || y <= 0) && this.AnimatedIsshow) {
            timing(this.animations.val, {
                duration: 300,
                toValue: 0,
                easing: Easing.inOut(Easing.ease),
            }).start();
            this.AnimatedIsshow = false;
            return;
        }
        if (y < this.nowY) {
            if (this.AnimatedIsshow) {
                timing(this.animations.val, {
                    duration: 300,
                    toValue: 0,
                    easing: Easing.inOut(Easing.ease),
                }).start();
                this.AnimatedIsshow = false;
            }
        }
        if (y > this.nowY) {
            if (!this.AnimatedIsshow) {
                timing(this.animations.val, {
                    duration: 300,
                    toValue: 1,
                    easing: Easing.inOut(Easing.ease),
                }).start();
                this.AnimatedIsshow = true;

            }
        }
    };
    _onScroll = (y) => {
        if (Platform.OS === 'android') {
            this._androidShowAnimated(y);
        } else {
            this._iosShowAnimated(y);
        }
        this.nowY = y;
    };
    SearchOnFocus = () => {
        NavigationUtils.goPage({}, 'SearchPage');
    };
}

class FristListComponent extends PureComponent {
    state = {
        lunboData: [
            {imgUrl: 'http://img2.imgtn.bdimg.com/it/u=3292807210,3869414696&fm=26&gp=0.jpg'},
            {imgUrl: 'http://static.open-open.com/lib/uploadImg/20160101/20160101125439_819.jpg'},
        ],
    };
    _renderItem = ({item, index}) => {
        return <TouchableOpacity onPress={() => {
        }}>
            <FastImage
                style={[styles.imgStyle, {height: '100%', width: '100%'}]}
                source={{uri: `${item.imgUrl}`}}
                resizeMode={FastImage.resizeMode.stretch}
                key={index}
            />
        </TouchableOpacity>
            ;
    };
    scrollY = new Animated.Value(0);
    // AnimatedEvent = Animated.event(
    //     [
    //         {
    //             nativeEvent: {
    //                 contentOffset: {
    //                     y: y =>
    //                         Animated.block([
    //                             Animated.call(
    //                                 [y],
    //                                 ([offsetY]) => (this.props.onScroll(offsetY)),
    //                             ),
    //                         ]),
    //                 },
    //             },
    //         },
    //     ],
    //     {
    //         useNativeDriver: true,
    //     },
    // );

    _onScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const {showAnimated} = this.props;
        if (Platform.OS === 'android') {

            if ((this.nowY <= 0 || y <= 0) && this.AnimatedIsshow) {
                showAnimated(false)
            }
            if (y < this.nowY) {
                showAnimated(false)
            }
            if (y > this.nowY) {
                showAnimated(true)
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


    render() {
        const containerWidth = width - 20;
        const {lunboData} = this.state;
        const columnTop = Animated.interpolate(this.scrollY, {
            inputRange: [-220, 0, lunboHeight - 20],
            outputRange: [lunboHeight + 220, lunboHeight - 10, 20],
            extrapolate: 'clamp',
        });
        return <Animated.View style={{
            transform: [{translateY: this.props.translateY}],
        }}>
            <View style={{height: 30}}/>
            <FlatListCommonUtil
                style={{zIndex: -100, elevation: -100}}
                onScrollBeginDrag={this._onScroll}
                onScrollEndDrag={this._onScroll}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {y: this.scrollY},
                        },
                    },
                ])}
                onLoading={(load) => {
                    this.props.onLoad(load);
                }}
                ListHeaderComponent={
                    <View>

                        <View style={{
                            alignItems: 'center',
                            height: lunboHeight,
                            paddingTop: 10,
                            backgroundColor: theme,
                            width: width,
                            // zIndex: 1,

                        }}>
                            {/*轮播图*/}
                            <Carousel
                                // homeNavigation={NavigationUtil.homeNavigation}
                                // navigation={this.props.navigation}
                                style={styles.carousel}
                                timeout={3000}
                                data={lunboData}
                                renderItem={this._renderItem}
                                itemWidth={containerWidth}
                                containerWidth={containerWidth}
                                separatorWidth={0}
                                pagingEnable={true}
                                paginationDefaultColor={'rgba(255,255,255,0.5)'}
                                paginationActiveColor={'rgba(255,255,255,1)'}
                            />
                            <View style={{height: 40}}/>

                        </View>
                    </View>
                    //
                }
                // onScroll={}
            />
            <Animated.View style={{
                width, height: 40, justifyContent: 'space-between', position: 'absolute',
                backgroundColor: 'white', transform: [{translateY: columnTop}]
            }}>
                <View style={{height:8}}/>
                <Text
                    style={{
                        fontSize: 12,
                        marginLeft: 15,
                        marginTop: 10,
                        color: bottomTheme,
                    }}>为您推荐</Text>
                <View style={{
                    width: 50,
                    backgroundColor: bottomTheme,
                    height: 1,
                    marginLeft: 15,
                    marginTop: 10,
                    // alignSelf:'flex-end',
                }}/>
            </Animated.View>
        </Animated.View>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onLogin: (phone, code, callback) => dispatch(actions.onLogin(phone, code, callback)),
});
const HomePageRedux = connect(mapStateToProps, mapDispatchToProps)(HomePage);
const styles = StyleSheet.create({
    carousel: {
        flex: 1,
        // justifyContent:'center'
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
