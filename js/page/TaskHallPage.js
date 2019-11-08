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
    StyleSheet, ScrollView, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity,
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
import TaskSumComponent from '../common/TaskSumComponent';
import zhankai from '../res/svg/zhankai.svg';
import yincang from '../res/svg/yincang.svg';
import toutiao from '../res/svg/toutiao.svg';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

class TaskHallPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        navigationIndex: 0,
        navigationRoutes: [
            {key: 'first', title: '全部'},
            {key: 'second', title: '高价'},
            {key: 'second1', title: '简单'},
        ],
    };

    componentDidMount() {


    }

    position = new Animated.Value(0);
    topBarTop = new Animated.Value(0);

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        const {navigationIndex, navigationRoutes} = this.state;

        let statusBar = {
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
            // barStyle: 'light-content',
            // hidden: false,
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
                    // flexDirection: 'row',
                    // justifyContent: 'space-around',
                    alignItems: 'center',

                }}>
                    {/*搜索图标*/}
                    <TouchableOpacity style={{
                        position: 'absolute',
                        left: 20,
                        top: 10,

                    }}>
                        <SvgUri width={21} height={21} fill={'white'} svgXmlData={search}/>
                    </TouchableOpacity>


                    <TabBar
                        style={{
                            height: 35,
                            // width: width - 150,
                            // overflow:'hidden',
                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: 10}}
                        routes={navigationRoutes}
                        index={0}
                        sidePadding={0}
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
                        activeOpacity={0.6}
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: 8,
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

                <TabView
                    ref={ref => this.tabView = ref}
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
        // console.log(index);
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <FristListComponent/>;
            case 'second':
                return <View style={[styles.scene, {backgroundColor: '#673ab7', flex: 1}]}/>;
        }
    };

}

class FristListComponent extends PureComponent {
    state = {
        taskData: [
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5},
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5},
        ],
        isLoading: false,
        hideLoaded: false,
    };
    _renderIndexPath = ({item, index}) => {
        return <TaskSumComponent
            titleFontSize={15}
            marginHorizontal={15}
        />;
    };

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.params.pageIndex === 0 || !this.params.pageIndex ? null : <View
                style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10}}>没有更多了哦</Text>
            </View>;
    }

    onLoading = () => {
        console.log('onLoading触发中');
        this.setState({
            hideLoaded: false,
        });
        const data = [...this.state.taskData];
        // data.push([...data]);
        let tmpData = [];
        for (let i = 0; i < 10; i++) {
            console.log(i);
            tmpData.push({
                id: i,
            });
        }
        setTimeout(() => {
            this.setState({
                taskData: data.concat(tmpData),
            }, () => {
                // this
                // this.setState({
                //     hideLoaded: true,
                // });
            });
        }, 2000);

    };
    onRefresh = () => {
        this.setState({
            isLoading: true,
        });
        // this.props.onRefresh(true);
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
            // this.props.onRefresh(false);
        }, 1000);
    };
    params = {
        pageIndex: 0,
    };
    _topLeftClick = (isShow) => {
        if (isShow) {
            this.filterComponent.show();
        } else {
            this.filterComponent.hide();
        }
    };
    nowY = 0;

    _onScroll = (e) => {
        if (e.nativeEvent.contentOffset.y > 0) {
            if (e.nativeEvent.contentOffset.y - this.nowY > 10 || e.nativeEvent.contentOffset.y - this.nowY < -10) {
                if (e.nativeEvent.contentOffset.y > this.nowY) {
                    this.topLeftFilterComponent.showAnimated();
                } else if (e.nativeEvent.contentOffset.y < this.nowY) {
                    this.topLeftFilterComponent.hideAnimated();
                }
            }

        }
        this.nowY = e.nativeEvent.contentOffset.y;

    };

    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        return <View style={{flex: 1, zIndex: 3}}>
            {/*工具条*/}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 0.5,
                borderBottomColor: '#e8e8e8',
                zIndex: 3,
                height: 30,
                width,
                backgroundColor: theme,
            }}>
                <TopLeftFilterComponent ref={ref => this.topLeftFilterComponent = ref}/>
                <FilterBtnComponent onPress={this._topLeftClick}/>
            </View>
            <HeadlineComponent/>
            {/*筛选器*/}
            <FilterComponent ref={ref => this.filterComponent = ref}/>

            <AnimatedFlatList
                // ListHeaderComponent={
                //
                //
                // }
                ref={ref => this.flatList = ref}
                data={taskData}
                scrollEventThrottle={1}
                renderItem={data => this._renderIndexPath(data)}
                keyExtractor={(item, index) => index + ''}
                refreshControl={
                    <RefreshControl
                        title={'更新任务中'}
                        refreshing={isLoading}
                        onRefresh={() => this.onRefresh()}
                    />
                }
                onScroll={this._onScroll}
                ListFooterComponent={() => this.genIndicator(hideLoaded)}
                onEndReached={() => {
                    console.log('onEndReached.....');
                    // 等待页面布局完成以后，在让加载更多
                    if (this.canLoadMore) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }}
                // onScrollEndDrag={this._onScrollEndDrag}
                windowSize={300}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => {
                    console.log('我被触发');
                    this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                }}
            />


        </View>;
    }
}

