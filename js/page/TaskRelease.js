/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {
    View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput, findNodeHandle,
    UIManager,
} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import rule from '../res/text/rule';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import menu_right from '../res/svg/menu_right.svg';
import step_add from '../res/svg/step_add.svg';
import task_yulan from '../res/svg/task_yulan.svg';
import SvgUri from 'react-native-svg-uri';
import PopButtomMenu from '../common/PopButtomMenu';
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
import ImageViewerModal from '../common/ImageViewerModal';

const {width, height} = Dimensions.get('window');

const genFormItem = (title, rightComponentType, rightComponentData) => {
    let rightComponent;
    let rightComponentSvg;

    switch (rightComponentType) {
        case 1:
            rightComponent = <TextInput
                editable={rightComponentData.editable}
                style={{flex: 1, color: 'black', padding: 0, fontSize: 13}}
                placeholder={rightComponentData.info}
                placeholderTextColor={'#7b798d'}
                onChangeText={rightComponentData.onChangeText}
            />;
            rightComponentSvg = null;
            break;
        case 2:
            rightComponent = <InputSelect
                popTitle={rightComponentData.popTitle}
                menuArr={rightComponentData.menuArr}
                select={rightComponentData.selectClick}
                info={rightComponentData.info}/>;
            rightComponentSvg = <SvgUri width={10} style={{marginLeft: 5}} height={10} svgXmlData={menu_right}/>;
            break;
        case 3:
            rightComponent = <RadioInfoComponent select={rightComponentData.selectClick}/>;
            rightComponentSvg = null;

            break;
        case 4:
            rightComponent = <InputTextPro
                onChangeText={rightComponentData.onChangeText}
                placeComponent={rightComponentData.placeComponent}/>;
            rightComponentSvg = null;
            break;
        case 5:
            rightComponent = <View style={{flex: 1}}/>;
            rightComponentSvg = rightComponentData.svgCot;

            break;

    }
    return <View style={{
        width, flexDirection: 'row', height: 40, paddingHorizontal: 10, paddingVertical: 10,
        alignItems: 'center', borderBottomWidth: 0.3, borderBottomColor: 'rgba(0,0,0,0.1)',
    }}>
        <Text style={{width: width / 4.2, fontSize: 13}}>{title}</Text>
        {rightComponent}
        {rightComponentSvg}
    </View>;
};

//屏幕最下面的提示
class ComplyColumn extends Component {
    state = {
        isTrue: true,
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


                <Text style={{fontSize: 13}}>我已阅读并同意遵守</Text>
                <TouchableOpacity
                    activeOpacity={0.8}


                >
                    <Text style={{color: 'red', fontSize: 13}}>《发布规则》</Text>
                </TouchableOpacity>

                <Text style={{fontSize: 13}}>全部内容</Text>
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
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {


    }

    componentWillUnmount() {

    }

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
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '任务发布', null, bottomTheme, 'white', 16);
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}

                <ScrollView
                    ref={ref => this.scrollView = ref}
                    style={{backgroundColor: '#e8e8e8'}}>

                    <TypeSelect ref={ref => this.typeSelect = ref}/>
                    <TypeSelect ref={ref => this.deviceSelect = ref} style={{marginTop: 10}} title={'支持设备'} typeArr={[
                        {id: 1, title: '全部'},
                        {id: 2, title: '安卓'},
                        {id: 3, title: '苹果'},
                    ]}/>
                    <BottomInfoForm ref={ref => this.bIform = ref} scrollTo={this._scrollTo}
                                    scollToEnd={this._scollToEnd}/>
                    <ComplyColumn/>
                </ScrollView>
                <View style={{borderTopWidth: 0.5, borderTopColor: '#e8e8e8', flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={() => {
                            //
                            const typeData = this.typeSelect.getTypeData();
                            const deviceData = this.deviceSelect.getTypeData();
                            const columnData = this.bIform.getColumnData();
                            const stepData = this.bIform.stepInfo.taskStep.getStepData();
                            console.log(typeData, deviceData, columnData, stepData);
                            NavigationUtils.goPage({typeData, deviceData, columnData, stepData}, 'TaskDetails');
                        }}
                        activeOpacity={0.6}
                        style={{
                            height: 60,
                            width: width / 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <SvgUri width={20} fill={'rgba(0,0,0,0.9)'} style={{marginLeft: 5}} height={20}
                                svgXmlData={task_yulan}/>
                        <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.9)', marginLeft: 5}}>预览</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {

                            console.log(this.bIform.stepInfo.taskStep.getStepData());
                        }}
                        style={{
                            height: 60,
                            width: (width / 3) * 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: bottomTheme,
                        }}>
                        <Text style={{fontSize: 15, color: 'white', marginLeft: 5}}>申请发布</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaViewPlus>
        );
    }

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

