/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Platform, FlatList,
} from 'react-native';
import {bottomTheme, theme} from '../appSet';
import Animated, {Easing} from 'react-native-reanimated';
import NavigationBar from '../common/NavigationBar';
import TabBar from '../common/TabBar';
import search from '../res/svg/search.svg';
import jia from '../res/svg/jia.svg';
import SvgUri from 'react-native-svg-uri';
import {TabView} from 'react-native-tab-view';
import zhankai from '../res/svg/zhankai.svg';
import yincang from '../res/svg/yincang.svg';
import FlatListCommonUtil from './TaskHallPage/FlatListCommonUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import {getHotTasks} from '../util/AppService';
import Global from '../common/Global';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import Image from 'react-native-fast-image';
import {getEmojis} from '../util/CommonUtils';
import Emoji from 'react-native-emoji';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AnimatedFadeIn from '../common/AnimatedFadeIn';
const {timing} = Animated;
let FilterComponent = null;

const width = Dimensions.get('window').width;

class TaskHallPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        navigationIndex: 0,
        navigationRoutes: [
            {key: 'first', title: '全部'},
            {key: 'second', title: Platform.OS === 'android' ? '安卓手机' : '苹果手机'},
        ],
    };

    componentDidMount() {


    }

    position = new Animated.Value(0);

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {

        const {navigationIndex, navigationRoutes} = this.state;

        let statusBar = {
            hidden: false,
        };
        let navigationBar = <NavigationBar
            // showStatusBarHeight={true}
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        return (
            <View
                style={{flex: 1}}
            >
                {navigationBar}
                {/*顶部样式*/}
                <View style={{
                    backgroundColor: bottomTheme,
                    height: hp(9.7),
                    width,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                }}>
                    <TabBar
                        style={{
                            height: hp(7.5),
                            width: wp(50),
                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: hp(3.7)}}
                        routes={navigationRoutes}
                        index={navigationIndex}
                        handleIndexChange={this.handleIndexChange}
                        bounces={true}
                        titleMarginHorizontal={wp(4)}
                        activeStyle={{fontSize: wp(5), color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: wp(4), color: [255, 255, 255], height: 10}}
                        indicatorStyle={{height: hp(0.4), backgroundColor: 'white', borderRadius: 3, top: -hp(0.1)}}
                    />
                    <View style={{flexDirection: 'row', marginTop: hp(1.5), alignItems: 'center'}}>
                        {/*加图标*/}
                        <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goPage({}, 'TaskRelease');
                            }}
                        >
                            <SvgUri width={wp(5.8)} height={hp(5.8)} fill={'white'} svgXmlData={jia}/>
                        </TouchableOpacity>
                        <View style={{
                            height: hp(2.3),
                            width: wp(0.05),
                            backgroundColor: 'white',
                            marginHorizontal: wp(3.5),
                        }}/>
                        {/*搜索图标*/}
                        <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goPage({}, 'SearchPage');
                            }}
                        >
                            <SvgUri width={wp(5.5)} height={hp(5.5)} fill={'white'} svgXmlData={search}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <TabView
                    indicatorStyle={{backgroundColor: 'white'}}
                    navigationState={{index: navigationIndex, routes: navigationRoutes}}
                    renderScene={this.renderScene}
                    position={this.position}
                    renderTabBar={() => null}
                    onIndexChange={index => {
                        this.setState({
                            navigationIndex: index,
                        });
                        Global.TaskHallPage_Index = index;
                    }}
                    initialLayout={{width}}
                    lazy={true}
                />

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
                return <FristListComponent index={0} device={1}/>;
            case 'second':
                return <FristListComponent index={1} device={Platform.OS == 'android' ? 2 : 3}/>;
        }
    };

}

class FristListComponent extends PureComponent {
    componentDidMount() {
        EventBus.getInstance().addListener(EventTypes.scroll_top_for_page, this.listener = data => {
            const {pageName} = data;
            if (pageName == `TaskHallPage_${this.props.index}`) {
                this.flatList.scrollToTop_();
                this.showAnimated(false);
            }
        });
    }

    componentWillUnmount() {

        EventBus.getInstance().removeListener(this.listener);
    }

    onLoading = (load) => {
        this.onloading = load;
    };
    state = {
        show: false,
        showFilterComponent: false,
        tOutputRange: hp(5.9),
    };
    params = {
        pageIndex: 0,
    };
    _topLeftClick = (isShow) => {
        if (isShow) {
            //

            this.filterComponent.show();
        } else {
            this.filterComponent.hide();
        }
    };
    nowY = 0;
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