class HeadlineComponent extends PureComponent {
    static defaultProps = {
        HeadlineArrays: [
            {id: 1, title: '1111', price: 10},
            {id: 2, title: '2222', price: 10},
            {id: 3, title: '3333', price: 10},
            {id: 4, title: '4444', price: 10},
            {id: 5, title: '5555', price: 10},
            {id: 6, title: '6666', price: 10},
        ],
    };
    index = 0;

    componentWillUnmount() {


    }
    componentDidMount() {

        // setInterval(() => {
        //     this.index = this.index + 1;
        //     console.log(this.index, this.props.HeadlineArrays.length);
        //     if (this.index >= this.props.HeadlineArrays.length) {
        //         this.index = 0;
        //     }
        //     this.flatList.scrollToIndex({viewPosition: 0, index: this.index});
        // }, 5000);
    }

    render() {
        const {HeadlineArrays} = this.props;

        return <View style={{
            height: 40, width, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center',
            borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)',
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SvgUri style={{marginLeft: 20, marginRight: 5}} width={20} height={20} svgXmlData={toutiao}/>
                <Text
                    fontFamily={'sans-serif-condensed'}
                    style={{
                        fontSize: 13,
                    }}>热门任务</Text>
            </View>
            {/*分隔符*/}
            <View
                style={{height: 25, width: 0.7, backgroundColor: 'rgba(0,0,0,0.2)', marginLeft: 20, borderRadius: 3}}/>
            {/*热门任务*/}
            <View style={{
                flex: 1,
                marginLeft: 10,
                overflow:'hidden',

            }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ref={ref => this.flatList = ref}
                    data={HeadlineArrays}
                    scrollEventThrottle={1}
                    renderItem={data => this._renderIndexPath(data)}
                    keyExtractor={(item, index) => index + ''}
                    onEndReachedThreshold={0.01}
                />
                {/*禁止触摸*/}
                <View style={{position: 'absolute', width:300, height: 40, opacity:1}}/>
            </View>
        </View>;
    }

    _renderIndexPath = ({item, index}) => {
        return <View style={{
            height: 40,
            flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-around',
        }}>
            <Text style={{
                fontSize: 13,
                color: bottomTheme,
                // color: bottomTheme,
            }}>{item.title}</Text>
            <Text style={{color: 'red', fontStyle: 'italic', fontSize: 16}}>+{item.price}</Text>
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
        ],
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.index !== nextState.index) {
            return true;
        }
        return false;
    }

    animations = {
        translateX: new Animated.Value(0),
    };
    isShow = false;

    showAnimated = () => {
        // Animated.parallel([]);
        if (!this.isShow) {
            timing(this.animations.translateX, {
                duration: 300,
                toValue: 1,
                easing: Easing.inOut(Easing.ease),
            }).start();
            this.isShow = true;
        }

    };
    hideAnimated = () => {
        // Animated.parallel([]);
        if (this.isShow) {
            timing(this.animations.translateX, {
                duration: 300,
                toValue: 0,
                easing: Easing.inOut(Easing.ease),
            }).start();
            this.isShow = false;
        }

    };
    _onPress = (index) => {
        this.setState({
            index,
        });
    };

