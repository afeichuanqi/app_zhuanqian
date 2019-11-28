import React, {PureComponent} from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {selectAllRecommendTask} from '../../util/AppService';
import TaskSumComponent from '../../common/TaskSumComponent';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class FlatListCommonUtil extends PureComponent {
    componentDidMount(): void {
        this._updateList(true);
    }

    static defaultProps = {
        type: 1,
        onRefresh: () => {
        },
        onLoading: () => {
        },
    };
    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: false,
    };
    page: {
        pageIndex: 0,
    };
    _updateList = (refresh) => {
        if (refresh) {
            this.props.onRefresh(true);
            this.page = {pageIndex: 0};
            this.setState({
                isLoading: true,
            });
        } else {
            this.props.onLoading(true);
            this.page = {pageIndex: this.page.pageIndex + 1};
        }
        selectAllRecommendTask({pageIndex: this.page.pageIndex, type: this.props.type}).then(result => {
            console.log(result);
            if (refresh) {
                this.setState({
                    taskData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 30 ? false : true,
                });
                this.props.onRefresh(false);
            } else {
                const tmpArr = [...this.state.taskData];
                this.setState({
                    taskData: tmpArr.concat(result),
                    hideLoaded: result.length >= 30 ? false : true,
                });
                this.props.onLoading(false);
            }
        });
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
        this._updateList(false);


    };
    onRefresh = () => {
        this._updateList(true);

    };


    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.page.pageIndex === 0 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10}}>没有更多了哦</Text>
            </View>;
    }

    _renderIndexPath = ({item, index}) => {
        return <TaskSumComponent item={item} key={index}/>;
    };

}