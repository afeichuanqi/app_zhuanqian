/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import FastImage from 'react-native-fast-image';
import SvgUri from 'react-native-svg-uri';
import menu_right from '../res/svg/menu_right.svg';
import TaskStepColumn from './TaskRelease/TaskStepColumn';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import {addTaskReleaseData, selectTaskInfo, startSignUpTask} from '../util/AppService';
import taskHallNext from '../res/svg/taskHallNext.svg';
import goback from '../res/svg/goback.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import {judgeTaskData} from '../util/CommonUtils';
import Toast from '../common/Toast';

const {width} = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

class TaskDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    state = {
        totalData: {},
        signUp: false,

    };

    componentDidMount() {
        const {test, task_id} = this.params;
        if (test) {
            const {fromUserinfo, taskData, stepData} = this.params;
            const totalData = {fromUserinfo, taskData, stepData};
            // console.log(totalData, 'totalData');
            this.setState({
                totalData,
            });
        } else {
            selectTaskInfo({task_id: task_id}, this.props.userinfo.token).then(result => {

                const {fromUserinfo, taskData, stepData} = result;
                const totalData = {fromUserinfo, taskData, stepData: JSON.parse(stepData)};
                this.setState({
                    totalData,
                });
            });
        }

    }

    componentWillUnmount() {

    }

    animations = {
        value: new Animated.Value(0),
    };

    render() {
        const TitleTop = Animated.interpolate(this.animations.value, {
            inputRange: [0, 70],
            outputRange: [20, -50],
            extrapolate: 'clamp',
        });
        const NameOpacity = Animated.interpolate(this.animations.value, {
            inputRange: [0, 70],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });
        const opacity = Animated.interpolate(this.animations.value, {
            inputRange: [0, 55],
            outputRange: [1, 0.5],
            extrapolate: 'clamp',
        });
        const goBackTop = Animated.interpolate(this.animations.value, {
            inputRange: [0, 40],
            outputRange: [20, 5],
            extrapolate: 'clamp',
        });
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
            inputRange: [-200, -0.1, 0],
            outputRange: [250, 20, 0],
            extrapolate: 'clamp',
        });
        const {fromUserinfo, taskData, stepData} = this.state.totalData;
        const {signUp} = this.state;
        const {userinfo} = this.props;
        const {test} = this.params;

        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>

                    <View style={{
                        backgroundColor: bottomTheme,
                        height: 35,
                        justifyContent: 'center',
                    }}/>

                    <Animated.View
                        style={{width, position: 'absolute', top: TitleTop, alignItems: 'center', zIndex: 2}}>
                        <Text style={{color: 'white', fontSize: 18}}>任务详情</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            width,
                            position: 'absolute',
                            top: 5,
                            alignItems: 'center',
                            zIndex: 2,
                            opacity: NameOpacity,
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>{taskData && taskData.title}</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            backgroundColor: bottomTheme,
                            height: RefreshHeight,
                            width,
                            position: 'absolute',
                            top: 35,
                        }}>
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

                                    <View>
                                        <Text style={{fontSize: 16, opacity: 0.9, color: 'black'}}>
                                            {taskData && taskData.title}
                                        </Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                                            <Text
                                                style={{
                                                    color: 'rgba(0,0,0,0.7)',
                                                    fontSize: 12,
                                                }}>{taskData && taskData.title}</Text>
                                            <View style={{
                                                height: 10, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)',
                                                marginHorizontal: 10,
                                            }}/>
                                            <Text style={{
                                                color: 'rgba(0,0,0,0.7)',
                                                fontSize: 12,
                                            }}>{taskData && taskData.projectTitle}</Text>
                                        </View>
                                    </View>

                                    <Text style={{
                                        fontSize: 16,
                                        color: bottomTheme,
                                    }}>{taskData && taskData.rewardPrice}元</Text>
                                </View>
                                <View style={{
                                    height: 60,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    // marginTop: 20,
                                    alignItems: 'center',
                                }}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 15,
                                        }}>{taskData && taskData.remainderNum}</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>剩余数量</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 15,
                                        }}>{taskData && taskData.rewardNum - taskData.remainderNum}</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>完成数量</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 15,
                                        }}>{taskData && taskData.orderTimeLimit.title}</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>做单时间</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontSize: 15,
                                            }}>{taskData && taskData.reviewTime.title}</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>审核时间</Text>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
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
                                    source={{uri: fromUserinfo && fromUserinfo.avatar_url}}
                                    resizeMode={FastImage.stretch}
                                />
                                <View style={{marginLeft: 10, justifyContent: 'space-around'}}>
                                    <Text>{fromUserinfo && fromUserinfo.username}</Text>
                                    <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: 12}}>名豪投资</Text>
                                </View>
                            </View>
                            <View>
                                <SvgUri width={15} style={{marginLeft: 5}} height={15} svgXmlData={menu_right}/>
                            </View>
                        </TouchableOpacity>
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
                            }}>{taskData && taskData.TaskInfo}</Text>
                        </View>
                        <View style={{
                            marginTop: 10, paddingHorizontal: 10, backgroundColor: 'white', marginHorizontal: 10,
                            paddingBottom: 10, borderRadius: 3,
                        }}>
                            <Text style={{fontSize: 14, color: bottomTheme, marginTop: 10}}>做单步骤（请仔细审阅任务步骤）</Text>

                        </View>
                        <TaskStepColumn
                            ref={ref => this.taskStep = ref}
                            showEditModel={signUp}
                            userinfo={userinfo}
                            stepArr={stepData || []}
                            showUtilColumn={false}/>
                    </Animated.ScrollView>
                    {test ? <View style={{borderTopWidth: 0.5, borderTopColor: '#c8c8c8', flexDirection: 'row'}}>
                        <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goBack(this.props.navigation);
                            }}
                            activeOpacity={0.6}
                            style={{
                                height: 60,
                                width: width / 3,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>

                            <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>修改</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                const {FormData} = this.params;
                                const {token} = userinfo;
                                const error = judgeTaskData(FormData);
                                if (error != '') {
                                    this.toast.show(error);
                                    return;
                                }
                                addTaskReleaseData(FormData, token).then(result => {
                                    this.toast.show('发布成功 ~ ~ ');
                                }).catch(err => {
                                    this.toast.show(err);
                                });
                            }}
                            style={{
                                height: 60,
                                width: (width / 3) * 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                backgroundColor: bottomTheme,
                            }}>
                            <Text
                                style={{fontSize: 15, color: 'white', marginLeft: 5}}>申请发布</Text>
                        </TouchableOpacity>

                    </View> : <View style={{borderTopWidth: 0.5, borderTopColor: '#c8c8c8', flexDirection: 'row'}}>
                        <TouchableOpacity
                            // onPress={this._goReleaseTest}
                            activeOpacity={0.6}
                            style={{
                                height: 60,
                                width: width / 3,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <SvgUri width={17} fill={'rgba(0,0,0,0.7)'} style={{marginLeft: 5}} height={17}
                                    svgXmlData={taskHallNext}/>
                            <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>换一批</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={this._startSignUp}
                            style={{
                                height: 60,
                                width: (width / 3) * 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                backgroundColor: bottomTheme,
                            }}>
                            <Text
                                style={{fontSize: 15, color: 'white', marginLeft: 5}}>{signUp ? '提交验证' : '开始报名'}</Text>
                        </TouchableOpacity>

                    </View>}
                    <AnimatedTouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            NavigationUtils.goBack(this.props.navigation);
                        }}
                        style={{position: 'absolute', top: goBackTop, left: 10, zIndex: 10, width: 50}}>
                        <SvgUri width={24} height={24} fill={'white'} svgXmlData={goback}/>
                    </AnimatedTouchableOpacity>
                </View>
            </SafeAreaViewPlus>
        );
    }

    _startSignUp = () => {
        const {signUp} = this.state;
        const {userinfo} = this.props;
        console.log(userinfo.token);
        const {task_id} = this.params;
        if (!signUp) {
            startSignUpTask({task_id: task_id},userinfo.token).then(result => {

                this.setState({
                    signUp: true,
                }, () => {
                    this.toast.show('报名成功');
                });
            }).catch((msg) => {
                this.toast.show(msg);
            });

        } else {
        }

    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
const TaskDetailsRedux = connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
export default TaskDetailsRedux;
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
