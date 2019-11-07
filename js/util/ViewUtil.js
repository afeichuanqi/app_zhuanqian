import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Dimensions, Platform} from 'react-native';

import SvgUri from 'react-native-svg-uri';
import goback from '../res/svg/goback.svg';
import shop from '../res/svg/shop.svg';
import message_more from '../res/svg/message_more.svg';
import menu_right from '../res/svg/menu_right.svg';

export default class ViewUtil {
    static getTopColumn(goBackClick, title, rightSvg, ColumnBgcColor = 'white', fontColor = 'black', fontSize = 14) {
        return (
            <View style={{
                flexDirection: 'row', paddingHorizontal: 10, height: 45, alignItems: 'center',
                justifyContent: 'space-between', backgroundColor: ColumnBgcColor, width: Dimensions.get('window').width,
            }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={goBackClick}
                    style={{justifyContent: 'center'}}>
                    <SvgUri width={24} height={24} fill={fontColor} svgXmlData={goback}/>


                </TouchableOpacity>
                <View>
                    <Text style={{color: fontColor, fontSize}}>{title}</Text>
                </View>
                {rightSvg ? <TouchableOpacity
                    activeOpacity={0.6}
                    style={{justifyContent: 'center'}}>
                    <SvgUri width={24} height={24} fill={fontColor} svgXmlData={message_more}/>


                </TouchableOpacity> : <View/>}

            </View>
        );
    }

    /**
     * 获取设置页的Item
     * @param menuSvg 菜单svg
     * @param title 标题
     * @param menuinfo 菜单说明
     */
    static getSettingItem(menuSvg, title, menuinfo) {
        return (
            <View style={styles.setting_item_container}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
                    <SvgUri width={20} height={20} fill={'rgba(0,0,0,0.9)'} svgXmlData={menuSvg}/>
                    <Text style={{marginLeft: 10, fontSize: 15, opacity: 1, color: 'black'}}>{title}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
                    <Text style={{marginLeft: 10, fontSize: 12, opacity: 0.4, color: 'black'}}>{menuinfo}</Text>
                    <SvgUri width={10} style={{marginLeft: 5}} height={10} svgXmlData={menu_right}/>
                </View>
            </View>
        );
    }

    static getMenuLine() {
        return <View style={{marginVertical:10}}>
            <View style={{
                height: 0.5,
                opacity: 0.3,
                backgroundColor: 'darkgray',
            }}/>
        </View>;
    }

    // static

}
const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
});
