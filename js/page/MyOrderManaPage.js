/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Text, TextInput, ScrollView, TouchableOpacity, Image, View, Dimensions} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import {StatusBar} from 'react-native';
import ViewUtil from '../util/ViewUtil';
import jiaoliu from '../res/svg/jiaoliu.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import Toast from '../common/Toast';
import SvgUri from 'react-native-svg-uri';
import task_icon from '../res/svg/task_icon.svg';
import menu_right from '../res/svg/menu_right.svg';
import LabelBigComponent from '../common/LabelBigComponent';
import {addUserTaskNum, selectTaskInfo_, updateUserTaskPrice} from '../util/AppService';
import {connect} from 'react-redux';
import MyModalBoxTwo from '../common/MyModalBoxTwo';

const {width} = Dimensions.get('window');

class MyOrderManaPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    state = {
        // interVal: 100,
        taskInfo: {},

    };

    componentDidMount() {
        this._updatePage();

    }

    _updatePage = () => {
        const {userinfo} = this.props;
        const {taskid} = this.params;

        selectTaskInfo_({
            task_id: taskid,
        }, userinfo.token).then(result => {
            console.log(result, 'result');
            this.setState({
                taskInfo: result,
            });
        });
    };

    componentWillUnmount() {

    }

    getTaskItem = (taskInfo) => {
        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: this.params.taskid}, 'TaskDetails');
            }}
            activeOpacity={0.6}
            style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingTop: 18,
                height: 80,
                backgroundColor: 'white',

            }}
        >
            <View style={{
                height: 45,
                width: 43,
                backgroundColor: bottomTheme,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
            }}>
                <SvgUri width={25} height={25} fill={'white'} svgXmlData={task_icon}/>
            </View>
            {/*左上*/}
            <View style={{
                position: 'absolute',
                top: 17,
                left: 60,
                flexDirection: 'row',
            }}>
                <Text style={{
                    fontSize: 15,
                    color: 'black',
                }}>{taskInfo.id} - {taskInfo.task_title}</Text>
            </View>
            {/*左下*/}
            <View style={{
                position: 'absolute',
                bottom: 15,
                left: 60,
                flexDirection: 'row',
            }}>
                <LabelBigComponent paddingVertical={3} paddingHorizontal={8} fontSize={11} title={taskInfo.task_info}/>
            </View>
            {/*右上*/}
            <View style={{
                position: 'absolute',
                top: 25,
                right: 30,
            }}>
                <Text style={{
                    fontSize: 16,
                    color: 'red',
                }}>+{taskInfo.reward_price}元</Text>
            </View>
            {/*右下*/}
            <View style={{
                position: 'absolute',
                bottom: 15,
                right: 30,
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                <Text style={{
                    fontSize: 13,
                    opacity: 0.5,
                }}>浏览次数:{taskInfo.browse_num}</Text>

            </View>
            <View style={{
                position: 'absolute',
                bottom: 20,
                right: 5,
                alignItems: 'center',
            }}>
                <SvgUri width={20} height={20} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>
            </View>
        </TouchableOpacity>;
    };

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let TopColumn = ViewUtil.getTopColumn(this._goChatPage, '任务管理', jiaoliu, null, null, null, () => {
            // const data = this.taskDatas[this.pageIndex];
        }, false);
        const {taskInfo} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
                bottomInset={false}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <ScrollView style={{flex: 1, backgroundColor: '#e8e8e8'}}>
                    {this.getTaskItem(taskInfo)}
                    <View style={{
                        width: width - 20,
                        height: 0.3,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        alignSelf: 'center',
                    }}/>
                    <View style={{
                        height: 60, backgroundColor: 'white', width: width, justifyContent: 'center',
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            width: (width) / 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            paddingRight: 10,
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: 15, marginRight: 10}}>剩余数量:</Text>
                                <Text>{(parseInt(taskInfo.reward_num) - parseInt(taskInfo.task_sign_up_num))}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    this.myModalBoxNum.show();
                                }}
                                style={{
                                    width: 45, height: 25, backgroundColor: bottomTheme, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 3,
                                }}>
                                <Text style={{color: 'white'}}>加量</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            width: (width - 40) / 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            paddingRight: 10,
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: 15, marginRight: 10}}>佣金:</Text>
                                <Text>{(parseInt(taskInfo.reward_price))}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    this.myModalBoxPrice.show();
                                }}
                                style={{
                                    width: 45, height: 25, backgroundColor: bottomTheme, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 3,
                                }}>
                                <Text style={{color: 'white'}}>加价</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        width: width - 20,
                        height: 0.5,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        alignSelf: 'center',
                    }}/>


                    {this.getColumn(taskInfo)}
                    {this.getBottomColumn(taskInfo)}


                </ScrollView>
                <MyModalBoxTwo
                    sureClick={this._sureAddNum}
                    title={'增加数量'}
                    ref={ref => this.myModalBoxNum = ref}>
                    <UpdateTaskNum
                        ref={ref => this.updateTaskNum = ref}
                        rewardPrice={taskInfo.reward_price}
                    />

                </MyModalBoxTwo>
                <MyModalBoxTwo
                    sureClick={this._sureAddPrice}
                    title={'增加价格'}
                    ref={ref => this.myModalBoxPrice = ref}>
                    <UpdateTaskPrice
                        ref={ref => this.updateTaskPrice = ref}
                        rewardPrice={taskInfo.reward_price}
                        rewardNum={taskInfo.reward_num}
                        taskSignUpNum={taskInfo.task_sign_up_num}
                    />

                </MyModalBoxTwo>
            </SafeAreaViewPlus>
        );
    }

    _sureAddPrice = () => {
        const {userinfo} = this.props;

        const {taskInfo} = this.state;
        const new_price = this.updateTaskPrice.getNewPrice();
        updateUserTaskPrice({
            task_id: taskInfo.id,
            new_price,
        }, userinfo.token).then(result => {
            setTimeout(() => {
                this._updatePage();
                this.toast.show('加价成功');
            }, 200);
        }).catch(msg => {
            this.toast.show(msg);
        });
    };
    getBottomColumn = (taskInfo) => {
        return <View style={{
            marginTop: 20,
            width: width,
            // height: 60,
            backgroundColor: 'white',
            flexDirection: 'row',
            flexWrap: 'wrap',
        }}>
            <TouchableOpacity
                onPress={() => {
                    console.log('111');
                    NavigationUtils.goPage({
                        title: '已完成列表',
                        status: 1,
                        taskid: this.state.taskInfo.id,
                    }, 'TaskSendFromUserList');
                }}
                style={{
                    flexDirection: 'row', alignItems: 'center', width: (width) / 2,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                <Text>已完成：{(parseInt(taskInfo.task_pass_num))}</Text>
                <SvgUri width={15} height={15} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    NavigationUtils.goPage({
                        task_id: this.state.taskInfo.id,
                        type: 3,
                    }, 'MessageTypePage');
                }}
                style={{
                    flexDirection: 'row', alignItems: 'center', width: (width) / 2,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                <Text>投诉：{(parseInt(taskInfo.complaintCount))}</Text>
                <SvgUri width={15} height={15} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    NavigationUtils.goPage({
                        title: '进行中列表',
                        status: 0,
                        taskid: this.state.taskInfo.id,
                    }, 'TaskSendFromUserList');
                }}
                style={{
                    flexDirection: 'row', alignItems: 'center', width: (width) / 2,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                <Text>进行中：{(parseInt(taskInfo.task_sign_up_num) - parseInt(taskInfo.task_pass_num))}</Text>
                <SvgUri width={15} height={15} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=>{
                    NavigationUtils.goPage({
                        task_id: this.state.taskInfo.id,
                        type: 2,
                    }, 'MessageTypePage');
                }}
                style={{
                flexDirection: 'row', alignItems: 'center', width: (width) / 2,
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingVertical: 10,
            }}>
                <Text>申诉：{(parseInt(taskInfo.appealCount))}</Text>
                <SvgUri width={15} height={15} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    NavigationUtils.goPage({
                        title: '已驳回列表',
                        status: -1,
                        taskid: this.state.taskInfo.id,
                    }, 'TaskSendFromUserList');

                }}
                style={{
                    flexDirection: 'row', alignItems: 'center', width: (width) / 2,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                <Text>已驳回：{(parseInt(taskInfo.task_noPass_num))}</Text>
                <SvgUri width={15} height={15} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>
            </TouchableOpacity>
        </View>;
    };
    getColumn = () => {
        return <View style={{
            width,
            paddingVertical: 10, backgroundColor: 'white', paddingHorizontal: 10, flexDirection: 'row',
            flexWrap: 'wrap',
        }}>
            <TouchableOpacity style={{
                width: (width - 20) / 4,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../res/img/orderMana/xiugai.png')}
                       style={{width: 18, height: 18}}/>
                <Text style={{marginTop: 5}}>修改</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                width: (width - 20) / 4,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../res/img/orderMana/shangjia.png')}
                       style={{width: 20, height: 20}}/>
                <Text style={{marginTop: 5}}>上架</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                width: (width - 20) / 4,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../res/img/orderMana/xiajia.png')}
                       style={{width: 20, height: 20}}/>
                <Text style={{marginTop: 5}}>下架</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                width: (width - 20) / 4,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../res/img/orderMana/fenxiang.png')}
                       style={{width: 23, height: 23}}/>
                <Text style={{marginTop: 5}}>分享</Text>
            </TouchableOpacity>

        </View>;
    };
    _sureAddNum = () => {
        const {userinfo} = this.props;

        const {taskInfo} = this.state;
        const nowTaskNum = this.updateTaskNum.getNewTaskNum();
        addUserTaskNum({
            task_id: taskInfo.id,
            add_num: nowTaskNum,
        }, userinfo.token).then(result => {
            // console.log(result);
            setTimeout(() => {
                this._updatePage();
                this.toast.show('加量成功');
            }, 200);

        }).catch(msg => {
            this.toast.show(msg);
        });
    };
}

class UpdateTaskPrice extends PureComponent {
    state = {
        price: 0,
        error: false,
    };
    getNewPrice = () => {
        return this.priceText;

    };

    render() {
        const {rewardNum, rewardPrice} = this.props;
        const {price, error} = this.state;
        return <View style={{backgroundColor: 'white', paddingHorizontal: 10, paddingTop: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>当前数量：</Text>
                <Text style={{color: 'red'}}>{rewardNum}</Text>
            </View>
            <View style={{paddingVertical: 10}}>
                <TextInput
                    keyboardType={'number-pad'}
                    placeholder={'输入调整的价格'}
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    maxLength={4}
                    onChangeText={text => {
                        this.priceText = text;
                        this.setState({
                            error: !(parseInt(text) > parseInt(rewardPrice)),
                        });
                        if (parseInt(text) > parseInt(rewardPrice)) {
                            this.setState({
                                price: (parseInt(text) - parseInt(rewardPrice)) * rewardNum.toFixed(2),
                            });
                        } else {

                        }
                    }}
                    style={{
                        padding: 0,
                        borderWidth: 0.3,
                        borderColor: error ? 'red' : 'rgba(0,0,0,0.3)',
                        height: 30,
                        borderRadius: 5,
                        paddingHorizontal: 5,

                    }}/>
            </View>
            <View style={{height: 20, backgroundColor: 'white'}}>
                <Text style={{color: 'rgba(0,0,0,0.8)'}}>本次调整所需金额(包含服务费)：{price}元</Text>
            </View>
        </View>;

    }
}

class UpdateTaskNum extends PureComponent {
    state = {
        price: 0,
        error: false,
    };
    getNewTaskNum = () => {
        return this.numText;
    };

    render() {
        const {rewardPrice} = this.props;
        const {price} = this.state;
        return <View style={{backgroundColor: 'white', paddingHorizontal: 10, paddingTop: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>当前价格：</Text>
                <Text style={{color: 'red'}}>{rewardPrice}元</Text>
            </View>
            <View style={{paddingVertical: 10}}>
                <TextInput
                    keyboardType={'number-pad'}
                    placeholder={'输入调整的数量'}
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    maxLength={4}
                    onChangeText={text => {
                        this.numText = text;
                        this.setState({
                            price: (parseInt(text) * parseInt(rewardPrice) * 1.05).toFixed(2),
                        });
                    }}
                    style={{
                        padding: 0,
                        borderWidth: 0.3,
                        borderColor: 'rgba(0,0,0,0.3)',
                        height: 30,
                        borderRadius: 5,
                        paddingHorizontal: 5,

                    }}/>
            </View>
            <View style={{height: 20, backgroundColor: 'white'}}>
                <Text style={{color: 'rgba(0,0,0,0.8)'}}>本次调整所需金额(包含服务费)：{price}元</Text>
            </View>
        </View>;

    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const MyOrderManaPageRedux = connect(mapStateToProps, mapDispatchToProps)(MyOrderManaPage);
export default MyOrderManaPageRedux;
