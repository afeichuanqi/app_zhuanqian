/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {ActivityIndicator, RefreshControl} from 'react-native';
import NavigationBar from '../common/NavigationBar';

import {Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {bottomTheme} from '../appSet';
import setting from '../res/svg/setting.svg';
import shop from '../res/svg/shop.svg';
import guanzhu from '../res/svg/mysvg/guanzhu1.svg';
import bill1 from '../res/svg/mysvg/bill1.svg';
import yaoqing2 from '../res/svg/mysvg/yaoqing2.svg';
import pingbi1 from '../res/svg/mysvg/pingbi1.svg';
import favorite_1 from '../res/svg/mysvg/favorite_1.svg';
import my_fabu from '../res/svg/my_fabu.svg';
import SvgUri from 'react-native-svg-uri';
import FastImage from 'react-native-fast-image';
import ViewUtil from '../util/ViewUtil';
import Animated from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';
import {connect} from 'react-redux';
import PickerImage from '../common/PickerImage';
import actions from '../action';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import FastImagePro from '../common/FastImagePro';
import {equalsObj} from '../util/CommonUtils';
import {updateNoticeIsReadForType} from '../util/AppService';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const {width, height} = Dimensions.get('window');
const MenuClick = (menuName, params = {}) => {
    NavigationUtils.goPage(params, menuName);
};

class MyPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {};

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    render() {
        let statusBar = {
            // hidden: false,
            // backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        const titleTop = Animated.interpolate(this.scrollY, {
            inputRange: [-400, 0, 100],
            outputRange: [450, 55, 18],
            extrapolate: 'clamp',
        });
        const titleFontSize = Animated.interpolate(this.scrollY, {
            inputRange: [0, 100],
            outputRange: [22, 16],
            extrapolate: 'clamp',
        });
        const RefreshHeight = Animated.interpolate(this.scrollY, {
            inputRange: [0, 1, 2],
            outputRange: [230, 50, 50],
            extrapolate: 'clamp',
        });
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        const {userinfo, onUploadAvatar, onGetUserInFoForToken} = this.props;
        return (
            <View
                style={{flex: 1}}
            >
                {navigationBar}
                {/*顶部导航栏*/}
                <View
                    style={{flex: 1}}
                >
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        height: 50,
                        backgroundColor: bottomTheme,
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                NavigationUtils.goPage({}, 'SettingPage');
                            }}

                        >
                            <SvgUri width={23} height={23} fill={'white'} svgXmlData={setting}/>
                        </TouchableOpacity>
                    </View>


                    <Animated.View
                        style={{
                            backgroundColor: bottomTheme,
                            height: RefreshHeight,
                            width,
                            position: 'absolute',
                            top: 50,
                        }}>
                    </Animated.View>
                    <AnimatedScrollView
                        style={{zIndex: 1}}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: {y: this.scrollY},
                                },
                            },
                        ])}
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={false}
                        //         enabled={false}
                        //         onRefresh={() => {
                        //             onGetUserInFoForToken(userinfo.token, () => {
                        //             });
                        //         }}
                        //     />
                        // }
                        scrollEventThrottle={1}
                    >
                        <TopInfoColumn onUploadAvatar={onUploadAvatar} userinfo={userinfo} scrollY={this.scrollY}/>
                        <BottomInfoColumnRedux/>
                    </AnimatedScrollView>
                    {/*名字*/}
                    <AnimatedTouchableOpacity
                        activeOpacity={1}
                        onPress={userinfo.login ? () => {
                            NavigationUtils.goPage({}, 'AccountSetting');
                        } : this._nameClick}
                        style={{
                            position: 'absolute',
                            top: titleTop,
                            left: 10,
                            zIndex: 2,
                            elevation: 0.3,

                        }}>
                        <Animated.Text
                            style={{fontSize: titleFontSize, color: 'white', fontWeight: 'bold'}}>
                            {userinfo.login ? userinfo.username : '请先登录'}
                        </Animated.Text>
                    </AnimatedTouchableOpacity>

                </View>

            </View>
        );
    }

    _nameClick = () => {
        NavigationUtils.goPage({}, 'LoginPage');
    };
    scrollY = new Animated.Value(0);
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onUploadAvatar: (token, data, callback) => dispatch(actions.onUploadAvatar(token, data, callback)),
    onGetUserInFoForToken: (token, callback) => dispatch(actions.onGetUserInFoForToken(token, callback)),
});
const MyPageRedux = connect(mapStateToProps, mapDispatchToProps)(MyPage);
export default MyPageRedux;

