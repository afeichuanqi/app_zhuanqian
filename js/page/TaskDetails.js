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
import {getEmojis, judgeSendTaskData, judgeTaskData} from '../util/CommonUtils';
import Toast from '../common/Toast';
import liaotian from '../res/svg/liaotian.svg';
import BackPressComponent from '../common/BackPressComponent';
import message_more from '../res/svg/message_more.svg';
import TaskMenu from './TaskRelease/TaskMenu';
import fenxiang from '../res/svg/fenxiang.svg';
import shoucang from '../res/svg/shoucang.svg';
import shoucang_ from '../res/svg/shoucang_.svg';
import ToastShare from '../common/ToastShare';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import Emoji from 'react-native-emoji';
import ToastSelect from '../common/ToastSelect';

const {
    timing,
} = Animated;
const {width} = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
let toast = null;

class TaskDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        console.log(this.params,"this.params");
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
                console.log(stepData, 'stepData');
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
            barStyle: 'light-content',
            // hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        // StatusBar.setBarStyle('light-content', true);
        StatusBar.setBackgroundColor(bottomTheme, true);
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        const RefreshHeight = Animated.interpolate(this.animations.value, {
            inputRange: [-400, -0.01, 0],
            outputRange: [450, 20, 0],
            extrapolate: 'clamp',
        });
        const {fromUserinfo, taskData, stepData} = this.state.totalData;
        const {StatusForTask, taskStatus} = this.state;
        const {userinfo} = this.props;
        const {test} = this.params;
        let taskTitle = '';
        let emojiArr = [];
        if (taskData) {
            taskTitle = taskData.title;

            const json = getEmojis(taskTitle);
            if (json) {
                taskTitle = json.content;
                emojiArr = json.emojiArr;
            }
        }

        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                <Toast
                    ref={ref => toast = ref}
                />
                <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>

                    <View style={{
                        backgroundColor: bottomTheme,
                        height: 35,
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
                        <Text style={{color: 'white', fontSize: 18}}>任务详情</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            width,
                            position: 'absolute',
                            top: 8,
                            alignItems: 'center',
                            zIndex: 2,
                            opacity: NameOpacity,
                        }}>
                        <Text numberOfLines={1} style={{color: 'white', fontSize: 16,width:width-90}}>{taskTitle} {emojiArr.map((item,index) => {
                            return <Emoji index={index} name={item} style={{fontSize: 15}}/>;
                        })}</Text>
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
                                    marginTop:5
                                }}>

                                    <View>
                                        <Text numberOfLines={2} style={{fontSize: 16, opacity: 0.9, color: 'black',width:width-90}}>
                                            {taskTitle} {emojiArr.map((item) => {
                                            return <Emoji name={item} style={{fontSize: 15}}/>;
                                        })}
                                        </Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                                            <Text
                                                style={{
                                                    color: 'rgba(0,0,0,0.7)',
                                                    fontSize: 12,
                                                }}>{taskData && taskData.taskType.title}</Text>
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
                                        fontSize: 18,
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
                                        }}>{taskData && taskData.rewardNum - taskData.taskSignUpNum}</Text>
                                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 5}}>剩余数量</Text>
                                    </View>
                                    <View style={{height: 20, width: 0.3, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 15,
                                        }}>{taskData && taskData.taskPassNum}</Text>
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
                                    <Text style={{color: 'black'}}>{fromUserinfo && fromUserinfo.username}</Text>
                                    <Text style={{color: 'red', opacity: 0.8, fontSize: 12}}>{
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
                                {/*<SvgUri width={15} style={{marginLeft: 5}} height={15} svgXmlData={menu_right}/>*/}

                            </TouchableOpacity>
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
                        {/*做单步骤图*/}
                        <TaskStepColumn
                            ref={ref => this.taskStep = ref}
                            showEditModel={(StatusForTask.status === 4 || StatusForTask.status === 5) ? true : false}
                            userinfo={userinfo}
                            isEdit={(StatusForTask.status === 4) ? true : false}
                            stepArr={stepData || []}
                            toast={toast}
                            showUtilColumn={false}/>
                    </Animated.ScrollView>
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
                        style={{position: 'absolute', top: goBackTop, left: 10, zIndex: 10, width: 50}}>
                        <SvgUri width={24} height={24} fill={'white'} svgXmlData={goback}/>
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
                        style={{position: 'absolute', top: goBackTop, right: 0, zIndex: 10, width: 40, marginTop: 3}}>
                        <SvgUri width={20} height={20} fill={'white'} svgXmlData={message_more}/>
                    </AnimatedTouchableOpacity>
                </View>
                {/*右上角的弹出菜单*/}
                <TaskDetailsPop
                    ref={ref => this.taskDetailsPop = ref}
                    userinfo={userinfo}
                    task_id={this.task_id}
                    shareClick={() => {
                        this.toastShare.show();
                    }}
                    toast={toast}
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
                    toast.show('报名成功');
                });
                this._updateTaskStatus().then();
            }).catch((msg) => {
                toast.show(msg);
            });

        }
        if (StatusForTask.status === 4) {//进行提交
            //提交任务
            const task_step_data = this.taskStep.getStepData();
            const taskText = JSON.stringify(task_step_data);
            const error = judgeSendTaskData(taskText);
            if (error != '') {//任务步骤正确是否正确填写完毕
                toast.show(error);
            } else {
                sendTaskStepForm({task_id: this.task_id, task_step_data: taskText}, userinfo.token).then(result => {
                    toast.show('提交成功,等待审核');
                    this._updateTaskStatus().then();
                }).catch((msg) => {
                    toast.show(msg);
                });
            }

        }

    };
    _sendStepData = () => {
        const {userinfo} = this.props;
        if (!userinfo.token || userinfo.token.length === 0) {
            toast.show('您未登录哦 ～ ～ ');
            return;
        }
        if (!this.params.update) {
            const {FormData} = this.params;
            const {token} = userinfo;
            const error = judgeTaskData(FormData);
            if (error != '') {
                toast.show(error);
                return;
            }
            addTaskReleaseData(FormData, token).then(result => {
                toast.show('发布成功 ~ ~ ');
            }).catch(err => {
                toast.show(err);
            });
        } else {
            const {FormData} = this.params;
            const {token} = userinfo;
            const error = judgeTaskData(FormData, true);
            if (error != '') {
                toast.show(error);
                return;
            }
            updateTaskReleaseData(FormData, token).then(result => {
                toast.show('修改成功 ~ ~ ');
            }).catch(err => {
                toast.show(err);
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
        return <View>
            <TaskMenu opacity={0.2} animationType={'none'} ref={ref => this.taskMenu = ref}>
                <TouchableOpacity
                    key={1}
                    activeOpacity={0.6}
                    onPress={() => {
                        this.taskMenu.hide(true);
                        NavigationUtils.goPage({type: 2}, 'UserProtocol');
                    }}
                    style={{
                        width: 100, height: 30,
                        alignItems: 'center', flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    {/*<SvgUri width={20} style={{marginHorizontal: 5}} fill={'black'} height={20} svgXmlData={svgXmlData}/>*/}
                    <Text style={{fontSize: 15, opacity: 0.7, color: 'black'}}>接单说明</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    // key={index}
                    activeOpacity={0.6}
                    onPress={() => {
                        this.taskMenu.hide(false);
                        this.props.shareClick();
                    }}
                    style={{
                        width: 100, height: 35,
                        alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                    }}>
                    <SvgUri width={18} fill={'rgba(0,0,0,0.7)'} height={18} svgXmlData={fenxiang}/>
                    <Text style={{fontSize: 15, width: 50, textAlign: 'center', opacity: 0.7, color: 'black'}}>分享</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        const is_favorite = this.state.isFavorite == 1 ? 0 : 1;
                        setUserFavoriteTask({
                            task_id: task_id,
                            favorite_status: is_favorite,
                        }, userinfo.token).then(result => {
                            this.props.toast.show(`${is_favorite == 1 ? '收藏' : '取消收藏'}成功`);
                            this.setState({
                                isFavorite: is_favorite,
                            });
                        });
                        this.taskMenu.hide(true);
                    }}
                    style={{
                        width: 100, height: 35,
                        alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                    }}>
                    <SvgUri width={18} fill={isFavorite == 1 ? bottomTheme : 'rgba(0,0,0,0.7)'} height={18}
                            svgXmlData={isFavorite == 1 ? shoucang_ : shoucang}/>
                    <Text style={{fontSize: 15, width: 50, textAlign: 'center', opacity: 0.7, color: 'black'}}>收藏</Text>
                </TouchableOpacity>

            </TaskMenu>

        </View>;
    }
}

class BottomBtns extends PureComponent {
    static defaultProps = {
        test: false,
        taskStatus: 100,
        signUp: false,
    };

    render() {
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
                            fontSize: 15,
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
                        height: 60,
                        width: (width / 3) * 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: (StatusForTask.status === 0 || StatusForTask.status === 4 || StatusForTask.status === 5) ? bottomTheme : 'rgba(33,150,243,0.6)',
                    }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: 'white',
                            marginLeft: 5,
                        }}>{StatusForTask.status === 0 ? '开始报名' : StatusForTask.status === 4 ? '提交验证' : StatusForTask.status === 5 ? '待审核' : StatusForTask.msg || ''}</Text>
                </TouchableOpacity>


            </View>}
            <ToastSelect
                rightTitle={this.props.update ? '确认修改' : '确认发布'}
                sureClick={() => {
                    this.toastS.hide();
                    this.props.sendStepData;
                }}
                ref={ref => this.toastS = ref}>
                <View style={{
                    height: 30, backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                    paddingTop: 10,
                }}>
                    <Text style={{fontSize: 14}}>{`是否确认此任务的${this.props.update ? '修改' : '发布'}？`}</Text>
                </View>
            </ToastSelect>
        </View>;
    }
}

class ChangeTask extends Component {
    animations = {
        rotate: new Animated.Value(0),
    };
    _onPress = () => {
        //隐藏box
        toast.show('已切换');
        getNewTaskId().then(result => {
            const taskId = result.task_id;
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
                height: 60,
                width: width / 3,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#f6f6f6',
            }}>
            <Animated.View
                style={{transform: [{rotate: rotate}]}}
            >
                <SvgUri width={13} fill={'rgba(0,0,0,0.7)'} style={{}} height={13}
                        svgXmlData={taskHallNext}/>
            </Animated.View>

            <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>换一批</Text>
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
        width: 40,
        height: 40,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