    render() {
        const {index} = this.state;
        const {filterArray} = this.props;
        const translateX = Animated.interpolate(this.animations.translateX, {
            inputRange: [0, 1],
            outputRange: [0, width / 2 - 80],
            extrapolate: 'clamp',
        });
        const fontSize = Animated.interpolate(this.animations.translateX, {
            inputRange: [0, 1],
            outputRange: [12, 16],
            extrapolate: 'clamp',
        });
        return <Animated.View style={{
            paddingHorizontal: 10, flexDirection: 'row',
            justifyContent: 'space-between', height: 30, alignItems: 'center', width: 200,
            transform: [{translateX: translateX}],
        }}>
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                {filterArray.map((item, Lindex, arr) => {
                    return <TouchableOpacity
                        key={Lindex}
                        activeOpacity={0.6}
                        style={{marginLeft: 8, alignItems: 'center', justifyContent:'center'}}
                        onPress={() => this._onPress(Lindex)}
                    >
                        <Animated.Text style={[{
                            fontSize: 12,
                            fontWeight: '400',
                            // transform: [{translationY:80}],
                            // transfrom
                        }, Lindex === index ? {color: 'black',fontSize: fontSize} : {color: '#595959'}]}>{item.title}</Animated.Text>

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

        </Animated.View>;
    }
}

class FilterBtnComponent extends PureComponent {
    state = {
        show: false,
    };
    _onPress = () => {
        this.setState({
            show: !this.state.show,
        }, () => {
            this.props.onPress(this.state.show);
        });

    };

    render() {
        const {show} = this.state;

        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                this.props.onPress();
            }}
            style={{height: 30, justifyContent: 'center', marginRight: 8}}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this._onPress}
                style={{paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', justifyContent: 'center'}}>
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

            </TouchableOpacity>
        </TouchableOpacity>;
    }
}

class FilterComponent extends PureComponent {
    static defaultProps = {
        typeArray: [
            {id: 1, title: '注册', type: 1},
            {id: 2, title: '投票', type: 1},
            {id: 3, title: '关注', type: 1},
            {id: 4, title: '浏览', type: 1},
            {id: 5, title: '下载', type: 1},
            {id: 6, title: '转发', type: 2},
            {id: 7, title: '发帖', type: 2},
        ],
    };
    typeMap = new Map();
    _typeClick = (index, data, checked) => {
        this.typeMap.set(data.id, checked);
    };
    // hide
    animations = {
        translateY: new Animated.Value(0),
    };
    show = () => {
        //折罩层显示
        this.containerBox.setNativeProps({
            style: {
                height,
            },
        });
        //隐藏box
        this._anim = timing(this.animations.translateY, {
            duration: 300,
            toValue: 1,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };
    hide = () => {
        //隐藏box
        this._anim = timing(this.animations.translateY, {
            duration: 300,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            //折罩层隐藏
            this.containerBox.setNativeProps({
                style: {
                    height: 0,
                },
            });
        });
    };

    render() {
        const translateY = Animated.interpolate(this.animations.translateY, {
            inputRange: [0, 1],
            outputRange: [-260, 0],
            extrapolate: 'clamp',
        });
        const opacity = Animated.interpolate(this.animations.translateY, {
            inputRange: [0, 1],
            outputRange: [0, 0.6],
            extrapolate: 'clamp',
        });
        const {typeArray} = this.props;
        return <View ref={ref => this.containerBox = ref} style={{
            position: 'absolute',
            top: 30,
            height: 0,
            width,
            zIndex: 1,
        }}>
            {/*/!*遮罩层*!/*/}

            <AnimatedTouchableOpacity
                activeOpacity={0.6}
                onPress={this.hide}
                style={{
                    flex: 1, backgroundColor: '#b4b4b4',
                    opacity: opacity,
                }}/>
            {/*box*/}
            <Animated.View style={{
                position: 'absolute', transform: [{translateY}],
            }}>
                <ScrollView style={{
                    height: 180,
                    width,
                    // top: ,
                    zIndex: 2,
                    backgroundColor: 'white',
                }}>
                    {/*栏目二*/}
                    <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 5}}>
                        <View style={{
                            height: 10, width: 3, backgroundColor: bottomTheme,
                        }}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={{
                                // color: 'red',
                                opacity: 0.7,
                            }}>简单</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}>

                        {typeArray.map((item, index, arr) => {
                            if (item.type == 1) {
                                return <TypeComponent ref={`typeBtn${item.id}`} key={item.id} onPress={this._typeClick}
                                                      data={item} index={index}/>;
                            }


                        })}
                    </View>
                    {/*栏目一*/}
                    <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 5}}>
                        <View style={{
                            height: 10, width: 3, backgroundColor: bottomTheme,
                        }}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={{
                                // color: 'red',
                                opacity: 0.7,
                            }}>收益高</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}>

                        {typeArray.map((item, index, arr) => {
                            if (item.type == 2) {
                                return <TypeComponent ref={`typeBtn${item.id}`} key={item.id} onPress={this._typeClick}
                                                      data={item} index={index}/>;
                            }

                        })}
                    </View>

                </ScrollView>
                <View

                    style={{
                        height: 80, width, backgroundColor: 'white', zIndex: 2, flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'space-around', borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                    }}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this._ResetClick}
                        style={{
                            width: width / 2 - 60, height: 30, borderWidth: 1, borderColor: '#e8e8e8',
                            justifyContent: 'center', borderRadius: 5,
                        }}>
                        <Text style={{alignSelf: 'center', color: 'black', opacity: 0.7}}>
                            重置
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._sureClick}
                        activeOpacity={0.6}
                        style={{
                            width: width / 2, height: 30, borderWidth: 1, borderColor: '#e8e8e8',
                            justifyContent: 'center', backgroundColor: bottomTheme, borderRadius: 5,
                        }}>
                        <Text style={{alignSelf: 'center', color: 'white'}}>
                            确定
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>


        </View>;
    }

    _ResetClick = () => {
        this.typeMap.forEach((value, key, map) => {
            this.refs[`typeBtn${key}`].ResetStatus();
        });
    };
    _sureClick = () => {
        this.hide();
    };
}

