/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    UIManager,
    findNodeHandle,
    Image
} from 'react-native';
import {bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import FastImage from 'react-native-fast-image';
import SvgUri from 'react-native-svg-uri';
import TaskStepColumn from './TaskRelease/TaskStepColumn';
import Animated, {Easing} from 'react-native-reanimated';
import {connect} from 'react-redux';
import {
    addTaskReleaseData, getNewTaskId,
    selectTaskInfo, selectUserIsFavoriteTask,
    selectUserStatusForTaskId,
    sendTaskStepForm, setUserFavoriteTask,
    startSignUpTask, updateTaskReleaseData,
} from '../util/AppService';
import taskHallNext from '../res/svg/taskHallNext.svg';
import goback from '../res/svg/goback.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import {judgeSendTaskData, judgeTaskData, renderEmoji} from '../util/CommonUtils';
import Toast from 'react-native-root-toast';
import liaotian from '../res/svg/liaotian.svg';
import BackPressComponent from '../common/BackPressComponent';
import message_more from '../res/svg/message_more.svg';
import TaskMenu from './TaskDetails/TaskMenu';
import fenxiang from '../res/svg/fenxiang.svg';
import shoucang from '../res/svg/shoucang.svg';
import shoucang_ from '../res/svg/shoucang_.svg';
import ToastShare from '../common/ToastShare';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import ToastSelect from '../common/ToastSelectTwo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {
    timing,
} = Animated;
const {width} = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);
const {height} = Dimensions.get('window');

class TaskDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        // console.log(this.params, 'this.params');
        const {test, task_id} = this.params;
        this.test = test;
        this.task_id = task_id;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    state = {
        totalData: {},
        StatusForTask: {},
    };
    _updateTaskStatus = async () => {
        const StatusForTask = await selectUserStatusForTaskId({
            task_id: this.task_id,
            device: Platform.OS == 'android' ? 2 : 3,
        }, this.props.userinfo.token);
        const tmpData = {...this.state.totalData};
        if (StatusForTask.status === 5) {
            const newStepData = JSON.parse(StatusForTask.stepData.task_step_data);
            tmpData.stepData = newStepData;
            this.setState({
                StatusForTask,
                totalData: tmpData,
            });
        } else {
            this.setState({
                StatusForTask,
            });
        }

    };
    updatePage = async () => {
        if (this.test) {
            const {fromUserinfo, taskData, stepData} = this.params;
            const totalData = {fromUserinfo, taskData, stepData};
            this.setState({
                totalData,
            });
        } else {
            const TaskInfo = await selectTaskInfo({task_id: this.task_id}, this.props.userinfo.token);
            const StatusForTask = await selectUserStatusForTaskId({
                task_id: this.task_id,
                device: Platform.OS == 'android' ? 2 : 3,
            }, this.props.userinfo.token);
            let {fromUserinfo, taskData, stepData} = TaskInfo;

            if (StatusForTask.status === 5) {
                stepData = StatusForTask.stepData.task_step_data;
                const totalData = {fromUserinfo, taskData, stepData: JSON.parse(stepData)};
                this.setState({
                    totalData,
                    StatusForTask,
                });
            } else {
                const totalData = {fromUserinfo, taskData, stepData: JSON.parse(stepData)};
                // console.log(stepData, 'stepData');
                this.setState({
                    totalData,
                    StatusForTask,
                });
            }
        }
    };

    componentDidMount() {
        this.backPress.componentDidMount();
        this.updatePage().then();
        StatusBar.setTranslucent(false);
        //收到消息刷新任务
        EventBus.getInstance().addListener(EventTypes.update_task_page, this.listener = data => {
            const {test, task_id} = data;
            if (task_id != this.task_id) {
                this.task_id = task_id;
                this.test = test;
                this.updatePage().then();
            }
        });
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        EventBus.getInstance().removeListener(this.listener);
    }

    animations = {
        value: new Animated.Value(0),
    };

    render() {
        const TitleTop = Animated.interpolate(this.animations.value, {
            inputRange: [0, hp(6.5)],
            outputRange: [hp(3), -hp(5)],
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
            inputRange: [0, hp(1.5)],
            outputRange: [hp(3),  hp(2)],
            extrapolate: 'clamp',
        });
        const translateY = Animated.interpolate(this.animations.value, {
            inputRange: [-height, 0, height],
            outputRange: [height, 0, -height],
            extrapolate: 'clamp',
        });
        let statusBar = {
            barStyle: 'light-content',
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        StatusBar.setBackgroundColor(bottomTheme, true);
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;

        const {fromUserinfo, taskData, stepData} = this.state.totalData;
        // console.log(this.state.totalData);
        const {StatusForTask, taskStatus} = this.state;
        const {userinfo} = this.props;
        const {test} = this.params;

        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>

                    <View style={{
                        backgroundColor: bottomTheme,
                        height: hp(6.5),
                        justifyContent: 'center',
                    }}/>

                    <Animated.View
                        style={{
                            width,
                            position: 'absolute',
                            top: 0,
                            transform: [{translateY: TitleTop}],
                            alignItems: 'center',
                            zIndex: 2,
                        }}>
                        <Text style={{color: 'white', fontSize: hp(2.5)}}>任务详情</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            width,
                            position: 'absolute',
                            top: hp(2),
                            alignItems: 'center',
                            zIndex: 2,
                            opacity: NameOpacity,
                        }}>
                        <Text numberOfLines={1} style={{
                            color: 'white',
                            // fontSize: 16,
                            width: width - 90,
                            // textAlign:'center',
                        }}>{taskData && renderEmoji(taskData.title, [], hp(2.2), 0, 'white').map((item, index) => {
                            return item;
                        })}</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            backgroundColor: bottomTheme,
                            height,
                            width,
                            position: 'absolute',
                            top: (-height) + hp(6.5),
                            transform: [{translateY: translateY}],
                        }}>
                    </Animated.View>
                    <AnimatedKeyboardAwareScrollView
                        enableOnAndroid={true}
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
                        <Animated.View style={{height: hp(19), opacity: opacity}}>
                            <View style={{
                                height: hp(9), backgroundColor: bottomTheme, borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                            }}/>
                            <View style={{
                                height: hp(19), backgroundColor: 'white',
                                position: 'absolute',
                                top: 0, width: width - 20,
                                left: 10,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                            }}>
                                <View style={{
                                    height: hp(9),
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 8,
                                }}>

                                    <View>
                                        <Text numberOfLines={2}
                                              style={{
                                                  fontSize: hp(2.3),
                                                  opacity: 0.9,
                                                  color: 'black',
                                                  width: wp(75),
                                              }}>
                                            {taskData && renderEmoji(taskData.title, [], hp(2.4), 0).map((item, index) => {
                                                return item;
                                            })}
                                        </Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                                            <Text
                                                style={{
                                                    color: 'rgba(0,0,0,0.7)',
                                                    fontSize: hp(1.8),
                                                }}>{taskData && taskData.taskType.title}</Text>
                                            <View style={{
                                                height: 10, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)',
                                                marginHorizontal: 10,
                                            }}/>
                                            <Text style={{
                                                color: 'rgba(0,0,0,0.7)',
                                                fontSize: hp(1.8),
                                            }}>{taskData && taskData.projectTitle}</Text>
                                        </View>
                                    </View>

                                    <Text style={{
                                        fontSize: hp(2.8),
                                        color: bottomTheme,
                                    }}>{taskData &&( taskData.rewardPrice.toString().length===1?`${taskData.rewardPrice}.0`:taskData.rewardPrice)}元</Text>
                                </View>
                                <View style={{
                                    height: hp(8),
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    // marginTop: 20,
                                    alignItems: 'center',
                                }}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: hp(2.2),
                                        }}>{taskData && taskData.rewardNum - taskData.taskSignUpNum}</Text>
                                        <Text style={{
                                            color: 'rgba(0,0,0,0.6)',
                                            fontSize: hp(1.8),
                                            marginTop: hp(1.2),
                                        }}>剩余数量</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.4, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: hp(2.2),

                                        }}>{taskData && taskData.taskPassNum}</Text>
                                        <Text style={{
                                            color: 'rgba(0,0,0,0.6)',
                                            fontSize: hp(1.8),
                                            marginTop: hp(1.2),
                                        }}>完成数量</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.4, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: hp(2.2),
                                        }}>{taskData && taskData.orderTimeLimit.title}</Text>
                                        <Text style={{
                                            color: 'rgba(0,0,0,0.6)',
                                            fontSize: hp(1.8),
                                            marginTop: hp(1.2),
                                        }}>做单时间</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.4, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontSize: hp(2.2),
                                            }}>{taskData && taskData.reviewTime.title}</Text>
                                        <Text style={{
                                            color: 'rgba(0,0,0,0.6)',
                                            fontSize: hp(1.8),
                                            marginTop: hp(1.2),
                                        }}>审核时间</Text>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                        <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goPage({
                                    userid: fromUserinfo.userid,
                                    taskId: this.task_id,
                                    taskUri: taskData.taskUri,
                                }, 'ShopInfoPage');
                            }}
                            activeOpacity={0.6}
                            style={{
                                backgroundColor: 'white',
                                height: hp(11),
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
                                    <Text style={{
                                        color: 'black',
                                        fontSize: hp(2.2),
                                    }}>{fromUserinfo && fromUserinfo.username}</Text>
                                    <Text style={{color: 'red', opacity: 0.8, fontSize: hp(1.7)}}>{
                                        taskData ? (taskData.singOrder.type == 1 ? `此任务每人${taskData.singOrder.num}次`
                                            :
                                            taskData.singOrder.type == 2 ? `此任务每人每天${taskData.singOrder.num}次`
                                                :
                                                '') : '...'

                                    }</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    NavigationUtils.goPage({
                                        fromUserinfo: {
                                            avatar_url: fromUserinfo && fromUserinfo.avatar_url,
                                            id: fromUserinfo && fromUserinfo.userid,
                                            username: fromUserinfo && fromUserinfo.username,
                                        },
                                        columnType: 1,
                                        task_id: this.task_id,
                                        taskUri: taskData.taskUri,
                                        sendFormId: -1,
                                    }, 'ChatRoomPage');
                                }}
                                style={{marginRight: 10}}>
                                <SvgUri width={25} fill={'#6d6d6d'} height={25} svgXmlData={liaotian}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <View style={{
                            backgroundColor: 'white', marginTop: 10, paddingHorizontal: 10, marginHorizontal: 10,
                            paddingVertical: wp(4), borderRadius: 5,
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    resizeMode={'stretch'}
                                    style={{width: hp(1.9), height: hp(1.9), marginRight: 5}}
                                    source={require('../res/img/item_icon/label_icon_green.png')}
                                />
                                {/*<View style={{*/}
                                {/*    width:3,height:'100%',*/}
                                {/*    backgroundColor:'red',*/}
                                {/*    marginRight:5,*/}
                                {/*}}/>*/}
                                <Text style={{fontSize: hp(2.2), color: bottomTheme, fontWeight:'bold'}}>
                                    任务说明
                                </Text>
                            </View>

                            <Text style={{
                                marginTop: 10,
                            }}>
                                {taskData && renderEmoji(taskData.TaskInfo, [], hp(2.0), 0, 'rgba(0,0,0,0.8)', {lineHeight: hp(3)}).map((item, index) => {
                                    return item;
                                })}
                            </Text>
                        </View>
                        <View style={{
                            marginTop: 10, paddingHorizontal: 10, backgroundColor: 'white', marginHorizontal: 10,
                            borderRadius: 3, height: hp(6), justifyContent: 'center',
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    resizeMode={'stretch'}
                                    style={{width: hp(1.9), height: hp(1.9), marginRight: 5}}
                                    source={require('../res/img/item_icon/label_icon_green.png')}
                                />
                                <Text style={{fontSize: hp(2.2), color: bottomTheme, fontWeight:'bold'}}>
                                    做单步骤（请仔细审阅任务步骤）
                                </Text>
                            </View>


                        </View>
                        {/*做单步骤图*/}
                        <TaskStepColumn
                            ref={ref => this.taskStep = ref}
                            showEditModel={(StatusForTask.status === 4 || StatusForTask.status === 5) ? true : false}
                            userinfo={userinfo}
                            isEdit={(StatusForTask.status === 4) ? true : false}
                            stepArr={stepData || []}
                            showUtilColumn={false}/>
                    </AnimatedKeyboardAwareScrollView>
                    {/*底部按钮*/}
                    <BottomBtns
                        test={test}
                        update={this.params.update}
                        taskStatus={taskStatus}
                        StatusForTask={StatusForTask}
                        startSignUp={this._startSignUp}
                        updateStep={this.onBackPress}
                        sendStepData={this._sendStepData}
                    />
                    <AnimatedTouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.onBackPress}
                        style={{
                            position: 'absolute',
                            top: 0,
                            transform: [{translateY: goBackTop}],
                            left: 10,
                            zIndex: 10,
                            width: 50,
                        }}>
                        <SvgUri width={hp(2.8)} height={hp(2.8)} fill={'white'} svgXmlData={goback}/>
                    </AnimatedTouchableOpacity>
                    <AnimatedTouchableOpacity
                        ref={ref => this.moreSvg = ref}
                        activeOpacity={0.6}
                        onPress={() => {
                            const handle = findNodeHandle(this.moreSvg);
                            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                                this.taskDetailsPop.show(pageX, pageY);
                            });
                        }}
                        style={{position: 'absolute', transform: [{translateY: goBackTop}],top: 0, right: 0, zIndex: 10, width: 40, marginTop: 3}}>
                        <SvgUri width={hp(2.8)} height={hp(2.8)} fill={'white'} svgXmlData={message_more}/>
                    </AnimatedTouchableOpacity>
                </View>
                {/*右上角的弹出菜单*/}
                <TaskDetailsPop
                    ref={ref => this.taskDetailsPop = ref}
                    userinfo={userinfo}
                    task_id={this.task_id}
                    shareClick={() => {
                        // console.log();
                        this.toastShare.show({
                            title:taskData.title,
                            text:taskData.TaskInfo,
                            url: `http://www.easy-z.cn/?amount=${taskData.rewardPrice}&title=&count=${taskData.rewardNum}&taskId=${this.task_id}`,
                        });
                    }}
                />
                {/*分享弹窗*/}
                <ToastShare ref={ref => this.toastShare = ref}/>

            </SafeAreaViewPlus>
        );
    }

    _startSignUp = async () => {
        const {StatusForTask} = this.state;
        const {userinfo} = this.props;
        // console.log(userinfo.token);
        if (StatusForTask.status === 0) {//进行报名
            //进行报名
            startSignUpTask({
                task_id: this.task_id,
                device: Platform.OS == 'android' ? 2 : 3,
            }, userinfo.token).then(result => {
                this.setState({
                    signUp: true,
                }, () => {
                    Toast.show('报名成功', {position: Toast.positions.CENTER});
                });
                this._updateTaskStatus().then();
            }).catch((msg) => {
                if (msg === '为了您的安全,请先绑定手机号') {
                    NavigationUtils.goPage({
                        updatePhone: true
                    }, 'LoginPage')
                }
                Toast.show(msg, {position: Toast.positions.CENTER});
            });

        }
        if (StatusForTask.status === 4) {//进行提交
            //提交任务
            const task_step_data = this.taskStep.getStepData();
            const taskText = JSON.stringify(task_step_data);
            const error = judgeSendTaskData(taskText);
            if (error != '') {//任务步骤正确是否正确填写完毕
                Toast.show(error, {position: Toast.positions.CENTER});
            } else {
                sendTaskStepForm({task_id: this.task_id, task_step_data: taskText}, userinfo.token).then(result => {
                    Toast.show('提交成功,等待审核', {position: Toast.positions.CENTER});
                    this._updateTaskStatus().then();
                }).catch((msg) => {
                    Toast.show(msg, {position: Toast.positions.CENTER});
                });
            }

        }

    };
    _sendStepData = () => {
        const {userinfo} = this.props;
        // console.log(userinfo);
        if (!userinfo.token || userinfo.token.length === 0) {
            Toast.show('您未登录哦 ～ ～ ', {position: Toast.positions.CENTER});
            return;
        }
        if (!this.params.update) {
            const {FormData} = this.params;
            const {token} = userinfo;
            const error = judgeTaskData(FormData);
            if (error != '') {
                Toast.show(error, {position: Toast.positions.CENTER});
                return;
            }
            addTaskReleaseData(FormData, token).then(result => {
                Toast.show('发布成功 ~ ~ ', {position: Toast.positions.CENTER});
            }).catch(err => {
                Toast.show(err, {position: Toast.positions.CENTER});
            });
        } else {
            const {FormData} = this.params;
            const {token} = userinfo;
            const error = judgeTaskData(FormData, true);
            if (error != '') {
                Toast.show(error);
                return;
            }
            updateTaskReleaseData(FormData, token).then(result => {
                // console.log(result);
                Toast.show('修改成功 ~ ~ ', {position: Toast.positions.CENTER});
            }).catch(err => {
                Toast.show(err, {position: Toast.positions.CENTER});
            });
        }
    };
}

