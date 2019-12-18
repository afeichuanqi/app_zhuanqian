import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import SvgUri from 'react-native-svg-uri';
// import Animated, {Easing} from 'react-native-reanimated';

// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
// const {timing} = Animated;


const {width} = Dimensions.get('window');

class TaskSumComponent extends Component {

    // shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    //     if (this.state.value !== nextState.value) {
    //         return true;
    //     }
    //     return false;
    // }
    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        return this.props.item.taskId !== nextProps.item.taskId;

    }

    isZuijinTime = (date) => {
        const newDate = new Date(date);

        const str = newDate.getTime();
        const now = Date.now();

        return str > (now - 5 * 60 * 1000);

    };
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
        // console.log(item);
        let maxWidth = width - 80;
        const isZuijin = this.isZuijinTime(item.updateTime);
        if (item.recommendIsExp == 1) {
            maxWidth -= 40;
        }
        if (item.topIsExp == 1) {
            maxWidth -= 40;
        }
        if (isZuijin) {
            maxWidth -= 49;
        }
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: item.taskId}, 'TaskDetails');
                this.props.onPress && this.props.onPress(item.taskId);
            }}
            style={{
                flex: 1,
                // flexDirection: 'row',

                paddingTop: 15,
                paddingBottom: 25,
                // borderBottomWidth: 0.7,
                // borderBottomColor: '#d8d8d8',
                alignItems:'center',
                backgroundColor:'white',
                height: 130,
                marginBottom:5,
            }}
        >

            <View style={{
                height: 50, width: width - 20, paddingLeft: 10, justifyContent: 'space-between',

            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/*标题*/}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 17,
                                color: 'black',
                                fontWeight: '500',
                                // width:width-200
                                maxWidth: maxWidth,
                            }}>{item.taskId} - {item.taskTitle}</Text>
                        {isZuijin && <View style={{
                            height: 15,
                            paddingHorizontal: 3,
                            borderRadius: 3,
                            borderWidth: 0.8,
                            borderColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 5,
                        }}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 10}}>最近刷新</Text>
                        </View>}
                        {item.recommendIsExp == 1 && <View style={{
                            height: 15,
                            paddingHorizontal: 3,
                            borderRadius: 3,
                            borderWidth: 0.8,
                            borderColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 5,
                        }}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 10}}>推荐</Text>
                        </View>}


                        {item.topIsExp == 1 && <View style={{
                            height: 15,
                            paddingHorizontal: 3,
                            borderRadius: 3,
                            borderWidth: 0.8,
                            borderColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 5,
                        }}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 10}}>置顶</Text>
                        </View>}
                    </View>
                    {/*价格*/}
                    <View style={{}}>
                        <Text style={{
                            fontSize: 17,
                            color: 'red',
                            fontWeight: '500',
                        }}>+ {item.rewardPrice}元</Text>
                    </View>
                </View>
                {/*剩余数*/}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                }}>
                    <Text style={{
                        fontSize: 13,
                        opacity: 0.5,
                    }}>{parseInt(item.taskPassNum)}人已完成</Text>
                    <View
                        style={{width: 0.3, height: 13, backgroundColor: 'rgba(0,0,0,0.5)', marginHorizontal: 10}}/>
                    <Text style={{
                        fontSize: 13,
                        opacity: 0.5,
                        color:'red',
                    }}>剩余{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}个名额</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                    }}>
                    {/*标签*/}
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <LabelBigComponent paddingHorizontal={8} fontSize={11} title={item.typeTitle}/>
                        <LabelBigComponent paddingHorizontal={8} fontSize={11} title={item.taskName}/>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        NavigationUtils.goPage({userid: item.userId}, 'ShopInfoPage');
                    }}
                    style={{marginTop: 10, flexDirection: 'row', alignItems: 'center', width: 200}}>
                    <View>
                        <FastImage
                            style={[styles.imgStyle]}
                            source={{uri: item.avatarUrl}}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                        <SvgUri style={{
                            position: 'absolute',
                            right: -2,
                            bottom: -2,
                            backgroundColor: item.sex == 0 ? '#3b8ae8' : '#e893d8',
                            borderRadius: 20,

                        }} fill={'white'} width={10} height={10}
                                svgXmlData={item.sex == 0 ? sex_nan_ : sex_nv_}/>
                    </View>

                    <Text style={{fontSize: 12, marginLeft: 8,width: 100}}>{item.userName}</Text>

                </TouchableOpacity>
            </View>
            {/*<View style={{width,height:5, backgroundColor:'#d8d8d8'}}/>*/}

        </TouchableOpacity>;


    }


}

export default TaskSumComponent;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 20,
        height: 20,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
