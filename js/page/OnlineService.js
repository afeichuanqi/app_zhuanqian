/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {StatusBar, Text, TouchableOpacity, View, Dimensions, Image, Clipboard} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';

import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import SvgUri from 'react-native-svg-uri';
import menu_right from '../res/svg/menu_right.svg';
import Toast from "react-native-root-toast";
const {width,height} = Dimensions.get('window')
class OnlineService extends PureComponent {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {
        CacheSize: 0,

    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this.backPress.componentDidMount();


    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }


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


        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '在线客服', null, theme, 'black', 16, null, false);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{
                    borderTopWidth: 0.3,
                    borderTopColor: 'rgba(0,0,0,0.1)',
                }}/>
                <View style={{flex: 1}}>

                    {this.getSettingMenu('QQ', () => {
                        Clipboard.setString('1412894');
                        Toast.show('已经复制到剪切板');
                    }, `1412894`)}
                    {this.getSettingMenu('微信', () => {
                        Clipboard.setString('qingfengkjkj');
                        Toast.show('已经复制到剪切板')
                    },'qingfengkjkj')}

                </View>
            </SafeAreaViewPlus>
        );
    }
    getSettingMenu = (MenuTitle, click, rightText = '', showSvg = true) => {
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={click}
            style={{
                height: 40,
                width,
                paddingHorizontal: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: hp(2),
            }}>
            <Text style={{fontSize: hp(2.2), color: 'rgba(0,0,0,0.8)', marginLeft:hp(1)}}>{MenuTitle}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
                <Text style={{
                    marginLeft: 10,
                    fontSize: hp(2),
                    opacity: 0.5,
                    color: rightText == '立即绑定' ? bottomTheme : 'black',
                }}>{rightText}</Text>
                {showSvg && <SvgUri width={10} style={{marginLeft: 5}} height={10} svgXmlData={menu_right}/>}

            </View>
        </TouchableOpacity>;
    };
}
export default OnlineService;