    _onScroll = (e) => {
        const y = e.nativeEvent.contentOffset.y;

        if (Platform.OS === 'android') {
            if ((this.nowY <= 0 || y <= 0) && this.AnimatedIsshow) {
                this.showAnimated(false);
                return;
            }
            if (y < this.nowY) {
                this.showAnimated(false);
            }
            if (y > this.nowY) {
                this.showAnimated(true);
            }
        } else {
            if (y > this.nowY && y > 0) {
                this.showAnimated(true);
            }
            //
            if (y < this.nowY) {
                this.showAnimated(false);
            }
        }
        this.nowY = y;

    };
    animations = {
        val: new Animated.Value(0),
    };
    _sureClick = (arr) => {
        this.flatList.setTypes(arr.toString());
        this.hide();
        setTimeout(() => {
            this.flatList._updateList(true);
        }, 200);
        if (arr.length > 0) {
            this.typeItem.setTitle(`类型·${arr.length}`);
        } else {
            if (this.typeItem.getTitle().length !== 2) {
                this.typeItem.setTitle(`类型`);
            }

        }
    };
    _columnTypeClick = (item) => {
        this.flatList.setColumnType(item.id);
        this.flatList._updateList(true);

    };
    onMomentumScrollEnd = (e) => {
        if (Platform.OS === 'ios') {
            this.nowY = e.nativeEvent.contentOffset.y;
        }

    };

    render() {
        const headlineTranslateY = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [0, -hp(5.9)],
            extrapolate: 'clamp',
        });
        const translateY = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [this.state.tOutputRange, 0],
            extrapolate: 'clamp',
        });
        const {show, showFilterComponent} = this.state;

        return <View style={{flex: 1, zIndex: 3}}>


            <Animated.View style={{transform: [{translateY}]}}>
                <FlatListCommonUtil
                    statusBarType={'light'}
                    device={this.props.device}
                    ref={ref => this.flatList = ref}
                    onScrollBeginDrag={this._onScroll}
                    onScrollEndDrag={this._onScroll}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}
                    onRefresh={() => {
                        this.headlineComponent.updatePage();
                    }}
                />
            </Animated.View>
            {/*工具条*/}
            <Animated.View style={{
                position: 'absolute',
                transform: [{translateY: headlineTranslateY}],
                zIndex: 4,
                elevation: 0.2,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: wp(0.1),
                    borderBottomColor: 'rgba(0,0,0,0.2)',
                    zIndex: 3,
                    height: hp(5.9),
                    width,

                    backgroundColor: theme,
                }}>
                    <TopLeftFilterComponent onPress={this._columnTypeClick}
                                            ref={ref => this.topLeftFilterComponent = ref}/>
                    <TypeItem ref={ref => this.typeItem = ref} show={show} onPress={this._onPress}/>
                </View>

                <HeadlineComponent
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                    index={this.props.index}
                    ref={ref => this.headlineComponent = ref}
                />

            </Animated.View>
            {/*筛选器*/}
            {showFilterComponent ?
                <FilterComponent cancelClick={() => {
                    this.hide();
                }} sureClick={this._sureClick} ref={ref => this.filterComponent = ref}/> : null}
        </View>;
    }

    onError = () => {
        if (this.state.tOutputRange === hp(11.8)) {
            this.setState({
                tOutputRange: hp(5.9),
            });
        }
    };
    onSuccess = () => {
        if (this.state.tOutputRange === hp(5.9)) {
            this.setState({
                tOutputRange: hp(11.8),
            });
        }
    };
    _onPress = () => {
        if (FilterComponent !== null && !this.state.showFilterComponent) {
            this.setState({
                showFilterComponent: true,
            });
        }
        if (!this.state.show && FilterComponent === null) {
            FilterComponent = require('./TaskHallPage/FilterComponent').default;
            this.setState({
                showFilterComponent: true,
            });
        }
        this.setState({
            show: !this.state.show,
        }, () => {
            this._topLeftClick(this.state.show);
        });
    };
    hide = () => {
        this.setState({
            show: false,
        });
    };
}

class TypeItem extends PureComponent {
    state = {
        title: '类型',
    };
    setTitle = (title) => {
        this.setState({
            title,
        });
    };
    getTitle = () => {
        return this.state.title;
    };

    render() {
        const {show, onPress} = this.props;
        const {title} = this.state;

        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={onPress}
            style={{height: hp(5.9), justifyContent: 'center', marginRight: wp(2)}}>
            <View
                // activeOpacity={0.6}
                onPress={this.onPress}
                style={{
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(0.6),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: title.length > 2 ? 'rgba(33,152,245,0.1)' : '#f5f5f5',
                    borderRadius: wp(1),

                }}>
                <Text style={[{
                    fontSize: wp(3.9), marginRight: wp(0.5),
                }, title.length > 2 ? {color: bottomTheme} : !show ? {
                    color: 'black',
                    opacity: 0.6,
                } : {color: bottomTheme}]}>{title}</Text>
                {
                    !show ?
                        <SvgUri style={{marginTop: hp(0.6)}} fill={title.length > 2 ? bottomTheme : 'rgba(0,0,0,0.5)'}
                                width={wp(2)} height={wp(2)}
                                svgXmlData={zhankai}/> :
                        <SvgUri style={{marginTop: hp(0.6)}} fill={bottomTheme} width={wp(2)} height={wp(2)}
                                svgXmlData={yincang}/>
                }

            </View>
        </TouchableOpacity>;
    }
}

