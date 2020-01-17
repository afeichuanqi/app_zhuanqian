/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
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
import {getNoticeList} from '../util/AppService';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {equalsObj} from '../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class SystemNotificationPage extends PureComponent {
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
        getNoticeList({
            pageIndex: this.page.pageIndex,
        }, userinfo.token).then(result => {
            if (isRefresh) {
                console.log('我被触发isRefresh');
                this.setState({
                    taskData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 10 ? false : true,
                });
            } else {
                const tmpArr = [...this.state.taskData];
                console.log('我被触发onload');
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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '系统通知', null, 'white', 'black', 16, null, false, false, '清空', 'black');
        const {taskData, isLoading, hideLoaded} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <AnimatedFlatList
                        style={{backgroundColor: '#f5f5f5'}}
                        ListEmptyComponent={<EmptyComponent type={4} height={height - 80} message={'您还没有相关任务'}/>}
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
                                if (this.canLoadMore && taskData.length >= 10) {
                                    this.onLoading();
                                    this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                                }
                            }, 100);
                        }}
                        windowSize={300}
                        onEndReachedThreshold={0.3}
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
        return <NoticeItem item={item}/>;
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

class NoticeItem extends Component {
    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        console.log(this.state.is_read, 'this.state.is_read != nextState.is_read', nextState.is_read, this.state.is_read != nextState.is_read);
        if (!equalsObj(this.props.item, nextProps.item) || this.state.is_read != nextState.is_read) {
            console.log('被执行');
            return true;
        }
        return false;
    }

    constructor(props) {
        super(props);
        this.state = {
            is_read: props.item.is_read,
        };
    }

    render() {
        const {item} = this.props;
        const {is_read} = this.state;
        // console.log(is_read, 'is_read');
        return <TouchableOpacity
            key={item.id}
            onPress={() => {
                this.setState({
                    is_read: 1,
                });

                let pageName = '', navigationIndex = 0, type = item.type;
                // console.log(type, 'type');
                if (type > 0 && type <= 3) {
                    pageName = 'TaskReleaseMana';
                    navigationIndex = type - 1;

                } else if (type > 3 && type <= 7) {
                    pageName = 'TaskOrdersMana';
                    navigationIndex = type - 4;
                } else if (type > 7 && type <= 10) {
                    pageName = 'UserBillListPage';
                    navigationIndex = type - 8;
                }
                if (pageName.length > 0) {
                    NavigationUtils.goPage({navigationIndex}, pageName);
                }

            }}
            style={{
                width: wp(95),

                paddingHorizontal: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',


            }}>
            <View>
                <Text
                    style={{fontSize: wp(3), opacity: 0.5, marginVertical: 10, color: 'black'}}>{item.send_date1}</Text>
            </View>
            <View style={{
                width: wp(95), backgroundColor: 'white',
                paddingHorizontal: 10, borderRadius: 10, paddingVertical: 10,
            }}>
                <Text style={{marginVertical: 10, fontSize: wp(3.8), color: 'black'}}>{item.title}</Text>
                <View style={{height: 1, width: wp(90), backgroundColor: '#e8e8e8'}}/>
                <Text style={{
                    marginVertical: hp(2),
                    fontSize: wp(3.25),
                    opacity: 0.5,
                    width: wp(90),
                    color: 'black',
                }}>{item.content}</Text>
                {is_read == 0 && <View style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    width: 5,
                    height: 5,
                    backgroundColor: 'red',
                    borderRadius: 5,
                }}/>}

            </View>

        </TouchableOpacity>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const SystemNotificationPageRedux = connect(mapStateToProps, mapDispatchToProps)(SystemNotificationPage);


export default SystemNotificationPageRedux;
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
