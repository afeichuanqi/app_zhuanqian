import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';

const topBottomVal = 17;

class TaskSumComponent extends Component {


    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.value !== nextState.value) {
            return true;
        }
        return false;
    }

    static defaultProps = {
        placeholder: '搜索任务ID',
        onFocus: () => {

        },
    };

    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    render() {
        return <TouchableOpacity
            activeOpacity={0.6}
            style={{
            flex: 1,
            flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            marginHorizontal: 10,
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
            }}>
                <Text style={{
                    fontSize: 16,
                    color: 'black',
                }}>0元够 + 现金 = 30元</Text>
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
                    fontSize: 16,
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
