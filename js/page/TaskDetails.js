/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import FastImage from 'react-native-fast-image';
import SvgUri from 'react-native-svg-uri';
import menu_right from '../res/svg/menu_right.svg';
import TaskStepColumn from './TaskRelease/TaskStepColumn';
import Animated from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

class TaskDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    animations = {
        value: new Animated.Value(0),
    };

    render() {
        const top = Animated.interpolate(this.animations.value, {
            inputRange: [-220, 0, 75],
            outputRange: [295, 75, 10],
            extrapolate: 'clamp',
        });
        const left = Animated.interpolate(this.animations.value, {
            inputRange: [0, 20, 55],
            outputRange: [20, 20, width / 2 - 40],
            extrapolate: 'clamp',
        });
        const R = Animated.interpolate(this.animations.value, {
            inputRange: [0, 74, 75],
            outputRange: [0, 0, 255],
            extrapolate: 'clamp',
        });
        const opacity = Animated.interpolate(this.animations.value, {
            inputRange: [0, 55],
            outputRange: [1, 0.5],
            extrapolate: 'clamp',
        });
        const color = Animated.color(R, R, R);
        let statusBar = {
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        const RefreshHeight = Animated.interpolate(this.animations.value, {
            inputRange: [-200, 0],
            outputRange: [250, 0],
            extrapolate: 'clamp',
        });
        // let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '', null, bottomTheme, 'white', 16);
        // console.log()
        const {typeData, deviceData, columnData, stepData} = this.params;
        console.log(columnData.rewardPrice);
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {/*{TopColumn}*/}
                <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>

                    <View style={{
                        backgroundColor: bottomTheme,
                        height: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}/>
                    <Animated.View
                        // ref={ref => this.zhedangRef = ref}
                        style={{
                            backgroundColor: bottomTheme,
                            height: RefreshHeight,
                            width,
                            position: 'absolute',
                            top: 35,
                            // zIndex:1 ,
                        }}>


                    </Animated.View>
                    <Animated.View style={{position: 'absolute', top: top, left: left, height: 60, zIndex: 1}}>
                        <Animated.Text
                            style={{fontSize: 16, color: color}}>微信实名</Animated.Text>
                    </Animated.View>
                    <Animated.ScrollView
                        scrollEventThrottle={1}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: {y: this.animations.value},
                                },
                            },
                        ])}

                    >
                        <View style={{backgroundColor: bottomTheme, height: 30}}/>
                        <Animated.View style={{height: 120, opacity: opacity}}>
                            <View style={{height: 60, backgroundColor: bottomTheme}}/>
                            <View style={{
                                height: 120, backgroundColor: 'white',
                                position: 'absolute',
                                top: 0, width: width - 20,
                                left: 10,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                            }}>
                                <View style={{
                                    height: 60,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <View style={{marginTop: 15}}>
                                        {/*<Text style={{fontSize: 16}}>微信实名</Text>*/}
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                            <Text
                                                style={{color: 'rgba(0,0,0,0.7)', fontSize: 12}}>{typeData.title}</Text>
                                            <View style={{
                                                height: 10, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)',
                                                marginHorizontal: 10,
                                            }}/>
                                            <Text style={{
                                                color: 'rgba(0,0,0,0.7)',
                                                fontSize: 12,
                                            }}>{columnData.projectTitle}</Text>
                                        </View>
                                    </View>

                                    <Text style={{fontSize: 16, color: bottomTheme}}>{columnData.rewardPrice}元</Text>
                                </View>
                                <View style={{
                                    height: 60,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    // marginTop: 20,
                                    alignItems: 'center',
                                }}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{color: 'black', fontSize: 15}}>10</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>剩余数量</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{color: 'black', fontSize: 15}}>10</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>完成数量</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 15,
                                        }}>{columnData.orderTimeLimit.title}</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>做单时间</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text
                                            style={{color: 'black', fontSize: 15}}>{columnData.reviewTime.title}</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>审核时间</Text>
                                    </View>

                                </View>
                            </View>
                        </Animated.View>
                        <View style={{
                            backgroundColor: 'white',
                            height: 60,
                            marginTop: 10,
                            marginHorizontal: 10,
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderRadius: 5,
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <FastImage
                                    style={[styles.imgStyle]}
                                    source={{uri: `http://www.embeddedlinux.org.cn/uploads/allimg/180122/2222032V5-0.jpg`}}
                                    resizeMode={FastImage.stretch}
                                />
                                <View style={{marginLeft: 10, justifyContent: 'space-around'}}>
                                    <Text>张先生</Text>
                                    <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: 12}}>名豪投资</Text>
                                </View>
                            </View>
                            <View>
                                <SvgUri width={15} style={{marginLeft: 5}} height={15} svgXmlData={menu_right}/>
                            </View>
                        </View>
                        <View style={{
                            backgroundColor: 'white', marginTop: 10, paddingHorizontal: 10, marginHorizontal: 10,
                            paddingVertical: 10, borderRadius: 5,
                        }}>
                            <Text style={{fontSize: 14, color: bottomTheme}}>
                                任务说明
                            </Text>
                            <Text style={{
                                marginTop: 10,
                                color: 'rgba(0,0,0,1)',
                                fontSize: 13,
                                lineHeight: 20,
                                letterSpacing: 0.2,
                            }}>{columnData.TaskInfo}</Text>
                        </View>
                        <View style={{
                            marginTop: 10, paddingHorizontal: 10, backgroundColor: 'white', marginHorizontal: 10,
                            paddingBottom: 10, borderRadius: 3,
                        }}>
                            <Text style={{fontSize: 14, color: bottomTheme, marginTop: 10}}>做单步骤（请仔细审阅任务步骤）</Text>

                        </View>
                        <TaskStepColumn stepArr={stepData} showUtilColumn={false}/>
                    </Animated.ScrollView>
                </View>


                {/*<Text style={{}}>wifi万能钥匙</Text>*/}

                {/*{TopColumn}*/}
            </SafeAreaViewPlus>
        );
    }
}

export default TaskDetails;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 40,
        height: 40,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
