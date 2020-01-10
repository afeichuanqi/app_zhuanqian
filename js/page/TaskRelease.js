/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, PureComponent} from 'react';
import {
    Dimensions,
    findNodeHandle,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
    Platform,
} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme} from '../appSet';
import rule from '../res/text/rule';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import menu_right from '../res/svg/menu_right.svg';
import step_add from '../res/svg/step_add.svg';
import task_yulan from '../res/svg/task_yulan.svg';
import SvgUri from 'react-native-svg-uri';
import TaskMenu from './TaskRelease/TaskMenu';
import TaskPop from './TaskRelease/TaskPopMenu';
import wangzhi from '../res/svg/wangzhi.svg';
import task_sure from '../res/svg/task_sure.svg';
import task_sure1 from '../res/svg/task_sure1.svg';
import erweima from '../res/svg/erweima.svg';
import fuzhi from '../res/svg/fuzhi.svg';
import tuwen from '../res/svg/tuwen.svg';
import yanzhengtu from '../res/svg/yanzhengtu.svg';
import shouji from '../res/svg/shouji.svg';
import {MORE_MENU} from './TaskRelease/TASK_MENU';
import TaskStepColumn from './TaskRelease/TaskStepColumn';
import NavigationUtils from '../navigator/NavigationUtils';
import {
    addTaskReleaseData,
    genTaskReleaseInfoData,
    selectTaskReleaseData,
    updateTaskReleaseData,
    uploadQiniuImage,
} from '../util/AppService';
import {connect} from 'react-redux';
import AppTskDefaultData from './TaskRelease/AppTskDefaultData';
import actions from '../action';
import {judgeTaskData} from '../util/CommonUtils';
import Toast from '../common/Toast';
import BackPressComponent from '../common/BackPressComponent';
import Global from '../common/Global';
import ToastSelect from '../common/ToastSelect';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
let PopButtomMenu = null;
const {width} = Dimensions.get('window');

class TextInputPro extends PureComponent {
    state = {
        defaultValue: this.props.rightComponentData.defaultValue,
    };

    componentWillReceiveProps(nextProps) {

        if (this.props.rightComponentData.defaultValue != nextProps.rightComponentData.defaultValue) {
            this.setState({
                defaultValue: nextProps.rightComponentData.defaultValue,
            });
        }
    }

    render() {
        const {rightComponentData} = this.props;
        return <TextInput
            value={this.state.defaultValue}
            editable={rightComponentData.editable}
            style={{flex: 1, color: 'black', padding: 0, fontSize: wp(3.8)}}
            placeholder={rightComponentData.info}
            placeholderTextColor={'#7b798d'}
            onChangeText={this._onChangeText}
        />;
    }

    _onChangeText = (text) => {
        this.setState({
            defaultValue: text,
        });
        this.props.rightComponentData.onChangeText(text);
    };
}

const genFormItem = (title, rightComponentType, rightComponentData) => {
    let rightComponent;
    let rightComponentSvg;

    switch (rightComponentType) {
        case 1:
            rightComponent = <TextInputPro rightComponentData={rightComponentData}/>;
            rightComponentSvg = null;
            break;
        case 2:
            rightComponent = <InputSelect
                popTitle={rightComponentData.popTitle}
                menuArr={rightComponentData.menuArr}
                select={rightComponentData.selectClick}
                defaultId={rightComponentData.defaultId}/>;
            rightComponentSvg = <SvgUri width={10} style={{marginLeft: 5}} height={10} svgXmlData={menu_right}/>;
            break;
        case 3:
            rightComponent = <RadioInfoComponent
                // key={title}
                radioArr={rightComponentData.radioArr}
                defaultId={rightComponentData.defaultId}
                select={rightComponentData.selectClick}/>;
            rightComponentSvg = null;

            break;
        case 4:
            rightComponent = <InputTextPro
                onChangeText={rightComponentData.onChangeText}
                defaultValue={rightComponentData.defaultValue}
                editable={rightComponentData.editable}
                placeComponent={rightComponentData.placeComponent}/>;
            rightComponentSvg = null;
            break;
        case 5:
            rightComponent = <View style={{flex: 1}}/>;
            rightComponentSvg = rightComponentData.svgCot;
            break;
    }
    return <View style={{
        width, flexDirection: 'row', height: hp(6.2), paddingHorizontal: 10, paddingVertical: 10,
        alignItems: 'center', borderBottomWidth: 0.3, borderBottomColor: 'rgba(0,0,0,0.1)',
    }}>
        <Text style={{width: width / 4.2, color: 'black', fontSize: wp(3.8)}}>{title}</Text>
        {rightComponent}
        {rightComponentSvg}
    </View>;
};

//屏幕最下面的提示
class ComplyColumn extends Component {
    state = {
        isTrue: true,
    };
    getIsTrue = () => {
        return this.state.isTrue;
    };

    render() {
        const {isTrue} = this.state;
        return <View style={{width, marginTop: 20, paddingTop: 20, marginBottom: 40}}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                    this.setState({
                        isTrue: !this.state.isTrue,
                    });
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>

                <SvgUri width={15} style={{marginLeft: 10, marginRight: 5}} height={15}
                        svgXmlData={isTrue ? task_sure1 : task_sure}/>


                <Text style={{fontSize: 13, color: 'black'}}>我已阅读并同意遵守</Text>
                <TouchableOpacity
                    activeOpacity={0.8}


                >
                    <Text style={{color: 'red', fontSize: 13}}>《发布规则》</Text>
                </TouchableOpacity>

                <Text style={{fontSize: 13, color: 'black'}}>全部内容</Text>
            </TouchableOpacity>
            <View style={{padding: 10}}>
                <Text
                    selectable={true}
                    style={{color: 'red', fontSize: 12}}>
                    {rule.release_prompt}
                </Text>
            </View>
        </View>;
    }
}

