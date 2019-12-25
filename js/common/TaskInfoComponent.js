import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import Emoji from 'react-native-emoji';
import {getEmojis} from '../util/CommonUtils';
// import Animated, {Easing} from 'react-native-reanimated';

// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
// const {timing} = Animated;


const {width} = Dimensions.get('window');

class TaskInfoComponent extends PureComponent {

    // shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    //     if (this.state.value !== nextState.value) {
    //         return true;
    //     }
    //     return false;
    // }

    static defaultProps = {
        titleFontSize: 15,
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
        let taskTitle = item.taskTitle;
        let emojiArr = [];
        const json = getEmojis(taskTitle);
        if (json) {
            taskTitle = json.content;
            emojiArr = json.emojiArr;
        }
        // let castArr = taskTitle.match(emoji);

        // if(castArr){
        //     castArr.forEach((item) => {
        //         emojiArr.push(item);
        //         taskTitle = taskTitle.replace(item, '');
        //     });
        // }
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: item.taskId}, 'TaskDetails');
                this.props.onPress && this.props.onPress(item.taskId);
            }}
            key={item.taskId}
            style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: marginHorizontal,
                paddingTop: 15,
                paddingBottom: 25,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                // transform: [{scale}],
                backgroundColor:'white',
                height: 85,
            }}
            // onPressIn={this._onPressIn}
            // onPressOut={this._onPressOut}
        >
            <FastImage
                style={[styles.imgStyle,this.props.avatarStyle]}
                source={{uri: item.avatarUrl}}
                resizeMode={FastImage.resizeMode.stretch}
            />
            <View style={{
                height: 50, width: width - 70, paddingLeft: 10, justifyContent: 'space-between',

            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/*标题*/}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: titleFontSize,
                            color: 'black',

                        }}>{taskTitle} {emojiArr.map((item) => {
                            return <Emoji name={item} style={{fontSize: 15}}/>;
                        })}</Text>
                        {item.recommendIsExp == 1 && <View style={{
                            height: 15, width: 15, borderRadius: 3, backgroundColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center', marginLeft: 5,
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
                    </View>
                    {/*价格*/}
                    <View style={{}}>
                        <Text style={{
                            fontSize: 16,
                            color: 'red',
                        }}>+{item.rewardPrice} 元</Text>
                    </View>
                </View>
                <View
                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/*标签*/}
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <LabelBigComponent title={item.typeTitle}/>
                        <LabelBigComponent title={item.taskName}/>
                    </View>
                    {/*剩余数*/}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 13,
                            opacity: 0.5,
                            color: 'black',
                        }}>{parseInt(item.taskPassNum)}人已完成</Text>
                        <View
                            style={{width: 0.7, height: 13, backgroundColor: 'rgba(0,0,0,0.5)', marginHorizontal: 5}}/>
                        <Text style={{
                            fontSize: 13,
                            opacity: 0.5,
                            color: 'black',
                        }}>剩余{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}</Text>
                    </View>

                </View>
            </View>


        </TouchableOpacity>;


    }


}

export default TaskInfoComponent;
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
