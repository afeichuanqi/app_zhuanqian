/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {
    ActivityIndicator, ImageBackground, Platform, RefreshControl,
    Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import {bottomTheme} from '../appSet';
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
import ChatSocket from '../util/ChatSocket';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const {width, height} = Dimensions.get('window');
const MenuClick = (menuName, params = {}) => {
    NavigationUtils.goPage(params, menuName);
};
let jumpTo = null;

class MyPage extends PureComponent {
    constructor(props) {
        super(props);
        jumpTo = this.props.jumpTo;
    }

    state = {isLoading: false};

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    render() {
        let statusBar = {
        };
        const titleTop = Animated.interpolate(this.scrollY, {
            inputRange: [-800, 0, 100],
            outputRange: [850, hp(9), 18],
            extrapolate: 'clamp',
        });
        const titleFontSize = Animated.interpolate(this.scrollY, {
            inputRange: [0, 100],
            outputRange: [24, 17],
            extrapolate: 'clamp',
        });
        const translateY = Animated.interpolate(this.scrollY, {
            inputRange: [-height, 0, height],
            outputRange: [height, 0, -height],
            extrapolate: 'clamp',
        });
        // const opacity = Animated.interpolate(this.scrollY, {
        //     inputRange: [0,  150],
        //     outputRange: [0, 1],
        //     extrapolate: 'clamp',
        // });
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
                    style={{
                        flex: 1,
                        backgroundColor:'#f5f5f5',
                    }}
                >
                    <View style={{
                        paddingHorizontal: 10,
                        backgroundColor: bottomTheme,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            opacity: 1,
                            height: 50,
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    ChatSocket.quitAccount();
                                    this.props.onClearUserinfoAll();
                                    this.props.onSetNoticeMsgIsAllRead();
                                }}
                            >
                                <Text style={{color: 'white'}}>注销登录</Text>
                            </TouchableOpacity>

                        </View>

                    </View>


                    <Animated.View
                        style={{
                            backgroundColor: bottomTheme,
                            height,
                            width,
                            position: 'absolute',
                            top: (-height) + 50,
                            transform: [{translateY: translateY}],
                            zIndex: -1,
                        }}>
                    </Animated.View>
                    <View
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
                    </View>
                    <View style={{
                        position: 'absolute',
                        right: 0,
                        left: 0,
                        bottom: 50,
                        zIndex: 100,
                    }}>
                        <TouchableOpacity

                            onPress={() => {

                                ChatSocket.quitAccount();
                                this.props.onClearUserinfoAll();
                                this.props.onSetNoticeMsgIsAllRead();
                                // NavigationUtils.goBack(this.props.navigation);
                            }}
                            style={{
                                // borderWidth: 0.3,
                                // borderColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: wp(40),
                                height: wp(14),
                                borderRadius: wp(10),
                                alignSelf: 'center',
                                backgroundColor: 'white',

                            }}>
                            <Text style={{color: bottomTheme, fontSize: hp(2.4)}}>退出登录</Text>

                        </TouchableOpacity>
                    </View>
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
    onClearUserinfoAll: () => dispatch(actions.onClearUserinfoAll()),
    onSetNoticeMsgIsAllRead: () => dispatch(actions.onSetNoticeMsgIsAllRead()),
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

        return <View style={{}}>
            <View
                style={{marginTop: 35}}
            />
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/feedback.png'), '意见反馈', '我们需要您的意见', () => {
                MenuClick('UserFeedbackPage');
            })}
            {ViewUtil.getSettingItem(require('../res/img/myMenuIcon/aboutme.png'), '关于我们', '关于我们', () => {
                MenuClick('AountMePage');
            })}
        </View>;
    }
}

const mapStateToProps_ = state => ({
    userinfo: state.userinfo,
    friend: state.friend,
});
const mapDispatchToProps_ = dispatch => ({});



const BottomInfoColumnRedux = connect(mapStateToProps_, mapDispatchToProps_)(BottomInfoColumn);


class TopInfoColumn extends PureComponent {
    genDataInfo = (value, title) => {
        return <View style={{
            width: width / 4,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: hp(1),
        }}>
            <Text style={{color: 'white', fontSize: hp(2.1), fontWeight: '500'}}>{value}</Text>
            <Text style={{color: 'white', fontSize: hp(1.7), opacity: 0.8, marginTop: 5}}>{title}</Text>
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
            imageStyle={{
                // borderBottomLeftRadius:10,
                // borderBottomRightRadius:,
            }}
            resizeMode={'stretch'}
            source={require('../res/img/my/my_background.png')}
            style={{backgroundColor: bottomTheme}}>
            <View style={{marginTop: hp(22), height: 0}}/>
            <Animated.View
                style={{height: hp(22), opacity, position: 'absolute', top: 0, width}}>
                {/*头像*/}
                <View style={{
                    justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row',
                    paddingLeft: 15,
                }}>
                    <TouchableOpacity
                        onPress={() => {

                            if(!userinfo.token || userinfo.token.length===0){
                                NavigationUtils.goPage({},'LoginPage')
                            }else{
                                jumpTo('hall');
                            }
                        }}
                        style={{marginTop: hp(7), flexDirection: 'row', alignItems: 'center'}}>


                        <Text style={{fontSize: hp(1.8), color: 'white'}}>马上逛逛 > </Text>
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
                    position: 'absolute',
                    bottom: -20,
                    width,

                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: wp(90),
                        height: hp(10),
                        borderRadius: 10,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={()=>{
                                if(!this.props.userinfo.token || this.props.userinfo.token.length===0){
                                    NavigationUtils.goPage({}, 'LoginPage');
                                }else{
                                    MenuClick('TaskOrdersMana');
                                }

                            }}
                            style={{alignItems: 'center'}}>
                            <Image
                                style={{width: hp(3.5), height: hp(3.5)}}
                                source={require('../res/img/myPage/signup.png')}
                            />
                            <Text style={{marginTop: hp(1.2)}}>已报名</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                if(!this.props.userinfo.token || this.props.userinfo.token.length===0){
                                    NavigationUtils.goPage({}, 'LoginPage');
                                }else{
                                    NavigationUtils.goPage({}, 'AccountSetting');
                                }
                            }}
                            style={{alignItems: 'center'}}>
                            <Image
                                style={{width: hp(3.5), height: hp(3.5)}}
                                source={require('../res/img/myPage/my.png')}
                            />
                            <Text style={{marginTop: hp(1.2)}}>我的资料</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                if(!this.props.userinfo.token || this.props.userinfo.token.length===0){
                                    NavigationUtils.goPage({}, 'LoginPage');
                                }else{
                                    MenuClick('MyFavoritePage');
                                }

                            }}
                            style={{alignItems: 'center'}}>
                            <Image
                                style={{width: hp(3.5), height: hp(3.5)}}
                                source={require('../res/img/myPage/favorite.png')}
                            />
                            <Text style={{marginTop: hp(1.2)}}>我的收藏</Text>
                        </TouchableOpacity>

                    </View>

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
