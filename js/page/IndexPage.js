/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, Dimensions, StyleSheet, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import SearchComponent from '../common/SearchComponent';
import Carousel from '../common/Carousel';
import FastImage from 'react-native-fast-image';
import TaskSumComponent from '../common/TaskSumComponent';
import TabBar from '../common/TabBar';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        lunboData: [
            {imgUrl: 'http://img2.imgtn.bdimg.com/it/u=3292807210,3869414696&fm=26&gp=0.jpg'},
            {imgUrl: 'http://static.open-open.com/lib/uploadImg/20160101/20160101125439_819.jpg'},
        ],
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
        hideLoaded: true,

    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);

    }

    render() {
        const {lunboData, taskData, isLoading, hideLoaded} = this.state;
        let statusBar = {
            hidden: false,
        };

        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        const containerWidth = width - 18;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {/*顶部搜索栏样式*/}
                <View style={{
                    marginHorizontal: 10,
                    marginVertical: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        marginRight: 10,
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>简单赚</Text>
                    <SearchComponent
                        onFocus={this.SearchOnFocus}
                    />
                </View>
                {/*下部刷新列表tab*/}
                <FlatList
                    ListHeaderComponent={<View style={{
                        height: height / 4,
                        paddingTop: 10,
                        alignItems: 'center',
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
                        {/*topbar*/}
                        <TabBar
                            style={{height:50,width:width, marginLeft:10}}
                            // position={props.position}
                            contentContainerStyle={{ paddingTop: 24.5 }}
                            routes={[
                                { key: 'warehouse', title: '仓库'},
                                { key: 'uncomplete', title: '待付款' },
                                { key: 'sendOut', title: '已出库', },
                            ]}
                            index={1}
                            sidePadding={0}
                            handleIndexChange={this.handleIndexChange}
                            // indicatorStyle={styles.indicator}
                            titleMarginHorizontal={25}
                            activeStyle={{fontSize:25,color:[88,99]}}
                            inactiveStyle={{fontSize:16,color:[15,16],width:10,height:10}}
                        />
                    </View>}
                    // style={{marginBottom: data.length < 3 ? 140 : this.state.marginBottom}}
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
                    //         {
                    //             nativeEvent: {
                    //                 contentOffset: {y: this.state.headerTop},
                    //             },
                    //         },
                    //     ],
                    //     {
                    //         listener: event => {
                    //             this.TopColumn.setTopView(event.nativeEvent.contentOffset.y - this.contentOffsety, true);
                    //             this.contentOffsety = event.nativeEvent.contentOffset.y;
                    //
                    //         },
                    //     })}
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


            </SafeAreaViewPlus>
        );
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
        setTimeout(()=>{
            this.setState({
                taskData: data.concat(tmpData),
            }, () => {
                // this
                // this.setState({
                //     hideLoaded: true,
                // });
            });
        },2000)

    };
    onRefresh = () => {
        this.setState({
            isLoading: true,
        });
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
        }, 1000);
    };
    params = {
        pageIndex: 0,
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

    _renderIndexPath = ({item, index}) => {
        // console.log(item.imgUrl, 'item');
        return <TaskSumComponent/>;
    };
    _renderItem = ({item, index}) => {
        return <FastImage
            style={[styles.imgStyle, {height: '100%', width: '100%'}]}
            source={{uri: `${item.imgUrl}`}}
            resizeMode={FastImage.stretch}
            key={index}
        />;
    };
    SearchOnFocus = () => {
        console.log('我被触发');
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
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
export default HomePage;
