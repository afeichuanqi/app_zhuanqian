import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Dimensions, Platform, Image} from 'react-native';

import SvgUri from 'react-native-svg-uri';
import goback from '../res/svg/goback.svg';
import message_more from '../res/svg/message_more.svg';
import menu_right from '../res/svg/menu_right.svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');
export default class ViewUtil {
    static getTopColumn = (goBackClick, title, rightSvg, ColumnBgcColor = 'white', fontColor = 'black', fontSize = 14, rightClick, isShowRightSvg = true, isShowRightText = false, rightText = '', rightTextColor = 'black') => {
        return (
            <View style={{
                flexDirection: 'row', paddingHorizontal: 10, height: 45, alignItems: 'center',
                justifyContent: 'space-between', backgroundColor: ColumnBgcColor,


            }}>

                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={goBackClick}
                    style={{alignItems: 'flex-start', width: 60}}
                >
                    <SvgUri width={24} height={24} fill={fontColor} svgXmlData={goback}/>
                </TouchableOpacity>
                <View style={{justifyContent: 'center', alignItems: 'center', width: width - 140}}>
                    <Text style={{color: fontColor, fontSize}}>{title}</Text>
                </View>
                <TouchableOpacity
                    onPress={rightClick}
                    activeOpacity={0.6}
                    style={{alignItems: 'flex-end', width: 60}}>
                    {isShowRightSvg &&
                    <SvgUri width={24} height={24} fill={fontColor} svgXmlData={rightSvg || message_more}/>}
                    {isShowRightText &&
                    <Text style={{marginTop: 5, color: rightTextColor}}>{rightText}</Text>}


                </TouchableOpacity>


            </View>
        );
    };

    /**
     * 获取设置页的Item
     * @param menuSource 菜单svg
     * @param title 标题
     * @param menuinfo 菜单说明
     * @param isOtherMsg 菜单说明
     * @param click
     */
    static getSettingItem = (menuSource, title, menuinfo, click, isOtherMsg = false) => {
        return (
            <TouchableOpacity
                onPress={click}
                style={{
                    backgroundColor: 'white',
                    height: hp(7),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',

                }}>

                <View style={{flexDirection: 'row', alignItems: 'center', height: hp(6), paddingLeft: wp(5)}}>
                    <Image
                        resizeMode={'stretch'}
                        source={menuSource}
                        style={{width: hp(2.4), height: hp(2.4)}}
                    />
                    <Text style={{marginLeft: wp(3.5), fontSize: hp(2.3), opacity: 1, color: 'black'}}>{title}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', height: hp(6), paddingRight: wp(2)}}>
                    <Text
                        style={{marginLeft: wp(2.5), fontSize: hp(1.8), opacity: 0.4, color: 'black'}}>{menuinfo}</Text>
                    <SvgUri width={wp(3)} style={{marginLeft: wp(1)}} height={wp(3)} svgXmlData={menu_right}/>
                </View>
                {isOtherMsg && <View style={{
                    position: 'absolute',
                    right: 10, top: 10, width: 5, height: 5, borderRadius: 8,
                    backgroundColor: 'red',
                }}/>}
            </TouchableOpacity>

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
    /**
     * 重新发布
     * @param reviewNum
     * @param click
     * @returns {*}
     */
    static getReReviewIco = (click) => {
        return <TouchableOpacity
            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: wp(3.5)}}>
            <Image
                style={{height: wp(3.3), width: wp(3.3)}}
                source={require('../res/img/taskReView/task_chongxinfabu.png')}
            />
            <Text style={{fontSize: hp(1.8), marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>重新发布</Text>

        </TouchableOpacity>;
    };
    /**
     * 重新发布
     * @param reviewNum
     * @param click
     * @returns {*}
     */
    static getReReviewIngIco = (click) => {
        return <View
            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: wp(3.5)}}>
            <Image
                style={{height: wp(3.3), width: wp(3.3)}}
                source={require('../res/img/taskReView/reviewing.png')}
            />
            <Text style={{fontSize: hp(1.8), marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>审核中</Text>

        </View>;
    };

    /**
     * 删除
     * @param reviewNum
     * @param click
     * @returns {*}
     */
    static getDeleteIco = (click) => {
        return <TouchableOpacity
            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: wp(3.5)}}>
            <Image
                style={{height: wp(3.3), width: wp(3.3)}}
                source={require('../res/img/taskReView/task_delete.png')}
            />
            <Text style={{fontSize: hp(1.8), marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>删除</Text>

        </TouchableOpacity>;
    };
    static getReviewIco = (reviewNum, click) => {
        return <TouchableOpacity
            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: wp(3.5)}}>
            <Image
                style={{height: wp(3.3), width: wp(3)}}
                source={require('../res/img/taskReView/review.png')}
            />
            <Text style={{fontSize: hp(1.8), marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>审核:{reviewNum}</Text>

        </TouchableOpacity>;
    };
    static getzhidingIco = (click) => {
        return <TouchableOpacity
            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: wp(3.5)}}>
            <Image
                style={{height: wp(3.3), width: wp(3)}}
                source={require('../res/img/taskReView/zhiding.png')}
            />
            <Text style={{fontSize: hp(1.8), marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>置顶</Text>

        </TouchableOpacity>;
    };
    static getrecommendedIco = (click) => {
        return <TouchableOpacity

            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: wp(3.5)}}>
            <Image
                style={{height: wp(3.3), width: wp(3.3)}}
                source={require('../res/img/taskReView/tuijian.png')}
            />
            <Text style={{fontSize: hp(1.8), marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>推荐</Text>

        </TouchableOpacity>;
    };
    static getUpdateIco = (click) => {
        return <TouchableOpacity
            onPress={click}
            style={{flexDirection: 'row', alignItems: 'center', height: wp(3.5)}}>

            <Image
                style={{height: wp(3.3), width: wp(3.3)}}
                source={require('../res/img/taskReView/update.png')}
            />
            <Text style={{fontSize: hp(1.8), marginLeft: 5, color: 'rgba(0,0,0,0.9)'}}>刷新</Text>

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

    },
});
