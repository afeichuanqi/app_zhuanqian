/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions,
    StyleSheet,
    View, Text, StatusBar, TouchableOpacity, ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import ImageViewerModal from '../common/ImageViewerModal';
import {selectOrderTaskInfo, userGiveUpTask, userRedoTask} from '../util/AppService';
import EmptyComponent from '../common/EmptyComponent';
import FastImagePro from '../common/FastImagePro';
import SvgUri from 'react-native-svg-uri';
import menu_right from '../res/svg/menu_right.svg';
import ToastSelect from '../common/ToastSelect';
import Toast from '../common/Toast';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';

const screenWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class TaskRejectDetailsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    state = {
        sendFormInfo: {},
    };

    componentDidMount() {
        // console.log('11111');
        selectOrderTaskInfo({sendFormId: this.params.sendFormId}, this.props.userinfo.token).then(result => {
            console.log(result.length > 0, 'result.length > 0');
            if (result.length > 0) {
                this.setState({
                    sendFormInfo: result[0],
                });
            }
        });
        this.backPress.componentDidMount();
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

    render() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        const {sendFormInfo} = this.state;
        const {
            task_status, reason_for_rejection, userid, username, review_time, task_step_data, avatar_url,
            taskId, taskUri,
        } = sendFormInfo;
        let title = '';
        if (task_status == -1) {
            title = '驳回详情';
        } else {
            title = '提交详情';
        }
        if (task_status == 0) {
            title += `(待审核)`;
        }
        if (task_status == 1) {
            title += `(待审核)`;
        }
        if (task_status == -2) {
            title += `(已放弃)`;
        }
        if (task_status == -3) {
            title += `(已过期)`;
        }

        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, title, null, 'white', 'black', 16, () => {
            NavigationUtils.goPage({
                task_id: this.params.taskId,
                sendFormId: this.params.sendFormId,
                fromUserinfo: this.params.fromUserinfo,
                columnType: 2,
                taskUri: this.params.task_uri,
            }, 'ChatRoomPage');
        }, false, (task_status == -1 && userid == this.props.userinfo.userid) ? true : false, '申诉');
        if (!sendFormInfo.task_step_data) {
            return <EmptyComponent height={height - 50}/>;
        }
        let ImageIndex = 0;
        this.reviewPic = [];
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <View style={{flex: 1}}>
                    <ScrollView style={{
                        backgroundColor: '#f0f0f0',
                        marginBottom: (task_status == -1 && userid == this.props.userinfo.userid) ? 50 : 0,
                    }}>


                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                NavigationUtils.goPage({userid: userid}, 'ShopInfoPage');
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
                                source={{uri: avatar_url}}
                                style={{
                                    width: 40, height: 40,
                                    borderRadius: 25,
                                }}/>
                            <View style={{marginLeft: 15, height: 40, justifyContent: 'space-around'}}>
                                <View style={{flexDirection: 'row', width: Dimensions.get('window').width - 80}}>
                                    <Text style={{fontSize: 15, color: 'black'}}>{username}</Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: 'black',
                                            marginLeft: 5,
                                        }}>(ID:{userid})</Text>
                                </View>

                                <Text style={{
                                    fontSize: 12,
                                    color: 'rgba(0,0,0,0.6)',
                                    width: Dimensions.get('window').width - 80,
                                }}>审核时间:{review_time}</Text>
                            </View>
                            <SvgUri style={{position: 'absolute', right: 15, top: 30}} width={15} height={15}
                                    svgXmlData={menu_right}/>
                        </TouchableOpacity>
                        {task_status === -1 ? <View style={{
                                backgroundColor: 'white',
                                marginTop: 10,
                                justifyContent: 'center',
                                paddingLeft: 15,
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
                                        }}>{JSON.parse(reason_for_rejection).turnDownInfo}</Text>
                                </View>
                                <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                                    {JSON.parse(reason_for_rejection).image && JSON.parse(reason_for_rejection).image.map((url, index, arrs) => {
                                        return <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.6}
                                            onPress={() => {
                                                let urls = [];
                                                arrs.map((item, index) => {
                                                    urls.push({url: item});
                                                    if (index === arrs.length - 1) {
                                                        this.imgModal.show(urls, url);
                                                    }
                                                });

                                            }}
                                        >
                                            <FastImagePro
                                                style={{height: 100, width: 80, marginTop: 10, marginRight: 5}}
                                                source={{uri: url}}
                                            />

                                        </TouchableOpacity>;

                                    })}
                                </View>


                            </View>
                            :
                            null}

                        {task_step_data && JSON.parse(task_step_data).map((item, index, arr) => {
                            const {type, typeData} = item;

                            if (type === 5 && typeData && typeData.uri1) {
                                this.reviewPic.push({url: typeData.uri1});
                                ImageIndex += 1;
                                return this.getImageView(typeData.uri1, typeData.uri1ImgHeight || 500, typeData.uri1ImgWidth || screenWidth - 40, ImageIndex, '验证图', index);
                            } else if (type === 6 && typeData.collectInfoContent) {
                                return this.getTextView(typeData.collectInfoContent, index);
                            } else {
                                return null;
                            }
                        })}

                    </ScrollView>
                    {task_status === -1 && userid == this.props.userinfo.userid && <View style={{
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

                                console.log(this.params.fromUserinfo, 'this.params.fromUserinfo');
                                NavigationUtils.goPage({
                                    task_id: this.params.taskId,
                                    sendFormId: this.params.sendFormId,
                                    fromUserinfo: this.params.fromUserinfo,
                                    columnType: 5,
                                    taskUri: this.params.task_uri,
                                }, 'ChatRoomPage');
                            }}
                            activeOpacity={0.5}
                            style={{
                                height: 40,
                                width: (screenWidth - 2) / 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text style={{color: 'white'}}>沟通</Text>
                        </TouchableOpacity>
                        <View style={{height: 30, width: 1, backgroundColor: 'white'}}/>
                        <TouchableOpacity onPress={() => {//放弃
                            this.toastS.show();
                        }} style={{
                            height: 40,
                            width: (screenWidth - 2) / 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{color: 'white'}}>放弃</Text>
                        </TouchableOpacity>
                        <View style={{height: 30, width: 1, backgroundColor: 'white'}}/>
                        <TouchableOpacity onPress={() => {//重做
                            userRedoTask({SendFormTaskId: this.params.sendFormId}, this.props.userinfo.token).then((result) => {
                                NavigationUtils.goPage({task_id: result.task_id, test: false}, 'TaskDetails');
                                EventBus.getInstance().fireEvent(EventTypes.update_task_orders_mana, {
                                    indexs: [0, 2],
                                });//页面跳转到顶部
                            }).catch(msg => {
                                this.toast.show(msg);
                            });

                        }} style={{
                            height: 40,
                            width: (screenWidth - 2) / 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{color: 'white'}}>重做</Text>
                        </TouchableOpacity>

                    </View>}
                </View>
                <ImageViewerModal ref={ref => this.imgModal = ref}/>
                <ToastSelect
                    rightTitle={'放弃'}
                    sureClick={this.giveUpTask}
                    ref={ref => this.toastS = ref}>
                    <View style={{
                        height: 30, backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                        paddingTop: 10,
                    }}>
                        <Text

                            style={{
                                fontSize: 14,

                            }}>是否确认放弃此任务？</Text>
                    </View>
                </ToastSelect>
            </SafeAreaViewPlus>
        );
    }

    giveUpTask = () => {
        this.toastS.hide();
        userGiveUpTask({SendFormTaskId: this.params.sendFormId}, this.props.userinfo.token).then((result) => {
            // NavigationUtils.goPage({task_id: result.task_id, test: false}, 'TaskDetails');
            this.toast.show('成功放弃');
            NavigationUtils.goBack(this.props.navigation);
        }).catch(msg => {
            this.toast.show(msg);
        });
    };
    getImageView = (url, height, width, ImageIndex, title, index) => {
        return <View
            key={index}
            style={{marginTop: 10, backgroundColor: 'white', alignItems: 'center', paddingBottom: 20}}>
            <View style={{
                width: screenWidth, paddingVertical: 10, justifyContent: 'center', alignItems: 'center',
                flexDirection: 'row',
            }}>
                <View style={{width: 20, height: 0.7, backgroundColor: 'black'}}/>
                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15, paddingHorizontal: 10}}> {title} </Text>
                <View style={{width: 20, height: 0.7, backgroundColor: 'black'}}/>
            </View>
            {/*<Flat*/}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    this.imgModal.show(this.reviewPic, url);
                }}
            >
                <FastImagePro
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
    getTextView = (text, index) => {
        return <View
            key={index}
            style={{
                marginTop: 10,
                backgroundColor: 'white',
                paddingVertical: 15, paddingHorizontal: 10,

            }}>
            <View style={{
                alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.08)',
                flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10,
                borderRadius: 3,
            }}>
                <Text style={{fontSize: 13, color: 'rgba(0,0,0,0.5)'}}>文字验证:</Text>
                <Text style={{
                    fontSize: 13,
                    marginLeft: 5,
                    color: 'rgba(0,0,0,0.5)',
                    width: screenWidth - 100,
                }}>{text}</Text>
            </View>
        </View>;
    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const TaskRejectDetailsPageRedux = connect(mapStateToProps, mapDispatchToProps)(TaskRejectDetailsPage);


export default TaskRejectDetailsPageRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 55,
        height: 55,
        borderRadius: 40,
        // 设置高度
        // height:150
    },
});