class InputSelect extends Component {
    state = {
        info: this.props.info,

    };

    render() {
        return <View style={{flex: 1}}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    this.dateMenu.show();
                }}
            >
                <Text style={{fontSize: 13}}>{this.state.info}</Text>
            </TouchableOpacity>
            <PopButtomMenu popTitle={this.props.popTitle} menuArr={this.props.menuArr} select={this._select}
                           ref={ref => this.dateMenu = ref}/>
        </View>;
    }

    _select = (item) => {
        console.log(item, 'item..');
        this.setState({
            info: item ? item.title : this.props.info,
        });
        this.props.select(this.state.info);
    };
}

class InputTextPro extends Component {
    static defaultProps = {
        placeComponent: <Text>1111</Text>,
    };

    render() {
        return <View style={{flex: 1, justifyContent: 'center'}}>
            <TextInput
                maxLength={5}
                keyboardType={'number-pad'}
                onFocus={this.hidePlaceholder}
                onBlur={this._onBlur}
                onChangeText={this._onChangeText}
                ref={ref => this.ipt = ref} style={{flex: 1, backgroundColor: 'white'}}/>
            <TouchableOpacity
                ref={ref => this.btn = ref}
                activeOpacity={1}
                onPress={this.hidePlaceholder}
                style={{position: 'absolute'}}>
                {this.props.placeComponent}
            </TouchableOpacity>
        </View>;
    }

    inputText = '';
    _onChangeText = (text) => {
        this.inputText = text;
        this.props.onChangeText(text);
    };
    _onBlur = () => {
        if (this.inputText.length === 0) {
            this.showPlaceholder();
        }
    };
    showPlaceholder = () => {
        this.ipt.setNativeProps({
            style: {
                zIndex: 0,
            },
        });
        this.btn.setNativeProps({
            style: {
                zIndex: 1,
            },
        });
    };
    hidePlaceholder = () => {
        console.log('我被单击');

        this.ipt.setNativeProps({
            style: {
                // back
                zIndex: 1,
            },
        });
        this.btn.setNativeProps({
            style: {
                zIndex: 0,
            },
        });
        this.ipt.focus();

    };
}

class RadioInfoComponent extends Component {
    static defaultProps = {
        radioArr: [
            {id: 0, title: '每人一次'},
            {id: 1, title: '每人三次'},
            {id: 2, title: '每日一次'},
        ],
    };
    state = {
        index: 0,
    };
    _radioClick = (item, index) => {
        // console.log(index);
        this.setState({
            index,
        });
        this.props.select(item);
    };
    genRadio = (item, Nindex, index) => {
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                this._radioClick(item, Nindex);
            }}
            style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
            <View>
                <View style={{borderWidth: 1, borderColor: 'black', borderRadius: 10, width: 13, height: 13}}/>
                {Nindex == index && <View style={{
                    position: 'absolute', top: 2.5, left: 2.5, width: 8, height: 8, backgroundColor: bottomTheme,
                    borderRadius: 8,
                }}/>}
            </View>
            <Text style={{fontSize: 13, marginLeft: 5}}>{item.title}</Text>
        </TouchableOpacity>;
    };

    render() {
        const {radioArr} = this.props;
        const {index} = this.state;

        return <View style={{flex: 1, flexDirection: 'row'}}>
            {radioArr.map((item, Nindex, arr) => {
                return this.genRadio(item, Nindex, index);
            })}

        </View>;
    }
}


class BottomInfoForm extends Component {

