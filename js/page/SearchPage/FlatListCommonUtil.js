import React, {PureComponent} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, Text, View, Dimensions, Platform} from 'react-native';
import Animated from 'react-native-reanimated';
import {getSearchContent} from '../../util/AppService';
import EmptyComponent from '../../common/EmptyComponent';
import TaskInfoComponent from '../../common/TaskInfoComponent';
import TaskInfoComponent_tmp from '../../common/TaskInfoComponent_tmp';
import Global from '../../common/Global';

const {height, width} = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class FlatListCommonUtil extends PureComponent {
    static defaultProps = {
        onRefresh: () => {
        },
        onLoading: () => {
        },
    };

    // componentDidMount(): void {
    //     //     setTimeout(() => {
    //     //         this._updateList(true);
    //     //     }, 500);
    //     // }


    setSearchContent = (searchContent) => {
        this.params.searchContent = searchContent;
    };
    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: false,
    };
    params = {
        pageIndex: 0,
        searchContent: '',
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
        // console.log({
        //     pageIndex: this.params.pageIndex,
        //     searchContent: this.params.searchContent,
        //     platform: Platform.OS,
        //     iosV: Global.apple_pay,
        //     androidV: Global.android_pay,
        // });
        getSearchContent({
            pageIndex: this.params.pageIndex,
            searchContent: this.params.searchContent,
            platform: Platform.OS,
            iosV: Global.apple_pay,
            androidV: Global.android_pay,
        }, this.props.token).then(result => {
            // console.log(result,"result");
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
        const {ListHeaderComponent} = this.props;
        return <AnimatedFlatList
            ListEmptyComponent={<EmptyComponent type={4} message={'暂无符合搜索记录'} height={height - 80}/>}
            ListHeaderComponent={ListHeaderComponent}
            ref={ref => this.flatList = ref}
            data={taskData}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}

            refreshControl={
                <RefreshControl
                    // title={'更新任务中'}
                    // tintColor={bottomTheme}
                    refreshing={isLoading}
                    onRefresh={() => this.onRefresh()}
                />
            }
            // onScroll={onScroll}
            ListFooterComponent={() => this.genIndicator(hideLoaded)}
            onEndReached={() => {
                // 等待页面布局完成以后，在让加载更多
                setTimeout(() => {
                    // this.onLoading();
                    if (this.canLoadMore && taskData.length >= 10) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }, 100);
            }}
            windowSize={300}
            onEndReachedThreshold={0.01}
            // onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollBegin={event => {
                // onScrollBeginDrag(event);
                this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
            }}
            // onMomentumScrollEnd={onMomentumScrollEnd}

            // onScrollBeginDrag={(e) => {
            //
            // }}
        />;
    }

    onLoading = () => {
        // console.log("onLoading");
        this._updateList(false);

    };
    onRefresh = () => {
        // console.log("onRefresh");
        this._updateList(true);
    };


    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10,fontSize:hp(1.7)}}>正在加载更多</Text>
            </View> : this.params.pageIndex === 0 || !this.params.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: hp(1.7)}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    _renderIndexPath = ({item, index}) => {
        if ((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) {
            return <TaskInfoComponent_tmp
                item={item}
                key={index}
            />;
        }
        return <TaskInfoComponent item={item} key={index}/>;
    };

}