//发布整体布局
class TaskRelease extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                app_task_type: AppTskDefaultData.app_task_type,
                app_task_single_order: AppTskDefaultData.app_task_single_order,
                app_task_device: AppTskDefaultData.app_task_device,
                app_task_review_time: AppTskDefaultData.app_task_review_time,
                app_task_order_time_limit: AppTskDefaultData.app_task_order_time_limit,
                app_task_single_order_select: AppTskDefaultData.app_task_single_order_select,
            },
            showColumn: false,
        };
        this.params = this.props.navigation.state.params;
        const {update} = this.params;
        this.taskInfo = this.props.taskInfo;
        this.taskInfo.update = update;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        const data = this._getTaskReleaseData();
        this.props.onSetTaskReleaseInfo(data);
        this.timer && clearTimeout(this.timer);
    }


    _goReleaseTest = () => {
        //生成数据
        const FormData = this._getFormData();
        FormData.task_id = this.taskInfo.taskId;
        // FormData.update = this.taskInfo.update;
        const data = this._getTaskReleaseData();
        const fromUserinfo = this.props.userinfo;
        // console.log( data.columnData.orderReplayNum," data.orderReplayNum");
        const taskData = {
            title: data.columnData.title,
            projectTitle: data.columnData.projectTitle,
            TaskInfo: data.columnData.TaskInfo,
            rewardPrice: data.columnData.rewardPrice,
            taskSignUpNum: 0,
            rewardNum: data.columnData.rewardNum,
            orderTimeLimit: data.columnData.orderTimeLimit,
            reviewTime: data.columnData.reviewTime,
            taskType: data.typeData,
            taskPassNum: 0,
            taskNoPassNum: 0,
            singOrder: data.columnData.orderReplayNum,
        };
        const stepData = data.stepData;
        //console.log(taskData);
        NavigationUtils.goPage({
            fromUserinfo,
            taskData,
            stepData,
            test: true,
            FormData,
            update: this.taskInfo.update,
        }, 'TaskDetails');

    };
    //生成表单提交数据
    _getFormData = () => {
        const typeData = this.typeSelect.getTypeData();
        const deviceData = this.deviceSelect.getTypeData();
        const columnData = this.bIform.getColumnData();
        const stepData = (this.bIform.stepInfo && this.bIform.stepInfo.taskStep.getStepData()) || [];

        const task_type_id = typeData.id;
        const task_device_id = deviceData.id;
        const task_name = columnData.projectTitle;
        const task_title = columnData.title;
        const task_info = columnData.TaskInfo;
        const order_time_limit_id = columnData.orderTimeLimit.id;
        const review_time = columnData.reviewTime.id;
        let single_order_id = '';
        if (columnData.singleOrder.use) {
            single_order_id = columnData.singleOrder.id;
        } else {
            single_order_id = columnData.orderReplayNum.id;
        }
        const reward_price = columnData.rewardPrice;
        const reward_num = columnData.rewardNum;

        const stepIndex = stepData && stepData.findIndex(d => d.type == 5);
        // console.log(stepIndex, 'stepIndex');

        const task_uri = stepIndex !== -1 ? (stepIndex !== -1 ? stepData[stepIndex].typeData.uri : '') : '';

        const task_steps = JSON.stringify(stepData);
        return {
            task_type_id,
            task_device_id,
            task_name,
            task_title,
            task_info,
            order_time_limit_id,
            review_time,
            single_order_id,
            reward_price,
            reward_num,
            task_steps,
            task_uri,
        };

    };
    _addTaskReleaseData = () => {
        if (!this.taskInfo.update) {
            const data = this._getFormData();
            const error = judgeTaskData(data);
            if (error != '') {
                this.toast.show(error);
            } else {
                const {userinfo} = this.props;
                const {token} = userinfo;
                addTaskReleaseData(data, token).then(result => {
                    const {task_id} = result;
                    NavigationUtils.goPage({
                        task_id: task_id,
                        test: false,
                    }, 'TaskDetails');

                }).catch(err => {
                    this.toast.show(err);
                });
            }
        } else {
            const isTrue = this.complyColumn.getIsTrue();
            if (!isTrue) {
                this.toast.show('您未同意发布规则哦 ～ ～ ');
                return;

            }
            const {userinfo} = this.props;
            const {token} = userinfo;
            if (!token || token.length === 0) {
                this.toast.show('您未登录哦 ～ ～ ');
                return;
            }
            const data = this._getFormData();
            data.task_id = this.taskInfo.taskId;
            const error = judgeTaskData(data, true);
            if (error != '') {
                this.toast.show(error);
            } else {
                updateTaskReleaseData(data, token).then(result => {
                    NavigationUtils.goBack(this.props.navigation);
                    this.params.updatePage && this.params.updatePage();
                }).catch(err => {
                    this.toast.show(err);
                });
            }
        }


    };

    componentDidMount() {

        const {task_id, update} = this.params;
        const {userinfo} = this.props;
        if (task_id) {
            genTaskReleaseInfoData({task_id}, userinfo.token).then(taskInfo => {
                const stepData = JSON.parse(taskInfo.stepData);
                taskInfo.stepData = stepData;
                taskInfo.columnData.rewardPrice = taskInfo.columnData.rewardPrice.toString();
                taskInfo.columnData.rewardNum = taskInfo.columnData.rewardNum.toString();
                this.taskInfo = taskInfo;
                this.taskInfo.update = update;//加标示
                this.taskInfo.taskId = task_id;//加标示
                this.forceUpdate();
            });
        } else {
        }

        selectTaskReleaseData().then((result) => {
            this.setState({
                data: result,
            });
        });
        this.timer = setTimeout(() => {
            this.setState({
                showColumn: true,
            });
        }, Platform.OS === 'android' ? 200 : 150);
        this.backPress.componentDidMount();
    }

    renderColumn = () => {
        return <View style={{flex: 1, backgroundColor: '#e8e8e8'}}>
            <View style={{height: 40, backgroundColor: 'white'}}>
                <Text style={{fontSize: 15, marginTop: 10, marginLeft: 10, color: 'black'}}>请选择类型</Text>
            </View>
            <View style={{marginTop: 10, height: 40, backgroundColor: 'white'}}>
                <Text style={{fontSize: 15, marginTop: 10, marginLeft: 10, color: 'black'}}>支持设备</Text>
            </View>
            <View style={{backgroundColor: 'white', marginTop: 10}}>
                {this.getXuniTitle('项目名称', '请输入项目名称')}
                {this.getXuniTitle('标题', '关键字')}
                {this.getXuniTitle('任务说明', '需求备注')}
                {this.getXuniTitle('接单时限', '15分钟')}
                {this.getXuniTitle('做单次数', '每人一次')}
            </View>
            <View style={{backgroundColor: 'white', marginTop: 10}}>
                {this.getXuniTitle('悬赏单价', '最低 0.5 元')}
                {this.getXuniTitle('悬赏数量', '最少 10 单')}
                {this.getXuniTitle('预付赏金', '服务费、成交额12%')}

            </View>
            <View style={{backgroundColor: 'white', marginTop: 10}}>
                <View style={{
                    flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text style={{fontSize: 14, color: 'black'}}>添加步骤</Text>
                    <SvgUri width={20} style={{marginLeft: 5}} height={20}
                            svgXmlData={step_add}/>
                </View>

            </View>
            {/*顶部提示*/}
            <ComplyColumn ref={ref => this.complyColumn = ref}/>
        </View>;
    };
    getXuniTitle = (title, placeholder) => {
        return <View style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: Platform.OS === 'android' ? 10 : 15,
            alignItems: 'center',
        }}>
            <Text style={{fontSize: 15, color: 'black'}}>{title}</Text>
            <TextInput style={{marginLeft: 20, fontSize: 15, color: 'black', padding: 0}}
                       placeholderTextColor={'rgba(0,0,0,0.5)'}
                       placeholder={placeholder}/>
        </View>;
    };

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        const {userinfo} = this.props;
        const {data, showColumn} = this.state;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, this.taskInfo.update ? '任务修改' : '任务发布', null, bottomTheme, 'white', 16, () => {
            NavigationUtils.goPage({type: 1}, 'UserProtocol');
        }, false, true, '发布须知', 'white');
        //console.log(this.taskInfo);
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                {showColumn ? <ScrollView
                    // keyboardShouldPersistTaps={'always'}
                    ref={ref => this.scrollView = ref}
                    style={{backgroundColor: '#e8e8e8'}}>

                    <TypeSelect
                        defaultId={this.taskInfo.typeData.id}
                        typeArr={data.app_task_type}
                        ref={ref => this.typeSelect = ref}/>
                    <TypeSelect
                        defaultId={this.taskInfo.deviceData.id}
                        ref={ref => this.deviceSelect = ref}
                        typeArr={data.app_task_device}
                        style={{marginTop: 10}} title={'支持设备'}/>
                    {/*/!*栏目加步骤*!/*/}
                    <BottomInfoForm
                        taskInfo={this.taskInfo}
                        data={data}
                        userinfo={userinfo} ref={ref => this.bIform = ref}
                        scrollTo={this._scrollTo}
                        scollToEnd={this._scollToEnd}/>
                    {/*顶部提示*/}
                    <ComplyColumn ref={ref => this.complyColumn = ref}/>
                </ScrollView> : this.renderColumn()}

                <View style={{borderTopWidth: 0.5, borderTopColor: '#f6f6f6', flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={this._goReleaseTest}
                        activeOpacity={0.6}
                        style={{
                            height: 60,
                            width: width / 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: '#f6f6f6',
                        }}>
                        <SvgUri width={20} fill={'rgba(0,0,0,0.9)'} style={{marginLeft: 5}} height={20}
                                svgXmlData={task_yulan}/>
                        <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>预览</Text>
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
                        <Text style={{
                            fontSize: 15,
                            color: 'white',
                            marginLeft: 5,
                        }}>{this.taskInfo.update ? '确认修改' : '申请发布'}</Text>
                    </TouchableOpacity>
                </View>
                <ToastSelect
                    rightTitle={this.taskInfo.update ? '确认修改' : '确认发布'}
                    sureClick={() => {
                        this.toastS.hide();
                        this._addTaskReleaseData();
                    }}
                    ref={ref => this.toastS = ref}>
                    <View style={{
                        height: 30, backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                        paddingTop: 10,
                    }}>
                        <Text style={{fontSize: 14}}>{`是否确认此任务的${this.taskInfo.update ? '修改' : '发布'}？`}</Text>
                    </View>
                </ToastSelect>
            </SafeAreaViewPlus>
        );
    }


    _getTaskReleaseData = () => {
        const typeData = this.typeSelect.getTypeData();
        const deviceData = this.deviceSelect.getTypeData();
        const columnData = this.bIform.getColumnData();
        const stepData = this.bIform.stepInfo && this.bIform.stepInfo.taskStep.getStepData();
        return {
            typeData,
            deviceData,
            columnData,
            stepData,
        };
    };
    _scrollTo = (x, y, animated) => {
        this.scrollView.scrollTo({x: x, y: y, animated: animated});
    };
    _scollToEnd = () => {
        this.scrollView.scrollToEnd({animated: false, duration: 0});
    };
    // _scrollFun = {
    //     scrollToEnd: this.scrollView.scrollToEnd,
    // };

}