    columnData = {
        orderTimeLimit: {id: 1, title: '6小时'},
        reviewTime: {id: 3, title: '1天'},
        singleOrder: {id: 1, title: '6小时'},
        rewardNum: 0,
        rewardPrice: 0,
    };
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
        if (item.id === 2) {
            this.replayNum.setNativeProps({
                style: {
                    height: 40,
                },
            });
        } else {
            this.replayNum.setNativeProps({
                style: {
                    height: 0,
                },
            });
        }
        this.columnData.singleOrder = item;
    };
    _selectReplayNum = (item) => {
        this.columnData.singleOrder = item;
    };
    _changeRewardPrice = (text) => {
        this.columnData.rewardPrice = text;
        if (this.columnData.rewardNum != 0 && this.columnData.rewardNum != 0) {
            this.inputSetting.setValue(this.columnData.rewardNum * this.columnData.rewardPrice + (this.columnData.rewardNum * this.columnData.rewardPrice) * 0.12);
        }

    };
    _changeRewardNum = (text) => {
        this.columnData.rewardNum = text;
        if (this.columnData.rewardNum != 0 && this.columnData.rewardNum != 0) {
            this.inputSetting.setValue(this.columnData.rewardNum * this.columnData.rewardPrice + (this.columnData.rewardNum * this.columnData.rewardPrice) * 0.12);
        }
    };
    _changePrepaidBounty = (text) => {
        this.columnData.prepaidBounty = text;
    };
    getColumnData = () => {
        return this.columnData;
    };

    render() {
        //悬赏单价
        const rewardPrice = <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'rgba(0,0,0,0.5)'}}>变色</Text>
            <Text style={{color: 'black', marginHorizontal: 5}}>0.5</Text>
            <Text style={{color: 'rgba(0,0,0,0.5)'}}>元</Text>
        </View>;
        //悬赏数量
        const rewardNum = <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'rgba(0,0,0,0.5)'}}>最少</Text>
            <Text style={{color: 'black', marginHorizontal: 5}}>10</Text>
            <Text style={{color: 'rgba(0,0,0,0.5)'}}>单</Text>
        </View>;


        return <View>
            <View style={{marginTop: 10, backgroundColor: 'white'}}>
                {genFormItem('项目名称', 1, {
                    info: '请输入项目名', onChangeText: this._changeProjectTitle,
                    editable: true,
                })}
                {genFormItem('标题', 1, {info: '关键字', onChangeText: this._changeTitle, editable: true})}
                {genFormItem('任务说明', 1, {info: '需求备注', onChangeText: this._changeTaskInfo, editable: true})}


                {genFormItem('接单时限', 2, {
                    popTitle: '接单时限',
                    info: '6小时',
                    menuArr: [
                        {id: 1, title: '6小时'},
                        {id: 2, title: '12小时'},
                        {id: 3, title: '1天'},
                        {id: 4, title: '2天'},
                        {id: 5, title: '3天'},
                        {id: 6, title: '4天'},
                        {id: 7, title: '5天'},
                        {id: 8, title: '一星期'},
                    ],

                    selectClick: this._SelectOrderTimeLimit,
                })}
                {genFormItem('审核时间', 2, {
                    popTitle: '审核时间',
                    info: '1天',
                    menuArr: [
                        {id: 1, title: '6小时'},
                        {id: 2, title: '12小时'},
                        {id: 3, title: '1天'},
                        {id: 4, title: '2天'},
                        {id: 5, title: '3天'},
                        {id: 6, title: '4天'},
                        {id: 7, title: '5天'},
                        {id: 8, title: '一星期'},
                    ],
                    selectClick: this._SelectReviewTime,
                })}
                {genFormItem('做单次数', 3, {
                    selectClick: this._SelectSingleOrder,
                })}
                <View style={{height: 0, overflow: 'hidden'}} ref={ref => this.replayNum = ref}>
                    {genFormItem('重复次数', 2, {
                        info: '2次',
                        popTitle: '重复次数',
                        menuArr: [
                            {id: 1, title: '2次'},
                            {id: 2, title: '3次'},
                            {id: 8, title: '无限'},
                        ],
                        selectClick: this._selectReplayNum,
                    })}
                </View>
                {/*<View style={{marginTop: 10}}/>*/}


            </View>
            <View style={{marginTop: 10, backgroundColor: 'white'}}>
                {genFormItem('悬赏单价', 4, {placeComponent: rewardPrice, onChangeText: this._changeRewardPrice})}
                {genFormItem('悬赏数量', 4, {placeComponent: rewardNum, onChangeText: this._changeRewardNum})}
                {/*{genFormItem('预付赏金', 1, {info: '服务费、成交额12%', onchangeText: this._changePrepaidBounty, editable: false})}*/}
                <InputSetting
                    ref={ref => this.inputSetting = ref}
                    title={'预付赏金'} rightComponentData={{
                    info: '服务费、成交额12%',
                    onchangeText: this._changePrepaidBounty,
                    editable: false,
                }}/>
            </View>
            <StepInfo ref={ref => this.stepInfo = ref} scrollTo={this.props.scrollTo}
                      scollToEnd={this.props.scollToEnd}/>

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
            <Text style={{width: width / 4.2, fontSize: 13}}>{title}</Text>
            <TextInput
                editable={rightComponentData.editable}
                style={{flex: 1, color: 'red', padding: 0, fontSize: 13}}
                placeholder={rightComponentData.info}
                placeholderTextColor={'#7b798d'}
                onChangeText={this._onChangeText}
                value={this.state.value}
            />
        </View>;
    }

    setValue = (text) => {
        console.log(text);
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

                imageClick={(index, images) => {
                    this.imageViewerModal.show(index, images);
                }}

                edit={(no, type, typeData) => {
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
            <TaskMenu menuArr={this.menuArr} ref={ref => this.laPop = ref}/>
            {/*具体类型*/}
            <TaskPop
                // 弹窗确认按钮被单击
                sureClick={(data, type, stepNo, rightTitle) => {
                    // console.log(stepNo, 'stepNo');

                    this.taskStep.setStepDataArr(type, data, stepNo);
                    // console.log(rightTitle);
                    if (rightTitle === '添加') {
                        setTimeout(() => {
                            this.props.scollToEnd();
                        }, 200);
                    }
                    // console.log(type, data);
                }}
                ref={ref => this.taskPop = ref}/>
            {/*图片浏览器*/}
            <ImageViewerModal
                ref={ref => this.imageViewerModal = ref}
            />
        </View>;

    }

    _svgClick = () => {
        this.props.scollToEnd();
        const handle = findNodeHandle(this.svg);
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            this.laPop.show(pageX, pageY);
        });


        // ;
    };
}

