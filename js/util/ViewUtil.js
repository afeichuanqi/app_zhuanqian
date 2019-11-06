import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Dimensions, Platform} from 'react-native'

import SvgUri from "react-native-svg-uri";
import {bottomTheme} from '../appSet';
import goback from '../res/svg/goback.svg';

export default class ViewUtil {
    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param text 显示的文本
     * @param color 图标着色
     * @param Icons react-native-vector-icons组件
     * @param icon 左侧图标
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getSettingItem(callBack, text, color, Icons, icon, expandableIco, leftComponent, rightPrompt, rightComponent) {
        return (
            <View style={styles.setting_item_container}>
                <Ripple rippleDuration={400} rippleColor={theme} onPress={callBack}>
                    <View

                        style={{
                            width: Dimensions.get('window').width,
                            height: 50,
                            justifyContent: 'center',
                            padding: 10,
                        }}
                    >
                        <View style={{alignItems: 'center', flexDirection: 'row'}}>
                            <View style={{width: 35}}>
                                {Icons && icon ?
                                    <Icons
                                        name={icon}
                                        size={23}
                                        style={{color: color, marginRight: 10}}
                                    /> :
                                    <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>
                                }
                            </View>
                            <Text style={[Platform.OS === 'ios' && {fontSize: 15,color:'rgba(0,0,0,0.8)'}]}>{text}</Text>
                            {leftComponent ? leftComponent : null}
                        </View>


                    </View>
                </Ripple>
                <View style={{position: 'absolute', top: 0, right: 10, height: 50, justifyContent: 'center'}}>
                    {rightComponent ? rightComponent : <View style={{flexDirection: 'row'}}>
                        {rightPrompt ? rightPrompt : null}
                        <Ionicons
                            name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                            size={16}
                            style={{
                                marginRight: 10,
                                alignSelf: 'center',
                                color: color || 'black',
                                marginLeft: 10,
                            }}/>

                    </View>
                    }
                </View>
            </View>
        )
    }

    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param menu @MORE_MENU
     * @param color 图标着色
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getMenuItem(callBack, menu, color, expandableIco, leftComponent, rightPrompt, rightComponent) {
        return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco, leftComponent, rightPrompt, rightComponent)
    }

    /**
     * 获取左侧返回按钮
     * @param callBack
     * @returns {XML}
     */
    static getLeftBackButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingHorizontal: 12, zIndex: 2}}
            onPress={callBack}>
            <SvgUri width={24} height={24}  svgXmlData={goback}/>
        </TouchableOpacity>
    }

    /**
     * 获取左侧返回按钮
     * @param callBack
     * @returns {XML}
     */
    static getLeftBackButtonForHome(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}>
            <FontAwesome
                name={'home'}
                size={26}
                style={{color: 'white'}}/>
        </TouchableOpacity>
    }

    /**
     * 获取右侧设置按钮
     * @param callBack
     * @returns {XML}
     */
    static getUpdateBtn(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}>
            <Feather
                name={'refresh-ccw'}
                size={20}
                style={{color: 'white'}}/>
        </TouchableOpacity>
    }

    /**
     * 获取右侧文字按钮
     * @param title
     * @param callBack
     * @returns {XML}
     */
    static getRightButton(title, callBack) {
        return <TouchableOpacity
            style={{alignItems: 'center',}}
            onPress={callBack}>
            <Text style={{fontSize: 18, color: '#FFFFFF', marginRight: 10}}>{title}</Text>
        </TouchableOpacity>
    }

    /**
     * 获取分享按钮
     * @param callBack
     * @returns {XML}
     */
    static getShareButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Ionicons
                name={'md-share'}
                size={20}
                style={{opacity: 0.9, marginRight: 10, color: 'white'}}/>
        </TouchableOpacity>
    }

    /**
     * 获取观看历史按钮
     * @param callBack
     * @returns {XML}
     */
    static getWacthHisoryButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
            style={{marginHorizontal: 8, marginLeft: 0}}
        >
            <SvgUri width="23" height="23" fill={'rgba(255,255,255,0.8)'} svgXmlData={watchHistory}/>
        </TouchableOpacity>
    }

    /**
     * 获取下载历史按钮
     * @param callBack
     * @returns {XML}
     */
    static getDownLoadButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
            style={{marginHorizontal: 8, marginTop: 1}}
        >
            <SvgUri width="24" height="24" fill={'rgba(255,255,255,0.8)'} svgXmlData={download1}/>
        </TouchableOpacity>
    }

    /**
     * 获取搜索按钮
     * @param callBack
     * @returns {XML}
     */
    static getSearchButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Feather
                name={'search'}
                size={20}
                style={{opacity: 0.9, marginRight: 10, color: 'white'}}/>
        </TouchableOpacity>
    }

    /**
     * 获取订单按钮
     * @param callBack
     * @returns {XML}
     */
    static getOrderButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Octicons
                name={'list-unordered'}
                size={20}
                style={{opacity: 0.9, marginRight: 10, color: 'white'}}/>
        </TouchableOpacity>
    }

    /**
     * 获取主页按钮
     * @param callBack
     * @returns {XML}
     */
    static getHomeButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingHorizontal: 12, zIndex: 2}}
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Ionicons
                name={'md-home'}
                size={22}
                style={{opacity: 0.9, marginRight: 10, color: 'white'}}/>
        </TouchableOpacity>
    }
}
const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
});
