/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
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
import {selectBillForUserId} from '../util/AppService';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class TaskReleaseMana extends PureComponent {
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
        // const {status, taskid} = this.params;
        const {userinfo} = this.props;
        if (isRefresh) {
            this.page.pageIndex = 0;
            this.setState({
                isLoading: true,
            });
        } else {
            this.page.pageIndex += 1;

        }
        selectBillForUserId({

            pageIndex: this.page.pageIndex,
        }, userinfo.token).then(result => {
            console.log(result);
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
            console.log(msg);
        });

    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

    render() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '帐单', null, 'white', 'black', 16, null, false);
        const {taskData, isLoading, hideLoaded} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}

                <AnimatedFlatList
                    style={{backgroundColor: '#f5f5f5', paddingTop: 5}}
                    ListEmptyComponent={<EmptyComponent height={height - 80} message={'您还没有相关帐单'}/>}
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
                    // onScroll={this._onScroll}
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
                        this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                    }}
                />

            </SafeAreaViewPlus>
        );
    }

    onLoading = () => {
        this._updatePage(false);
    };
    onRefresh = () => {
        this._updatePage(true);
    };
    _renderIndexPath = ({item, index}) => {
        return <TouchableOpacity
            onPress={()=>{
                if(item.bill_task_id){
                    NavigationUtils.goPage({test:false,task_id:item.bill_task_id},'TaskDetails')
                }

            }}
            key={item.id}
            style={{
                height: 90, width,
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'white',
                borderBottomWidth: 0.3,
                borderBottomColor: 'rgba(0,0,0,0.1)',
            }}>
            <View>
                <Text style={{fontSize: 15}}>{item.bill_title}</Text>
                <Text style={{marginTop: 8, opacity: 0.8, fontSize: 13}}>余额:{item.bill_balance}</Text>
                <Text style={{marginTop: 8, opacity: 0.7, fontSize: 12}}>{item.bill_date1}</Text>
            </View>
            <View style={{alignSelf: 'flex-start', marginTop: 20}}>
                <Text style={{
                    fontSize: 16,
                    color: 'red',
                    textAlign: 'right',
                }}>{item.bill_money_type}{parseFloat(item.bill_money).toFixed(2)}</Text>
                <Text style={{
                    opacity: 0.5,
                    marginTop: 10,
                    textAlign: 'right',
                }}>{item.bill_status == 1 ? '支付成功' : '处理中'}</Text>
            </View>

        </TouchableOpacity>;
    };
    page = {
        pageIndex: 0,
    };

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多 ~ ~</Text>
            </View> : this.page.pageIndex === 0 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10}}>没有更多了哦 ~ ~</Text>
            </View>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const TaskReleaseManaRedux = connect(mapStateToProps, mapDispatchToProps)(TaskReleaseMana);


export default TaskReleaseManaRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 40,
        height: 40,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
