/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import NavigationBar from '../common/NavigationBar';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList} from 'react-native';
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

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const {width, height} = Dimensions.get('window');
const MenuClick = (menuName) => {
    NavigationUtils.goPage({}, menuName);
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
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        const titleTop = Animated.interpolate(this.scrollY, {
            inputRange: [-200, 0, 100],
            outputRange: [250, 55, 18],
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
        const {userinfo, onUploadAvatar} = this.props;
        console.log(userinfo.upload_avatar_loading,"userinfo.upload_avatar_loading");
        // console.log(userinfo);
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
                        refreshControl={null}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: {y: this.scrollY},
                                },
                            },
                        ])}
                        scrollEventThrottle={1}
                    >
                        {/*<View style={{backgroundColor: 'transparent', height: 50}}>*/}

                        {/*</View>*/}
                        <TopInfoColumn onUploadAvatar={onUploadAvatar} userinfo={userinfo} scrollY={this.scrollY}/>
                        <BottomInfoColumn/>
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
});
const MyPageRedux = connect(mapStateToProps, mapDispatchToProps)(MyPage);
export default MyPageRedux;

class ToolsItemComponent extends PureComponent {
    static defaultProps = {
        title: '发布管理',
        info: '提升简历活跃',
        svgXmlData: my_fabu,
    };

    render() {
        const {title, info, svgXmlData} = this.props;

        return <TouchableOpacity
            onPress={this.props.onPress}
            activeOpacity={0.6}
            style={{
                width: 130, height: 50,
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
                // borderWidth:0.5,
                // borderColor:'rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                marginRight: 5,
                marginBottom: 10,
                marginLeft: 5,
                marginTop: 10,
            }}>
            <View>
                <Text style={{fontWeight: 'bold', fontSize: 14}}>{title}</Text>
                <Text style={{fontSize: 10, color: 'black', marginTop: 5, opacity: 0.7}}>{info}</Text>
            </View>
            <SvgUri width={28} height={28} svgXmlData={svgXmlData}/>

        </TouchableOpacity>;
    }
}


class BottomInfoColumn extends PureComponent {
    render() {
        return <View style={{}}>
            <View style={{paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white'}}>
                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
                    我的工具
                </Text>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{paddingLeft: 5, backgroundColor: '#fafafa'}}
            >
                <ToolsItemComponent onPress={() => {
                    MenuClick('TaskReleaseMana');
                }}/>
                <ToolsItemComponent/>
                <ToolsItemComponent/>
                <ToolsItemComponent/>
            </ScrollView>

            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getMenuLine()}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}
            {/*{ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}*/}


        </View>;
    }
}

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
        console.log(userinfo.avatar_url);
        return <View style={{backgroundColor: bottomTheme}}>
            <View style={{marginTop: 130, height: 0}}/>
            <Animated.View
                style={{height: 130, opacity, position: 'absolute', top: 0}}>
                {/*头像*/}
                <View style={{justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row'}}>
                    <TouchableOpacity style={{marginTop: 40, flexDirection: 'row', alignItems: 'center'}}>

                        <SvgUri width={14} height={14} style={{marginRight: 5}} fill={'white'} svgXmlData={shop}/>
                        <Text style={{fontSize: 12, color: 'white'}}>我的店铺 > </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this._avatarClick}
                    >

                        <FastImage
                            style={[styles.imgStyle]}
                            source={userinfo.login ? userinfo.upload_avatar_loading ? require('../res/img/upload_avatar_loading_.png') : {uri: userinfo.avatar_url} : require('../res/img/no_login.png')}
                            resizeMode={FastImage.stretch}
                        />
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
            <PickerImage cropping={true} includeBase64={true} select={this._avatarSelect} popTitle={'选取头像'}
                         ref={ref => this.pickerImage = ref}/>
        </View>;
    }

    _avatarSelect = (image) => {
        const {userinfo} = this.props;
        const mime = image.mime;
        const base64Data = image.data;
        const imgData = {
            mime,
            data: base64Data,
        };
        // console.log(userinfo.token);
        this.props.onUploadAvatar(userinfo.token, imgData, (isTrue, data) => {
            if (!isTrue) {
                console.log(data.msg);
            }
        });
    };
}

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
