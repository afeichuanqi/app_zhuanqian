import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Dimensions, Platform, Image} from 'react-native';

import SvgUri from 'react-native-svg-uri';
import goback from '../res/svg/goback.svg';
import message_more from '../res/svg/message_more.svg';
import menu_right from '../res/svg/menu_right.svg';

const {width, height} = Dimensions.get('window');
export default class ViewUtil {
    static getTopColumn = (goBackClick, title, rightSvg, ColumnBgcColor = 'white', fontColor = 'black', fontSize = 14, rightClick, isShowRightSvg = true) => {
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
                <TouchableOpacity
                    onPress={rightClick}
                    activeOpacity={0.6}
                    style={{justifyContent: 'center'}}>
                    {isShowRightSvg&&<SvgUri width={24} height={24} fill={fontColor} svgXmlData={rightSvg || message_more}/>}



                </TouchableOpacity>


            </View>
        );
    };

    /**
     * 获取设置页的Item
     * @param menuSvg 菜单svg
     * @param title 标题
     * @param menuinfo 菜单说明
     */
    static getSettingItem = (menuSvg, title, menuinfo) => {
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
    };

    static getMenuLine = () => {
        return <View style={{marginVertical: 10}}>
            <View style={{
                height: 0.5,
                opacity: 0.3,
                backgroundColor: 'darkgray',
            }}/>
        </View>;
    };

    // static
    static getSettingMenu = (MenuTitle, click, rightText = '', showSvg = true) => {
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

            }}>
            <Text style={{fontSize: 13, color: 'rgba(0,0,0,0.8)'}}>{MenuTitle}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
                <Text style={{marginLeft: 10, fontSize: 12, opacity: 0.5, color: 'black'}}>{rightText}</Text>
                {showSvg && <SvgUri width={10} style={{marginLeft: 5}} height={10} svgXmlData={menu_right}/>}

            </View>
        </TouchableOpacity>;
    };
    static getReviewIco = (reviewNum, click) => {
        return <TouchableOpacity
            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: 13}}>
            <Image
                style={{height: 13, width: 13}}
                source={require('../res/img/task_release_review.png')}
            />
            <Text style={{fontSize: 12, marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>审核:{reviewNum}</Text>

        </TouchableOpacity>;
    };
    static getzhidingIco = () => {
        return <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', height: 13}}>
            <Image
                style={{height: 13, width: 13}}
                source={require('../res/img/task_top.png')}
            />
            <Text style={{fontSize: 12, marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>置顶</Text>

        </TouchableOpacity>;
    };
    static getrecommendedIco = () => {
        return <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', height: 13}}>
            <Image
                style={{height: 13, width: 13}}
                source={require('../res/img/task_recommended.png')}
            />
            <Text style={{fontSize: 12, marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>推荐</Text>

        </TouchableOpacity>;
    };
    static getUpdateIco = () => {
        return <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', height: 13}}>
            <Image
                style={{height: 13, width: 13}}
                source={require('../res/img/task_update.png')}
            />
            <Text style={{fontSize: 12, marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>刷新</Text>

        </TouchableOpacity>;
    };
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