class BottomInfoForm extends Component {
    columnData = {
        orderTimeLimit: (this.props.taskInfo.columnData.orderTimeLimit && Object.keys(this.props.taskInfo.columnData.orderTimeLimit).length > 0) ? this.props.taskInfo.columnData.orderTimeLimit : this.props.data.app_task_order_time_limit[0],
        reviewTime: (this.props.taskInfo.columnData.reviewTime && Object.keys(this.props.taskInfo.columnData.reviewTime).length > 0) ? this.props.taskInfo.columnData.reviewTime : this.props.data.app_task_review_time[0],
        singleOrder: (this.props.taskInfo.columnData.singleOrder && Object.keys(this.props.taskInfo.columnData.singleOrder).length > 0) ? this.props.taskInfo.columnData.singleOrder : this.props.data.app_task_single_order[0],
        rewardNum: this.props.taskInfo.columnData.rewardNum,
        rewardPrice: this.props.taskInfo.columnData.rewardPrice,
        TaskInfo: this.props.taskInfo.columnData.TaskInfo,
        title: this.props.taskInfo.columnData.title,
        projectTitle: this.props.taskInfo.columnData.projectTitle,
        orderReplayNum: (this.props.taskInfo.columnData.orderReplayNum && Object.keys(this.props.taskInfo.columnData.orderReplayNum).length > 0) ? this.props.taskInfo.columnData.orderReplayNum : this.props.data.app_task_single_order_select[0],
    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.columnData = {
            orderTimeLimit: (this.props.taskInfo.columnData.orderTimeLimit && Object.keys(this.props.taskInfo.columnData.orderTimeLimit).length > 0) ? this.props.taskInfo.columnData.orderTimeLimit : this.props.data.app_task_order_time_limit[0],
            reviewTime: (this.props.taskInfo.columnData.reviewTime && Object.keys(this.props.taskInfo.columnData.reviewTime).length > 0) ? this.props.taskInfo.columnData.reviewTime : this.props.data.app_task_review_time[0],
            singleOrder: (this.props.taskInfo.columnData.singleOrder && Object.keys(this.props.taskInfo.columnData.singleOrder).length > 0) ? this.props.taskInfo.columnData.singleOrder : this.props.data.app_task_single_order[0],
            rewardNum: this.props.taskInfo.columnData.rewardNum,
            rewardPrice: this.props.taskInfo.columnData.rewardPrice,
            TaskInfo: this.props.taskInfo.columnData.TaskInfo,
            title: this.props.taskInfo.columnData.title,
            projectTitle: this.props.taskInfo.columnData.projectTitle,
            orderReplayNum: (this.props.taskInfo.columnData.orderReplayNum && Object.keys(this.props.taskInfo.columnData.orderReplayNum).length > 0) ? this.props.taskInfo.columnData.orderReplayNum : this.props.data.app_task_single_order_select[0],
        };
    }

