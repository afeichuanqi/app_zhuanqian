import React, {PureComponent} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, Text, View, Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import TaskSumComponent from '../../common/TaskSumComponent';
import {getAllTask} from '../../util/AppService';
import EmptyComponent from '../../common/EmptyComponent';
const {height, width} = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class FlatListCommonUtil extends PureComponent {
    static defaultProps = {
        onRefresh: () => {
        },
        onLoading: () => {
        },

    };

    componentDidMount(): void {
        setTimeout(() => {
            this._updateList(true);
        }, 500);

    }

    scrollToTop_ = () => {
        this.flatList.getNode().scrollToOffset({animated: true, viewPosition: 0, index: 0});
    };
    setColumnType = (type) => {
        this.params.column_type = type;
    };
    setTypes = (types) => {
        this.params.types = types;
    };
    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: false,
    };
    params = {
        pageIndex: 0,
        column_type: 1,
        types: '',
        device: this.props.device,
    };
    _updateList = (refresh) => {
        if (refresh) {
            this.props.onRefresh(true);

            this.params.pageIndex = 0;

            this.setState({
                isLoading: true,
            });
        } else {
            this.props.onLoading(true);
            this.params.pageIndex += 1;
        }
        getAllTask({
            pageIndex: this.params.pageIndex,
            column_type: this.params.column_type,
            types: this.params.types,
            device: this.params.device,
        }).then(result => {
            if (refresh) {
                this.setState({
                    taskData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 10 ? false : true,
                });
            } else {
                const tmpArr = [...this.state.taskData];
                this.setState({
                    taskData: tmpArr.concat(result),
                    hideLoaded: result.length >= 10 ? false : true,
                });
            }
        }).catch(() => {
            this.setState({
                isLoading: false,
                hideLoaded: false,
            });
        });

    };


    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        const {ListHeaderComponent, onScroll, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd} = this.props;
        return <AnimatedFlatList
                ListEmptyComponent={<EmptyComponent type={4} message={'暂时没有符合任务'} height={height - 200}/>}
                ListHeaderComponent={ListHeaderComponent}
                ref={ref => this.flatList = ref}
                data={taskData}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                renderItem={data => this._renderIndexPath(data)}
                keyExtractor={(item, index) => index + ''}
                style={{
                    backgroundColor: '#f6f6f6',
                    height: '100%',
                }}
                refreshControl={
                    <RefreshControl
                        // title={'更新任务中'}
                        refreshing={isLoading}
                        onRefresh={() => this.onRefresh()}
                    />
                }
                onScroll={onScroll}
                ListFooterComponent={() => this.genIndicator(hideLoaded)}
                onEndReached={() => {
                    setTimeout(() => {
                        // 等待页面布局完成以后，在让加载更多
                        if (this.canLoadMore && taskData.length >= 10) {
                            this.onLoading();
                            this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                        }
                    }, 100);
                }}
                windowSize={300}
                onEndReachedThreshold={0.3}
                onScrollEndDrag={onScrollEndDrag}
                onScrollBeginDrag={onScrollBeginDrag}
                onMomentumScrollBegin={() => {
                    this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                }}
                onMomentumScrollEnd={onMomentumScrollEnd}
            />
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
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.params.pageIndex === 0 || !this.params.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: 13}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    _renderIndexPath = ({item, index}) => {
        return <TaskSumComponent imageViewModal={this.imageViewModal} item={item} key={index}/>;
    };

}
