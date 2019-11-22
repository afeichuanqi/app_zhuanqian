import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Text,Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
// import Animated, {Easing} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
// const {timing} = Animated;

const topBottomVal = 17;

class TaskSumComponent extends PureComponent {

    // shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    //     if (this.state.value !== nextState.value) {
    //         return true;
    //     }
    //     return false;
    // }

    static defaultProps = {
        titleFontSize: 16,
        marginHorizontal: 10,

    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    animations = {
        scale: new Animated.Value(1),
    };
    _onPressIn = () => {
        //隐藏box
        this._anim = Animated.timing(this.animations.scale, {
            duration: 200,
            toValue: 0,
            // easing: Easing.inOut(Easing.ease),
        }).start();
    };
    _onPressOut = () => {
        //隐藏box
        this._anim = Animated.timing(this.animations.scale, {
            duration: 200,
            toValue: 1,
            // easing: Easing.inOut(Easing.ease),
        }).start();
    };

    render() {
        const scale = this.animations.scale.interpolate( {
            inputRange: [0, 1],
            outputRange: [0.95, 1],
            extrapolate: 'clamp',
        });
        const {titleFontSize, marginHorizontal} = this.props;

        return <AnimatedTouchableOpacity
            activeOpacity={1}
            style={{
                flex: 1,
                flexDirection: 'row',
                marginHorizontal: marginHorizontal,
                paddingTop: 15,
                paddingBottom:25,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                transform: [{scale}],
                height:90
            }}
            onPressIn={this._onPressIn}
            onPressOut={this._onPressOut}
        >
            <FastImage
                style={[styles.imgStyle]}
                source={{uri: `http://www.embeddedlinux.org.cn/uploads/allimg/180122/2222032V5-0.jpg`}}
                resizeMode={FastImage.resizeMode.stretch}
            />
            {/*左上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                left: 60,
                flexDirection: 'row',
            }}>
                <Text style={{
                    fontSize: titleFontSize,
                    color: 'black',
                }}>0元购+现金 =30元</Text>
                {/*<SvgUri width={19} height={19} style={{marginLeft: 3}} svgXmlData={tuijian}/>*/}
                {/*<SvgUri width={18} height={18} style={{marginLeft: 3, marginTop: 1}} svgXmlData={ding}/>*/}
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
                    // fontWeight: '100',
                }}>116人已完成|剩余数90</Text>
            </View>
        </AnimatedTouchableOpacity>;


    }


}
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