    _changeProjectTitle = (text) => {
        this.columnData.projectTitle = text;
    };
    _changeTitle = (text) => {
        this.columnData.title = text;
    };
    _changeTaskInfo = (text) => {
        this.columnData.TaskInfo = text;
    };
    _SelectOrderTimeLimit = (item) => {
        this.columnData.orderTimeLimit = item;
    };
    _SelectReviewTime = (item) => {
        this.columnData.reviewTime = item;
    };
    _SelectSingleOrder = (item) => {
        this.columnData.singleOrder = item;
        if (item.id === 3) {
            this.replayNum.setNativeProps({
                style: {
                    height: 40,
                },
            });
            this.columnData.singleOrder.use = false;

        } else {
            this.replayNum.setNativeProps({
                style: {
                    height: 0,
                },
            });
            this.columnData.singleOrder.use = true;
        }


    };
    _selectReplayNum = (item) => {
        this.columnData.orderReplayNum = item;
    };
    _changeRewardPrice = (text) => {
        this.columnData.rewardPrice = text;
        if (this.columnData.rewardNum != 0 && this.columnData.rewardNum != 0) {
            this.inputSetting.setValue(((this.columnData.rewardNum * this.columnData.rewardPrice) * parseFloat(Global.user_service_fee)).toFixed(2));
        }

    };
    _changeRewardNum = (text) => {
        this.columnData.rewardNum = text;
        if (this.columnData.rewardNum != 0 && this.columnData.rewardNum != 0) {
            this.inputSetting.setValue(((this.columnData.rewardNum * this.columnData.rewardPrice) * parseFloat(Global.user_service_fee)).toFixed(2));
        }
    };
    _changePrepaidBounty = (text) => {
        this.columnData.prepaidBounty = text;
    };
    getColumnData = () => {
        return this.columnData;
    };
    // state = {
    //     showHistory: false,
    //     stepData: [],
    // };
    componentDidMount(): void {
        if (this.props.data && this.props.data.app_task_single_order) {
            const index = this.props.data.app_task_single_order.findIndex(e => e.id == this.columnData.singleOrder.id);
            if (index !== -1) {
                const item = this.props.data.app_task_single_order[index];
                this._SelectSingleOrder(item);
            }
        }
        if (this.columnData && this.columnData.rewardNum) {
            this._changeRewardNum(this.columnData.rewardNum);
        }

    }

