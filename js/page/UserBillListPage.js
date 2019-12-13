/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
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
import TabBar from '../common/TabBar';
import {TabView} from 'react-native-tab-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class UserBillListPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            navigationIndex: 0,
            navigationRoutes: [
                {key: 'first', title: '全部'},
                {key: 'second', title: '支出'},
                {key: 'second1', title: '收入'},
            ],

        };

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        this.backPress.componentDidMount();
    }

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
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '帐单', null, theme, 'black', 16, null, false);
        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <TabBar
                    style={{
                        height: 35,
                        backgroundColor: theme,
                        paddingLeft: 10,

                    }}
                    position={this.position}
                    contentContainerStyle={{paddingTop: 10}}
                    routes={navigationRoutes}
                    index={0}
                    sidePadding={0}
                    handleIndexChange={this.handleIndexChange}
                    // indicatorStyle={styles.indicator}
                    bounces={true}
                    titleMarginHorizontal={25}
                    activeStyle={{fontSize: 14, color: [33, 150, 243]}}
                    inactiveStyle={{fontSize: 13, color: [0, 0, 0], height: 10}}
                    indicatorStyle={{height: 3, backgroundColor: bottomTheme, borderRadius: 3}}
                />
                <TabView
                    ref={ref => this.tabView = ref}
                    indicatorStyle={{backgroundColor: 'white'}}
                    navigationState={{index: navigationIndex, routes: navigationRoutes}}
                    renderScene={this.renderScene}
                    position={this.position}
                    renderTabBar={() => null}
                    onIndexChange={index => {

                        this.setState({
                            navigationIndex: index,
                        });
                    }}

                    initialLayout={{width}}
                    lazy={true}
                />


            </SafeAreaViewPlus>
        );
    }
    handleIndexChange = (index) => {
        // console.log(index);
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <UserBillList type={0} userinfo={this.props.userinfo}/>;
            case 'second':
                return <UserBillList type={1} userinfo={this.props.userinfo}/>;
            case 'second1':
                return <UserBillList type={2} userinfo={this.props.userinfo}/>;
        }
    };
}

class UserBillList extends PureComponent {
    constructor(props) {
        super(props);


    }

    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };

    componentDidMount() {

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
            type: this.props.type,
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
            this.setState({
                isLoading: false,
                hideLoaded: false,
            });
        });

    };

    componentWillUnmount() {
    }


    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        return (
            <AnimatedFlatList
                style={{backgroundColor: '#f5f5f5', paddingTop: 1}}
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
                onScrollBeginDrag={() => {
                    this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                }}
            />
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
            onPress={() => {
                if (item.bill_task_id) {
                    NavigationUtils.goPage({test: false, task_id: item.bill_task_id}, 'TaskDetails');
                }

            }}
            key={item.id}
            style={{
                height: 90, width,
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'white',
                borderBottomWidth: 0.3,
                borderBottomColor: 'rgba(0,0,0,0.1)',
            }}>
            <View>
                <Text style={{fontSize: 14}}>{item.bill_title}</Text>
                <Text style={{marginTop: 8, opacity: 0.7, fontSize: 13}}>余额:{item.bill_balance}</Text>
                <Text style={{marginTop: 8, opacity: 0.5, fontSize: 12}}>{item.bill_date1}</Text>
            </View>
            <View style={{alignSelf: 'flex-start', marginTop: 20}}>
                <Text style={{
                    fontSize: 18,
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
const UserBillListPageRedux = connect(mapStateToProps, mapDispatchToProps)(UserBillListPage);


export default UserBillListPageRedux;

