/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import { theme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl, StyleSheet, Text,
    View, StatusBar, Platform, TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {selectFavoriteForUserId} from '../util/AppService';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import TaskEasyInfoComponent from '../common/TaskEasyInfoComponent';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Global from '../common/Global';
import {renderEmoji} from '../util/CommonUtils';

const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyFavoritePage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        this.backPress.componentDidMount();
        this._updatePage(true);
    }

    _updatePage = (isRefresh) => {
        const {userinfo} = this.props;
        if (isRefresh) {
            this.page.pageIndex = 0;
            this.setState({
                isLoading: true,
            });
        } else {
            this.page.pageIndex += 1;
        }
        selectFavoriteForUserId({

            pageIndex: this.page.pageIndex,
        }, userinfo.token).then(result => {
            if (isRefresh) {
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

        }).catch(msg => {
            this.setState({
                isLoading: false,
                hideLoaded: false,
            });
        });

    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };

        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '我的收藏', null, 'white', 'black', 16, null, false, false, '清空', 'black');
        const {taskData, isLoading, hideLoaded} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}

                <View style={{flex: 1}}>
                    <AnimatedFlatList
                        style={{backgroundColor: '#f5f5f5', paddingTop: 1}}
                        ListEmptyComponent={<EmptyComponent icoW={wp(23)} icoH={wp(21)} type={3} height={height - 80} message={'您还没有收藏'}/>}
                        ref={ref => this.flatList = ref}
                        data={taskData}
                        scrollEventThrottle={1}
                        renderItem={data => this._renderIndexPath(data)}
                        keyExtractor={(item, index) => index + ''}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={hp(8)}
                                title={'更新中'}
                                refreshing={isLoading}
                                onRefresh={this.onRefresh}
                            />
                        }
                        ListFooterComponent={() => this.genIndicator(hideLoaded)}
                        onEndReached={() => {
                            // 等待页面布局完成以后，在让加载更多
                            setTimeout(() => {
                                if (this.canLoadMore && this.taskData >= 10) {
                                    this.onLoading();
                                    this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                                }
                            }, 100);
                        }}
                        windowSize={300}
                        onEndReachedThreshold={0.01}
                        onMomentumScrollBegin={() => {
                            this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                        }}
                    />
                </View>

            </SafeAreaViewPlus>
        );
    }

    onRefresh = () => {
        this._updatePage(true);
    };
    onLoading = () => {
        this._updatePage(false);
    };
    _renderIndexPath = ({item, index}) => {



        const TextTitle = <Text
            numberOfLines={2}
            style={{
                fontWeight: 'bold',
                color: 'black',
                width: wp(55),
            }}>
            {item && renderEmoji(`${item.task_title}`, [], hp(2), 0, 'black').map((item, index) => {
                return item;
            })}
        </Text>;
        if(Global.apple_pay == 1 && Platform.OS === 'ios'){
            return <View
                style={{
                    backgroundColor: 'white', borderBottomWidth: 0.3,
                    borderBottomColor: '#f0f0f0',
                    // opacity: this.animations.scale,
                }}>
                <TouchableOpacity
                    onPress={()=>{
                        NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetailsTmp');
                    }}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        paddingVertical:20,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{marginLeft: 10}}>
                        {TextTitle}
                    </View>

                    <Text style={{fontSize: hp(2.3), color: 'red'}}>{item.rewardPrice}元/天</Text>
                </TouchableOpacity>
            </View>
        }
        const tmpItem = {
            taskTitle: item.task_title,
            imageUrl: item.task_uri,
            rewardPrice: item.rewardPrice,
            leftTopText: `剩余数:${item.rewardNum - item.signUpNum}`,
            leftBottomText: `编号:${item.taskId}`,
            taskId:item.taskId,
        };
        return <TaskEasyInfoComponent
            item={tmpItem}
            key={index}
            showTime={false}
        />;

    };
    page = {
        pageIndex: 0,
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
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const MyFavoritePageRedux = connect(mapStateToProps, mapDispatchToProps)(MyFavoritePage);


export default MyFavoritePageRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 40,
        height: 40,
        borderRadius: 3,
        // 设置高度
        // height:150
    },
});