class BottomInfoColumn extends Component {
    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.friend.notice_arr && !equalsObj(this.props.friend.notice_arr, nextProps.friend.notice_arr)) {
            return true;
        }
        return false;

    }

    render() {

        const {onSetNoticeMsgIsRead, friend, userinfo} = this.props;
        const {notice_arr} = friend;
        return <View style={{}}>
            <View style={{paddingHorizontal: 10, paddingTop: 20, paddingVertical: 10, backgroundColor: 'white'}}>
                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
                    我的工具
                </Text>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}

                style={{paddingLeft: 5, backgroundColor: '#fafafa'}}
            >
                <ToolsItemComponent
                    title={'发布管理'}
                    info={'有需求、大家做'}
                    source={require('../res/img/my/fabu.png')}
                    onPress={() => {
                        MenuClick('TaskReleaseMana');
                        notice_arr[1] > 0 && onSetNoticeMsgIsRead(1) && updateNoticeIsReadForType({type:1}, userinfo.token);
                    }}
                    isOtherMsg={notice_arr[1] > 0}

                />
                <ToolsItemComponent
                    title={'接单管理'}
                    source={require('../res/img/my/jiedan.png')}
                    info={'有任务、赚赏金'}
                    onPress={() => {
                        MenuClick('TaskOrdersMana');
                        notice_arr[2] > 0 && onSetNoticeMsgIsRead(2) && updateNoticeIsReadForType({type: 2}, userinfo.token);
                    }}
                    isOtherMsg={notice_arr[2] > 0}
                />
                <ToolsItemComponent/>
                <ToolsItemComponent/>
            </ScrollView>

            {ViewUtil.getSettingItem(guanzhu, '我的关注', '关注列表', () => {
                MenuClick('MyAttentionList', {user_id: this.props.userinfo.userid, isMy: true});
                // NavigationUtils.goPage();
            })}
            <View>
                {ViewUtil.getSettingItem(bill1, '帐单展示', '支出、收入', () => {
                    MenuClick('UserBillListPage');
                    NavigationUtils.goPage({}, '');

                })}

                {notice_arr[2] > 0 &&
                <View style={{
                    position: 'absolute',
                    right: 10, top: 10, width: 5, height: 5, borderRadius: 8,
                    backgroundColor: 'red',
                }}/>}
            </View>

            {ViewUtil.getSettingItem(yaoqing2, '邀请好友', '好友邀请得奖励', () => {
                MenuClick('FriendPromotionPage');
            })}
            {ViewUtil.getSettingItem(favorite_1, '我的收藏', '收藏精品任务', () => {
                MenuClick('MyFavoritePage');
            })}
            {ViewUtil.getSettingItem(pingbi1, '屏蔽用户', '屏蔽用户列表', () => {
                MenuClick('MyShieldPage');
            })}
            {ViewUtil.getMenuLine()}


        </View>;
    }
}

const mapStateToProps_ = state => ({
    userinfo: state.userinfo,
    friend: state.friend,
});
const mapDispatchToProps_ = dispatch => ({
    onSetNoticeMsgIsRead: (type) => dispatch(actions.onSetNoticeMsgIsRead(type)),
    // onUploadAvatar: (token, data, callback) => dispatch(actions.onUploadAvatar(token, data, callback)),
    // onGetUserInFoForToken: (token, callback) => dispatch(actions.onGetUserInFoForToken(token, callback)),
});


class ToolsItemComponent extends PureComponent {
    static defaultProps = {
        title: '发布管理',
        info: '提升简历活跃',
        svgXmlData: my_fabu,
        source: require('../res/img/my/fabu.png'),
        isOtherMsg: false,
    };

    render() {
        const {title, info, source, isOtherMsg} = this.props;

        return <TouchableOpacity
            onPress={this.props.onPress}
            activeOpacity={0.6}
            style={{
                width: 140, height: 65,
                borderRadius: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 10,
                shadowColor: '#e8e8e8',
                shadowRadius: 5,
                shadowOpacity: 3,
                shadowOffset: {w: 1, h: 1},
                elevation: 3,//安卓的阴影
                backgroundColor: 'white',
                marginRight: 5,
                marginBottom: 10,
                marginLeft: 5,
                marginTop: 10,
            }}>
            <View>
                <Text style={{fontSize: 15}}>{title}</Text>
                <Text style={{fontSize: 11, color: 'black', marginTop: 5, opacity: 0.7}}>{info}</Text>
            </View>
            <FastImage source={source} style={{width: 35, height: 35}}/>
            {isOtherMsg && <View style={{
                height: 8,
                width: 8,
                position: 'absolute',
                right: 5,
                top: 5,
                backgroundColor: 'red',
                borderRadius: 5,
            }}/>}
        </TouchableOpacity>;
    }
}