class TypeSelect extends PureComponent {

    static defaultProps = {
        title: '请选择类型',
        typeArr: [
            {id: 1, title: '注册'},
            {id: 2, title: '投票'},
            {id: 3, title: '关注'},
            {id: 4, title: '浏览'},
            {id: 5, title: '下载'},
            {id: 6, title: '转发'}, {id: 7, title: '下载'},
            {id: 8, title: '转发'}, {id: 9, title: '下载'},
            {id: 10, title: '转发'}, {id: 11, title: '下载'},
            {id: 12, title: '转发'}, {id: 13, title: '下载'},
            {id: 14, title: '转发'}, {id: 15, title: '下载'},
        ],
        index: 0,
    };
    state = {
        typeIndex: 0,
    };

    render() {
        const {title, typeArr} = this.props;
        const {typeIndex} = this.state;

        return <View style={[{backgroundColor: 'white', paddingBottom: 20}, this.props.style]}>
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
                <Text style={{fontSize: 15}}>{title}</Text>
            </View>
            <View style={{

                flexDirection: 'row',
                flexWrap: 'wrap',

            }}>
                {typeArr.map((item, index, arr) => {
                    return <TypeComponent checked={typeIndex === item.id ? true : false} ref={`typeBtn${item.id}`}
                                          key={item.id}
                                          onPress={this._typeClick}
                                          data={item} index={item.id}/>;

                })}

            </View>
        </View>;
    }

    typeData = {};
    _typeClick = (index, data, checked) => {
        if (checked) {
            this.typeData = data;
            this.setState({
                typeIndex: index,
            });
        }

    };
    getTypeData = () => {
        return this.typeData;
    };
}

class TypeComponent extends Component {
    static defaultProps = {
        data: {id: 1, title: 'test'},
    };


    componentDidMount(): void {

    }


    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.checked != nextProps.checked) {
            console.log('我该更新了');
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
                height: 25,
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
                fontSize: 14,
                color: 'rgba(255,255,255,0.5)',
                opacity: 0.8,
            }, !checked ? {
                color: 'black',
                opacity: 0.7,
            } : {color: bottomTheme}]}>{data.title}</Text>
        </TouchableOpacity>;
    }
}

export default TaskRelease;
