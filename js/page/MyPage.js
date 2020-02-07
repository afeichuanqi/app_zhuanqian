/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {ActivityIndicator, ImageBackground, RefreshControl} from 'react-native';
import NavigationBar from '../common/NavigationBar';

import {Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {bottomTheme} from '../appSet';
import setting from '../res/svg/setting.svg';
import shop from '../res/svg/shop.svg';
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
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


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

    state = {isLoading: false};

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
            inputRange: [-800, 0, 100],
            outputRange: [850, hp(9), 18],
            extrapolate: 'clamp',
        });
        const titleFontSize = Animated.interpolate(this.scrollY, {
            inputRange: [0, 100],
            outputRange: [23, 17],
            extrapolate: 'clamp',
        });
        const translateY = Animated.interpolate(this.scrollY, {
            inputRange: [-height, 0, height],
            outputRange: [height, 0, -height],
            extrapolate: 'clamp',
        });
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        const {userinfo, onUploadAvatar, onGetUserInFoForToken} = this.props;
        const {isLoading} = this.state;
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
                                NavigationUtils.goPage({}, 'ShopInfoPage');
                            }}
                            style={{marginRight:10}}

                        >
                            <SvgUri width={18} height={18} fill={'white'} svgXmlData={shop}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                NavigationUtils.goPage({}, 'SettingPage');
                            }}

                        >
                            <SvgUri width={18} height={18} fill={'white'} svgXmlData={setting}/>
                        </TouchableOpacity>
                    </View>


                    <Animated.View
                        style={{
                            backgroundColor: bottomTheme,
                            height,
                            width,
                            position: 'absolute',
                            top: (-height) + 50,
                            transform: [{translateY: translateY}],
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
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={() => {
                                    this.setState({
                                        isLoading: true,

                                    });
                                    onGetUserInFoForToken(userinfo.token, (loginStatus, msg) => {
                                        this.setState({
                                            isLoading: false,

                                        });
                                    });
                                }}
                            />
                        }
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
                            top: 0,
                            transform: [{translateY: titleTop}],
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
    onUploadAvatar: (token, mime, path, callback) => dispatch(actions.onUploadAvatar(token, mime, path, callback)),
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
        // const tmpNoticeArr = [...notice_arr];

        const releaseIsNewMsg = notice_arr.slice(1, 4).find(item => item > 0);
        const orderIsNewMsg = notice_arr.slice(4, 8).find(item => item > 0);
        const billIsNewMsg = notice_arr.slice(8, 11).find(item => item > 0);
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
                    source={require('../res/img/my/fabu_mana.png')}
                    onPress={() => {
                        MenuClick('TaskReleaseMana');
                        // fabuNewMsg && onSetNoticeMsgIsRead(1) && updateNoticeIsReadForType({type: 1}, userinfo.token);
                    }}
                    isOtherMsg={releaseIsNewMsg}

                />
                <ToolsItemComponent
                    title={'接单管理'}
                    source={require('../res/img/my/jiedan_mana.png')}
                    info={'有任务、赚赏金'}
                    onPress={() => {
                        MenuClick('TaskOrdersMana');
                    }}
                    isOtherMsg={orderIsNewMsg}
                />
                <ToolsItemComponent
                    title={'充值管理'}
                    source={require('../res/img/my/chongzhi_mana.png')}
                    info={'做任务、充赏金'}
                    onPress={() => {
                        MenuClick('RechargePage');
                    }}

                />
                <ToolsItemComponent
                    title={'提现管理'}
                    source={require('../res/img/my/tixian_mana.png')}
                    info={'有赏金、来提现'}
                    onPress={() => {
                        MenuClick('WithDrawPage');
                    }}

                />
            </ScrollView>

            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/updateOrder.png'), '刷新购买', '实时刷新', () => {
                MenuClick('UserUpdateOrderPage');
            })}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/bill.png'), '帐单详细', '支出、收入', () => {
                MenuClick('UserBillListPage');
                NavigationUtils.goPage({}, '');
            }, billIsNewMsg)}


            {ViewUtil.getMenuLine()}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/guanzhu2.png'), '我的关注', '关注列表', () => {
                MenuClick('MyAttentionList', {user_id: this.props.userinfo.userid, isMy: true});
                // NavigationUtils.goPage();
            })}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/favorite2.png'), '我的收藏', '收藏精品任务', () => {
                MenuClick('MyFavoritePage');
            })}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/viewHistory.png'), '浏览历史', '浏览历史', () => {
                MenuClick('MyViewHistoryPage');
            })}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/pingbi3.png'), '屏蔽用户', '屏蔽用户列表', () => {
                MenuClick('MyShieldPage');
            })}
            {ViewUtil.getMenuLine()}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/yaoqing1.png'), '邀请好友', '好友邀请得奖励', () => {
                MenuClick('FriendPromotionPage');
            })}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/yaoqingipt.png'), '输入邀请码', '输入邀请码', () => {
                MenuClick('InvitationCodePage');
            })}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/feedback.png'), '意见反馈', '我们需要您的意见', () => {
                MenuClick('UserFeedbackPage');
            })}
            {ViewUtil.getMenuLine()}
            <View style={{paddingVertical: 20, paddingBottom: 30, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: hp(1.8), color: 'rgba(0,0,0,0.5)'}}>工作时间:9-30-18:30</Text>
            </View>


        </View>;
    }
}

