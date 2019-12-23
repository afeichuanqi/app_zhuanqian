/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Text, TextInput, ScrollView, TouchableOpacity, Image, View, Dimensions, RefreshControl} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import {StatusBar} from 'react-native';
import ViewUtil from '../util/ViewUtil';
import jiaoliu from '../res/svg/jiaoliu.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import Toast from '../common/Toast';
import SvgUri from 'react-native-svg-uri';
import menu_right from '../res/svg/menu_right.svg';
import LabelBigComponent from '../common/LabelBigComponent';
import {addUserTaskNum, selectTaskInfo_, stopUserTask, updateUserTaskPrice} from '../util/AppService';
import {connect} from 'react-redux';
import MyModalBoxTwo from '../common/MyModalBoxTwo';
import ToastSelect from '../common/ToastSelect';
import BackPressComponent from '../common/BackPressComponent';
import FastImage from 'react-native-fast-image';
import {getEmojis} from '../util/CommonUtils';
import Emoji from 'react-native-emoji';

const {width} = Dimensions.get('window');

class MyOrderManaPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {
        // interVal: 100,
        taskInfo: {},
        isLoading:true

    };

    componentDidMount() {
        this.backPress.componentDidMount();
        this._updatePage();

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    _updatePage = () => {
        const {userinfo} = this.props;
        const {taskid} = this.params;
        this.setState({
            isLoading:true
        })
        selectTaskInfo_({
            task_id: taskid,
        }, userinfo.token).then(result => {
            this.setState({
                taskInfo: result,
                isLoading:false
            });
        }).catch(msg=>{
            this.setState({
                isLoading:false
            });
        })
    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    getTaskItem = (taskInfo) => {
        console.log(taskInfo);
        let taskTitle = taskInfo.task_title;
        let emojiArr = [];
        if(taskTitle){

            const json = getEmojis(taskTitle);
            if (json) {
                taskTitle = json.content;
                emojiArr = json.emojiArr;
            }
        }

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
            <FastImage
                style={{
                    height: 45,
                    width: 43,
                    backgroundColor: bottomTheme,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                }}
                source={{uri: taskInfo.task_uri}}
                resizeMode={FastImage.resizeMode.stretch}
            />
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
                }}>{taskInfo.id} - {taskTitle} {emojiArr.map((item) => {
                    return <Emoji name={item} style={{fontSize: 15}}/>;
                })}</Text>
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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '任务管理', jiaoliu, null, null, null, () => {
        }, false);
        const {taskInfo,isLoading} = this.state;
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
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            // title={'更新任务中'}
                            refreshing={isLoading}
                            onRefresh={this._updatePage}
                        />
                    }
                    style={{flex: 1, backgroundColor: '#e8e8e8'}}>
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
                                    alignItems: 'center', borderRadius: 5,
                                }}>
                                <Text style={{color: 'white', fontWeight:'bold'}}>加量</Text>
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
                                <Text>{(parseFloat(taskInfo.reward_price))}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    this.myModalBoxPrice.show();
                                }}
                                style={{
                                    width: 45, height: 25, backgroundColor: bottomTheme, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 5,
                                }}>
                                <Text style={{color: 'white', fontWeight:'bold'}}>加价</Text>
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
                <ToastSelect
                    rightTitle={'确认'}
                    sureClick={() => {
                        // const {task_status} = this.state.taskInfo;
                        const {userinfo} = this.props;
                        const {taskid} = this.params;
                        stopUserTask({
                            task_id: taskid,
                            task_status: 1,
                        }, userinfo.token).then(result => {
                            this.toastSelect.hide();
                            NavigationUtils.goBack(this.props.navigation);
                            this.params.updateReleasePage && this.params.updateReleasePage(true);
                        }).catch(msg => {
                            this.toast.show(msg);
                        });
                    }}
                    ref={ref => this.toastSelect = ref}>
                    <View style={{
                        height: 60, backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                        paddingTop: 10,

                    }}>
                        <Text style={{fontSize: 14, width: width - 80}}>下架后将删除此任务,您必须重新发布才能上架,是否确认？</Text>
                    </View>
                </ToastSelect>
            </SafeAreaViewPlus>
        );
    }

    _sureAddPrice = () => {
        const {userinfo} = this.props;

        const {taskInfo} = this.state;
        if (this.updateTaskPrice.getError()) {
            this.toast.show('佣金必须大于原有佣金哦 ～ ～');
            return;
        }
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
                        keyword: this.state.taskInfo.id,
                        type: 3,
                    }, 'MessageAppealPage');
                }}
                style={{
                    flexDirection: 'row', alignItems: 'center', width: (width) / 2,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                <Text>投诉：{(parseInt(taskInfo.appeal_3_num))}</Text>
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
                onPress={() => {
                    NavigationUtils.goPage({
                        keyword: this.state.taskInfo.id,
                        type: 2,
                    }, 'MessageAppealPage');
                }}
                style={{
                    flexDirection: 'row', alignItems: 'center', width: (width) / 2,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                <Text>申诉：{(parseInt(taskInfo.appeal_2_num))}</Text>
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
    // _update

    getColumn = () => {
        return <View style={{
            width,
            paddingVertical: 10, backgroundColor: 'white', paddingHorizontal: 10, flexDirection: 'row',
            flexWrap: 'wrap',
        }}>
            <TouchableOpacity
                onPress={() => {

                    if (this.state.taskInfo.task_status == 0) {
                        this.toast.show('请先暂停任务');
                    } else {
                        const {taskid} = this.params;
                        NavigationUtils.goPage({
                            task_id: taskid,
                            update: true,
                            updatePage: this._updatePage,
                        }, 'TaskRelease');
                    }

                }
                }

                style={{
                    width: (width - 20) / 4,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                <Image source={require('../res/img/orderMana/xiugai.png')}
                       style={{width: 23, height: 23,}}/>
                <Text style={{marginTop: 5}}>修改</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    const {task_status} = this.state.taskInfo;
                    const {userinfo} = this.props;
                    const {taskid} = this.params;
                    if (task_status != 0 && task_status != 2) {
                        this.toast.show('数据错误');
                        return;
                    }
                    const updateStatus = task_status == 0 ? 2 : task_status == 2 ? 0 : null;
                    stopUserTask({
                        task_id: taskid,
                        task_status: updateStatus,

                    }, userinfo.token).then(result => {
                        this._updatePage();
                    }).catch(msg => {
                        this.toast.show(msg);
                    });
                }}

                style={{
                    width: (width - 20) / 4,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={this.state.taskInfo.task_status == 0 ?
                        require('../res/img/orderMana/task_stop.png')
                        :
                        require('../res/img/orderMana/shangjia.png')}
                    style={{width: 23, height: 23}}/>
                <Text style={{marginTop: 5}}> {this.state.taskInfo.task_status == 0 ? '暂停' : '运行'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    const {task_status} = this.state.taskInfo;
                    if (task_status == 1) {
                        this.toast.show('已经是下架状态');
                        return;
                    }
                    this.toastSelect.show();

                }}
                style={{
                    width: (width - 20) / 4,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image source={require('../res/img/orderMana/xiajia.png')}
                       style={{width: 23, height: 23}}/>
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
        if (this.updateTaskNum.getError()) {
            this.toast.show('加量必须大于1哦 ～ ～');
            return;
        }
        const nowTaskNum = this.updateTaskNum.getNewTaskNum();

        addUserTaskNum({
            task_id: taskInfo.id,
            add_num: nowTaskNum,
        }, userinfo.token).then(result => {
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
    getError = () => {
        return this.state.error;
    };

    render() {
        const {rewardNum, rewardPrice} = this.props;
        const {price, error} = this.state;
        return <View style={{backgroundColor: 'white', paddingHorizontal: 10, paddingTop: 20, paddingBottom: 10}}>
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
                            error: !(parseFloat(text) > parseFloat(rewardPrice)),
                        });
                        if (parseFloat(text) > parseFloat(rewardPrice)) {
                            this.setState({
                                price: ((parseFloat(text) - parseFloat(rewardPrice)) * rewardNum * 1.05).toFixed(2),
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
    getError = () => {
        return this.state.error;
    };

    render() {
        const {rewardPrice} = this.props;
        const {price, error} = this.state;
        return <View style={{backgroundColor: 'white', paddingHorizontal: 10, paddingTop: 20, paddingBottom: 10}}>
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
                            error: !(parseFloat(text) >= 1),
                        });
                        this.setState({
                            price: (parseInt(text) * parseFloat(rewardPrice) * 1.05).toFixed(2),
                        });
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

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const MyOrderManaPageRedux = connect(mapStateToProps, mapDispatchToProps)(MyOrderManaPage);
export default MyOrderManaPageRedux;
