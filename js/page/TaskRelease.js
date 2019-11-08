/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput, findNodeHandle,
    UIManager} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import menu_right from '../res/svg/menu_right.svg';
import step_add from '../res/svg/step_add.svg';
import SvgUri from 'react-native-svg-uri';
import PopMenu from '../common/PopMenu';
import LocalAreaPop from '../common/LocalAreaPop';
import MyModalBox from '../common/MyModalBox';
import TaskForUrl from './TaskRelPops/TaskForUrl';

const {width, height} = Dimensions.get('window');

const genFormItem = (title, rightComponentType, rightComponentData) => {
    let rightComponent;
    let rightComponentSvg;

    switch (rightComponentType) {
        case 1:
            rightComponent = <TextInput style={{flex: 1, color: 'black', padding: 0, fontSize: 13}}
                                        placeholder={rightComponentData.info}
                                        placeholderTextColor={'#7b798d'}
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
            rightComponent = <InputTextPro placeComponent={rightComponentData.placeComponent}/>;
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

class StepAddMenu extends Component {
    render() {
        return <View>

        </View>;
    }
}

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
        // const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <ScrollView style={{backgroundColor: '#e8e8e8'}}>
                    <TypeSelect/>
                    <TypeSelect style={{marginTop: 10}} title={'支持设备'} typeArr={[
                        {id: 1, title: '全部'},
                        {id: 2, title: '安卓'},
                        {id: 3, title: '苹果'},
                    ]}/>
                    <BottomInfoForm/>
                </ScrollView>
                {/*<PopMenu popTitle={this.props.popTitle} menuArr={this.props.menuArr} select={this._select}*/}
                {/*         ref={ref => this.dateMenu = ref}/>*/}
            </SafeAreaViewPlus>
        );
    }
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
            <PopMenu popTitle={this.props.popTitle} menuArr={this.props.menuArr} select={this._select}
                     ref={ref => this.dateMenu = ref}/>
        </View>;
    }

    _select = (item) => {
        console.log(item, 'item..');
        this.setState({
            info: item ? item.title : this.props.info,
        });
        this.props.select(item);
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
                onBlur={this.showPlaceholder}
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

    showPlaceholder = () => {
        this.ipt.setNativeProps({
            style: {
                // back
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


    render() {
        //悬赏单价
        const rewardPrice = <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'rgba(0,0,0,0.5)'}}>最低出价</Text>
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
                {genFormItem('项目名称', 1, {info: '请输入项目名'})}
                {genFormItem('标题', 1, {info: '关键字'})}
                {genFormItem('任务说明', 1, {info: '需求备注'})}


                {genFormItem('接单时限', 2, {
                    popTitle: '接单时限',
                    info: '1小时',
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
                    selectClick: () => {
                    },
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
                    selectClick: () => {
                    },
                })}
                {genFormItem('做单次数', 3, {
                    selectClick: (item) => {
                        // console.log(item);
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
                    },
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
                        selectClick: () => {
                        },
                    })}
                </View>
                {/*<View style={{marginTop: 10}}/>*/}


            </View>
            <View style={{marginTop: 10, backgroundColor: 'white'}}>
                {genFormItem('悬赏单价', 4, {placeComponent: rewardPrice})}
                {genFormItem('悬赏数量', 4, {placeComponent: rewardNum})}
                {genFormItem('预付赏金', 1, {info: '服务费、成交额12%'})}
            </View>
            <StepInfo/>

        </View>;

    }
}

//步骤
class StepInfo extends Component {
    render() {
        return <View>

            <View  style={{marginTop: 10, backgroundColor: 'white'}}>
                {genFormItem('添加步骤', 5, {
                    info: '请输入项目名', svgCot: <TouchableOpacity
                        ref={ref => this.svg = ref}
                        onPress={this._svgClick}
                    >
                        <SvgUri  width={20} style={{marginLeft: 5}} height={20}
                                svgXmlData={step_add}/>
                    </TouchableOpacity>,
                })}
            </View>
            <LocalAreaPop ref={ref => this.laPop = ref}/>
            <TaskForUrl/>
            <View style={{height:240,width, backgroundColor:'white'}}></View>
        </View>;

    }
    _svgClick=()=>{
        const handle = findNodeHandle(this.svg)
        UIManager.measure(handle,(x, y, width, height, pageX, pageY)=>{
            // console.log('相对父视图位置x:', x);
            // console.log('相对父视图位置y:', y);
            // console.log('组件宽度width:', width);
            // console.log('组件高度height:', height);
            // console.log('距离屏幕的绝对位置x:', pageX);
            // console.log('距离屏幕的绝对位置y:', pageY);
            this.laPop.show(pageX,pageY)
        });

        // ;
    }
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

    _typeClick = (index, data, checked) => {
        if (checked) {
            this.setState({
                typeIndex: index,
            });
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