    render() {
        // const {showHistory, stepData} = this.state;

        //悬赏单价
        const rewardPrice = <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: 'rgba(0,0,0,0.5)', fontSize:wp(3.8)}}>最低</Text>
            <Text style={{color: 'black', marginHorizontal: 5, fontSize:wp(3.8)}}>0.5</Text>
            <Text style={{color: 'rgba(0,0,0,0.5)', fontSize:wp(3.8)}}>元</Text>
        </View>;
        //悬赏数量
        const rewardNum = <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: 'rgba(0,0,0,0.5)', fontSize:wp(3.8)}}>最少</Text>
            <Text style={{color: 'black', marginHorizontal: 5, fontSize:wp(3.8)}}>10</Text>
            <Text style={{color: 'rgba(0,0,0,0.5)', fontSize:wp(3.8)}}>单</Text>
        </View>;
        const {userinfo} = this.props;
        return <View>
            <View style={{marginTop: 10, backgroundColor: 'white'}}>
                {genFormItem('项目名称', 1, {
                    info: '请输入项目名', onChangeText: this._changeProjectTitle,
                    editable: true, defaultValue: this.columnData.projectTitle,
                })}
                {genFormItem('标题', 1,
                    {
                        info: '关键字',
                        onChangeText: this._changeTitle,
                        editable: true,
                        defaultValue: this.columnData.title,
                    })}
                {genFormItem('任务说明', 1,
                    {
                        info: '需求备注',
                        onChangeText: this._changeTaskInfo,
                        editable: true,

                        defaultValue: this.columnData.TaskInfo,
                    })}


                {genFormItem('接单时限', 2, {
                    popTitle: '接单时限',
                    defaultId: this.columnData.orderTimeLimit.id,
                    menuArr: this.props.data.app_task_order_time_limit,
                    selectClick: this._SelectOrderTimeLimit,
                })}
                {genFormItem('审核时间', 2, {
                    popTitle: '审核时间',
                    defaultId: this.columnData.reviewTime.id,
                    menuArr: this.props.data.app_task_review_time,
                    selectClick: this._SelectReviewTime,
                })}
                {genFormItem('做单次数', 3, {
                    defaultId: this.columnData.singleOrder.id,
                    selectClick: this._SelectSingleOrder,
                    radioArr: this.props.data.app_task_single_order,
                })}

                <View style={{height: 0, overflow: 'hidden'}} ref={ref => this.replayNum = ref}>
                    {genFormItem('重复次数', 2, {
                        defaultId: this.columnData.orderReplayNum.id,
                        popTitle: '重复次数',
                        menuArr: this.props.data.app_task_single_order_select,
                        selectClick: this._selectReplayNum,
                    })}
                </View>
                <View style={{marginTop: 10}}/>


            </View>
            {/*{!this.props.taskInfo.update && }*/}
            <View style={{marginTop: 10, backgroundColor: 'white'}}>

                {genFormItem('悬赏单价', 4,
                    {
                        placeComponent: rewardPrice,
                        onChangeText: this._changeRewardPrice,
                        defaultValue: this.columnData.rewardPrice,
                        editable: !this.props.taskInfo.update,
                    })}
                {genFormItem('悬赏数量', 4,
                    {
                        placeComponent: rewardNum,
                        onChangeText: this._changeRewardNum,
                        defaultValue: this.columnData.rewardNum,
                        editable: !this.props.taskInfo.update,
                    })}
                {/*{genFormItem('预付赏金', 1, {info: '服务费、成交额12%', onchangeText: this._changePrepaidBounty, editable: false})}*/}
                <InputSetting
                    ref={ref => this.inputSetting = ref}
                    title={'预付赏金'} rightComponentData={{
                    info: '服务费、成交额12%',
                    onchangeText: this._changePrepaidBounty,
                    editable: false,
                }}/>
                {/*<View style={{position:'absolute',flex:1,width, height:150,backgroundColor:'rgba(0,0,0,0.1)'}}/>*/}
            </View>
            <StepInfo stepData={this.props.taskInfo.stepData} userinfo={userinfo} ref={ref => this.stepInfo = ref}
                      scrollTo={this.props.scrollTo}
                      scollToEnd={this.props.scollToEnd}/>
            {/*{this.props.taskInfo.stepData && this.props.taskInfo.stepData.length > 0 && !showHistory ? <View*/}

            {/*        style={{height: 80, width, justifyContent: 'center', alignItems: 'center'}}*/}
            {/*    >*/}
            {/*        <Text style={{color: 'blue'}}>是否显示历史存档?</Text>*/}
            {/*        <View style={{width: 150, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>*/}

            {/*            <TouchableOpacity*/}
            {/*                onPress={() => {*/}
            {/*                    this.setState({*/}
            {/*                        showHistory: true,*/}
            {/*                        stepData: this.props.taskInfo.stepData,*/}
            {/*                    });*/}
            {/*                }}*/}

            {/*            >*/}
            {/*                <Text style={{color: 'blue'}}>是</Text>*/}

            {/*            </TouchableOpacity>*/}
            {/*            <TouchableOpacity*/}
            {/*                onPress={() => {*/}
            {/*                    this.setState({*/}
            {/*                        showHistory: true,*/}
            {/*                        stepData: [],*/}
            {/*                    });*/}
            {/*                }}*/}

            {/*            >*/}
            {/*                <Text style={{color: 'blue'}}>否</Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*    </View> :*/}
            {/*    <StepInfo stepData={stepData} userinfo={userinfo} ref={ref => this.stepInfo = ref}*/}
            {/*              scrollTo={this.props.scrollTo}*/}
            {/*              scollToEnd={this.props.scollToEnd}/>}*/}
        </View>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
    taskInfo: state.taskInfo,
});
const mapDispatchToProps = dispatch => ({
    onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const TaskReleaseRedux = connect(mapStateToProps, mapDispatchToProps)(TaskRelease);

class InputSelect extends Component {
    state = {
        // info: this.props.info,
        defaultId: this.props.defaultId,
        showPopBtn: false,
    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.props.defaultId != nextProps.defaultId) {
            this.setState({
                defaultId: nextProps.defaultId,
            });
        }
    }

    render() {
        const {defaultId} = this.state;

        const index = this.props.menuArr.findIndex(e => e.id == defaultId);

        let title = '';
        if (index != -1) {
            title = this.props.menuArr[index].title;

        }

        return <View style={{flex: 1}}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    if (!this.state.showPopBtn) {
                        PopButtomMenu = require('./TaskRelease/PopButtomMenu').default;
                        this.setState({
                            showPopBtn: true,
                        }, () => {
                            this.dateMenu.show();
                        });
                    } else {
                        this.dateMenu.show();
                    }


                }}
            >
                <Text style={{fontSize: wp(3.8), color: 'black'}}>{title}</Text>
            </TouchableOpacity>
            {this.state.showPopBtn ?
                <PopButtomMenu popTitle={this.props.popTitle} menuArr={this.props.menuArr} select={this._select}
                               ref={ref => this.dateMenu = ref}/> : null}

        </View>;
    }

    _select = (item) => {
        // console.log(item, 'item..');
        this.setState({
            defaultId: item ? item.id : this.props.defaultId,
        });
        this.props.select(item);
    };
}

