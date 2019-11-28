import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
// import Animated, {Easing} from 'react-native-reanimated';

// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
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
        item: {
            avatarUrl: '',
            recommendIsExp: 1,
            topIsExp: 1,
            typeTitle: '注册',
            taskName: '微信注册',
            rewardPrice: 100,
            rewardNum: 100,
            taskSignUpNum: 5,
            taskPassNum: 2,
        },
    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    // animations = {
    //     scale: new Animated.Value(1),
    // };
    // _onPressIn = () => {
    //     //隐藏box
    //     this._anim = Animated.timing(this.animations.scale, {
    //         duration: 200,
    //         toValue: 0,
    //         // easing: Easing.inOut(Easing.ease),
    //     }).start();
    // };
    // _onPressOut = () => {
    //     //隐藏box
    //     this._anim = Animated.timing(this.animations.scale, {
    //         duration: 200,
    //         toValue: 1,
    //         // easing: Easing.inOut(Easing.ease),
    //     }).start();
    // };

    render() {
        // const scale = this.animations.scale.interpolate( {
        //     inputRange: [0, 1],
        //     outputRange: [0.95, 1],
        //     extrapolate: 'clamp',
        // });
        const {titleFontSize, marginHorizontal, item} = this.props;

        return <TouchableOpacity
            onPress={()=>{
                NavigationUtils.goPage({test:false,task_id:item.taskId},'TaskDetails')
            }}
            style={{
                flex: 1,
                flexDirection: 'row',
                marginHorizontal: marginHorizontal,
                paddingTop: 15,
                paddingBottom: 25,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                // transform: [{scale}],
                height: 90,
            }}
            // onPressIn={this._onPressIn}
            // onPressOut={this._onPressOut}
        >
            <FastImage
                style={[styles.imgStyle]}
                source={{uri: item.avatarUrl}}
                resizeMode={FastImage.resizeMode.stretch}
            />
            {/*左上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                left: 65,
                flexDirection: 'row',
                alignItems:'center',
            }}>
                <Text style={{
                    fontSize: titleFontSize,
                    color: 'black',
                }}>{item.taskTitle}</Text>
                {item.recommendIsExp == 1 && <View style={{
                    height: 15, width: 15, borderRadius: 3, backgroundColor: bottomTheme,
                    alignItems: 'center',
                    justifyContent: 'center', marginLeft:5,
                }}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 11}}>推</Text>
                </View>}
                {item.topIsExp == 1 && <View style={{
                    height: 15, width: 15, borderRadius: 3, backgroundColor: bottomTheme,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 3,
                }}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 11}}>顶</Text>
                </View>}
                {/*<SvgUri width={19} height={19} style={{marginLeft: 3}} svgXmlData={tuijian}/>*/}
                {/*<SvgUri width={18} height={18} style={{marginLeft: 3, marginTop: 1}} svgXmlData={ding}/>*/}
            </View>
            {/*左下*/}
            <View style={{
                position: 'absolute',
                top: 47,
                left: 60,
                flexDirection: 'row',
            }}>
                <LabelBigComponent title={item.typeTitle}/>
                <LabelBigComponent title={item.taskName}/>
            </View>
            {/*右上*/}
            <View style={{
                position: 'absolute',
                top: 17,
                right: 0,
            }}>
                <Text style={{
                    fontSize: 16,
                    color: 'red',
                }}>+{item.rewardPrice} 元</Text>
            </View>
            {/*右下*/}
            <View style={{
                position: 'absolute',
                top: 50,
                right: 0,
            }}>
                <Text style={{
                    fontSize: 13,
                    // color:''
                    opacity: 0.5,
                    // fontWeight: '100',
                }}>{parseInt(item.taskPassNum)}人已完成|剩余数{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}</Text>
            </View>
        </TouchableOpacity>;


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
