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
import Toast from '../common/Toast';
import SvgUri from 'react-native-svg-uri';
import add_image from '../res/svg/add_image.svg';
import PickerImage from '../common/PickerImage';
import {TaskTurnDownTaskFrom, uploadQiniuImage} from '../util/AppService';
import ImageViewerModal from '../common/ImageViewerModal';
import BackPressComponent from '../common/BackPressComponent';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';

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
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '驳回', message_more, null, null, null, () => {
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
                <Toast
                    ref={ref => this.toast = ref}
                />
                <ScrollView style={{backgroundColor: '#e8e8e8'}}>

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
                            paddingBottom: 40,
                        }}>
                        <Image
                            source={{uri: taskData.avatar_url}}
                            style={{
                                width: 40, height: 40,
                                borderRadius: 5,
                            }}/>
                        <View style={{marginLeft: 15, height: 60, marginTop: 20}}>
                            <Text style={{fontSize: 15, color: 'black'}}>{taskData.username}</Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginTop: 5,
                                    color: 'rgba(0,0,0,0.6)',
                                }}>ID:{taskData.userid}</Text>

                            <Text style={{
                                fontSize: 12,
                                marginTop: 5,
                                color: 'rgba(0,0,0,0.6)',
                            }}>提交时间:{taskData.send_date}</Text>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: screenWidth - 80,
                            }}>
                                <Text style={{fontSize: 14, color: 'rgba(0,0,0,1)'}}>{taskData.task_title}</Text>
                                <Text style={{fontSize: 14, color: 'red'}}>+{taskData.reward_price}</Text>
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
                                // multiline={true}
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
                                    height: 100, width: width - 20, backgroundColor: '#ececec',
                                    paddingHorizontal: 5, padding: 0, textAlignVertical: 'top',
                                    paddingTop:5,
                                    paddingLeft:5,
                                    borderRadius:5,
                                }}
                                placeholder={'请输入驳回理由'}
                                // placeholderTextColor={'#7f7f7f'}
                                maxLength={300}
                            />

                        </View>
                        <View style={{marginBottom: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                            {this.state.data.map((item, index, arr) => {

                                if (!item.close) {
                                    return <TouchableOpacity
                                        key={index}
                                        ref={ref => this.btn = ref}
                                        onPress={() => {
                                            const {uri} = this.state.data[index];
                                            if (uri && (uri.indexOf('file://') !== -1 || uri.indexOf('http') !== -1)) {
                                                this.imageView.show([{url: uri}]);
                                            } else {
                                                this.refs[`picker${index}`].show(index);
                                            }

                                        }}
                                        style={{

                                            width: 55,
                                            height: 55,
                                            backgroundColor: '#e8e8e8',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            // borderWidth: this.animations.width,
                                            borderColor: 'rgba(0,0,0,0.6)',
                                            marginTop: 10, marginRight: 10,
                                            borderRadius:5,
                                            // borderWidth:1, borderColor:'rgba(255,0,0,1)',
                                        }}>
                                        {item.uri ? <Image
                                            source={{uri: item.uri}}
                                            style={{
                                                width: 55, height: 55,
                                                borderRadius: 0,
                                            }}
                                        /> : <SvgUri width={35} height={35} svgXmlData={add_image}/>}
                                        {item.uploadStatus == 0 &&
                                        <View style={{
                                            width: 55, height: 55, backgroundColor: 'rgba(0,0,0,0.5)',
                                            justifyContent: 'center', alignItems: 'center', position: 'absolute',

                                        }}>
                                            <Text style={{fontSize: 12, color: 'white'}}>正在上传</Text>
                                        </View>
                                        }
                                        {item.uploadStatus == -1 &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                const {userinfo} = this.props;
                                                const tmpArr = [...this.state.data];
                                                const item = tmpArr[index];
                                                const uri = item.uri;
                                                const mimeIndex = uri.lastIndexOf('.');
                                                const mime = uri.substring(mimeIndex + 1, uri.length);
                                                tmpArr[index].uploadStatus = 0;
                                                this.setState({
                                                    data: tmpArr,
                                                });
                                                uploadQiniuImage(userinfo.token, 'reUploadStep', mime, uri).then(url => {
                                                    tmpArr[index].uploadStatus = 1;
                                                    tmpArr[index].uri = url;
                                                    this.setState({
                                                        data: tmpArr,
                                                    });
                                                    this.forceUpdate();
                                                }).catch(err => {
                                                    tmpArr[index].uploadStatus = -1;
                                                    this.setState({
                                                        data: tmpArr,
                                                    });
                                                    this.forceUpdate();
                                                });
                                            }}
                                            style={{
                                                width: 55, height: 55, backgroundColor: 'rgba(0,0,0,0.5)',
                                                justifyContent: 'center', alignItems: 'center', position: 'absolute',
                                            }}>
                                            <View style={{
                                                width: 40,
                                                height: 20,
                                                borderRadius: 3,
                                                backgroundColor: 'red',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <Text style={{fontSize: 9, color: 'white'}}>重新上传</Text>
                                            </View>
                                        </TouchableOpacity>
                                        }
                                        {item.uri && <TouchableOpacity
                                            onPress={() => {
                                                const tmpArr = [...this.state.data];
                                                let interval = 0;
                                                for (let i = 0; i < tmpArr.length; i++) {
                                                    if (JSON.stringify(tmpArr[i]) === '{}') {
                                                        interval += 1;

                                                    }
                                                    if (i === tmpArr.length - 1) {
                                                        if (interval >= 1) {
                                                            tmpArr[index] = {close: true};
                                                            this.setState({
                                                                data: tmpArr,
                                                            });
                                                        } else {
                                                            tmpArr[index] = {};
                                                            this.setState({
                                                                data: tmpArr,
                                                            });
                                                        }
                                                    }
                                                }


                                            }}
                                            style={{
                                                width: 15,
                                                height: 15,
                                                borderRadius: 10,
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                right: -5,
                                                top: -5,
                                            }}>
                                            <Text style={{color: 'white', fontSize: 12}}>X</Text>
                                        </TouchableOpacity>}
                                        <PickerImage includeBase64={false} cropping={false} select={this._selectImg}
                                                     ref={`picker${index}`}/>
                                    </TouchableOpacity>;
                                } else {
                                    return null;
                                }

                            })}


                        </View>

                    </View>

                </ScrollView>
                <ImageViewerModal ref={ref => this.imageView = ref}/>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this._sureSayNo}
                    style={{
                        position: 'absolute',
                        bottom: 5,
                        width: screenWidth - 20,
                        justifyContent: 'center',
                        backgroundColor: bottomTheme,
                        alignItems: 'center',
                        height: 35,
                        marginHorizontal: 10,
                        borderRadius: 5,
                    }}>
                    <Text style={{color: 'white'}}>确认驳回</Text>
                </TouchableOpacity>

            </SafeAreaViewPlus>
        );
    }

    _sureSayNo = () => {
        const {data} = this.state;
        const {userinfo} = this.props;
        const imageData = {
            image: [],
            turnDownInfo: this.turnDownInfo,
        };
        const {taskData, updatePage} = this.params;
        for (let i = 0; i < data.length; i++) {
            if (data[i].uri && data[i].uri.indexOf('file://') !== -1) {
                this.toast.show('等待图片上传完毕');
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
                    EventBus.getInstance().fireEvent(EventTypes.update_task_release_mana, {});//刷新审核页面
                    this.toast.show('驳回成功');
                    NavigationUtils.goBack(this.props.navigation);

                    updatePage();

                });
            }
        }
        // console.log(JSON.stringify(imageData));
    };
    _selectImg = (imageData, timestamp) => {

        const {userinfo} = this.props;
        let mime = imageData.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const uri = `file://${imageData.path}`;
        const tmpArr = [...this.state.data];
        tmpArr[timestamp] = {uri, uploadStatus: 0};
        let interval = 0;
        let length = tmpArr.length;
        for (let i = 0; i < length; i++) {
            if (tmpArr[i].close) {
                interval += 1;
            }
            if (i === tmpArr.length - 1) {
                if (tmpArr.length - interval < 3) {
                    tmpArr.push({});
                }
                this.setState({
                    data: tmpArr,
                });
                setTimeout(() => {
                    uploadQiniuImage(userinfo.token, 'stepFile', mime, uri).then(URL => {
                        tmpArr[timestamp].uploadStatus = 1;
                        tmpArr[timestamp].uri = URL;
                        this.setState({
                            data: tmpArr,
                        });
                        this.forceUpdate();
                    }).catch(err => {
                        tmpArr[timestamp].uploadStatus = -1;
                        this.setState({
                            data: tmpArr,
                        });
                        this.forceUpdate();
                    });
                }, 500);

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