class TaskDetailsPop extends Component {
    state = {
        isFavorite: 0,
    };

    componentDidMount(): void {
        selectUserIsFavoriteTask({task_id: this.props.task_id}, this.props.userinfo.token).then(data => {

            this.setState({
                isFavorite: data.status,
            });
        }).catch(msg => {
            this.setState({
                isFavorite: 0,
            });
        });
    }

    show(x, y) {
        this.taskMenu.show(x, y);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.task_id != nextProps.task_id || this.state.isFavorite != nextState.isFavorite

        ) {
            return true;
        }
        return false;

    }

    render() {
        const {isFavorite} = this.state;
        const {task_id, userinfo} = this.props;
        return <TaskMenu opacity={0.3} animationType={'none'} ref={ref => this.taskMenu = ref}>
            <TouchableOpacity
                key={1}
                activeOpacity={0.6}
                onPress={() => {
                    this.taskMenu.hide(true);
                    NavigationUtils.goPage({type: 2}, 'UserProtocol');
                }}

                style={{
                    width: 100, height: hp(4),
                    alignItems: 'center', flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                <Text style={{fontSize: hp(2), opacity: 0.8, color: 'black'}}>接单规则</Text>
            </TouchableOpacity>
            <TouchableOpacity
                // key={index}
                activeOpacity={0.6}
                onPress={() => {
                    this.taskMenu.hide(false);
                    this.props.shareClick();
                }}
                style={{
                    width: 100, height: hp(4),
                    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                }}>
                <SvgUri width={hp(2.7)} fill={'rgba(0,0,0,0.7)'} height={hp(2.7)} svgXmlData={fenxiang}/>
                <Text
                    style={{fontSize: hp(2), width: 60, textAlign: 'center', opacity: 0.8, color: 'black'}}>分享</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                    const is_favorite = this.state.isFavorite == 1 ? 0 : 1;
                    setUserFavoriteTask({
                        task_id: task_id,
                        favorite_status: is_favorite,
                    }, userinfo.token).then(result => {
                        Toast.show(`${is_favorite == 1 ? '收藏' : '取消收藏'}成功`, {position: Toast.positions.CENTER});
                        this.setState({
                            isFavorite: is_favorite,
                        });
                    });
                    this.taskMenu.hide(true);
                }}
                style={{
                    width: 100, height: hp(4),
                    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                }}>
                <SvgUri width={hp(2.7)} fill={isFavorite == 1 ? bottomTheme : 'rgba(0,0,0,0.7)'} height={hp(2.7)}
                        svgXmlData={isFavorite == 1 ? shoucang_ : shoucang}/>
                <Text
                    style={{fontSize: hp(2), width: 60, textAlign: 'center', opacity: 0.8, color: 'black'}}>收藏</Text>
            </TouchableOpacity>

        </TaskMenu>;
    }
}

