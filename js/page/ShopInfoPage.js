/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity, StatusBar,
} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import TaskSumComponent from '../common/TaskSumComponent';
import {attentionUserId, selectShopInfoForUserId, selectTaskListForUserId} from '../util/AppService';
import {connect} from 'react-redux';
import EmptyComponent from '../common/EmptyComponent';
import Toast from '../common/Toast';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import BackPressComponent from '../common/BackPressComponent';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const {height, width} = Dimensions.get('window');
let taskId = 0;
let taskUri = '';

class ShopInfoPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        taskId = this.params.taskId;
        taskUri = this.params.taskUri;
        this.state = {
            shopInfo: {},
            attentionStatus: 0,
            userId: this.params.userid,
        };
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        this.backPress.componentDidMount();
        this.updateShopInfo(this.params.userid);
        EventBus.getInstance().addListener(EventTypes.update_shopInfo_page, this.listener = data => {
            this.updateShopInfo(data.userId);
        });
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        EventBus.getInstance().removeListener(this.listener);
    }

    updateShopInfo = (user_id) => {
        // this.userId = user_id;
        selectShopInfoForUserId({user_id: user_id}, this.props.userinfo.token).then(shopInfoArr => {
            // console.log(shopInfoArr,"shopInfoArr");
            const {shopInfo, attentionStatus} = shopInfoArr;

            this.setState({
                shopInfo,
                attentionStatus,
                userId: user_id,
            });
        });
    };
    animations = {
        val: new Animated.Value(1),
    };

    render() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(bottomTheme, true);
        const RefreshHeight = Animated.interpolate(this.animations.val, {
            inputRange: [-200, -0.1, 0],
            outputRange: [250, 50, 0],
            extrapolate: 'clamp',
        });
        let statusBar = {
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;

        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, `${this.state.shopInfo.username}的店铺`, null, bottomTheme, 'white', 16, () => {
        }, false);
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <View style={{flex: 1}}>
                    <Animated.View
                        style={{
                            backgroundColor: bottomTheme,
                            height: RefreshHeight,
                            width,
                            position: 'absolute',
                            top: 0,
                        }}>


                    </Animated.View>
                    <ShopList
                        attentionStatus={this.state.attentionStatus}
                        attentionUserId={this._attentionUserId}
                        updateShopInfo={this.updateShopInfo}
                        shopInfo={this.state.shopInfo}
                        userid={this.state.userId}
                        userinfo={this.props.userinfo}
                        RefreshHeight={this.animations.val}/>
                </View>

            </SafeAreaViewPlus>
        );
    }

    _attentionUserId = () => {
        let attention_type = this.state.attentionStatus == 0 ? 1 : 0;
        attentionUserId({
            be_user_id: this.params.userid,
            type: attention_type,
        }, this.props.userinfo.token).then(result => {
            this.setState({
                attentionStatus: attention_type,
            });
            // this.updateShopInfo();
            this.toast.show(`${attention_type == 0 ? '取消关注' : '关注'}成功`);
        }).catch(msg => {
            this.toast.show(msg);
        });
    };
}

class ShopList extends Component {
    state = {
        commodityData: [],
        isLoading: false,
        hideLoaded: false,

    };

