import React, {PureComponent} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, Text, View, StyleSheet, Dimensions, Platform} from 'react-native';
import Animated from 'react-native-reanimated';
import TaskSumComponent from '../../common/TaskSumComponent';
import {getAllTask, getAllTaskForNewEr} from '../../util/AppService';
import EmptyComponent from '../../common/EmptyComponent';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Global from '../../common/Global';
import TaskSumComponent_tmp from '../../common/TaskSumComponent_tmp';
import EventBus from '../../common/EventBus';
import EventTypes from '../../util/EventTypes';

const {width} = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class FlatListCommonUtil extends PureComponent {
    static defaultProps = {
        onRefresh: () => {
        },
        onLoading: () => {
        },
        isNewEr: false,

    };

    componentDidMount(): void {
        setTimeout(() => {
            this._updateList(true);
        }, 500);
        EventBus.getInstance().addListener(EventTypes.change_for_apple, this.listener = data => {
            this._updateList(true);
        });

    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
    }

    getItemLength = () => {
        return this.state.taskData.length;
    };
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
        const getTask = this.props.isNewEr ? getAllTaskForNewEr : getAllTask;

        getTask({
            pageIndex: this.params.pageIndex,
            column_type: this.params.column_type,
            types: this.params.types,
            device: this.params.device,
            platform: Platform.OS,
            androidV: Global.android_pay,
            iosV: Global.apple_pay,
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
                hideLoaded: true,
            });
        });

    };


    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        const {ListHeaderComponent, onScroll, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd} = this.props;
        return <AnimatedFlatList
            ListEmptyComponent={<EmptyComponent icoW={wp(23)} icoH={wp(21)} type={1} message={'暂时没有符合任务'}
                                                height={this.props.EmptyH}/>}
            ListHeaderComponent={<View
                style={{height: taskData.length === 0 ? 0 : 5, width, backgroundColor: '#fafafa'}}/>}
            ref={ref => this.flatList = ref}
            data={taskData}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            style={{
                backgroundColor: '#fafafa',
                height: '100%',
            }}
            refreshControl={
                <RefreshControl
                    progressViewOffset={hp(7)}
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
                    // this.onLoading();
                    if (this.canLoadMore && taskData.length >= 10) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }, 100);
            }}
            windowSize={300}
            onEndReachedThreshold={0.1}
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
        this._updateList(true);
    };


    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10, fontSize: hp(1.7)}}>正在加载更多</Text>
            </View> : this.params.pageIndex === 0 || !this.params.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: hp(1.7)}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    _renderIndexPath = ({item, index}) => {
        if ((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) {
            return <TaskSumComponent_tmp statusBarType={this.props.statusBarType} imageViewModal={this.imageViewModal}
                                         item={item} key={index}/>;
        }
        return <TaskSumComponent

            isShowPicLabel={this.props.isShowPicLabel}
            statusBarType={this.props.statusBarType}
            imageViewModal={this.imageViewModal}
            item={item} key={index}/>;
    };

}