class InputTextPro extends Component {
    static defaultProps = {
        placeComponent: <Text>1111</Text>,
        defaultValue: '1111',
    };
    state = {
        defaultValue: this.props.defaultValue,
        showPlaceholder: true,
    };

    constructor(props) {
        super(props);

    }

    render() {
        // console.log(this.props.defaultValue.length,"this.props.defaultValue1")
        return <View style={{flex: 1, justifyContent: 'center'}}>
            {this.state.showPlaceholder && <TouchableOpacity
                ref={ref => this.btn = ref}
                activeOpacity={1}
                onPress={this.hidePlaceholder}
                // style={{position: 'absolute'}}
            >
                {this.props.placeComponent}
            </TouchableOpacity>}
            {!this.state.showPlaceholder && <TextInput
                value={this.state.defaultValue}
                maxLength={5}
                editable={this.props.editable}
                keyboardType={'number-pad'}
                onFocus={this.hidePlaceholder}
                onBlur={this._onBlur}
                onChangeText={this._onChangeText}
                ref={ref => this.ipt = ref} style={{flex: 1, color: 'black', padding: 0, fontSize:wp(3.8)}}/>}

        </View>;
    }

    componentDidMount(): void {
        if (this.props.defaultValue.length > 0) {

            // this._onChangeText(this.props.defaultValue);
            this.setState({
                showPlaceholder: false,
            });
        }
    }

    //
    // componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    //     console.log(nextProps.defaultValue,"nextProps.defaultValue");
    //     if(this.props.defaultValue !== nextProps.defaultValue && nextProps.defaultValue.length > 0){
    //         console.log('我被执行');
    //         this.setState({
    //             showPlaceholder: false,
    //             defaultValue:nextProps.defaultValue
    //         });
    //     }
    // }

    _onChangeText = (text) => {
        this.setState({
            defaultValue: text,
            showPlaceholder: text.length === 0 ? true : false,
        });
        this.props.onChangeText(text);
    };
    _onBlur = () => {
        if (this.state.defaultValue.length === 0) {
            this.showPlaceholder();
        }
    };
    showPlaceholder = () => {
        this.setState({
            showPlaceholder: true,
        });

    };
    hidePlaceholder = () => {
        this.setState({
            showPlaceholder: false,
        }, () => {
            this.ipt.focus();
        });
    };
}

