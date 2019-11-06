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
    StyleSheet, Platform, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import {bottomTheme, theme} from '../appSet';
import Animated from 'react-native-reanimated';
import NavigationBar from '../common/NavigationBar';
import TabBar from '../common/TabBar';
import search from '../res/svg/search.svg';
import fabu from '../res/svg/fabu.svg';
import SvgUri from 'react-native-svg-uri';
import {TabView} from 'react-native-tab-view';
import TaskSumComponent from '../common/TaskSumComponent';
import zhankai from '../res/svg/zhankai.svg';
import {ScrollView} from 'react-navigation';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
                    <SvgUri style={{
                        position: 'absolute',
                        left: 10,
                        top: 5,

                    }} width={26} height={26} fill={'white'} svgXmlData={search}/>

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
                        indicatorStyle={{height: 3, backgroundColor: 'white'}}
                    />
                    {/*发布按钮图标*/}
                    <View style={{
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
                    </View>
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

    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        return <View style={{flex: 1}}>
            {/*工具条*/}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
            }}>
                <TopLeftFilterComponent/>
                <FilterBtnComponent/>
            </View>
            {/*筛选器*/}
            <FilterComponent/>
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
                // onScroll={Animated.event([
                //     {
                //         nativeEvent: {
                //             contentOffset: {y: this.props.topBarTop},
                //         },
                //     },
                // ])}
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

class TopLeftFilterComponent extends PureComponent {
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

    _onPress = (index) => {
        this.setState({
            index,
        });
    };

    render() {
        const {index} = this.state;
        const {filterArray} = this.props;

        return <View style={{
            paddingHorizontal: 10, flexDirection: 'row',
            justifyContent: 'space-between', height: 30, alignItems: 'center',
        }}>
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                {filterArray.map((item, Lindex, arr) => {
                    return <TouchableOpacity
                        activeOpacity={0.6}
                        style={{marginLeft: 8, alignItems: 'center'}}
                        onPress={() => this._onPress(Lindex)}
                    >
                        <Text style={[{
                            fontSize: 12,
                            fontWeight: '400',
                            // ,
                            // width:30
                        }, Lindex === index ? {color: 'black'} : {color: '#595959'}]}>{item.title}</Text>

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

class FilterBtnComponent extends PureComponent {
    render() {
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                this.props.onPress();
            }}
            style={{height: 30, justifyContent: 'center', marginRight: 8}}>
            <View style={{paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{
                    fontSize: 12,
                    fontWeight: '400',
                    opacity: 0.6,
                }}>类型 </Text>
                <SvgUri style={{marginTop: 3}} width={10} height={10}
                        svgXmlData={zhankai}/>
            </View>
        </TouchableOpacity>;
    }
}

class FilterComponent extends PureComponent {
    static defaultProps = {
        typeArray: [
            {id: 1, title: '注册'},
            {id: 2, title: '投票'},
            {id: 3, title: '关注'},
            {id: 4, title: '浏览'},
            {id: 5, title: '下载'},
            {id: 6, title: '转发'},
            {id: 7, title: '发帖'},
        ],
    };
    typeMap = new Map();
    _typeClick = (index, data, checked) => {
        this.typeMap.set(data.id, checked);
    };

    render() {
        const {typeArray} = this.props;

        return <View style={{
            position: 'absolute',
            top: 30,
            height,
            width,
            zIndex: 1,
        }}>
            {/*/!*遮罩层*!/*/}
            <TouchableOpacity
                activeOpacity={0.6}
                // onPress={}
                style={{
                    flex: 1, backgroundColor: '#e8e8e8',
                    opacity: 0.6,
                }}/>
            {/*box*/}
            <View style={{
                position: 'absolute',

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
                                color: 'red',
                                opacity: 0.7,
                            }}>简单</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}>

                        {typeArray.map((item, index, arr) => {
                            return <TypeComponent key={item.id} onPress={this._typeClick} data={item} index={index}/>;

                        })}
                    </View>
                    {/*栏目一*/}
                    <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 5}}>
                        <View style={{
                            height: 10, width: 3, backgroundColor: bottomTheme,
                        }}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={{
                                color: 'red',
                                opacity: 0.7,
                            }}>收益高</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}>

                        {typeArray.map((item, index, arr) => {
                            return <TypeComponent key={item.id} onPress={this._typeClick} data={item} index={index}/>;
                        })}
                    </View>

                </ScrollView>
                <View
                    activeOpacity={0.6}
                    style={{
                        height: 80, width, backgroundColor: 'white', zIndex: 2, flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'space-around',
                    }}>
                    <View style={{
                        width: width / 2 - 60, height: 30, borderWidth: 1, borderColor: '#e8e8e8',
                        justifyContent: 'center',
                    }}>
                        <Text style={{alignSelf: 'center', color: 'black', opacity: 0.7}}>
                            重置
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={this._sureClick}
                        activeOpacity={0.6}
                        style={{
                            width: width / 2, height: 30, borderWidth: 1, borderColor: '#e8e8e8',
                            justifyContent: 'center', backgroundColor: bottomTheme,
                        }}>
                        <Text style={{alignSelf: 'center', color: 'white'}}>
                            确定
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>;
    }

    _sureClick = () => {
        console.log(this.typeMap);
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
                alignItems: 'center', marginHorizontal: 10, borderRadius: 3,
            }, !checked ? {backgroundColor: '#f1f1f1'} : {
                backgroundColor: 'rgba(33,150,243,0.1)',
                borderWidth: 0.3, borderColor: bottomTheme,
            }]}>
            <Text style={[{
                fontSize: 13,
                color: 'black',
                opacity: 0.8,
            }, !checked ? {
                color: 'black',
                opacity: 0.8,
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
