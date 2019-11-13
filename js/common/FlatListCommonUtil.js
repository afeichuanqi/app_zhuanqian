import React, {PureComponent} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';
import TaskSumComponent from './TaskSumComponent';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class FlatListCommonUtil extends PureComponent {
    static defaultProps = {
        onRefresh: () => {
        },
        onLoading: () => {
        },
    };
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

    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        const {ListHeaderComponent, onScroll, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd} = this.props;
        return <AnimatedFlatList
            // style={this.props.style}
            ListHeaderComponent={ListHeaderComponent}
            ref={ref => this.flatList = ref}
            data={taskData}
            showsVerticalScrollIndicator={false}
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
            onScroll={onScroll}
            ListFooterComponent={() => this.genIndicator(hideLoaded)}
            onEndReached={() => {
                console.log('onEndReached.....');
                // 等待页面布局完成以后，在让加载更多
                if (this.canLoadMore) {
                    this.onLoading();
                    this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                }
            }}
            windowSize={300}
            onEndReachedThreshold={0.01}
            onScrollEndDrag={onScrollEndDrag}
            onScrollBeginDrag={onScrollBeginDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}

            onMomentumScrollBegin={(e) => {
                this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
            }}
        />;
    }

    // _onMomentumScrollBegin=(3)=>{
    //
    // }
    onLoading = () => {
        this.props.onLoading(true);
        const data = [...this.state.taskData];
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
                this.props.onLoading(false);
            });
        }, 2000);

    };
    onRefresh = () => {
        this.props.onRefresh(true);
        this.setState({
            isLoading: true,
        });
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
            this.props.onRefresh(false);
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
        return <TaskSumComponent/>;
    };

}
