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
import NavigationBar from '../common/NavigationBar';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl, Text,
    View, TouchableOpacity, StatusBar,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {selectBillForUserId, updateNoticeIsReadForType} from '../util/AppService';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import TabBar from '../common/TabBar';
import {TabView} from 'react-native-tab-view';
import SvgUri from 'react-native-svg-uri';
import goback from '../res/svg/goback.svg';
import {equalsObj, formatData} from '../util/CommonUtils';
import actions from '../action';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class UserBillListPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            navigationIndex: this.params.navigationIndex || 0,
            navigationRoutes: [
                {key: 'first', title: '全部', isMsg: props.notice_arr[8]},
                {key: 'second', title: '支出', isMsg: props.notice_arr[9]},
                {key: 'second1', title: '收入', isMsg: props.notice_arr[10]},
            ],

        };
        const type = (this.params.navigationIndex || 0) + 8;
        const {onSetNoticeMsgIsRead, userinfo} = this.props;
        onSetNoticeMsgIsRead(type) && updateNoticeIsReadForType({type: type}, userinfo.token);

    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.navigationIndex !== nextState.navigationIndex
            || !equalsObj(this.props.notice_arr, nextProps.notice_arr)
        ) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (!equalsObj(this.props.notice_arr, nextProps.notice_arr)) {
            this.setState({
                navigationRoutes: [
                    {key: 'first', title: '全部', isMsg: nextProps.notice_arr[8]},
                    {key: 'second', title: '支出', isMsg: nextProps.notice_arr[9]},
                    {key: 'second1', title: '收入', isMsg: nextProps.notice_arr[10]},
                ],
            });
        }
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
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

        // let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '帐单', null, theme, 'black', 16, null, false);
        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                <View style={{paddingBottom: 10, marginTop: 5}}>
                    <TabBar
                        style={{
                            height: 35,
                            width: 200,
                            alignSelf: 'center',
                            marginLeft: 30,
                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: 13}}
                        routes={navigationRoutes}
                        index={0}
                        sidePadding={0}
                        handleIndexChange={this.handleIndexChange}
                        bounces={true}
                        titleMarginHorizontal={30}
                        activeStyle={{fontSize: 16, color: [0, 0, 0], fontWeight: 'bold'}}
                        inactiveStyle={{fontSize: 16, color: [150, 150, 150], height: 10}}
                        indicatorStyle={{height: 3, backgroundColor: bottomTheme, borderRadius: 3, top: 3}}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            NavigationUtils.goBack(this.props.navigation);
                        }}
                        style={{
                            position: 'absolute',
                            top: 15, left: 10,
                        }}>
                        <SvgUri width={20} height={20} svgXmlData={goback}/>
                    </TouchableOpacity>
                </View>

                <TabView
                    ref={ref => this.tabView = ref}
                    indicatorStyle={{backgroundColor: 'white'}}
                    navigationState={{index: navigationIndex, routes: navigationRoutes}}
                    renderScene={this.renderScene}
                    position={this.position}
                    renderTabBar={() => null}
                    onIndexChange={index => {
                        const noticeType = index + 8;
                        //console.log(noticeType, 'onIndexChange');
                        const {onSetNoticeMsgIsRead, userinfo} = this.props;
                        onSetNoticeMsgIsRead(noticeType) && updateNoticeIsReadForType({type: noticeType}, userinfo.token);
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

    clearNotice = (noticeType) => {
        const {onSetNoticeMsgIsRead, userinfo, notice_arr} = this.props;
        notice_arr[noticeType] && onSetNoticeMsgIsRead(noticeType) && updateNoticeIsReadForType({type: noticeType}, userinfo.token);
    };
    handleIndexChange = (index) => {
        // console.log(index);
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <UserBillList type={0}
                                     clearNotice={this.clearNotice}
                                     noticeType={8}
                                     userinfo={this.props.userinfo}/>;
            case 'second':
                return <UserBillList type={1}
                                     clearNotice={this.clearNotice}
                                     noticeType={9}
                                     userinfo={this.props.userinfo}/>;
            case 'second1':
                return <UserBillList type={2}
                                     clearNotice={this.clearNotice}
                                     noticeType={10}
                                     userinfo={this.props.userinfo}/>;
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
        setTimeout(() => {
            this._updatePage(true);
        }, 400);

    }

    _updatePage = (isRefresh) => {
        const {noticeType, clearNotice} = this.props;
        clearNotice(noticeType);
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
            if (isRefresh) {
                const newData = formatData([], result, 'bill_date1');
                this.setState({
                    taskData: newData,
                    isLoading: false,
                    hideLoaded: result.length < 10,
                });
            } else {
                const newData = formatData(this.state.taskData, result, 'bill_date1');
                this.setState({
                    taskData: newData,
                    hideLoaded: result.length < 10,
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
                ListEmptyComponent={<EmptyComponent icoW={wp(23)} icoH={wp(21)} height={height - 80} message={'您还没有相关帐单'}/>}
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
                    // 等待页面布局完成以后，在让加载更多
                    setTimeout(() => {
                        if (this.canLoadMore && taskData.length >= 10) {
                            this.onLoading();
                            this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                        }
                    }, 100);
                }}
                windowSize={300}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => {
                    // console.log('我被触发');
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
        if (item.time) {
            return <View style={{height: 40, backgroundColor: 'rgba(245,245,245,0.6)'}}>
                <Text style={{position: 'absolute', bottom: 3, left: 10, color: 'rgba(0,0,0,0.6)'}}>{item.time}</Text>
            </View>;
        }
        return <TouchableOpacity
            onPress={() => {
                if (!isNaN(item.bill_task_id) && item.bill_task_id > 0) {
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
                <Text style={{fontSize: 16, color: 'black'}}>{item.bill_title}</Text>
                <Text style={{
                    marginTop: 8,
                    opacity: 0.7,
                    fontSize: 14,
                    color: 'black',
                }}>余额:{item.bill_balance}</Text>
                <Text style={{marginTop: 8, opacity: 0.5, fontSize:14, color: 'black'}}>{item.bill_date1}</Text>
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
                    textAlign: 'right', color: 'black',

                }}>{item.bill_status == 1 ? '成功' : item.bill_status == 0 ? '待审核' : item.bill_status == -1 ? '驳回' : ''}</Text>
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
    notice_arr: state.friend.notice_arr,
});
const mapDispatchToProps = dispatch => ({
    onSetNoticeMsgIsRead: (type) => dispatch(actions.onSetNoticeMsgIsRead(type)),
});
const UserBillListPageRedux = connect(mapStateToProps, mapDispatchToProps)(UserBillListPage);


export default UserBillListPageRedux;

