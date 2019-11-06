import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
import ding from '../res/svg/ding.svg';
import tuijian from '../res/svg/tuijian.svg';
import SvgUri from 'react-native-svg-uri';

const topBottomVal = 15;

class TaskSumComponent extends Component {

    // shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    //     if (this.state.value !== nextState.value) {
    //         return true;
    //     }
    //     return false;
    // }

    static defaultProps = {
        titleFontSize:16,
        marginHorizontal:10

    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    render() {
        const {titleFontSize,marginHorizontal} = this.props;

        return <TouchableOpacity
            activeOpacity={0.6}
            style={{
            flex: 1,
            flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            marginHorizontal: marginHorizontal,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#e8e8e8',
            // paddingBottomW
        }}>
            <FastImage
                style={[styles.imgStyle]}
                source={{uri: `http://www.embeddedlinux.org.cn/uploads/allimg/180122/2222032V5-0.jpg`}}
                resizeMode={FastImage.stretch}
            />
            {/*左上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                left: 60,
                flexDirection:'row',
            }}>
                <Text style={{
                    fontSize: titleFontSize,
                    color: 'black',
                }}>0元购 + 现金 = 30元</Text>
                <SvgUri  width={19} height={19} style={{marginLeft:8}}  svgXmlData={tuijian}/>
                <SvgUri  width={18} height={18} style={{marginLeft:8,marginTop:1}}  svgXmlData={ding}/>
            </View>
            {/*左下*/}
            <View style={{
                position: 'absolute',
                bottom: topBottomVal,
                left: 60,
                flexDirection: 'row',
            }}>
                <LabelBigComponent title={'高价'}/>
                <LabelBigComponent title={'京东支付1分'}/>
            </View>
            {/*右上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                right: 0,
            }}>
                <Text style={{
                    fontSize: titleFontSize,
                    color: 'red',
                }}>+3.6元</Text>
            </View>
            {/*右下*/}
            <View style={{
                position: 'absolute',
                bottom: topBottomVal,
                right: 0,
            }}>
                <Text style={{
                    fontSize: 12,
                    // color:''
                    opacity: 0.5,
                    fontWeight: '100',
                }}>116人已完成|剩余数90</Text>
            </View>
        </TouchableOpacity>;


    }


}

// class
export default TaskSumComponent;
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