class BottomBtns extends PureComponent {
    static defaultProps = {
        test: false,
        taskStatus: 100,
        signUp: false,
    };

    render() {
        console.log(this.props.StatusForTask);
        const {test, StatusForTask} = this.props;
        return <View>
            {test ? <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={this.props.updateStep}
                    activeOpacity={0.6}
                    style={{
                        height: 60,
                        width: width / 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: '#f6f6f6',
                    }}>

                    <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>修改</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        this.toastS.show();
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
                        style={{
                            fontSize: hp(1.9),
                            color: 'white',
                            marginLeft: 5,
                        }}>{this.props.update ? '确认修改' : '申请发布'}</Text>
                </TouchableOpacity>

            </View> : <View style={{flexDirection: 'row'}}>
                <ChangeTask
                />
                <TouchableOpacity
                    activeOpacity={(StatusForTask.status === 0 || StatusForTask.status === 4 || StatusForTask.status === 5) ? 0.5 : 1}
                    onPress={this.props.startSignUp}
                    style={{
                        height: hp(8),
                        width: wp(60),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: (StatusForTask.status === 0 || StatusForTask.status === 4 || StatusForTask.status === 5) ? bottomTheme : 'rgba(33,150,243,0.6)',
                    }}>
                    <Text
                        style={{
                            fontSize: hp(1.9),
                            color: 'white',
                            marginLeft: 5,
                        }}>{StatusForTask.status === 0 ? '开始报名' : StatusForTask.status === 4 ? '提交验证' : StatusForTask.status === 5 ? '待审核' : StatusForTask.msg || ''}</Text>
                </TouchableOpacity>


            </View>}
            <ToastSelect
                sureTitle={this.props.update ? '确认修改' : '确认发布'}
                sureClick={() => {
                    this.toastS.hide();
                    this.props.sendStepData();
                }}
                ref={ref => this.toastS = ref}/>
        </View>;
    }
}

