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
    Platform,
} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import TaskSumComponent from '../common/TaskInfoComponent';
import {attentionUserId, selectShopInfoForUserId, selectTaskListForUserId, uploadQiniuImage} from '../util/AppService';
import {connect} from 'react-redux';
import EmptyComponent from '../common/EmptyComponent';
import Toast from 'react-native-root-toast';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import BackPressComponent from '../common/BackPressComponent';
import ImageViewerModal from '../common/ImageViewerModal';
import SkeletonPlaceholder from '../common/SkeletonPlaceholder';
import SvgUri from 'react-native-svg-uri';
import goback from '../res/svg/goback.svg';
import PickerImage from '../common/PickerImage';
import actions from '../action';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const {height, width} = Dimensions.get('window');
const backgroundHeight = 100;
const topHeight = 140;
const {call, block, set} = Animated;

class ShopInfoPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            shopInfo: {},
            attentionStatus: 0,
            userId: this.params.userid,
        };
        this.animations = {
            val: new Animated.Value(1),
        };
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        // StatusBar.setBarStyle('light-content', true);
        // StatusBar.setTranslucent(true);
        // StatusBar.setBackgroundColor('rgba(0,0,0,0)', true);

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        this.backPress.componentDidMount();
        this.updateShopInfo(this.params.userid);
        StatusBar.setBarStyle('light-content', true);
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('rgba(0,0,0,0)', true);

        EventBus.getInstance().addListener(EventTypes.update_shopInfo_page, this.listener = data => {
            this.updateShopInfo(data.userId);
        });

    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        EventBus.getInstance().removeListener(this.listener);
    }

    updateShopInfo = (user_id) => {
        selectShopInfoForUserId({user_id: user_id}, this.props.userinfo.token).then(shopInfoArr => {
            const {shopInfo, attentionStatus} = shopInfoArr;
            this.setState({
                shopInfo,
                attentionStatus,
                userId: user_id,
            });
        });
    };

    changeShopBackImg = () => {
        if (this.state.userId === this.props.userinfo.userid) {
            this.pickerImage.show();
        }

    };

    render() {

        const translateY = Animated.interpolate(this.animations.val, {
            inputRange: [-height, 0, height],
            outputRange: [height + backgroundHeight + topHeight, backgroundHeight + topHeight, -height + backgroundHeight + topHeight],
            extrapolate: 'clamp',
        });
        const whiteOpacity = Animated.interpolate(this.animations.val, {
            inputRange: [0, 100, 130],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const blackOpacity = Animated.interpolate(this.animations.val, {
            inputRange: [0, 130, 160],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
        });
        //console.log(this.state.shopInfo);
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                <View style={{flex: 1}}>
                    <Animated.View
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            height,
                            width,
                            position: 'absolute',
                            top: (-height),
                            transform: [{translateY: translateY}],

                        }}>
                        <View style={{
                            width,
                            height: 30,
                            position: 'absolute',
                            bottom: backgroundHeight + topHeight + backgroundHeight + 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{color: 'rgba(255,255,255,0.5)', fontSize: hp(1.7)}}>简易赚 - 人人都能赚钱</Text>
                        </View>
                        <FastImage
                            source={{uri: this.state.userId === this.props.userinfo.userid ? this.props.userinfo.shopinfo_url : this.state.shopInfo.shopinfoUrl}}
                            style={{
                                height: Platform.OS === 'ios' ? backgroundHeight + topHeight + backgroundHeight : backgroundHeight + topHeight,
                                width,
                                position: 'absolute',
                                bottom: 0,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.changeShopBackImg}
                            style={{
                                height: Platform.OS === 'ios' ? backgroundHeight + topHeight + backgroundHeight : backgroundHeight + topHeight,
                                width,
                                position: 'absolute',
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                            }}
                        />

                    </Animated.View>
                    <View
                        style={{
                            position: 'absolute', top: 0, width, zIndex: 100,
                        }}
                    >
                        <Animated.View style={{backgroundColor: '#eeecee', width, height: 60, opacity: blackOpacity}}>
                            <View style={{
                                position: 'absolute', marginTop: 10, width, flexDirection: 'row', alignItems: 'center',
                                justifyContent: 'space-between', height: 60,
                            }}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={this.onBackPress}
                                    style={{justifyContent: 'center', marginLeft: 10}}>
                                    <SvgUri width={24} height={24} fill={'rgba(0,0,0,0.8)'} svgXmlData={goback}/>
                                </TouchableOpacity>
                                <Text style={{color: 'rgba(0,0,0,0.8)', fontSize: 16}}>
                                    {this.state.shopInfo.username ? this.state.shopInfo.username + '的店铺' : ''}
                                </Text>
                                <View style={{width: 30}}/>
                            </View>

                        </Animated.View>
                        <Animated.View style={{
                            position: 'absolute', top: 30, width, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', opacity: whiteOpacity,
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.onBackPress}
                                style={{justifyContent: 'center', marginLeft: 10}}>
                                <SvgUri width={24} height={24} fill={'rgba(255,255,255,0.8)'} svgXmlData={goback}/>
                            </TouchableOpacity>
                            <Text style={{color: 'white', fontSize: 16}}/>
                            <View/>
                        </Animated.View>

                    </View>
                    <ShopList
                        changeShopBackImg={this.changeShopBackImg}
                        attentionStatus={this.state.attentionStatus}
                        attentionUserId={this._attentionUserId}
                        updateShopInfo={this.updateShopInfo}
                        shopInfo={this.state.shopInfo}
                        userid={this.state.userId}
                        userinfo={this.props.userinfo}
                        RefreshHeight={this.animations.val}/>
                    {/*set*/}
                </View>
                <PickerImage

                    showMorePhotos={true}
                    cropping={true}
                    includeBase64={true}
                    select={this.selectImage}
                    popTitle={'请选择背景墙图片'} ref={ref => this.pickerImage = ref}/>
            </SafeAreaViewPlus>
        );
    }

    selectImage = (image) => {
        const {userinfo, onSetShopInfoBgImg} = this.props;//我的用户信息
        const token = userinfo.token;
        let mime = image.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const path = `file://${image.path}`;
        onSetShopInfoBgImg(token, mime, path, (isTrue, data) => {
            isTrue && Toast.show('更换成功');
        });
    };
    _attentionUserId = () => {
        let attention_type = this.state.attentionStatus == 0 ? 1 : 0;
        attentionUserId({
            be_user_id: this.params.userid,
            type: attention_type,
        }, this.props.userinfo.token).then(result => {
            this.setState({
                attentionStatus: attention_type,
            });
            Toast.show(`${attention_type == 0 ? '取消关注' : '关注'}成功`);
        }).catch(msg => {
            Toast.show(msg);
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
    BarStyle = 'light';

    render() {
        const {shopInfo} = this.props;

        const {commodityData, hideLoaded, isLoading} = this.state;
        return <AnimatedFlatList
            ListHeaderComponent={
                <View style={{}}>
                    <TouchableOpacity
                        onPress={this.props.changeShopBackImg}
                        activeOpacity={1}

                    >
                        <View style={{height: backgroundHeight}}/>
                        <AvatarColumn
                            attentionStatus={this.props.attentionStatus}
                            attentionUserId={this.props.attentionUserId}
                            shopInfo={shopInfo}
                            userinfo={this.props.userinfo}
                        />
                    </TouchableOpacity>


                    <ShopData shopInfo={shopInfo}/>
                </View>


            }
            style={{
                height: '100%',
                // backgroundColor: 'white',
            }}
            ref={ref => this.flatList = ref}
            data={commodityData}
            ListEmptyComponent={<EmptyComponent icoW={wp(23)} icoH={wp(21)} message={'暂无发布任务'} height={height - 380}/>}
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            refreshControl={
                <RefreshControl
                    progressViewOffset={hp(7)}
                    tintColor={'white'}
                    color={'white'}
                    refreshing={isLoading}
                    onRefresh={() => this.onRefresh()}
                />
            }
            onScroll={Animated.event([
                {
                    nativeEvent: {
                        contentOffset: {
                            y: y =>
                                block([
                                    set(this.props.RefreshHeight, y),
                                    call(
                                        [y],
                                        ([offsetY]) => {
                                            if (offsetY > 130 && this.BarStyle !== 'dark') {
                                                this.BarStyle = 'dark';
                                                StatusBar.setBarStyle('dark-content', false);

                                            }

                                            if (offsetY <= 130 && this.BarStyle !== 'light') {
                                                this.BarStyle = 'light';
                                                StatusBar.setBarStyle('light-content', true);
                                            }
                                        },
                                    ),
                                ]),
                        },
                    },
                },
            ])}
            ListFooterComponent={() => this.genIndicator(hideLoaded)}
            onEndReached={() => {
                // console.log('onEndReached.....');
                // 等待页面布局完成以后，在让加载更多
                setTimeout(() => {
                    if (this.canLoadMore && commodityData.length >= 10) {
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
    getTaskDataColumn = (title, value, value1 = '') => {

        if ((isNaN(value))) {
            return <SkeletonPlaceholder minOpacity={0.2}>
                <View style={{width: width / 3 - 10, marginHorizontal: 5, marginVertical: 5, height: 70}}/>
            </SkeletonPlaceholder>;
        }

        return <View style={{width: width / 3, justifyContent: 'center', alignItems: 'center', height: 70}}>
            <Text style={{fontSize:17, color: 'black'}}>{value}{value1}</Text>
            <Text style={{fontSize: 14, opacity: 0.7, marginTop: 5, color: 'black'}}>{title}</Text>
        </View>;
    };

    render() {
        const {total_hair_tasks_num, total_hair_order_num, success_hair_order_num, total_join_order_num, success_join_order_num} = this.props.shopInfo;
        // console.log(parseInt(success_join_order_num) / parseInt(total_join_order_num),"(parseInt(success_join_order_num) / parseInt(total_join_order_num) * 100).toFixed(2)");
        return <View style={{

            backgroundColor: 'white',
            borderBottomWidth: 10,
            borderBottomColor: '#e2e2e2',
        }}>
            <View style={{
                width,
                height: 40,
                paddingHorizontal: 20,
                paddingVertical: 10,
                justifyContent: 'center',

            }}>
                <Text style={{fontSize:15}}>店铺数据一览</Text>
            </View>
            <View style={{height: 0.3, width: width, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.3)'}}/>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.getTaskDataColumn('总发任务数', total_hair_tasks_num)}
                {this.getTaskDataColumn('总发单数', total_hair_order_num)}
                {this.getTaskDataColumn('成功派单数', success_hair_order_num)}
                {this.getTaskDataColumn('总接单数', total_join_order_num)}
                {this.getTaskDataColumn('成功接单数', success_join_order_num)}
                {this.getTaskDataColumn('接单转化比', (success_join_order_num == 0 && total_join_order_num == 0) ? 0 : (parseInt(success_join_order_num) / parseInt(total_join_order_num) * 100).toFixed(2), '%')}
            </View>

        </View>;

    }
}

class AvatarColumn extends Component {
    render() {
        return <View style={{width, paddingVertical: 10, paddingBottom: 50}}>
            <View style={{marginTop: 5, marginLeft: 10}}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        width: 50,
                        height: 50,
                    }}
                    onPress={() => {
                        this.imageViewer.show([{url: this.props.shopInfo.avatar_url}]);
                    }}
                >
                    <FastImage
                        style={[styles.imgStyle]}
                        source={{uri: this.props.shopInfo.avatar_url}}
                        resizeMode={FastImage.stretch}
                    />
                </TouchableOpacity>

                {/*左上*/}
                <View style={{
                    position: 'absolute',
                    top: 5,
                    left: 65,
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontSize: 18,
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
                        fontSize: 15,
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
                            fontSize:15,
                        }}>{this.props.attentionStatus == 0 ? '+ 关注' : '✓ 已关注'}</Text>
                    </TouchableOpacity>

                </View>

            </View>
            {/*左下*/}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
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
            <ImageViewerModal statusBarType={'translucent'} ref={ref => this.imageViewer = ref}/>
        </View>;
    }

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onSetShopInfoBgImg: (token, mime, path, callback) => dispatch(actions.onSetShopInfoBgImg(token, mime, path, callback)),
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
