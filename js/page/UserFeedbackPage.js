/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions,
    StyleSheet, Text,
    View, TouchableOpacity, StatusBar, ScrollView, TextInput, Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import {saveFeedBack} from '../util/AppService';
import UploadImgsComponent from '../common/UploadImgsComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class UserFeedbackPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {};
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
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
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '提意见送大礼', null, 'white', 'black', hp(2.4), () => {
            NavigationUtils.goPage({}, 'UserFeedbackListPage');
        }, false, true, '历史反馈');

        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex:1}}>
                    <KeyboardAwareScrollView
                        enableOnAndroid={true} style={{flex: 1, backgroundColor: '#f7f7f7'}}>
                        <View>
                            <Text style={{
                                color: 'rgba(0,0,0,0.5)',
                                paddingTop: 10,
                                paddingLeft: 10,
                                marginBottom: 10,
                                fontSize:hp(2),
                            }}>标签</Text>
                            <RadioCheck ref={ref => this.radioCheck = ref}/>
                        </View>
                        <View style={{marginTop: 10}}>
                            <Text style={{
                                color: 'rgba(0,0,0,0.5)',
                                paddingTop: 10,
                                paddingLeft: 10,
                                marginBottom: 10,
                                fontSize:hp(2),
                            }}>反馈内容</Text>
                            <InputTextImage ref={ref => this.inputTextImage = ref} userinfo={this.props.userinfo}/>
                        </View>
                        <View style={{marginTop: 10}}>
                            <Text style={{
                                color: 'rgba(0,0,0,0.5)',
                                paddingTop: 10,
                                paddingLeft: 10,
                                marginBottom: 10,
                                fontSize:hp(2),
                            }}>联系方式</Text>
                            <InputPro ref={ref => this.inputPro = ref}/>
                        </View>
                        <View style={{height: 50}}/>

                    </KeyboardAwareScrollView>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.sendView}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width,
                            height: hp(7),
                            backgroundColor: bottomTheme,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{color: 'white', fontSize: hp(2)}}>提交</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaViewPlus>
        );
    }

    sendView = () => {
        const radioItem = this.radioCheck.getType();
        const images = this.inputTextImage.getImages();
        const text = this.inputTextImage.getText();
        const phone = this.inputPro.getPhone();
        if (text.length < 10) {
            Toast.show('请输入大于10个字节的建议哦');
            return;
        }
        if (images.length === 0) {
            Toast.show('请至少上传一张图片哦');
            return;
        }
        if (phone.length < 3) {
            Toast.show('请输入大于3个字节的联系方式哦');
            return;
        }
        const content = {
            images,
            info: text,
        };
        saveFeedBack({
            content: JSON.stringify(content),
            type: radioItem.id,
            phone,
        }, this.props.userinfo.token).then(result => {
            Toast.show('反馈成功 ~ ~');
            this.inputTextImage.reStart();
            this.radioCheck.reStart();
            this.inputPro.reStart();
            NavigationUtils.goPage({}, 'UserFeedbackListPage');
        }).catch(msg => {
            Toast.show('反馈失败 ~ ~');
        });
    };

}

class InputPro extends PureComponent {
    getPhone = () => {
        return this.state.phone;
    };
    state = {
        phone: '',
    };
    reStart = () => {
        this.setState({
            phone: '',
        });
    };

    render() {
        return <TextInput
            onChangeText={text => {
                this.setState({
                    phone: text,
                });
            }}
            value={this.state.phone}
            placeholder={'请留下您的联系方式，方便我们联系您'}
            placeholderTextColor={'rgba(0,0,0,0.4)'}
            style={{height: hp(6), width, backgroundColor: 'white', paddingHorizontal: 15, fontSize:hp(2)}}
        />;
    }
}

class InputTextImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            changeText: '',
        };
    }

    reStart = () => {
        this.setState({
            changeText: '',
        });
        this.uploadImgs.reStart();

    };

    render() {


        return <View>
            <TextInput
                onChangeText={text => {
                    this.setState({
                        changeText: text,
                    });
                }}
                value={this.state.changeText}
                style={{
                    height: height / 4,
                    width,
                    backgroundColor: 'white',
                    // paddingHorizontal: 5,
                    padding: 0,
                    textAlignVertical: 'top',
                    paddingTop: 5,
                    paddingHorizontal:15,
                    borderRadius: 5,
                    fontSize:hp(2.0),
                }}
                placeholder={'希望您能积极的提交平台的不足,请我们及时能知道我们的缺点 ~ ~ 请务必在登录模式下提交,如bug存在将赠送红包'}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                multiline={true}
                autoCapitalize={'none'}
                autoComplete={'off'}
            />
            <View style={{ flexDirection: 'row', backgroundColor:'white', paddingLeft:13}}>
                <UploadImgsComponent userinfo={this.props.userinfo} ref={ref => this.uploadImgs = ref}/>
            </View>

        </View>;
    }

    getImages = () => {
        const imgs = this.uploadImgs.getImages();
        const imgsText = [];
        for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].uploadStatus == 1) {
                imgsText.push(imgs[i].uri);

            }
            if (i === imgs.length - 1) {
                return imgsText;
            }
        }

    };
    getText = () => {
        return this.state.changeText;

    };

}

class RadioCheck extends PureComponent {
    static defaultProps = {
        data: [
            {id: 1, title: '功能建议'},
            {id: 2, title: '体验性能'},
            {id: 3, title: 'bug提交'},
        ],
    };

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            checkIndex: 0,
        };
    }

    reStart = () => {
        this.setState({
            checkIndex: 0,
        });
    };
    getType = () => {
        return this.state.data[this.state.checkIndex];
    };

    // get
    render() {
        const {data, checkIndex} = this.state;
        return <View style={{flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white', paddingLeft:15}}>
            {data.map((item, index, arrs) => {
                return <TouchableOpacity
                    activeOpacity={0.6}
                    key={index}
                    onPress={() => {
                        this.setState({
                            checkIndex: index,
                        });
                    }}
                    style={[{
                        paddingHorizontal: hp(1),
                        paddingVertical: 8,
                        // borderWidth: 1,
                        // borderColor: bottomTheme,
                        marginHorizontal: hp(1.2),
                        borderRadius: 4,
                        // backgroundColor: '#f7f7f7',
                        // borderWidth: 0.3,
                        borderStyle: 'dashed',
                        borderWidth: 1,
                    }, checkIndex === index ? {
                        backgroundColor: 'rgba(33,150,243,0.1)',
                         borderColor: bottomTheme,
                    }:{backgroundColor: '#fcfcfc', borderColor:'#d2d2d2'}]}>
                    <Text
                        style={[{color: bottomTheme, fontSize:hp(2)}, checkIndex === index ? {color: bottomTheme} : {color: 'rgba(0,0,0,0.7)'}]}>{item.title}</Text>
                </TouchableOpacity>;
            })}

        </View>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const UserFeedbackPageRedux = connect(mapStateToProps, mapDispatchToProps)(UserFeedbackPage);


export default UserFeedbackPageRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 40,
        height: 40,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
