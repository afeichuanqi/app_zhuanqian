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
    FlatList, TouchableOpacity, Platform,
} from 'react-native';
import {bottomTheme, theme} from '../appSet';
import Animated, {Easing} from 'react-native-reanimated';

const {timing} = Animated;
import NavigationBar from '../common/NavigationBar';
import TabBar from '../common/TabBar';
import search from '../res/svg/search.svg';
import jia from '../res/svg/jia.svg';
import fabu from '../res/svg/fabu.svg';
import SvgUri from 'react-native-svg-uri';
import {TabView} from 'react-native-tab-view';
import zhankai from '../res/svg/zhankai.svg';
import yincang from '../res/svg/yincang.svg';
import remenrenwu from '../res/svg/remenrenwu.svg';
import FlatListCommonUtil from './TaskHallPage/FlatListCommonUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import {getHotTasks} from '../util/AppService';
import Global from '../common/Global';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
// import FilterComponent from './TaskHall/FilterComponent';
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
            // {key: 'second1', title: '简单'},
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
            // backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
            // barStyle: 'light-content',
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
                    height: 50,
                    width,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                }}>
                    <TabBar
                        style={{
                            height: 45,
                            width: 200,
                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: 15}}
                        routes={navigationRoutes}
                        index={navigationIndex}
                        handleIndexChange={this.handleIndexChange}
                        bounces={true}
                        titleMarginHorizontal={15}
                        activeStyle={{fontSize: 19, color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: 16, color: [255, 255, 255], height: 10}}
                        indicatorStyle={{height: 3, backgroundColor: 'white', borderRadius: 3, top: -5}}
                    />
                    <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                        {/*加图标*/}
                        <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goPage({}, 'TaskRelease');
                            }}
                        >
                            <SvgUri width={21} height={21} fill={'white'} svgXmlData={jia}/>
                        </TouchableOpacity>
                        <View style={{height: 13, width: 0.4, backgroundColor: 'white', marginHorizontal: 12}}/>
                        {/*搜索图标*/}
                        <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goPage({}, 'SearchPage');
                            }}
                        >
                            <SvgUri width={21} height={21} fill={'white'} svgXmlData={search}/>
                        </TouchableOpacity>


                    </View>
                </View>
                <TabView
                    // ref={ref => this.tabView = ref}
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
        const Y_ = this.nowY - y;
        if (Y_ < 10
            && Y_ > -10
        ) {
            return;
        }

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

    render() {
        const marginTop = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [0, -40],
            extrapolate: 'clamp',
        });
        const translateY = Animated.interpolate(this.animations.val, {
            inputRange: [0, 1],
            outputRange: [80, 0],
            extrapolate: 'clamp',
        });
        const {show, showFilterComponent} = this.state;

        return <View style={{flex: 1, zIndex: 3}}>


            <Animated.View style={{transform: [{translateY}]}}>
                <FlatListCommonUtil
                    device={this.props.device}
                    ref={ref => this.flatList = ref}
                    onScrollBeginDrag={this._onScroll}
                    onScrollEndDrag={this._onScroll}
                    onRefresh={() => {
                        this.headlineComponent.updatePage();
                    }}
                />
            </Animated.View>
            {/*工具条*/}
            <Animated.View style={{position: 'absolute', top: marginTop, zIndex: 4, elevation: 0.2}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#e8e8e8',
                    zIndex: 3,
                    height: 40,
                    width,

                    backgroundColor: theme,
                }}>
                    <TopLeftFilterComponent onPress={this._columnTypeClick}
                                            ref={ref => this.topLeftFilterComponent = ref}/>
                    <TypeItem ref={ref => this.typeItem = ref} show={show} onPress={this._onPress}/>
                </View>
                {/*筛选器*/}
                <HeadlineComponent index={this.props.index} ref={ref => this.headlineComponent = ref}/>

            </Animated.View>

            {showFilterComponent ?
                <FilterComponent cancelClick={() => {
                    this.hide();
                }} sureClick={this._sureClick} ref={ref => this.filterComponent = ref}/> : null}
        </View>;
    }

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
            style={{height: 40, justifyContent: 'center', marginRight: 8}}>
            <View
                // activeOpacity={0.6}
                onPress={this.onPress}
                style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: title.length > 2 ? 'rgba(33,150,243,0.1)' : '#f0f0f0',
                    borderRadius: 5,

                }}>
                <Text style={[{
                    fontSize: 13, marginRight: 3,
                }, title.length > 2 ? {color: bottomTheme} : !show ? {
                    color: 'black',
                    opacity: 0.5,
                } : {color: bottomTheme}]}>{title}</Text>
                {
                    !show ? <SvgUri style={{marginTop: 3}} fill={title.length > 2 ? bottomTheme : 'rgba(0,0,0,0.5)'}
                                    width={10} height={10}
                                    svgXmlData={zhankai}/> :
                        <SvgUri style={{marginTop: 3}} fill={bottomTheme} width={10} height={10}
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
                this.state.HeadlineArrays.length !== 0) {//只有在当前页面才进行跑马灯
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
        return <View style={{
            height: 40,
            width,
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 0.3,
            borderBottomColor: 'rgba(0,0,0,0.1)',
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center', height: 20}}>
                <SvgUri style={{marginLeft: 20, marginTop: 2}} width={60} height={60} svgXmlData={remenrenwu}/>
            </View>
            {/*分隔符*/}
            <View
                style={{height: 25, width: 0.7, backgroundColor: 'rgba(0,0,0,0.2)', marginLeft: 20, borderRadius: 3}}/>
            {/*热门任务*/}
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
                {/*禁止触摸*/}
                <TouchableOpacity
                    onPress={() => {
                        NavigationUtils.goPage({
                            test: false,
                            task_id: this.state.HeadlineArrays[this.index].taskId,
                        }, 'TaskDetails');
                    }}
                    activeOpacity={1}
                    style={{position: 'absolute', width: 300, height: 40, opacity: 1, zIndex: 3}}/>
            </View>
        </View>;
    }

    _renderIndexPath = ({item, index}) => {
        return <View
            key={item.taskId}
            style={{
                height: 40,
                flexDirection: 'row',
                alignItems: 'center', justifyContent: 'space-between',

            }}>
            <Text
                numberOfLines={1}
                style={{
                    fontSize: 17,
                    color: bottomTheme,
                    width: width - 190,
                    marginLeft: 10,

                }}>{item.taskTitle}</Text>
            <Text style={{
                color: 'red', fontSize: 17,
                marginRight: 10,
            }}>+{item.rewardPrice} 元</Text>
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
            paddingHorizontal: 12, flexDirection: 'row',
            justifyContent: 'space-between', height: 40, alignItems: 'center', width: 200,

        }}>
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                {filterArray.map((item, Lindex, arr) => {
                    return <TouchableOpacity
                        key={Lindex}
                        activeOpacity={0.6}
                        style={{marginLeft: 8, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this._onPress(Lindex)}
                    >
                        <Text style={[{
                            fontSize: 15,
                            // fontWeight: '400',
                        }, Lindex === index ? {
                            color: 'black',
                            fontWeight: '400',
                        } : {color: '#767676'}]}>{item.title}</Text>

                        {/*{Lindex === index && <View style={{*/}
                        {/*    height: 3,*/}
                        {/*    width: 17,*/}
                        {/*    backgroundColor: bottomTheme,*/}
                        {/*    position: 'absolute',*/}
                        {/*    bottom: -8,*/}
                        {/*    // left:8,*/}
                        {/*}}/>}*/}

                    </TouchableOpacity>;
                })}

            </View>

        </View>;
    }
}


export default TaskHallPage;