const mapStateToProps_ = state => ({
    userinfo: state.userinfo,
    friend: state.friend,
});
const mapDispatchToProps_ = dispatch => ({});


class ToolsItemComponent extends PureComponent {
    static defaultProps = {
        title: '发布管理',
        info: '提升简历活跃',
        svgXmlData: my_fabu,
        source: require('../res/img/my/fabu_mana.png'),
        isOtherMsg: false,
    };

    render() {
        const {title, info, source, isOtherMsg} = this.props;

        return <TouchableOpacity
            onPress={this.props.onPress}
            activeOpacity={0.6}
            style={{
                paddingVertical: hp(1.6),
                borderRadius: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: wp(3),
                shadowColor: '#e8e8e8',
                shadowRadius: 5,
                shadowOpacity: 3,
                shadowOffset: {w: 1, h: 1},
                elevation: 3,//安卓的阴影
                backgroundColor: 'white',
                marginHorizontal: wp(1),
                marginVertical: hp(1.5),
            }}>
            <View>
                <Text style={{fontSize: hp(2.3), color: 'black'}}>{title}</Text>
                <Text style={{fontSize: hp(1.65), color: 'black', marginTop: 5, opacity: 0.7}}>{info}</Text>
            </View>
            <FastImage source={source}
                       style={{width: wp(8.7), height: wp(8.7), borderRadius: 12, marginLeft: wp(1.5)}}/>
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
            <Text style={{color: 'white', fontSize: hp(2.2), fontWeight:'500'}}>{value}</Text>
            <Text style={{color: 'white', fontSize: hp(1.8), opacity: 0.8, marginTop: 5}}>{title}</Text>
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
        const {userinfo} = this.props;
        const opacity = Animated.interpolate(this.props.scrollY, {
            inputRange: [0, 30, 120],
            outputRange: [1, 0.1, 0.1],
            extrapolate: 'clamp',
        });
        return <ImageBackground
            resizeMode={'stretch'}
            source={require('../res/img/my/my_background.png')}
            style={{backgroundColor: bottomTheme}}>
            <View style={{marginTop: hp(22), height: 0}}/>
            <Animated.View
                style={{height: hp(22), opacity, position: 'absolute', top: 0, width}}>
                {/*头像*/}
                <View style={{justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={() => {
                            if (userinfo.login) {
                                NavigationUtils.goPage({userid: userinfo.userid}, 'ShopInfoPage');
                            } else {
                                NavigationUtils.goPage({}, 'LoginPage');
                            }


                        }}
                        style={{marginTop: hp(7), flexDirection: 'row', alignItems: 'center'}}>

                        <SvgUri width={hp(1.9)} height={hp(1.9)} style={{marginRight: 5}} fill={'white'} svgXmlData={shop}/>
                        <Text style={{fontSize: hp(2.05), color: 'white'}}>我的店铺 > </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{marginTop: hp(2)}}
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
                            }}>
                                <ActivityIndicator size="small" color="white"/>
                            </View>
                            : <FastImagePro
                                style={[styles.imgStyle]}
                                source={userinfo.login ? {uri: userinfo.avatar_url} : require('../res/img/no_login.png')}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                        }
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
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                }}>
                    {this.genDataInfo(userinfo.login ? userinfo.task_currency : 0, '任务币')}
                    {this.genDataInfo(userinfo.login ? userinfo.offer_reward_dividend : 0, '悬赏收入')}
                    {this.genDataInfo(userinfo.login ? userinfo.share_dividend : 0, '分享收入')}

                    {this.genDataInfo(userinfo.login ? userinfo.tota_withdrawal : 0, '提现总额')}

                </View>
            </Animated.View>
            <PickerImage showMorePhotos={true} cropping={true} includeBase64={true} select={this._avatarSelect}
                         popTitle={'选取头像'}
                         ref={ref => this.pickerImage = ref}/>
        </ImageBackground>;
    }

    _avatarSelect = (image) => {
        const {userinfo, onUploadAvatar} = this.props;//我的用户信息

        const token = userinfo.token;
        let mime = image.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const path = `file://${image.path}`;
        onUploadAvatar(token, mime, path, () => {

        });
    };
}

const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        width: hp(8),
        height: hp(8),
        borderRadius: hp(8) / 2,
    },
});
