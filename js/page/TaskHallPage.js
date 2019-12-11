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
import fabu from '../res/svg/fabu.svg';
import SvgUri from 'react-native-svg-uri';
import {TabView} from 'react-native-tab-view';
import zhankai from '../res/svg/zhankai.svg';
import yincang from '../res/svg/yincang.svg';
import remenrenwu from '../res/svg/remenrenwu.svg';
import FlatListCommonUtil from './TaskHallPage/FlatListCommonUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import {getHotTasks} from '../util/AppService';
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
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
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
                    height: 44,
                    width,
                    alignItems: 'center',

                }}>
                    {/*搜索图标*/}
                    <TouchableOpacity
                        onPress={() => {
                            NavigationUtils.goPage({}, 'SearchPage');
                        }}
                        style={{
                            position: 'absolute',
                            left: 20,
                            top: 15,

                        }}>
                        <SvgUri width={21} height={21} fill={'white'} svgXmlData={search}/>
                    </TouchableOpacity>


                    <TabBar
                        style={{
                            height: 40,
                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: 17}}
                        routes={navigationRoutes}
                        index={navigationIndex}
                        // sidePadding={0}
                        handleIndexChange={this.handleIndexChange}
                        // indicatorStyle={styles.indicator}
                        bounces={true}
                        titleMarginHorizontal={25}
                        activeStyle={{fontSize: 18, color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: 14, color: [255, 255, 255], height: 10}}
                        indicatorStyle={{height: 3, backgroundColor: 'white', borderRadius: 3}}
                    />
                    {/*发布按钮图标*/}
                    <TouchableOpacity
                        onPress={()=>{
                            NavigationUtils.goPage({},'TaskRelease')
                        }}
                        activeOpacity={0.6}
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: 12,
                            width: 70,
                            height: 25,
                            borderRadius: 20,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <SvgUri style={{marginRight: 3}} width={20} height={20} fill={bottomTheme} svgXmlData={fabu}/>
                        <Text style={{
                            color: bottomTheme,
                        }}>发布</Text>
                    </TouchableOpacity>
                </View>
                {/*<FristListComponent/>*/}
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
                return <FristListComponent device={1}/>;
            case 'second':
                return <FristListComponent device={Platform.OS == 'android' ? 2 : 3}/>;
        }
    };

}

class FristListComponent extends PureComponent {
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
                        // console.log('刷次一次');
                        this.headlineComponent.updatePage();
                    }}
                    // onScroll={this._onScroll}
                    // onLoading={this.onLoading}
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
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this._onPress}
                        style={{height: 40, justifyContent: 'center', marginRight: 8}}>
                        <View
                            // activeOpacity={0.6}
                            onPress={this._onPress}
                            style={{
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                            <Text style={[{
                                fontSize: 12,
                                fontWeight: '400',
                                opacity: 0.6,
                            }, !show ? {color: 'black', opacity: 0.6} : {color: bottomTheme}]}>类型 </Text>
                            {
                                !show ? <SvgUri style={{marginTop: 3}} width={10} height={10}
                                                svgXmlData={zhankai}/> :
                                    <SvgUri style={{marginTop: 3}} width={10} height={10}
                                            svgXmlData={yincang}/>
                            }

                        </View>
                    </TouchableOpacity>
                    {/*<FilterBtnComponent ref={ref => this.filterBtnComponent = ref} onPress={this._topLeftClick}/>*/}
                </View>
                {/*筛选器*/}
                <HeadlineComponent ref={ref => this.headlineComponent = ref}/>

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
            this.index = this.index >= this.state.HeadlineArrays.length - 1 ? 0 : this.index + 1;
            if (this.state.HeadlineArrays.length !== 0) {
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
                <SvgUri style={{marginLeft: 20}} width={60} height={60} svgXmlData={remenrenwu}/>
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
                    onPress={()=>{
                        NavigationUtils.goPage({test:false,task_id:this.state.HeadlineArrays[this.index].taskId},'TaskDetails')
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
                    fontSize: 15,
                    color: bottomTheme,
                    width: width - 190,
                    marginLeft: 10,

                }}>{item.taskTitle}</Text>
            <Text style={{
                color: 'red', fontStyle: 'italic', fontSize: 15,
                marginRight: 20,
            }}>+{item.rewardPrice}元</Text>
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
            paddingHorizontal: 10, flexDirection: 'row',
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
                        <Animated.Text style={[{
                            fontSize: 12,
                            fontWeight: '400',
                            // transform: [{translationY:80}],
                            // transfrom
                        }, Lindex === index ? {
                            color: bottomTheme,
                            fontSize: 16,
                        } : {color: '#595959'}]}>{item.title}</Animated.Text>

                        {Lindex === index && <View style={{
                            height: 3,
                            width: 15,
                            backgroundColor: bottomTheme,
                            position: 'absolute',
                            bottom: -8,
                            // left:8,
                        }}/>}

                    </TouchableOpacity>;
                })}

            </View>

        </View>;
    }
}


export default TaskHallPage;