class RadioInfoComponent extends Component {
    static defaultProps = {
        radioArr: [],
        defaultId: 1,
    };
    state = {
        id: this.props.defaultId,
    };
    _radioClick = (item, index) => {
        // console.log(index);
        this.setState({
            id: item.id,
        });
        this.props.select(item);
    };
    // constructor(props){
    //     super(props);
    //     const index = props.radioArr.findIndex(e => e.id == props.defaultId);
    //     // this.props.select(props.radioArr[index]);
    //     console.log(props.radioArr[index],"props.radioArr[index]");
    // }
    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.props.defaultId != nextProps.defaultId) {
            const index = nextProps.radioArr.findIndex(e => e.id == nextProps.defaultId);
            this.props.select(nextProps.radioArr[index]);
            this.setState({
                id: nextProps.defaultId,
            });
        }
    }

    genRadio = (item, Nindex) => {
        // console.log(item, 'itemitem');
        return <TouchableOpacity
            key={item.id}
            activeOpacity={0.6}
            onPress={() => {
                this._radioClick(item, Nindex);
            }}
            style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
            <View>
                <View style={{borderWidth: 1, borderColor: 'black', borderRadius: 10, width: 13, height: 13}}/>
                {this.state.id == item.id && <View style={{
                    position: 'absolute', top: 2.5, left: 2.5, width: 8, height: 8, backgroundColor: bottomTheme,
                    borderRadius: 8,
                }}/>}
            </View>
            <Text style={{fontSize: wp(3.8), marginLeft: 5, color: 'black'}}>{item.title}</Text>
        </TouchableOpacity>;
    };

    render() {
        const {radioArr} = this.props;
        return <View style={{flex: 1, flexDirection: 'row'}}>
            {radioArr.map((item, Nindex, arr) => {

                return this.genRadio(item, Nindex);

            })}

        </View>;
    }
}


//预付赏金
class InputSetting extends Component {
    state = {
        value: '',
    };

    render() {
        const {rightComponentData, title} = this.props;
        return <View style={{
            width, flexDirection: 'row', height: 40, paddingHorizontal: 10, paddingVertical: 10,
            alignItems: 'center', borderBottomWidth: 0.3, borderBottomColor: 'rgba(0,0,0,0.1)',
        }}>
            <Text style={{width: width / 4.2, fontSize: wp(3.8), color: 'black'}}>{title}</Text>
            <TextInput
                editable={rightComponentData.editable}
                style={{flex: 1, color: 'red', padding: 0, fontSize: wp(3.8)}}
                placeholder={rightComponentData.info}
                placeholderTextColor={'#7b798d'}
                onChangeText={this._onChangeText}
                value={this.state.value}
            />
        </View>;
    }

    setValue = (text) => {
        //console.log(text);
        this.setState({
            value: text.toString(),
        });
    };
    _onChangeText = (text) => {
        this.setState({
            value: text,
        });
        this.props.rightComponentData.onChangeText(text);
    };
}

//步骤
class StepInfo extends Component {
    menuArr = [
        {
            title: '输入网址', svg: wangzhi, click: () => {
                this.taskPop.show(MORE_MENU.wangzhi.title, MORE_MENU.wangzhi.arr, MORE_MENU.wangzhi.type);
            },
        },
        {
            title: '二维码', svg: erweima, click: () => {
                this.taskPop.show(MORE_MENU.erweima.title, MORE_MENU.erweima.arr, MORE_MENU.erweima.type);
            },
        },
        {
            title: '复制数据', svg: fuzhi, click: () => {
                this.taskPop.show(MORE_MENU.fuzhishuju.title, MORE_MENU.fuzhishuju.arr, MORE_MENU.fuzhishuju.type);
            },
        },
        {
            title: '图文说明', svg: tuwen, click: () => {
                this.taskPop.show(MORE_MENU.tuwenshuoming.title, MORE_MENU.tuwenshuoming.arr, MORE_MENU.tuwenshuoming.type);
            },
        },
        {
            title: '验证图', svg: yanzhengtu, click: () => {
                this.taskPop.show(MORE_MENU.yanzhengtu.title, MORE_MENU.yanzhengtu.arr, MORE_MENU.yanzhengtu.type);
            },
        },
        {
            title: '收集信息', svg: shouji, click: () => {
                this.taskPop.show(MORE_MENU.shoujixinxi.title, MORE_MENU.shoujixinxi.arr, MORE_MENU.shoujixinxi.type);
            },
        },
    ];
    _findColumnInfoForType = (type) => {
        switch (type) {
            case MORE_MENU.wangzhi.type:
                return MORE_MENU.wangzhi;
            case MORE_MENU.erweima.type:
                return MORE_MENU.erweima;
            case MORE_MENU.fuzhishuju.type:
                return MORE_MENU.fuzhishuju;
            case MORE_MENU.tuwenshuoming.type:
                return MORE_MENU.tuwenshuoming;
            case MORE_MENU.yanzhengtu.type:
                return MORE_MENU.yanzhengtu;
            case MORE_MENU.shoujixinxi.type:
                return MORE_MENU.shoujixinxi;
        }
    };

