import React, {PureComponent} from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
    Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {selectAllRecommendTask} from '../../util/AppService';
import TaskSumComponent from '../../common/TaskSumComponent';
import EmptyComponent from '../../common/EmptyComponent';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class FlatListCommonUtil extends PureComponent {

    constructor(props) {
        super(props);
        this.page = {
            pageIndex: 0,
            pageSize: props.pageSize || 10,
        };

    }

    getItemLength = () => {
        return this.state.taskData.length;
    };

    componentDidMount(): void {
        if (this.props.type === 1) {
            selectAllRecommendTask({
                pageSize: this.page.pageSize,
                pageIndex: this.page.pageIndex,
                type: this.props.type,
            }).then(result => {
                this.setState({
                    taskData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 30 ? false : true,
                });
            }).catch(() => {
                this.setState({
                    isLoading: false,
                    hideLoaded: true,
                });
            });
        } else {
            this._updateList(true);
        }

    }

    static defaultProps = {
        type: 1,
        onRefresh: () => {
        },
        onLoading: () => {
        },
    };
    scrollToTop_ = () => {
        this.flatList && this.flatList.getNode().scrollToOffset({animated: true, viewPosition: 0, index: 0});
    };
    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: false,
    };

    _updateList = (refresh) => {
        if (refresh) {

            this.page.pageIndex = 0;
            this.setState({
                isLoading: true,
            });

        } else {
            this.page.pageIndex = this.page.pageIndex + 1;
        }
        //console.log({pageSize: this.page.pageSize,

        selectAllRecommendTask({
            pageSize: this.page.pageSize,
            pageIndex: this.page.pageIndex,
            type: this.props.type,
        }).then(result => {
            if (refresh) {
                this.setState({
                    taskData: result,
                    isLoading: false,
                    hideLoaded: result.length >= this.page.pageSize ? false : true,
                });
            } else {
                const tmpArr = [...this.state.taskData];

                this.setState({
                    taskData: tmpArr.concat(result),
                    hideLoaded: result.length >= this.page.pageSize ? false : true,
                });
            }
        }).catch(() => {
            this.setState({
                isLoading: false,
                hideLoaded: true,
            });
        });
    };


    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        const {ListHeaderComponent, onScroll, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd} = this.props;
        return <AnimatedFlatList

            ListEmptyComponent={<EmptyComponent icoW={wp(23)} icoH={wp(21)} type={1} message={'暂时没有符合任务'}
                                                height={this.props.EmptyHeight}/>}
            ListHeaderComponent={ListHeaderComponent}
            ref={ref => this.flatList = ref}
            data={taskData}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            style={{
                backgroundColor: '#f5f5f5',
                height: '100%',
            }}
            refreshControl={
                <RefreshControl
                    progressViewOffset={hp(8)}
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
        />;
    }

    // _onMomentumScrollBegin=(3)=>{
    //
    // }
    onLoading = () => {
        this._updateList(false);


    };
    onRefresh = () => {
        this.props.onRefresh();
        this._updateList(true);

    };


    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.page.pageIndex === 0 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: 13}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    _renderIndexPath = ({item, index}) => {
        return <TaskSumComponent statusBarType={this.props.statusBarType} imageViewModal={this.imageViewModal}
                                 item={item} key={index}/>;
    };

}
