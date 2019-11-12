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
import FlatListCommonUtil from '../common/FlatListCommonUtil';

const {timing} = Animated;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const lunboHeight = height / 4;
const topIputHeight = (Platform.OS === 'ios') ? 35 : 35;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
                resizeMode={FastImage.stretch}
                key={index}
            />
        </TouchableOpacity>
            ;
    };
    scrollY = new Animated.Value(0);

    render() {
        const containerWidth = width - 20;
        const {lunboData} = this.state;
        const columnTop = Animated.interpolate(this.scrollY, {
            inputRange: [-220, 0, lunboHeight - 40],
            outputRange: [lunboHeight - 40 + 220, lunboHeight - 40, 0],
            extrapolate: 'clamp',
        });
        return <View>
            <FlatListCommonUtil
                onLoading={(load) => {
                    this.props.onLoad(load);
                }}
                ListHeaderComponent={
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
                    //
                }
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: y =>
                                        Animated.block([
                                            Animated.set(this.scrollY, y),
                                            Animated.call(
                                                [y],
                                                ([offsetY]) => (this.props.onScroll(offsetY)),
                                            ),
                                        ]),
                                },
                            },
                        },
                    ],
                    {
                        useNativeDriver: true,
                    },
                )}
            />
            <Animated.View style={{
                width, height: 40, justifyContent: 'center', position: 'absolute',
                backgroundColor: 'white', transform: [{translateY: columnTop}],
            }}>
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
                }}/>
            </Animated.View>
        </View>;
    }
}

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


    }

    position = new Animated.Value(0);

    // FirstRoute = () => {
    //     // const {taskData, isLoading, hideLoaded} = this.state;
    //
    //     return ;
    // };
    // _onScroll = (y) => {
    //     this.topBarTop = y;
    // };

    // SecondRoute = () => (
    //     <View style={[styles.scene, {backgroundColor: '#673ab7'}]}/>
    // );

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    animations = {
        val: new Animated.Value(0),
    };

    render() {
        // console.log('wo被render');
        const {navigationRoutes, navigationIndex} = this.state;

        let statusBar = {
            hidden: false,
        };

        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        const searchWidth = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [width - 20, width - 150],
            extrapolate: 'clamp',
        });
        const marginTop = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [0, -40],
            extrapolate: 'clamp',
        });
        const svgTop = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [60, 20],
            extrapolate: 'clamp',
        });
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
                        // marginTop:10
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
                            <Text style={{color: 'rgba(0,0,0,0.6)'}}>搜索任务ID,商家名称</Text>
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
                    <AnimatedTouchableOpacity
                        style={{position: 'absolute', top: svgTop, zIndex: 3, right: 10, elevation: 1}}>
                        {/*<Image*/}
                        <FastImage
                            style={{
                                backgroundColor: '#E8E8E8',
                                // 设置宽度
                                width: 25,
                                height: 25,
                                borderRadius: 25,
                            }}
                            source={{uri: `https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573504411074&di=a19e2ebb37ff7fd3c9c14dccb1debeaf&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201709%2F22%2F20170922162149_snyk3.jpeg`}}
                            resizeMode={FastImage.stretch}
                        />
                    </AnimatedTouchableOpacity>
                    <Animated.View style={{marginTop: marginTop, width, height: 30, backgroundColor: 'white'}}>
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

                    {/*rn0.6bug多且行且珍惜*/}
                    <View style={{flex: 1, overflow: 'hidden'}}>
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
                    </View>
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
                />;

        }
    };
    flatListLoad = false;
    _onLoad = (refresh) => {
        this.flatListLoad = refresh;
    };
    AnimatedIsshow = false;
    lastScrollTitle = 0;
    showAnimated = (y) => {
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
        if (y < this.nowY && !this.flatListLoad) {
            if (this.AnimatedIsshow) {
                this.lastScrollTitle = Date.now();
                timing(this.animations.val, {
                    duration: 300,
                    toValue: 0,
                    easing: Easing.inOut(Easing.ease),
                }).start();
                this.AnimatedIsshow = false;
            }
        }
    };
    _onScroll = (y) => {
        // const  = e.nativeEvent.contentOffset.y;
        if (Platform.OS === 'android') {
            if (this.lastScrollTitle + 800 < Date.now()) {
                this.lastScrollTitle = Date.now();
                this.showAnimated(y);
            }
        } else {
            this.showAnimated(y);
        }


        this.nowY = y;
    };
    SearchOnFocus = () => {
        NavigationUtils.goPage({}, 'SearchPage');
    };
}

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
export default HomePage;
