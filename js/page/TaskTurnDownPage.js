/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Dimensions, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import message_more from '../res/svg/message_more.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import {TaskTurnDownTaskFrom} from '../util/AppService';
import BackPressComponent from '../common/BackPressComponent';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import UploadImgsComponent from '../common/UploadImgsComponent';
import {renderEmoji} from '../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;

class MyTaskReview extends PureComponent {
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
        data: [
            {},
        ],
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
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

        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '驳回', message_more, null, null, 16, () => {
            NavigationUtils.goPage({fromUserinfo: this.params.fromUserinfo}, 'ChatSettings');
        }, false);
        const {taskData} = this.params;
        return (
            <SafeAreaViewPlus
                topColor={theme}
                bottomInset={false}
            >
                {navigationBar}
                {TopColumn}
                <ScrollView style={{backgroundColor: '#ececec'}}>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            NavigationUtils.goPage({}, 'ShopInfoPage');
                        }}
                        style={{
                            width: screenWidth,
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            backgroundColor: 'white',
                            marginTop: 10,
                            paddingVertical:15,

                        }}>
                        <Image
                            source={{uri: taskData.avatar_url}}
                            style={{
                                width: hp(10), height: hp(10),
                                borderRadius: 5, alignSelf:'flex-start',
                            }}/>
                        <View style={{marginLeft: 15, }}>

                            <Text style={{fontSize: hp(2.2), color: 'black'}}>{taskData.username}</Text>
                            <Text
                                style={{
                                    fontSize: hp(1.9),
                                    marginTop: hp(0.5),
                                    color: 'rgba(0,0,0,0.7)',
                                }}>ID:{taskData.userid}</Text>

                            <Text style={{
                                fontSize: hp(1.8),
                                marginTop: hp(0.5),
                                color: 'rgba(0,0,0,0.7)',
                            }}>提交时间:{taskData.send_date}</Text>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: hp(0.3),
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: screenWidth - 130,
                            }}>
                                <Text style={{fontSize: hp(2.0), color: 'rgba(0,0,0,1)',width:wp(60)}}>

                                    {taskData && renderEmoji(`${taskData.task_title}`, [], hp(2.0), 0, 'black').map((item, index) => {
                                        return item;
                                    })}


                                </Text>
                                <Text style={{fontSize: hp(2.7), color: 'red'}}>+{taskData.reward_price}</Text>
                            </View>

                        </View>

                    </TouchableOpacity>
                    <View style={{backgroundColor: 'white', marginTop: 20, paddingHorizontal: 10}}>
                        <View style={{
                            paddingVertical: 5,
                            justifyContent: 'center',
                            paddingTop: 10,
                        }}>
                            <TextInput
                                onChangeText={(text) => {
                                    this.turnDownInfo = text;
                                }}
                                autoCapitalize={'none'}
                                autoComplete={'off'}
                                autoCorrect={false}
                                blurOnSubmit={false}
                                value={this.state.value}

                                multiline={true}
                                style={{
                                    height: 100, width: width - 20, backgroundColor: '#f5f5f5',
                                    paddingHorizontal: 5, padding: 0, textAlignVertical: 'top',
                                    paddingTop: 5,
                                    paddingLeft: 5,
                                    borderRadius: 5,
                                }}
                                placeholder={'请输入驳回理由'}
                                maxLength={300}
                            />

                        </View>
                        <UploadImgsComponent userinfo={this.props.userinfo} ref={ref => this.uploadImgs = ref}/>
                    </View>

                </ScrollView>

                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this._sureSayNo}
                    style={{
                        position: 'absolute',
                        bottom: 5,
                        width: wp(95),
                        justifyContent: 'center',
                        backgroundColor: bottomTheme,
                        alignItems: 'center',
                        height: hp(7),
                        marginHorizontal: wp(2.5),
                        borderRadius: 5,
                    }}>
                    <Text style={{color: 'white', fontSize:hp(2.2)}}>确认驳回</Text>
                </TouchableOpacity>

            </SafeAreaViewPlus>
        );
    }

    _sureSayNo = () => {
        const data = this.uploadImgs.getImages();
        const {userinfo} = this.props;
        const imageData = {
            image: [],
            turnDownInfo: this.turnDownInfo,
        };
        const {taskData, updatePage} = this.params;
        for (let i = 0; i < data.length; i++) {
            if (data[i].uri && data[i].uri.indexOf('file://') !== -1) {
                Toast.show('等待图片上传完毕');
                return;
            }
            if (data[i].uri) {
                imageData.image.push(data[i].uri);
            }
            if (i == data.length - 1) {

                TaskTurnDownTaskFrom({
                    SendFormTaskId: taskData.taskStepId,
                    turnDownInfo: JSON.stringify(imageData),
                }, userinfo.token).then(err => {
                    EventBus.getInstance().fireEvent(EventTypes.update_task_release_mana, {index: 0});//刷新审核页面
                    Toast.show('驳回成功');
                    NavigationUtils.goBack(this.props.navigation);

                    updatePage();

                });
            }
        }
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
