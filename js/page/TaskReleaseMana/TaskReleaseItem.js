import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Dimensions, Image} from 'react-native';
import LabelBigComponent from '../../common/LabelBigComponent';
import ViewUtil from '../../util/ViewUtil';
import task_icon from '../../res/svg/task_icon.svg';
import SvgUri from 'react-native-svg-uri';
import {bottomTheme} from '../../appSet';
import NavigationUtils from '../../navigator/NavigationUtils';

const {width, height} = Dimensions.get('window');
export default class TaskReleaseItem extends PureComponent {
    render() {
        const titleFontSize = 14;
        const {item} = this.props;
        return <View style={{}}>
            <TouchableOpacity
                onPress={() => {
                    console.log(item);
                    NavigationUtils.goPage({taskid: item.id}, 'MyOrderManaPage');
                }}
                activeOpacity={0.6}
                style={{
                    // flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingTop: 18,
                    // paddingBottom: 25,

                    // transform: [{scale}],
                    height: 70,
                    backgroundColor: 'white',
                }}
                // onPressIn={this._onPressIn}
                // onPressOut={this._onPressOut}
            >
                <View style={{
                    height: 40,
                    width: 38,
                    backgroundColor: bottomTheme,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                }}>
                    <SvgUri width={25} height={25} fill={'white'} svgXmlData={task_icon}/>
                </View>
                {/*左上*/}
                <View style={{
                    position: 'absolute',
                    top: 20,
                    left: 55,
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontSize: titleFontSize,
                        color: 'black',
                    }}>{`${item.id} - ${item.task_title}`}</Text>
                    {/*<SvgUri width={19} height={19} style={{marginLeft: 3}} svgXmlData={tuijian}/>*/}
                    {/*<SvgUri width={18} height={18} style={{marginLeft: 3, marginTop: 1}} svgXmlData={ding}/>*/}
                </View>
                {/*左下*/}
                <View style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 55,
                    flexDirection: 'row',
                }}>
                    <LabelBigComponent paddingVertical={1} fontSize={10} title={item.task_name}/>
                </View>
                {/*右上*/}
                <View style={{
                    position: 'absolute',
                    top: 20,
                    right: 10,
                }}>
                    <Text style={{
                        fontSize: 15,
                        color: 'red',
                    }}>+{item.reward_price}元</Text>
                </View>
                {/*右下*/}
                <View style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontSize: 11,
                        // color:''
                        opacity: 0.5,
                        // fontWeight: '100',
                    }}>进行中:{parseInt(item.task_sign_up_num) - parseInt(item.task_pass_num)}</Text>
                    <View style={{height: 10, width: 1, marginHorizontal: 5, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                    <Text style={{
                        fontSize: 11,
                        // color:''
                        opacity: 0.5,
                        // fontWeight: '100',
                    }}>剩余:{(parseInt(item.reward_num) - parseInt(item.task_sign_up_num)).toString()}</Text>
                </View>
            </TouchableOpacity>
            <View style={{
                height: 25,
                paddingVertical: 6,
                paddingHorizontal: 11,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.5)',
                flexDirection: 'row',
            }}>
                {ViewUtil.getReviewIco(parseInt(item.task_is_send_num) - parseInt(item.task_pass_num) - parseInt(item.task_noPass_num), this._reViewClick)}
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getzhidingIco()}
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getrecommendedIco()}
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getUpdateIco()}
            </View>
            {/*{ViewUtil.getLine()}*/}
            {/**/}
        </View>;
    }

    _reViewClick = () => {
        const {item} = this.props;
        this.props.onPress(item);
    };
}
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        // backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 38,
        height: 40,
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