const BottomInfoColumnRedux = connect(mapStateToProps_, mapDispatchToProps_)(BottomInfoColumn);


class TopInfoColumn extends PureComponent {
    genDataInfo = (value, title) => {
        return <View style={{
            width: width / 4,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={{color: 'white', fontSize: 16}}>{value}</Text>
            <Text style={{color: 'white', fontSize: 12, opacity: 0.8, marginTop: 5}}>{title}</Text>
        </View>;
    };
    _avatarClick = () => {
        const {userinfo} = this.props;
        if (!userinfo.login) {
            NavigationUtils.goPage({}, 'LoginPage');
        } else {
            this.pickerImage.show();
        }
    };

    render() {
        // const translateY = Animated.interpolate(this.props.scrollY, {
        //     inputRange: [0, 120],
        //     outputRange: [-130, 70],
        //     extrapolate: 'clamp',
        // });
        const {userinfo} = this.props;
        const opacity = Animated.interpolate(this.props.scrollY, {
            inputRange: [0, 120],
            outputRange: [1, 0.1],
            extrapolate: 'clamp',
        });
        // console.log('');
        // console.log(userinfo);
        return <View style={{backgroundColor: bottomTheme}}>
            <View style={{marginTop: 130, height: 0}}/>
            <Animated.View
                style={{height: 130, opacity, position: 'absolute', top: 0}}>
                {/*头像*/}
                <View style={{justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationUtils.goPage({userid: userinfo.userid}, 'ShopInfoPage');

                        }}
                        style={{marginTop: 40, flexDirection: 'row', alignItems: 'center'}}>

                        <SvgUri width={14} height={14} style={{marginRight: 5}} fill={'white'} svgXmlData={shop}/>
                        <Text style={{fontSize: 12, color: 'white'}}>我的店铺 > </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this._avatarClick}
                    >
                        {userinfo.upload_avatar_loading ?
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                                // backgroundColor:'white',
                            }}>
                                <ActivityIndicator size="small" color="white"/>
                            </View>
                            : <FastImagePro
                                style={[styles.imgStyle]}
                                source={userinfo.login ? {uri: userinfo.avatar_url} : require('../res/img/no_login.png')}
                                resizeMode={FastImage.resizeMode.stretch}
                            />}

                        {/*<*/}
                        {userinfo.login && <SvgUri style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 5,
                            backgroundColor: userinfo.sex == 0 ? '#3b8ae8' : '#e893d8',
                            borderRadius: 20,
                        }} fill={'white'} width={12} height={12}
                                                   svgXmlData={userinfo.sex == 0 ? sex_nan_ : sex_nv_}/>}


                    </TouchableOpacity>

                </View>
                {/*基本信息栏目*/}
                <View style={{
                    // marginTop: 50,
                    flexDirection: 'row',
                    justifyContent: 'space-around',

                }}>
                    {this.genDataInfo(userinfo.login ? userinfo.task_currency : 0, '任务币')}
                    {this.genDataInfo(userinfo.login ? userinfo.income_dividend : 0, '收入分红')}
                    {this.genDataInfo(userinfo.login ? userinfo.tota_withdrawal : 0, '提现总额')}
                    {this.genDataInfo(userinfo.login ? userinfo.guaranteed_amount : 0, '保证金')}
                </View>
            </Animated.View>
            <PickerImage showMorePhotos={true} cropping={true} includeBase64={true} select={this._avatarSelect}
                         popTitle={'选取头像'}
                         ref={ref => this.pickerImage = ref}/>
        </View>;
    }

    _avatarSelect = (imageData) => {
        const {userinfo} = this.props;
        let mime = imageData.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const uri = `file://${imageData.path}`;
        this.props.onUploadAvatar(userinfo.token, {mime, uri}, (isTrue, data) => {
        });
    };
}

const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        // backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 50,
        height: 50,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
