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
            inputRange: [-200, 0],
            outputRange: [250, 0],
            extrapolate: 'clamp',
        });
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        return (
            <View
                style={{flex: 1}}
            >
                {navigationBar}
                {/*顶部导航栏*/}
                <View>
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

                        >
                            <SvgUri width={23} height={23} fill={'white'} svgXmlData={setting}/>
                        </TouchableOpacity>
                    </View>


                    {/*名字*/}
                    <AnimatedTouchableOpacity
                        activeOpacity={1}
                        onPress={this._nameClick}
                        style={{
                            position: 'absolute',
                            top: titleTop,
                            left: 10,
                            zIndex: 1,
                            elevation: 0.1,

                        }}>
                        <Animated.Text
                            style={{fontSize: titleFontSize, color: 'white', fontWeight: 'bold'}}>
                            点击登录
                        </Animated.Text>
                    </AnimatedTouchableOpacity>
                    <Animated.View
                        // ref={ref => this.zhedangRef = ref}
                        style={{
                            backgroundColor: bottomTheme,
                            height: RefreshHeight,
                            width,
                            position: 'absolute',
                            top: 50,
                            // zIndex:1 ,
                        }}>
                    </Animated.View>
                    <AnimatedScrollView
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: {y: this.scrollY},
                                },
                            },
                        ])}
                        scrollEventThrottle={1}
                    >
                        <TopInfoColumn scrollY={this.scrollY}/>
                        <BottomInfoColumn/>
                    </AnimatedScrollView>

                </View>

            </View>
        );
    }

    _nameClick = () => {
        NavigationUtils.goPage({}, 'LoginPage');
    };
    scrollY = new Animated.Value(0);
}

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
        return <View style={{marginTop: 10}}>
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
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}
            {ViewUtil.getSettingItem(shop, '附件管理', '已经上传')}


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

    render() {
        const translateY = Animated.interpolate(this.props.scrollY, {
            inputRange: [0, 120],
            outputRange: [0, 70],
            extrapolate: 'clamp',
        });
        const opacity = Animated.interpolate(this.props.scrollY, {
            inputRange: [0, 120],
            outputRange: [1, 0.1],
            extrapolate: 'clamp',
        });
        return <View style={{backgroundColor: bottomTheme}}>
            <Animated.View
                style={{height: 130, opacity, transform: [{translateY: translateY}]}}>
                {/*头像*/}
                <View style={{justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row'}}>
                    <TouchableOpacity style={{marginTop: 40, flexDirection: 'row', alignItems: 'center'}}>

                        <SvgUri width={14} height={14} style={{marginRight: 5}} fill={'white'} svgXmlData={shop}/>
                        <Text style={{fontSize: 12, color: 'white'}}>我的店铺 > </Text>
                    </TouchableOpacity>

                    <FastImage
                        style={[styles.imgStyle]}
                        source={require('../res/img/no_login.png')}
                        resizeMode={FastImage.stretch}
                    />
                </View>
                {/*基本信息栏目*/}
                <View style={{
                    // marginTop: 50,
                    flexDirection: 'row',
                    justifyContent: 'space-around',

                }}>
                    {this.genDataInfo('255', '任务币')}
                    {this.genDataInfo('0', '收入分红')}
                    {this.genDataInfo('0', '提现总额')}
                    {this.genDataInfo('0', '保证金')}
                </View>
            </Animated.View>
        </View>;
    }
}

export default MyPage;
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
