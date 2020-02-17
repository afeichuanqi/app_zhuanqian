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
    Image, Clipboard,
    Linking
} from 'react-native';
import {bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import SvgUri from 'react-native-svg-uri';
import Animated, {Easing} from 'react-native-reanimated';
import {connect} from 'react-redux';
import {
    selectTaskInfo, selectUserIsFavoriteTask,
    selectUserStatusForTaskId,
    sendTaskStepForm, setUserFavoriteTask,
    startSignUpTask, updateTaskReleaseData,
} from '../util/AppService';
import goback from '../res/svg/goback.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import {_handleTypeTitle, judgeSendTaskData, judgeTaskData, renderEmoji} from '../util/CommonUtils';
import Toast from 'react-native-root-toast';
import BackPressComponent from '../common/BackPressComponent';
import TaskMenu from './TaskDetails/TaskMenu';
import fenxiang from '../res/svg/fenxiang.svg';
import shoucang from '../res/svg/shoucang.svg';
import shoucang_ from '../res/svg/shoucang_.svg';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
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
            outputRange: [20, 11],
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
        const taskInfo = taskData && taskData.TaskInfo;
        // console.log(taskInfo);
        let taskInfoArr = [];
        if (taskInfo && taskInfo.indexOf('---')) {
            taskInfoArr = taskInfo.split('---');
            // console.log(taskInfoArr[2].toString().replace(new RegExp('\\\\n', 'gm'), 'sss'));
        }

        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>

                    <View style={{
                        backgroundColor: bottomTheme,
                        height: 45,
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
                        <Text style={{color: 'white', fontSize: 18}}>职位详情</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            width,
                            position: 'absolute',
                            top: 14,
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
                            top: (-height) + 45,
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
                        <Animated.View style={{height: hp(14), opacity: opacity}}>
                            <View style={{
                                height: hp(9), backgroundColor: bottomTheme, borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                            }}/>
                            <View style={{
                                height: hp(14), backgroundColor: 'white',
                                position: 'absolute',
                                top: 0, width: width - 20,
                                left: 10,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                                paddingTop: hp(1.5),
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
                                                  width: width - 95,
                                              }}>
                                            {taskData && renderEmoji(taskData.title, [], hp(2.3), 0).map((item, index) => {
                                                return item;
                                            })}
                                        </Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                                            <Text
                                                style={{
                                                    color: 'rgba(0,0,0,0.7)',
                                                    fontSize: hp(1.8),
                                                }}>{taskData && _handleTypeTitle(taskData.taskType.title)}</Text>
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
                                    }}>{taskData && taskData.rewardPrice}元</Text>
                                </View>
                            </View>
                        </Animated.View>
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
                                <Text style={{fontSize: hp(2.2), color: bottomTheme, fontWeight: 'bold'}}>
                                    公司信息
                                </Text>
                            </View>

                            <Text style={{
                                marginTop: 20,
                                marginHorizontal: 15,
                                fontSize: hp(2.1),
                                opacity: 0.8,
                            }}>
                                {taskInfoArr[0]}
                            </Text>
                            <View style={{
                                marginTop: 15,
                                marginHorizontal: 5,
                                width: wp(87),
                                height: hp(7),
                                borderWidth: 3,
                                borderColor: 'rgba(33,150,243,0.2)',
                                borderRadius: hp(1),
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                justifyContent: 'space-between',
                            }}>
                                <Text style={{fontSize: hp(2.1), opacity: 0.8}}>报名联系方式</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image
                                        style={{height: hp(3), width: hp(3)}}
                                        source={(taskInfoArr[1]&&taskInfoArr[1].length===11)?require('../res/img/share/phone.png'):require('../res/img/share/wechat.png')}
                                    />
                                    <Text style={{fontSize: hp(2.0), opacity: 0.8}}>{taskInfoArr[1]}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if((taskInfoArr[1]&&taskInfoArr[1].length===11)){
                                            Linking.openURL(`tel:${taskInfoArr[1]}`)
                                            console.log(`tel:${taskInfoArr[1]}`);
                                        }else{
                                            Clipboard.setString(taskInfoArr[1]);
                                            Toast.show('复制成功');
                                        }

                                    }}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 0.3,
                                        borderColor: 'rgba(0,0,0,0.8)',
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        borderRadius: 6,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: hp(1.9),
                                        opacity: 0.8,
                                    }}>{(taskInfoArr[1]&&taskInfoArr[1].length===11)?'拨打':'复制'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
                                <Text style={{fontSize: hp(2.2), color: bottomTheme, fontWeight: 'bold'}}>
                                    职位详情
                                </Text>
                            </View>

                            <Text style={{
                                marginTop: 20,
                                fontSize: hp(2.2),
                                paddingHorizontal: 15,
                                opacity: 0.8,
                                lineHeight: hp(3.5),
                            }}>

                                {taskInfoArr.length > 0 && taskInfoArr[2].toString().replace(new RegExp('\\\\n', 'gm'), '\n')}
                                {/*{'"职位类型：计算机/互联网\\n发布时间：2020-02-17\\n有效日期：2020-05-19\\n基本要求：年龄不限性别不限\\n工作地点：池州"'}*/}
                            </Text>
                        </View>
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
                                <Text style={{fontSize: hp(2.2), color: bottomTheme, fontWeight: 'bold'}}>
                                    公司介绍
                                </Text>
                            </View>

                            <Text style={{
                                marginTop: 20,
                                fontSize: hp(2.1),
                                paddingHorizontal: 15,
                                opacity: 0.8,
                            }}>
                                {taskInfoArr[3]}
                            </Text>
                        </View>
                    </AnimatedKeyboardAwareScrollView>
                    {/*底部按钮*/}
                    <BottomBtns
                        test={test}
                        update={this.params.update}
                        taskStatus={taskStatus}
                        StatusForTask={StatusForTask}
                        startSignUp={this._startSignUp}
                        updateStep={this.onBackPress}
                        userinfo={this.props.userinfo}
                        task_id={this.task_id}
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
                        <SvgUri width={24} height={24} fill={'white'} svgXmlData={goback}/>
                    </AnimatedTouchableOpacity>
                </View>

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
                    width: 100, height: 30,
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
                    width: 100, height: 35,
                    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                }}>
                <SvgUri width={hp(2.7)} fill={'rgba(0,0,0,0.7)'} height={hp(2.7)} svgXmlData={fenxiang}/>
                <Text
                    style={{fontSize: hp(2), width: 40, textAlign: 'center', opacity: 0.8, color: 'black'}}>分享</Text>
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
                    width: 100, height: 35,
                    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                }}>
                <SvgUri width={hp(2.7)} fill={isFavorite == 1 ? bottomTheme : 'rgba(0,0,0,0.7)'} height={hp(2.7)}
                        svgXmlData={isFavorite == 1 ? shoucang_ : shoucang}/>
                <Text
                    style={{fontSize: hp(2), width: 40, textAlign: 'center', opacity: 0.8, color: 'black'}}>收藏</Text>
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
        // console.log(this.props.StatusForTask);
        const {test, StatusForTask} = this.props;
        return <View>
            <View style={{flexDirection: 'row'}}>
                <ChangeTask
                    task_id={this.props.task_id}
                    userinfo={this.props.userinfo}
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
                            fontSize: 15,
                            color: 'white',
                            marginLeft: 5,
                        }}>{StatusForTask.status === 0 ? '立即报名' : StatusForTask.status === 4 ? '已经报名' : StatusForTask.status === 5 ? '待审核' : StatusForTask.msg || ''}</Text>
                </TouchableOpacity>


            </View>
            {/*<ToastSelect*/}
            {/*    sureTitle={this.props.update ? '确认修改' : '确认发布'}*/}
            {/*    sureClick={() => {*/}
            {/*        this.toastS.hide();*/}
            {/*        this.props.sendStepData();*/}
            {/*    }}*/}
            {/*    ref={ref => this.toastS = ref}/>*/}
        </View>;
    }
}

class ChangeTask extends Component {
    animations = {
        rotate: new Animated.Value(0),
    };
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
    _onPress = () => {
        //隐藏box
        if(!this.props.userinfo.token || this.props.userinfo.token.length===0){
            Toast.show(`请先登录`, {position: Toast.positions.CENTER});
            return ;
        }
        const is_favorite = this.state.isFavorite == 1 ? 0 : 1;
        setUserFavoriteTask({
            task_id: this.props.task_id,
            favorite_status: is_favorite,
        }, this.props.userinfo.token).then(result => {
            Toast.show(`${is_favorite == 1 ? '收藏' : '取消收藏'}成功`, {position: Toast.positions.CENTER});
            this.setState({
                isFavorite: is_favorite,
            });
        });
    };


    render() {
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
                // style={{transform: [{rotate: rotate}]}}
            >
                <SvgUri width={hp(2.5)} fill={'rgba(0,0,0,0.7)'} style={{}} height={hp(2.5)}
                        svgXmlData={this.state.isFavorite == 1 ? shoucang_ : shoucang}/>
            </Animated.View>

            <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>收藏</Text>
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
