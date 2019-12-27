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
    View, TouchableOpacity, StatusBar,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {selectFavoriteForUserId} from '../util/AppService';
import FastImage from 'react-native-fast-image';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';

const width = Dimensions.get('window').width;
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
        StatusBar.setBarStyle('dark-content', true);
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
                        style={{backgroundColor: '#f5f5f5', paddingTop: 3}}
                        ListEmptyComponent={<EmptyComponent type={3} height={height - 80} message={'您还没有收藏'}/>}
                        ref={ref => this.flatList = ref}
                        data={taskData}
                        scrollEventThrottle={1}
                        renderItem={data => this._renderIndexPath(data)}
                        keyExtractor={(item, index) => index + ''}
                        refreshControl={
                            <RefreshControl
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
        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetails');

            }}
            key={index}
            style={{
                height: 60, width,
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'white',
            }}>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                    <FastImage
                        style={[styles.imgStyle]}
                        source={{uri: item.task_uri}}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                    <View style={{justifyContent: 'space-around', marginLeft: 12}}>
                        <Text style={{fontSize: 14,color:'black'}}>{item.task_title}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 12, opacity: 0.5,color:'black'}}>剩余数:{item.rewardNum - item.signUpNum}</Text>
                            <Text style={{fontSize: 12, opacity: 0.5, marginLeft: 10,color:'black'}}>编号:{item.taskId}</Text>
                        </View>
                    </View>

                </View>

            </View>
            <Text style={{alignSelf: 'center', fontSize: 17, color: 'red'}}>{item.rewardPrice}元</Text>
        </TouchableOpacity>;
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