class HeadlineComponent extends PureComponent {

    state = {
        HeadlineArrays: [],
    };

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    updatePage = () => {

        getHotTasks().then(result => {
            result.length > 0 && this.props.onSuccess();
            result.length === 0 && this.props.onError();
            this.setState({
                HeadlineArrays: result,
            });
        });
    };
    startLunbo = () => {
        this.index = 0;
        this.timer = setInterval(() => {
            if (Global.TaskHallPage_Index == this.props.index &&
                Global.activeRouteName == 'TaskHallPage' &&
                this.state.HeadlineArrays.length > 1) {//只有在当前页面才进行跑马灯
                this.index = this.index >= this.state.HeadlineArrays.length - 1 ? 0 : this.index + 1;
                this.flatList.scrollToIndex({animated: true, index: this.index});
            }


        }, 2500);
    };

    componentDidMount() {
        // this.updatePage();
        !this.timer && this.startLunbo();

    }

    render() {
        const {HeadlineArrays} = this.state;
        if (HeadlineArrays.length === 0) {
            return null;
        }
        return <AnimatedFadeIn
            duration={1000}
        >
            <View style={{
                height: hp(5.9),
                width,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 0.3,
                borderBottomColor: 'rgba(0,0,0,0.2)',
            }}>
                <Image
                    resizeMode={'stretch'}
                    source={require('../res/img/index_hot.png')} style={{
                    width: wp(12), height: hp(2.5), marginLeft: wp(5),
                    marginBottom: hp(0.8),
                }}/>
                <View style={{
                    flex: 1,
                    overflow: 'hidden',

                }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        ref={ref => this.flatList = ref}
                        data={HeadlineArrays}
                        scrollEventThrottle={1}
                        renderItem={data => this._renderIndexPath(data)}
                        keyExtractor={(item, index) => index + ''}
                        // onEndReachedThreshold={0.01}
                    />

                </View>
            </View>
        </AnimatedFadeIn>;
    }

    _renderIndexPath = ({item, index}) => {
        let taskTitle = item.taskTitle;
        let emojiArr = [];
        const json = getEmojis(taskTitle);
        if (json) {
            taskTitle = json.content;
            emojiArr = json.emojiArr;
        }
        return <View
            key={item.taskId}
            style={{
                height: hp(5.9),
                flexDirection: 'row',
                alignItems: 'center', justifyContent: 'space-between',
                paddingRight: wp(2.3),
            }}>
            <Text
                numberOfLines={1}
                style={{
                    color: 'black',
                    width: wp(60),
                    marginLeft: wp(1), opacity: 0.8,
                    marginTop: -wp(0.5),
                    fontSize: wp(4),

                }}>


                {taskTitle} {emojiArr.map((item, index) => {
                return <Emoji key={index} name={item} style={{fontSize: wp(60)}}/>;
            })}
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center', height: 25}}>
                <Text style={{
                    color: 'red', fontSize: wp(4.6),
                    marginRight: wp(0.2),
                }}>
                    {item.rewardPrice}
                </Text>
                <Text style={{fontSize: 14, color: 'red', top: hp(0.07), marginRight: 5}}>元</Text>
                <Image resizeMode={'stretch'} source={require('../res/img/sanjiao.png')}
                       style={{width: wp(2), height: wp(2)}}/>
            </View>


        </View>;
    };
}

class TopLeftFilterComponent extends Component {
    state = {
        index: this.props.index || 0,

    };
    static defaultProps = {
        filterArray: [
            {id: 1, title: '推荐'},
            {id: 2, title: '最新'},
            {id: 3, title: '人气'},
            {id: 4, title: '价格'},
        ],
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.index !== nextState.index) {
            return true;
        }
        return false;
    }

    _onPress = (index) => {
        this.setState({
            index,
        });
        // console.log();
        this.props.onPress(this.props.filterArray[index]);
    };

    render() {
        // console.lo
        const {index} = this.state;
        const {filterArray} = this.props;
        return <View style={{
            paddingHorizontal: wp(3), flexDirection: 'row',
            justifyContent: 'space-between', height: hp(5.9), alignItems: 'center', width: wp(60),

        }}>
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                {filterArray.map((item, Lindex, arr) => {
                    return <TouchableOpacity
                        key={Lindex}
                        activeOpacity={0.6}
                        style={{marginLeft: wp(2.1), alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this._onPress(Lindex)}
                    >
                        <Text style={[{
                            fontSize: wp(4.2),
                            fontWeight: '400',
                        }, Lindex === index ? {
                            color: 'black',
                            fontWeight: '400',
                        } : {color: '#767676'}]}>{item.title}</Text>

                    </TouchableOpacity>;
                })}

            </View>

        </View>;
    }
}


export default TaskHallPage;
