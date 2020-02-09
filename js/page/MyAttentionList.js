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
    RefreshControl, StyleSheet, Text,
    View, TouchableOpacity, StatusBar,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {attentionUserId, selectAttentionFanList} from '../util/AppService';
import FastImage from 'react-native-fast-image';
import NavigationUtils from '../navigator/NavigationUtils';
import TabBar from '../common/TabBar';
import {TabView} from 'react-native-tab-view';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import SvgUri from 'react-native-svg-uri';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import BackPressComponent from '../common/BackPressComponent';
import goback from '../res/svg/goback.svg';
import Toast from 'react-native-root-toast';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyAttention extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            navigationIndex: 0,
            navigationRoutes: [
                {key: 'first', title: '我的关注'},
                {key: 'second', title: '关注我的'},
            ],

        };

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        StatusBar.setTranslucent(false);
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

        // let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '我的关注粉丝', null, theme, 'black', 16, null, false);
        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                <View style={{paddingBottom: 10, marginTop: 10}}>
                    <TabBar
                        style={{
                            height: 35,
                            width: 200,
                            alignSelf: 'center',
                            marginLeft: 55,

                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: 13}}
                        routes={navigationRoutes}
                        index={0}
                        sidePadding={0}
                        handleIndexChange={this.handleIndexChange}
                        bounces={true}
                        titleMarginHorizontal={20}
                        activeStyle={{fontSize: 16, color: [0, 0, 0]}}
                        inactiveStyle={{fontSize: 16, color: [150, 150, 150], height: 10}}
                        indicatorStyle={{height: 3, backgroundColor: bottomTheme, borderRadius: 3,top:3}}
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

    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <MyAttentionList type={1} userinfo={this.props.userinfo} user_id={this.params.user_id}/>;
            case 'second':
                return <MyAttentionList type={0} userinfo={this.props.userinfo} user_id={this.params.user_id}/>;
        }
    };
    handleIndexChange = (index) => {
        // console.log(index);
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
}

class MyAttentionList extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this._updatePage(true);
    }

    _updatePage = (isRefresh) => {
        // const {userinfo} = this.props;
        if (isRefresh) {
            this.page.pageIndex = 0;
            this.setState({
                isLoading: true,
            });
        } else {
            this.page.pageIndex += 1;

        }
        selectAttentionFanList({
            type: this.props.type,
            user_id: this.props.user_id,
            pageIndex: this.page.pageIndex,

        }, '').then(result => {
            //console.log(result);
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


    position = new Animated.Value(0);

    render() {

        const {taskData, isLoading, hideLoaded} = this.state;
        return (
            <View style={{flex: 1}}>
                <AnimatedFlatList
                    style={{backgroundColor: '#f5f5f5', paddingTop: 1}}
                    ListEmptyComponent={<EmptyComponent icoW={wp(23)} icoH={wp(21)} type={3} height={height - 80} message={'您还没有任何关注'}/>}
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
                    // onScroll={this._onScroll}
                    ListFooterComponent={() => this.genIndicator(hideLoaded)}
                    onEndReached={() => {
                        //console.log('onEndReached.....');
                        setTimeout(() => {
                            // 等待页面布局完成以后，在让加载更多
                            if (this.canLoadMore && taskData.length > 10) {
                                this.onLoading();
                                this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                            }
                        }, 100);
                    }}
                    // onScrollEndDrag={this._onScrollEndDrag}
                    windowSize={300}
                    onEndReachedThreshold={0.01}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                    }}
                />
            </View>
        );
    }

    onLoading = () => {
        this._updatePage(false);
    };
    onRefresh = () => {
        this._updatePage(true);
    };
    _renderIndexPath = ({item, index}) => {
        return <AttentionItem userinfo={this.props.userinfo} item={item} key={item.userId} type={this.props.type}/>;
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

class AttentionItem extends PureComponent {
    state = {
        attentionStatus: 1,
    };

    render() {
        const {item, type} = this.props;
        const {attentionStatus} = this.state;

        return <TouchableOpacity
            onPress={() => {
                EventBus.getInstance().fireEvent(EventTypes.update_shopInfo_page, {
                    userId: item.userId,
                });
                NavigationUtils.goPage({userid: item.userId}, 'ShopInfoPage');

            }}
            style={{
                height: hp(12), width,
                paddingHorizontal: wp(4.3),
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'white',
                borderBottomWidth: 0.3,
                borderBottomColor: 'rgba(0,0,0,0.2)',

            }}>

            <View style={{flexDirection: 'row'}}>
                <View>
                    <FastImage
                        style={[styles.imgStyle]}
                        source={{uri: item.avatar_url}}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                    <SvgUri style={{
                        position: 'absolute',
                        right: -3,
                        bottom: -3,
                        backgroundColor: item.sex == 0 ? '#3b8ae8' : '#e893d8',
                        borderRadius: 20,
                        padding: 3,
                    }} fill={'white'} width={8} height={8}
                            svgXmlData={item.sex == 0 ? sex_nan_ : sex_nv_}/>
                </View>

                <View style={{justifyContent: 'space-around'}}>
                    <View style={{marginLeft: 15}}>
                        <Text style={{fontSize: hp(2.2), color: 'black'}}>{item.username}</Text>
                        <Text
                            style={{
                                fontSize: hp(1.9),
                                opacity: 0.6,
                                marginTop: 7,
                                color: 'black',
                            }}>{item.fan_num}位粉丝</Text>
                    </View>
                </View>
            </View>
            {type == 1 && <TouchableOpacity
                onPress={() => {
                    let attention_type = this.state.attentionStatus == 0 ? 1 : 0;
                    attentionUserId({
                        be_user_id: item.userId,
                        type: attention_type,
                    }, this.props.userinfo.token).then(result => {
                        this.setState({
                            attentionStatus: attention_type,
                        });
                        Toast.show(`${attention_type == 0 ? '取消关注成功' : '关注成功'}`);
                    }).catch(msg => {
                    });
                }}
                style={{
                    paddingHorizontal: wp(2),
                    paddingVertical: wp(1),
                    borderRadius: 3,
                    backgroundColor: attentionStatus == 1 ? '#5faff3' : bottomTheme,
                }}>
                <Text
                    style={{color: 'white', fontSize: hp(1.9)}}>{attentionStatus == 1 ? '✓ 已关注' : '+ 关注'}</Text>
            </TouchableOpacity>}

        </TouchableOpacity>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
const MyAttentionRedux = connect(mapStateToProps, mapDispatchToProps)(MyAttention);


export default MyAttentionRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: wp(13),
        height: wp(13),
        borderRadius: wp(13) / 2,
        // 设置高度
        // height:150
    },
});
