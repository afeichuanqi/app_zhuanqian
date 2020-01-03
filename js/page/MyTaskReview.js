/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, ScrollView, Image, View, Dimensions} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import {StatusBar} from 'react-native';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import SvgUri from 'react-native-svg-uri';
import menu_right from '../res/svg/menu_right.svg';
import {bottomTheme} from '../appSet';
import {passTaskForSendFormTaskId, selectSendFormForTaskId} from '../util/AppService';
import {connect} from 'react-redux';
import Toast from '../common/Toast';
import ImageViewerModal from '../common/ImageViewerModal';
import ToastSelect from '../common/ToastSelect';
import EmptyComponent from '../common/EmptyComponent';
import BackPressComponent from '../common/BackPressComponent';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import FastImagePro from '../common/FastImagePro';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class MyTaskReview extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {
        taskData: {},
        unReviewCount: 0,
        haveReviewCount: 0,
        isEnd: false,
        isEmpty: false,
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
        const {task_id, status} = this.params;
        const {userinfo} = this.props;
        selectSendFormForTaskId({taskId: task_id, status: status}, userinfo.token).then(async result => {
            const {taskDatas} = result;
            this.taskDatas = taskDatas;
            const formIndex = await this.taskDatas.findIndex(d => d.taskStepId == this.params.sendFormId);

            this.pageIndex = formIndex === -1 ? 0 : formIndex;
            if (taskDatas.length > 0) {
                const {task_pass_num, task_noPass_num, task_is_send_num} = taskDatas[0];

                this.setState({
                    unReviewCount: parseInt(task_is_send_num) - parseInt(task_noPass_num) - parseInt(task_pass_num),
                    haveReviewCount: parseInt(task_pass_num) + parseInt(task_noPass_num),

                });
                this._setTaskData(this.pageIndex);
            } else {
                this.setState({
                    isEmpty: true,
                });
                // NavigationUtils.goBack(this.props.navigation);
            }

        }).catch(() => {
            // this.setState({
            //     isLoading: false,
            //     hideLoaded: false,
            // });
        });
    };
    _setTaskData = (index) => {

        try {
            const data = {...this.taskDatas[index]};
            const taskStepData = JSON.parse(data.task_step_data);
            data.task_step_data = taskStepData;
            this.setState({
                taskData: data,
            });


        } catch (e) {
            this.toast.show(`error>${e.toString()}`);

        }
    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        EventBus.getInstance().fireEvent(EventTypes.update_task_release_mana, {index: 0});//刷新审核页面
    }


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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, `任务审核 (${this.taskDatas && (this.pageIndex + 1) > this.taskDatas.length ? this.taskDatas.length : this.pageIndex + 1}/${this.taskDatas && this.taskDatas.length}) `, null, null, null, null, () => {
            const data = this.taskDatas[this.pageIndex];
            const {task_id, taskUri} = this.params;
            const fromUserinfo = {
                avatar_url: data.avatar_url,
                id: data.userid,
                username: data.username,
            };
            NavigationUtils.goPage({
                task_id: task_id,
                sendFormId: taskData.taskStepId,
                fromUserinfo: fromUserinfo,
                columnType: 3,
                taskUri: taskUri,
            }, 'ChatRoomPage');
        }, false, this.taskDatas && this.taskDatas.length > 0 ? true : false, '投诉', 'black', '');
        const {taskData, unReviewCount, isEnd, haveReviewCount, isEmpty} = this.state;
        const {task_status, isReject} = taskData;
        let ImageIndex = 0;
        this.reviewPic = [];
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
                {isEmpty ? <EmptyComponent height={screenHeight - 100} message={'没有更多的任务需要审核啦 ～ ～'}/> :
                    <View style={{flex: 1}}>
                        <ScrollView style={{backgroundColor: '#e8e8e8', marginBottom: 50}}>
                            {task_status === 0 ?
                                <View style={{
                                    backgroundColor: 'white',
                                    marginTop: 2,
                                    flexDirection: 'row',
                                    height: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text>已审核:</Text>
                                        <Text style={{color: 'red', marginLeft: 5}}>{haveReviewCount}</Text>
                                        <Text>个</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                                        <Text>未审核:</Text>
                                        <Text style={{color: 'red', marginLeft: 5}}>{unReviewCount}</Text>
                                        <Text>个</Text>
                                    </View>
                                </View> :
                                isReject === 1 ?

                                    <View style={{
                                        backgroundColor: 'white',
                                        marginTop: 10,
                                        // flexDirection: 'row',
                                        // height: 40,
                                        // alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingLeft: 15,
                                        // paddingVertical: 5,
                                        paddingVertical: 10,
                                    }}>
                                        <View style={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                                            <Text style={{color: 'red'}}>驳回理由:</Text>
                                            <Text
                                                // numberOfLines={5}
                                                // ellipsizeMode={'tail'}
                                                style={{
                                                    width: screenWidth - 120,
                                                    fontSize: 14,
                                                    color: 'red',
                                                    marginLeft: 10,
                                                }}>{JSON.parse(taskData.reason_for_rejection).turnDownInfo}</Text>
                                        </View>
                                        {JSON.parse(taskData.reason_for_rejection).image && JSON.parse(taskData.reason_for_rejection).image.map((url, index, arrs) => {
                                            return <TouchableOpacity
                                                key={index}
                                                activeOpacity={0.6}
                                                onPress={() => {
                                                    let urls = [];
                                                    arrs.map((item, index) => {
                                                        urls.push({url: item});
                                                        if (index === arrs.length - 1) {
                                                            this.imageModal.show(urls, url);
                                                        }
                                                    });

                                                }}
                                            >
                                                <FastImagePro
                                                    loadingType={2}
                                                    style={{height: 80, width: 80, marginTop: 10}}
                                                    source={{uri: url}}
                                                    // resizeMode={Image_.resizeMode.contain}
                                                />

                                            </TouchableOpacity>;

                                        })}

                                    </View>
                                    : null
                            }

                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    NavigationUtils.goPage({userid: taskData.userid}, 'ShopInfoPage');
                                }}
                                style={{
                                    width: screenWidth, height: 70,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    paddingHorizontal: 10,
                                    backgroundColor: 'white',
                                    marginTop: 10,
                                }}>
                                <FastImagePro
                                    source={{uri: taskData.avatar_url}}
                                    style={{
                                        width: 40, height: 40,
                                        borderRadius: 25,
                                    }}/>
                                <View style={{marginLeft: 15, height: 40, justifyContent: 'space-around'}}>
                                    <View style={{flexDirection: 'row', width: Dimensions.get('window').width - 80}}>
                                        <Text style={{fontSize: 15, color: 'black'}}>{taskData.username}</Text>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: 'black',
                                                marginLeft: 5,
                                            }}>(ID:{taskData.userid})</Text>
                                    </View>

                                    <Text style={{
                                        fontSize: 12,
                                        color: 'rgba(0,0,0,0.6)',
                                        width: Dimensions.get('window').width - 80,
                                    }}>{task_status != 0 ? `审核时间:${taskData.review_time}` : `提交时间:${taskData.send_date}`}</Text>
                                </View>
                                <SvgUri style={{position: 'absolute', right: 15, top: 30}} width={15} height={15}
                                        svgXmlData={menu_right}/>
                            </TouchableOpacity>

                            {taskData.task_step_data && taskData.task_step_data.map((item, index, arr) => {
                                const {type, typeData} = item;

                                // console.log(type, typeData, 'type, typeData');
                                if (type === 5 && typeData && typeData.uri1) {
                                    // console.log(typeData.uri1ImgHeight, typeData.uri1ImgWidth, 'typeData.uri1ImgHeight');

                                    this.reviewPic.push({url: typeData.uri1});

                                    ImageIndex += 1;
                                    return this.getImageView(typeData.uri1, typeData.uri1ImgHeight || 500, typeData.uri1ImgWidth || screenWidth - 40, ImageIndex);
                                } else if (type === 6 && typeData.collectInfoContent) {
                                    return this.getTextView(typeData.collectInfoContent);
                                } else {
                                    return null;
                                }
                            })}

                        </ScrollView>
                        {task_status === 0 ? <View style={{
                                position: 'absolute',
                                bottom: 0,
                                flexDirection: 'row',
                                width: screenWidth,
                                justifyContent: 'space-around',
                                // paddingVertical: 5,
                                backgroundColor: bottomTheme,
                                alignItems: 'center',
                                height: 50,
                            }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.toastS.show();
                                    }}
                                    activeOpacity={0.5}
                                    style={{
                                        height: 40,
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={{color: 'white'}}>通过</Text>
                                </TouchableOpacity>
                                <View style={{height: 30, width: 1, backgroundColor: 'white'}}/>
                                <TouchableOpacity onPress={() => {
                                    NavigationUtils.goPage({taskData, updatePage: this._updatePage}, 'TaskTurnDownPage');
                                }} style={{
                                    height: 40,
                                    width: (screenWidth - 2) / 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{color: 'white'}}>驳回</Text>
                                </TouchableOpacity>
                                <View style={{height: 30, width: 1, backgroundColor: 'white'}}/>
                                <TouchableOpacity
                                    onPress={!isEnd ? this._nextStepData : null}
                                    activeOpacity={isEnd ? 0.5 : 0.7}
                                    style={{
                                        height: 40,
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: isEnd ? 0.5 : 1,
                                    }}>
                                    <Text style={{color: 'white'}}>下一个</Text>
                                </TouchableOpacity>


                            </View> :
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                flexDirection: 'row',
                                width: screenWidth,
                                justifyContent: 'space-around',
                                // paddingVertical: 5,
                                backgroundColor: bottomTheme,
                                alignItems: 'center',
                                height: 50,
                            }}>
                                <TouchableOpacity
                                    onPress={this._PreviousStepData}
                                    activeOpacity={isEnd ? 0.5 : 0.7}
                                    style={{
                                        height: 40,
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // opacity: isEnd ? 0.5 : 1,
                                    }}>
                                    <Text style={{color: 'white'}}>上一个</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={!isEnd ? this._nextStepData : null}
                                    activeOpacity={isEnd ? 0.5 : 0.7}
                                    style={{
                                        height: 40,
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: isEnd ? 0.5 : 1,
                                    }}>
                                    <Text style={{color: 'white'}}>下一个</Text>
                                </TouchableOpacity>
                            </View>}

                        <ImageViewerModal ref={ref => this.imageModal = ref}/>
                        <ToastSelect
                            rightTitle={'通过'}
                            sureClick={() => this.thisTaskPass(taskData.taskStepId)}
                            ref={ref => this.toastS = ref}>
                            <View style={{
                                height: 30, backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                                paddingTop: 10,
                            }}>
                                <Text style={{fontSize: 14}}>仔细确认是否通过此任务的验证？</Text>
                            </View>
                        </ToastSelect>
                    </View>}

            </SafeAreaViewPlus>
        );
    }

    thisTaskPass = (taskStepId) => {
        const {userinfo} = this.props;
        this.toastS.hide();
        passTaskForSendFormTaskId({SendFormTaskId: taskStepId}, userinfo.token).then(result => {
            EventBus.getInstance().fireEvent(EventTypes.update_task_release_mana, {index: 0});//刷新审核页面
            this.setState({
                unReviewCount: this.state.unReviewCount - 1,
                haveReviewCount: this.state.haveReviewCount + 1,
            });
            this.toast.show('已经通过');
            if (this.pageIndex == this.taskDatas.length - 1) {
                this._updatePage();//直接刷新本页面
            } else {
                this._nextStepData();
            }


        }).catch(error => {
            this.toast.show(error);
        });
        this.toastS.hide();
    };
    _PreviousStepData = () => {

        this.pageIndex -= 1;
        if (this.pageIndex < 0) {
            this.pageIndex += 1;
            this.toast.show('没有更多了');
        } else {
            this._setTaskData(this.pageIndex);
        }

    };
    _nextStepData = () => {

        this.pageIndex += 1;
        if (this.pageIndex >= this.taskDatas.length) {
            this.pageIndex -= 1;
            this.toast.show('没有更多了');
        } else {
            this._setTaskData(this.pageIndex);
        }

    };
    getTextView = (text) => {
        return <View style={{
            marginTop: 10,
            backgroundColor: 'white',
            paddingVertical: 15, paddingHorizontal: 10,

        }}>
            <View style={{
                alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)',
                flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10,
                borderRadius: 3,
            }}>
                <Text style={{fontSize: 13, color: 'rgba(0,0,0,0.8)'}}>文字验证:</Text>
                <Text style={{
                    fontSize: 13,
                    marginLeft: 5,
                    color: 'rgba(0,0,0,0.8)',
                    width: screenWidth - 100,
                }}>{text}</Text>
            </View>
        </View>;
    };
    getImageView = (url, height, width, ImageIndex) => {
        return <View style={{marginTop: 10, backgroundColor: 'white', alignItems: 'center', paddingBottom: 20}}>
            <View style={{
                width: screenWidth, paddingVertical: 10, justifyContent: 'center', alignItems: 'center',
                flexDirection: 'row',
            }}>
                <View style={{width: 20, height: 0.7, backgroundColor: 'black'}}/>
                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15, paddingHorizontal: 10}}> 验证图 </Text>
                <View style={{width: 20, height: 0.7, backgroundColor: 'black'}}/>
            </View>
            {/*<Flat*/}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    this.imageModal.show(this.reviewPic, url);
                    // this.imageModal.show([{
                    //     url: url,
                    // }]);
                }}
            >
                <FastImagePro
                    loadingType={2}
                    style={{height: height, width: width}}
                    source={{uri: url}}
                    // resizeMode={Image_.resizeMode.contain}
                />
                <View style={{
                    position: 'absolute', left: 0, top: 0, paddingHorizontal: 5, paddingVertical: 2,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                    <Text style={{color: 'white'}}>图{ImageIndex}</Text>
                </View>
            </TouchableOpacity>

        </View>;

    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const MyTaskReviewRedux = connect(mapStateToProps, mapDispatchToProps)(MyTaskReview);
export default MyTaskReviewRedux;