    render() {
        return <View>
            {/*步骤计划图*/}
            <TaskStepColumn
                stepArr={this.props.stepData}
                userinfo={this.props.userinfo}
                // imageClick={(images) => {
                //     this.imageViewerModal.show(images);
                // }}

                edit={(no, type, typeData, timestamp) => {
                    const Menu = this._findColumnInfoForType(type);
                    this.taskPop.show(Menu.title, Menu.arr, Menu.type, typeData, true, '更新', no);
                }}
                ref={ref => this.taskStep = ref}
            />


            <View style={{marginTop: 10, backgroundColor: 'white'}}>
                {genFormItem('添加步骤', 5, {
                    info: '请输入项目名', svgCot: <TouchableOpacity
                        ref={ref => this.svg = ref}
                        onPress={this._svgClick}
                    >
                        <SvgUri width={20} style={{marginLeft: 5}} height={20}
                                svgXmlData={step_add}/>
                    </TouchableOpacity>,
                })}
            </View>
            {/*类型弹窗*/}
            <TaskMenu menuArr={this.menuArr} ref={ref => this.laPop = ref}>
                {this.menuArr.length > 0 && this.menuArr.map((item, index, arr) => {
                    return this.genMenu(item.title, item.svg, item.click, index);
                })}
            </TaskMenu>
            {/*具体类型*/}
            <TaskPop

                // 弹窗确认按钮被单击
                sureClick={(data, type, stepNo, rightTitle, timestamp_) => {
                    // 获取一个时间戳
                    const timestamp = !timestamp_ ? new Date().getTime() : timestamp_;//有则保存 无则创建
                    let imageData = {};
                    if (data.uri && Object.prototype.toString.call(data.uri) === '[object Object]') { //是否是本地图片

                        imageData = data.uri;
                        data.uri = `file://${imageData.path}`;//先展示本地数据
                        this.taskStep.setStepDataArr(type, data, stepNo, timestamp);
                        // 上传至云空间
                        setTimeout(() => {
                            const {userinfo} = this.props;
                            if (imageData.mime) {
                                let mime = imageData.mime;
                                const mimeIndex = mime.indexOf('/');
                                mime = mime.substring(mimeIndex + 1, mime.length);
                                const uri = `file://${imageData.path}`;
                                uploadQiniuImage(userinfo.token, 'stepFile', mime, uri).then(URL => {
                                    this.taskStep.setImageStatusOrUrl(timestamp, 1, URL);
                                }).catch(err => {
                                    this.taskStep.setImageStatusOrUrl(timestamp, -1, '');
                                });
                            } else {
                                this.taskStep.setImageStatusOrUrl(timestamp, -1, '');
                            }

                        }, 1000);


                    } else {
                        this.taskStep.setStepDataArr(type, data, stepNo, timestamp);
                    }

                    if (rightTitle === '添加') {
                        setTimeout(() => {
                            this.props.scollToEnd();
                        }, 200);
                    }
                }}
                ref={ref => this.taskPop = ref}/>
        </View>;

    }

    genMenu = (title, svgXmlData, click, index) => {
        return <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            onPress={() => {
                this.laPop.hide(false);
                click();
            }
            }
            style={{
                width: 100, height: 35,
                alignItems: 'center', flexDirection: 'row',
            }}>
            <SvgUri width={20} style={{marginHorizontal: 5}} fill={'black'} height={20} svgXmlData={svgXmlData}/>
            <Text style={{fontSize: 15, color: 'black'}}>{title}</Text>
        </TouchableOpacity>;
    };
    _svgClick = () => {
        this.props.scollToEnd();
        const handle = findNodeHandle(this.svg);
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            this.laPop.show(pageX, pageY);
        });
    };
}

class TypeSelect extends Component {

    static defaultProps = {
        title: '请选择类型',
        typeArr: [],
        defaultId: 1,
    };
    state = {
        id: this.props.defaultId,
    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.props.defaultId != nextProps.defaultId) {
            this.setState({
                id: nextProps.defaultId,
            });
        }
    }

    render() {
        const {title, typeArr} = this.props;
        return <View style={[{backgroundColor: 'white', paddingBottom: 20}, this.props.style]}>
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
                <Text style={{fontSize: 15, color: 'black'}}>{title}</Text>
            </View>
            <View style={{

                flexDirection: 'row',
                flexWrap: 'wrap',

            }}>
                {typeArr.map((item, index, arr) => {
                    return <TypeComponent checked={this.state.id === item.id ? true : false} ref={`typeBtn${item.id}`}
                                          key={item.id}
                                          onPress={this._typeClick}
                                          data={item} index={item.id}/>;

                })}

            </View>
        </View>;
    }

    // typeData = this.props.typeArr[this.st];
    _typeClick = (index, data, checked) => {
        if (checked) {
            this.typeData = data;
            //console.log(data.id, 'data.id');
            this.setState({
                id: data.id,
            });
        }

    };
    getTypeData = () => {
        const index = this.props.typeArr.findIndex(e => e.id == this.state.id);
        if (index != -1) {
            return this.props.typeArr[index];
        } else {
            return {};
        }

    };
}

class TypeComponent extends Component {
    static defaultProps = {
        data: {id: 1, title: 'test'},
    };


    componentDidMount(): void {

    }


    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.checked != nextProps.checked || this.props.data.title != nextProps.data.title || this.props.data.id != nextProps.data.id) {
            return true;
        }
        return false;
    }

    _onPress = () => {
        this.props.onPress(this.props.index, this.props.data, true);

    };

    render() {
        const {checked, data} = this.props;

        return <TouchableOpacity
            onPress={this._onPress}
            style={[{
                width: width / 4 - 20,
                height: hp(4.3),
                marginTop: 10,
                backgroundColor: '#f1f1f1',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10,
                borderRadius: 3,
                borderWidth: 0.3,
                borderColor: 'rgba(0,0,0,0.2)',
            }, !checked ? {backgroundColor: '#f3f3f3'} : {
                backgroundColor: 'rgba(33,150,243,0.1)',
                borderWidth: 0.3, borderColor: bottomTheme,
            }]}>
            <Text style={[{
                fontSize: wp(3.8),
                color: 'rgba(255,255,255,0.5)',
                opacity: 0.8,
            }, !checked ? {
                color: 'black',
                opacity: 0.7,
            } : {color: bottomTheme}]}>{data.title}</Text>
        </TouchableOpacity>;
    }
}

export default TaskReleaseRedux;
