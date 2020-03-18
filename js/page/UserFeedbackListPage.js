/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {FlatList,KeyboardAvoidingView} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions,
    StyleSheet, Text,
    View, TouchableOpacity, StatusBar, RefreshControl, ActivityIndicator, Image,
} from 'react-native';
import {connect} from 'react-redux';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import {selectFeedbackList} from '../util/AppService';
import EmptyComponent from '../common/EmptyComponent';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImagePro from '../common/FastImagePro';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class UserFeedbackListPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    page = {pageIndex: 0};

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this.backPress.componentDidMount();
        this._updateList(true);
    }

    _updateList = (refresh) => {
        if (refresh) {

            this.page = {pageIndex: 0};
            this.setState({
                isLoading: true,
            });

        } else {
            this.page = {pageIndex: this.page.pageIndex + 1};
        }
        selectFeedbackList({pageIndex: this.page.pageIndex}, this.props.userinfo.token).then(result => {
            if (refresh) {
                this.setState({
                    taskData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 30 ? false : true,
                });
            } else {
                const tmpArr = [...this.state.taskData];
                this.setState({
                    taskData: tmpArr.concat(result),
                    hideLoaded: result.length >= 30 ? false : true,
                });
            }
        }).catch(() => {
            this.setState({
                isLoading: false,
                hideLoaded: true,
            });
        });
    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    _renderIndexPath = ({item, index}) => {
        let source = '', title = '';

        if (item.type == 1) {
            // source = require('../res/img/feedback/gongneng.png');
            title = '功能建议';
        } else if (item.type == 2) {
            // source = require('../res/img/feedback/xingneng.png');
            title = '体验性能';
        } else if (item.type == 3) {
            // source = require('../res/img/feedback/bug.png');
            title = 'bug提交';
        }
        // console.log();
        return <View
            key={index}
            activeOpacity={0.6}

            style={{
                width,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#e2e2e2',
                flexDirection: 'row',
            }}
        >
            <FastImagePro
                resizeMode={'cover'}
                source={{uri:JSON.parse(item.content).images&&JSON.parse(item.content).images[0]}}
                style={{width: wp(12), height: wp(12),  marginLeft: 10}}
            />
            <View style={{marginLeft: 10, justifyContent: 'space-around'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color:'black'}}>{title}</Text>
                    <Text style={{fontSize: hp(1.75), color: 'rgba(0,0,0,0.5)'}}>{item.send_date1}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text numberOfLines={1} style={{color: 'rgba(0,0,0,0.5)', fontSize:hp(1.8),width:wp(80)}}>{JSON.parse(item.content).info}</Text>
                    {/*<Text style={{*/}
                    {/*    fontSize: 11,*/}
                    {/*    color: 'rgba(0,0,0,0.7)',*/}
                    {/*}}>{item.status == 0 ? '已发送' : item.status == 1 ? '奖励' : ''}</Text>*/}
                </View>

            </View>
        </View>;
    };

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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '历史反馈', null, 'white', 'black', 16, null, false, false);
        const {isLoading, taskData, hideLoaded} = this.state;

        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}


                <View style={{flex: 1}}>

                    <FlatList

                        ListEmptyComponent={<EmptyComponent type={4} message={'暂时没有反馈记录'} height={height - 100}/>}
                        // ListHeaderComponent={ListHeaderComponent}
                        ref={ref => this.flatList = ref}
                        data={taskData}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={1}
                        renderItem={data => this._renderIndexPath(data)}
                        keyExtractor={(item, index) => index + ''}
                        style={{
                            backgroundColor: '#f1f1f1',
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={() => this._updateList()}
                            />
                        }
                        ListFooterComponent={() => this.genIndicator(hideLoaded)}
                        onEndReached={() => {
                            setTimeout(() => {
                                // 等待页面布局完成以后，在让加载更多
                                this.onLoading();
                                // if (this.canLoadMore && taskData.length >= 10) {
                                //     this.onLoading();
                                //     this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                                // }
                            }, 100);
                        }}
                        windowSize={300}
                        onEndReachedThreshold={0.3}
                        onMomentumScrollBegin={() => {
                            this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                        }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            NavigationUtils.goBack(this.props.navigation);

                        }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width,
                            height: 50,
                            backgroundColor: bottomTheme,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>我要反馈</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaViewPlus>
        );
    }

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
const UserFeedbackListPageRedux = connect(mapStateToProps, mapDispatchToProps)(UserFeedbackListPage);


export default UserFeedbackListPageRedux;
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
