/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, TextInput, ScrollView, View, Dimensions} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import {StatusBar} from 'react-native';
import ViewUtil from '../util/ViewUtil';
import message_more from '../res/svg/message_more.svg';
import NavigationUtils from '../navigator/NavigationUtils';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import Toast from '../common/Toast';
import SvgUri from 'react-native-svg-uri';
import add_image from '../res/svg/add_image.svg';
import PickerImage from '../common/PickerImage';
import {uploadQiniuImage} from '../util/AppService';

const {width, height} = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;

class MyTaskReview extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    state = {
        data: [
            {},
        ],
    };

    componentWillUnmount() {

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
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '任务审核', message_more, null, null, null, () => {
            NavigationUtils.goPage({fromUserinfo: this.params.fromUserinfo}, 'ChatSettings');
        });
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
                                <Text style={{fontSize: 15, color: 'rgba(0,0,0,1)'}}>{taskData.task_title}</Text>
                                <Text style={{fontSize: 13, color: 'red'}}>+{taskData.reward_price}</Text>
                            </View>

                        </View>

                    </TouchableOpacity>
                    <View style={{backgroundColor: 'white', marginTop: 20, paddingHorizontal: 10}}>
                        <View style={{

                            paddingVertical: 5,
                            justifyContent: 'center',


                            paddingTop: 10,
                        }}>
                            <TextInput style={{
                                height: 100, width: width - 20, backgroundColor: '#e8e8e8',
                                paddingHorizontal: 5,
                            }}
                                       placeholder={'请输入驳回理由'}
                                       placeholderTextColor={'#7f7f7f'}
                                       multiline={true}
                            />

                        </View>
                        <View style={{marginBottom: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                            {this.state.data.map((item, index, arr) => {

                                if (!item.close) {
                                    return <TouchableOpacity
                                        key={index}
                                        ref={ref => this.btn = ref}
                                        onPress={() => {
                                            this.refs[`picker${index}`].show(index);
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
                                        {item.uri && <TouchableOpacity

                                            onPress={() => {
                                                const tmpArr = [...this.state.data];
                                                const json = {close: true};
                                                tmpArr[index] = json;
                                                this.setState({
                                                    data: tmpArr,
                                                });
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
                <PickerImage includeBase64={false} cropping={false} select={this._selectImg}
                             ref={ref => this.pickerImg = ref}/>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        position: 'absolute',
                        bottom: 5,
                        width: screenWidth - 20,
                        justifyContent: 'center',
                        // paddingVertical: 5,
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

    _selectImg = (imageData, timestamp) => {
        console.log(timestamp,"timestamp");
        const {userinfo} = this.props;
        let mime = imageData.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const uri = `file://${imageData.path}`;
        const tmpArr = [...this.state.data];
        tmpArr[timestamp] = {uri, uploadStatus: 0};
        tmpArr.push({});
        this.setState({
            data: tmpArr,
        });
        console.log(uri,"uriuri");
        uploadQiniuImage(userinfo.token, 'stepFile', mime, uri).then(URL => {
            // console.log(URL,"URL");
            const tmpArr = [...this.state.data];
            if (tmpArr[timestamp]) {
                tmpArr[timestamp].uploadStatus = 1;
                tmpArr[timestamp].uri = URL;
                this.setState({
                    data: tmpArr,
                });
            }
        }).catch(err => {
            // this.taskStep.setImageStatusOrUrl(timestamp, -1, '');
        });
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