class ChangeTask extends Component {
    animations = {
        rotate: new Animated.Value(0),
    };
    _onPress = () => {
        //隐藏box
        Toast.show('已切换', {position: Toast.positions.CENTER});
        getNewTaskId().then(result => {
            const taskId = result.task_id;
            console.log(result)
            EventBus.getInstance().fireEvent(EventTypes.update_task_page, {
                test: false,
                task_id: taskId,
            });

        }).catch(msg => {
        });
        this._anim = timing(this.animations.rotate, {
            duration: 1000,
            toValue: 1,
            easing: Easing.inOut(Easing.ease),
        }).start();
        this.animations.rotate.setValue(0);
    };


    render() {
        // const rotate = this.runProgression();
        const rotate = Animated.concat(
            Animated.interpolate(this.animations.rotate, {
                inputRange: [0, 1],
                outputRange: [0, 360],
            }),
            'deg',
        );
        return <TouchableOpacity
            onPress={this._onPress}
            activeOpacity={0.6}
            style={{
                height: hp(8),
                width: wp(40),
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#f6f6f6',
            }}>
            <Animated.View
                style={{transform: [{rotate: rotate}]}}
            >
                <SvgUri width={hp(2)} fill={'rgba(0,0,0,0.7)'} style={{}} height={hp(2)}
                        svgXmlData={taskHallNext}/>
            </Animated.View>

            <Text style={{fontSize: hp(1.9), color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>换一批</Text>
        </TouchableOpacity>;
    }
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
        width: hp(7),
        height: hp(7),
        borderRadius: hp(7) / 2,
        // 设置高度
        // height:150
    },
});