class TypeComponent extends PureComponent {
    static defaultProps = {
        index: 0,

        data: {id: 1, title: 'test'},
    };
    state = {
        checked: this.props.checked,
    };

    componentDidMount(): void {
        // EventBus.getInstance().addListener(EventTypes.search_btn_click, this.listener = data => {
        //     console.log(this.props.navigation.isFocused(), 'this.props.navigation.isFocused()');
        //     if (this.props.navigation.isFocused()) {
        //
        //         this._getHotContent();
        //     }
        // });
    }

    ResetStatus = () => {
        console.log('我被触发');
        if (this.state.checked) {
            this.setState({
                checked: false,
            });
        }
    };

    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.checked != nextProps.checked || this.state.checked != nextState.checked) {
            return true;
        }
        return false;
    }

    _onPress = () => {
        const {index, data} = this.props;
        const {checked} = this.state;
        this.setState({
            checked: !checked,
        }, () => {
            this.props.onPress(index, data, this.state.checked);
        });

    };

    render() {
        const {data} = this.props;
        const {checked} = this.state;

        return <TouchableOpacity
            onPress={this._onPress}
            style={[{
                width: width / 4 - 20, height: 25, marginTop: 10, backgroundColor: '#f1f1f1', justifyContent: 'center',
                alignItems: 'center', marginHorizontal: 10, borderRadius: 3,borderWidth:0.3, borderColor:'rgba(0,0,0,0.2)'
            }, !checked ? {backgroundColor: '#f6f6f6'} : {
                backgroundColor: 'rgba(33,150,243,0.1)',
                borderWidth: 0.3, borderColor: bottomTheme,
            }]}>
            <Text style={[{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                opacity: 0.8,
            }, !checked ? {
                color: 'black',
                opacity: 0.5,
            } : {color: bottomTheme}]}>{data.title}</Text>
        </TouchableOpacity>;
    }
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
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
export default TaskHallPage;