    componentDidMount(): void {
        this.userid = this.props.userid;

        this._updatePage(true);


    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.props.userid != nextProps.userid) {
            this.userid = nextProps.userid;
            this._updatePage(true);
        }
    }

    _updatePage = (refresh) => {
        if (refresh) {

            this.params.pageIndex = 0;
            this.setState({
                isLoading: true,
            });
        } else {
            this.params.pageIndex += 1;
        }
        selectTaskListForUserId({
            user_id: this.userid,
            pageIndex: this.params.pageIndex,
        }, this.props.userinfo.token).then(result => {
            // console.log('刷新中');
            if (refresh) {
                this.setState({
                    commodityData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 10 ? false : true,
                });
            } else {
                const tmpArr = [...this.state.commodityData];
                this.setState({
                    commodityData: tmpArr.concat(result),
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
    params = {
        pageIndex: 0,

    };

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.params.pageIndex === 0 || !this.params.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: 13}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    _renderIndexPath = ({item, index}) => {
        item.avatarUrl = item.task_uri;

        return <TaskSumComponent
            item={item}
            // titleFontSize={15}
            // marginHorizontal={15}
            onPress={(task_id) => {
                EventBus.getInstance().fireEvent(EventTypes.update_task_page, {
                    test: false,
                    task_id: task_id,
                });
            }}
        />;
    };
    onLoading = () => {
        this._updatePage(false);

    };
    onRefresh = () => {
        this.props.updateShopInfo(this.userid);
        this._updatePage(true);
    };

    render() {
        const {shopInfo} = this.props;

        const {commodityData, hideLoaded, isLoading} = this.state;

        return <AnimatedFlatList
            ListHeaderComponent={
                <View style={{backgroundColor: '#e8e8e8'}}>

                    <AvatarColumn
                        attentionStatus={this.props.attentionStatus}
                        attentionUserId={this.props.attentionUserId}
                        shopInfo={shopInfo}
                        userinfo={this.props.userinfo}

                    />
                    <ShopData shopInfo={shopInfo}/>
                </View>

            }
            style={{
                // backgroundColor: 'white',
            }}
            ref={ref => this.flatList = ref}
            data={commodityData}
            ListEmptyComponent={<EmptyComponent message={'暂无发布任务'} height={height - 380}/>}
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            refreshControl={
                <RefreshControl
                    // title={'更新任务中'}
                    // style={{backgroundColor:'blue'}}
                    color={'black'}
                    refreshing={isLoading}
                    onRefresh={() => this.onRefresh()}
                />
            }
            onScroll={Animated.event([
                {
                    nativeEvent: {
                        contentOffset: {y: this.props.RefreshHeight},
                    },
                },
            ])}
            ListFooterComponent={() => this.genIndicator(hideLoaded)}
            onEndReached={() => {
                // console.log('onEndReached.....');
                // 等待页面布局完成以后，在让加载更多
                setTimeout(() => {
                    if (this.canLoadMore) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }, 100);
            }}
            // onScrollEndDrag={this._onScrollEndDrag}
            windowSize={300}
            onEndReachedThreshold={0.3}
            onMomentumScrollBegin={() => {
                this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
            }}
        />;
    }
}

class ShopData extends Component {
    getTaskDataColumn = (title, value) => {
        return <View style={{width: width / 3, justifyContent: 'center', alignItems: 'center', height: 70}}>
            <Text style={{fontSize: 15}}>{value}</Text>
            <Text style={{fontSize: 12, opacity: 0.6, marginTop: 5}}>{title}</Text>
        </View>;
    };

    render() {
        return <View style={{marginTop: 10, backgroundColor: 'white', marginBottom: 10}}>
            <View style={{
                width,
                height: 40,
                paddingHorizontal: 20,
                paddingVertical: 10,
                justifyContent: 'center',
                borderBottomWidth: 0.3,
                borderBottomColor: 'rgba(0,0,0,0.1)',
            }}>
                <Text>店铺数据一览</Text>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.getTaskDataColumn('总发任务数', this.props.shopInfo.total_hair_tasks_num)}
                {this.getTaskDataColumn('总发单数', this.props.shopInfo.total_hair_order_num)}
                {this.getTaskDataColumn('成功派单数', this.props.shopInfo.success_hair_order_num)}
                {this.getTaskDataColumn('总接单数', this.props.shopInfo.total_join_order_num)}
                {this.getTaskDataColumn('成功接单数', this.props.shopInfo.success_join_order_num)}
                {this.getTaskDataColumn('接单转化比', (parseInt(this.props.shopInfo.success_join_order_num) / parseInt(this.props.shopInfo.total_join_order_num) * 100).toFixed(2) + '%')}
            </View>

        </View>;

    }
}

class AvatarColumn extends Component {
    render() {
        return <View style={{backgroundColor: bottomTheme, width, paddingVertical: 10, paddingBottom: 50}}>
            <View style={{marginTop: 5, marginLeft: 10}}>
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: this.props.shopInfo.avatar_url}}
                    resizeMode={FastImage.stretch}
                />
                {/*左上*/}
                <View style={{
                    position: 'absolute',
                    top: 5,
                    left: 65,
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontSize: 15,
                        color: 'white',
                    }}>{this.props.shopInfo.username}</Text>
                </View>
                {/*左下*/}
                <View style={{
                    position: 'absolute',
                    bottom: 5,
                    left: 65,
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: 'white',
                    }}>ID:{this.props.shopInfo.userId}</Text>
                </View>

                {/*右中*/}
                <View style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 20,
                    flexDirection: 'row',
                }}>


                    <TouchableOpacity
                        onPress={this.props.attentionUserId}
                        activeOpacity={0.6}
                        style={{
                            marginLeft: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            backgroundColor: '#5faff3',
                            borderRadius: 3,
                        }}>
                        <Text style={{
                            color: 'white',
                        }}>{this.props.attentionStatus == 0 ? '+ 关注' : '✓ 已关注'}</Text>
                    </TouchableOpacity>

                </View>

            </View>
            {/*左下*/}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    // EventBus.getInstance().fireEvent(EventTypes.update_attention_page, {
                    //     // isDelTitle: false
                    //     user_id: this.props.shopInfo.userId
                    // });
                    NavigationUtils.goPage({user_id: this.props.shopInfo.userId}, this.props.userinfo.userid == this.props.shopInfo.userId ? 'MyAttentionList' : 'HisAttentionList');
                }}
                style={{
                    position: 'absolute',
                    bottom: 15,
                    left: 15,
                    flexDirection: 'row',
                }}>
                <Text style={{
                    fontSize: 14,
                    color: 'white',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                }}>{this.props.shopInfo.attention_num}关注</Text>
                <Text style={{
                    fontSize: 14,
                    color: 'white',
                    marginLeft: 15,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                }}>{this.props.shopInfo.fan_num}粉丝</Text>
            </TouchableOpacity>
        </View>;
    }

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onUploadAvatar: (token, data, callback) => dispatch(actions.onUploadAvatar(token, data, callback)),
});
const ShopInfoPageRedux = connect(mapStateToProps, mapDispatchToProps)(ShopInfoPage);
export default ShopInfoPageRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 50,
        height: 50,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
