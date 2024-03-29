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
import Toast from 'react-native-root-toast';
import ImageViewerModal from '../common/ImageViewerModal';
import ToastSelect from '../common/ToastSelectTwo';
import EmptyComponent from '../common/EmptyComponent';
import BackPressComponent from '../common/BackPressComponent';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import FastImagePro from '../common/FastImagePro';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
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
            Toast.show(`error>${e.toString()}`);

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

        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, `任务审核 (${this.taskDatas && (this.pageIndex + 1) > this.taskDatas.length ? this.taskDatas.length : this.pageIndex + 1}/${this.taskDatas && this.taskDatas.length}) `, null, null, 'black', 16, () => {
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
                {isEmpty ? <EmptyComponent height={screenHeight - 100} message={'没有更多的任务需要审核啦 ～ ～'}/> :
                    <View style={{flex: 1}}>
                        <ScrollView style={{backgroundColor: '#e8e8e8', marginBottom: 50}}>
                            {task_status === 0 ?
                                <View style={{
                                    backgroundColor: 'white',
                                    marginTop: 2,
                                    flexDirection: 'row',
                                    height: hp(5),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{color:'black', fontSize:hp(1.8)}}>已审核:</Text>
                                        <Text style={{color: 'red', marginLeft: 5, fontSize:hp(1.8)}}>{haveReviewCount}</Text>
                                        <Text style={{color:'black', fontSize:hp(1.8)}}>个</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                                        <Text style={{color:'black', fontSize:hp(1.8)}}>未审核:</Text>
                                        <Text style={{color: 'red', marginLeft: 5, fontSize:hp(1.8)}}>{unReviewCount}</Text>
                                        <Text style={{color:'black', fontSize:hp(1.8)}}>个</Text>
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
                                            <Text style={{color: 'red',fontSize:hp(1.8)}}>驳回理由:</Text>
                                            <Text
                                                // numberOfLines={5}
                                                // ellipsizeMode={'tail'}
                                                style={{
                                                    width: screenWidth - 120,
                                                    fontSize: hp(1.8),
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
                                                    style={{height: hp(9), width: hp(9), marginTop: hp(1.5)}}
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
                                    width: screenWidth, height: hp(8),
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    paddingHorizontal: 10,
                                    backgroundColor: 'white',
                                    marginTop: 10,
                                }}>
                                <FastImagePro
                                    source={{uri: taskData.avatar_url}}
                                    style={{
                                        width: hp(5), height: hp(5),
                                        borderRadius: 25,
                                    }}/>
                                <View style={{marginLeft: 15, height: hp(5), justifyContent: 'space-around'}}>
                                    <View style={{flexDirection: 'row', width: Dimensions.get('window').width - 80}}>
                                        <Text style={{fontSize: hp(1.9), color: 'black'}}>{taskData.username}</Text>
                                        <Text
                                            style={{
                                                fontSize: hp(1.9),
                                                color: 'black',
                                                marginLeft: 5,
                                            }}>(ID:{taskData.userid})</Text>
                                    </View>

                                    <Text style={{
                                        fontSize: hp(1.6),
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
                                    return this.getImageView(typeData.uri1, typeData.uri1ImgHeight || hp(70), typeData.uri1ImgWidth || screenWidth - 40, ImageIndex);
                                } else if (type === 6 && typeData.collectInfoContent) {
                                    return this.getTextView(typeData.collectInfoContent, index);
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
                                height: hp(6),
                            }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.toastS.show();
                                    }}
                                    activeOpacity={0.5}
                                    style={{
                                        height: hp(5),
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={{color: 'white', fontSize:hp(1.9)}}>通过</Text>
                                </TouchableOpacity>
                                <View style={{height: 30, width: 1, backgroundColor: 'white'}}/>
                                <TouchableOpacity onPress={() => {
                                    NavigationUtils.goPage({taskData, updatePage: this._updatePage}, 'TaskTurnDownPage');
                                }} style={{
                                    height: hp(5),
                                    width: (screenWidth - 2) / 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize:hp(1.9)}}>驳回</Text>
                                </TouchableOpacity>
                                <View style={{height: 30, width: 1, backgroundColor: 'white'}}/>
                                <TouchableOpacity
                                    onPress={!isEnd ? this._nextStepData : null}
                                    activeOpacity={isEnd ? 0.5 : 0.7}
                                    style={{
                                        height: hp(5),
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: isEnd ? 0.5 : 1,
                                    }}>
                                    <Text style={{color: 'white', fontSize:hp(1.9)}}>下一个</Text>
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
                                height: hp(6),
                            }}>
                                <TouchableOpacity
                                    onPress={this._PreviousStepData}
                                    activeOpacity={isEnd ? 0.5 : 0.7}
                                    style={{
                                        height: hp(5),
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // opacity: isEnd ? 0.5 : 1,
                                    }}>
                                    <Text style={{color: 'white', fontSize:hp(1.9)}}>上一个</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={!isEnd ? this._nextStepData : null}
                                    activeOpacity={isEnd ? 0.5 : 0.7}
                                    style={{
                                        height: hp(5),
                                        width: (screenWidth - 2) / 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: isEnd ? 0.5 : 1,
                                    }}>
                                    <Text style={{color: 'white', fontSize:hp(1.9)}}>下一个</Text>
                                </TouchableOpacity>
                            </View>}

                        <ImageViewerModal statusBarType={'dark'} ref={ref => this.imageModal = ref}/>
                        <ToastSelect
                            sureTitle={'确认通过'}
                            sureClick={() => this.thisTaskPass(taskData.taskStepId)}
                            ref={ref => this.toastS = ref}/>
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
            Toast.show('已经通过',{position:Toast.positions.CENTER});
            if (this.pageIndex == this.taskDatas.length - 1) {
                this._updatePage();//直接刷新本页面
            } else {
                this._nextStepData();
            }


        }).catch(error => {
            Toast.show(error,{position:Toast.positions.CENTER});
        });
        this.toastS.hide();
    };
    _PreviousStepData = () => {

        this.pageIndex -= 1;
        if (this.pageIndex < 0) {
            this.pageIndex += 1;
            Toast.show('没有更多了',{position:Toast.positions.CENTER});
        } else {
            this._setTaskData(this.pageIndex);
        }

    };
    _nextStepData = () => {

        this.pageIndex += 1;
        if (this.pageIndex >= this.taskDatas.length) {
            this.pageIndex -= 1;
            Toast.show('没有更多了',{position:Toast.positions.CENTER});
        } else {
            this._setTaskData(this.pageIndex);
        }

    };
    getTextView = (text, index) => {
        return <View key={index} style={{
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
        return <View key={ImageIndex}
                     style={{marginTop: 10, backgroundColor: 'white', alignItems: 'center', paddingBottom: 20}}>
            <View style={{
                width: screenWidth, paddingVertical: 10, justifyContent: 'center', alignItems: 'center',
                flexDirection: 'row',
            }}>
                <View style={{width: 20, height: 0.7, backgroundColor: 'black'}}/>
                <Text style={{color: 'black', fontWeight: 'bold', fontSize: hp(1.7), paddingHorizontal: 10}}> 验证图 </Text>
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
