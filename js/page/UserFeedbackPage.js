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
    FlatList, StyleSheet, Text,
    View, TouchableOpacity, StatusBar, Clipboard, ScrollView, TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from '../common/Toast';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import add_image from '../res/svg/add_image.svg';
import SvgUri from 'react-native-svg-uri';
import PickerImage from '../common/PickerImage';
import {saveFeedBack, uploadQiniuImage} from '../util/AppService';
import UploadImgsComponent from '../common/UploadImgsComponent';

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
        this.backPress.componentDidMount();
        // this._updatePage(true);
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '提意见送大礼', null, 'white', 'black', 16, null, false);

        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <ScrollView style={{flex: 1, backgroundColor: '#efefef'}}>
                    <View>
                        <Text style={{
                            color: 'rgba(0,0,0,0.5)',
                            paddingTop: 10,
                            paddingLeft: 5,
                            marginBottom: 10,
                        }}>标签</Text>
                        <RadioCheck ref={ref => this.radioCheck = ref}/>
                    </View>
                    <View style={{marginTop: 10}}>
                        <Text style={{
                            color: 'rgba(0,0,0,0.5)',
                            paddingTop: 10,
                            paddingLeft: 5,
                            marginBottom: 10,
                        }}>反馈内容</Text>
                        <InputTextImage ref={ref => this.inputTextImage = ref} userinfo={this.props.userinfo}/>
                    </View>
                    <View style={{marginTop: 10}}>
                        <Text style={{
                            color: 'rgba(0,0,0,0.5)',
                            paddingTop: 10,
                            paddingLeft: 5,
                            marginBottom: 10,
                        }}>联系方式</Text>
                        <InputPro ref={ref => this.inputPro = ref}/>
                    </View>
                    <View style={{height: 50}}/>

                </ScrollView>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        const radioItem = this.radioCheck.getType();
                        const images = this.inputTextImage.getImages();
                        const text = this.inputTextImage.getText();
                        const phone = this.inputPro.getPhone();
                        const content = {
                            images,
                            info: text,
                        };
                        saveFeedBack({
                            content: JSON.stringify(content),
                            type: radioItem.id,
                            phone,
                        }, this.props.userinfo.token).then(result => {
                            this.toast.show('反馈成功 ~ ~');
                        }).catch(msg => {
                            this.toast.show('反馈失败 ~ ~');
                        });

                    }}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width,
                        height: 50,
                        backgroundColor: bottomTheme,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>提交</Text>
                </TouchableOpacity>
            </SafeAreaViewPlus>
        );
    }

}

class InputPro extends PureComponent {
    getPhone = () => {
        return this.phone;
    };

    render() {
        return <TextInput
            onChangeText={text => {
                this.phone = text;
            }}
            placeholder={'请留下您的联系方式，方便我们联系您'}
            placeholderTextColor={'rgba(0,0,0,0.4)'}
            style={{height: 40, width, backgroundColor: 'white', paddingLeft: 5}}
        />;
    }
}

class InputTextImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [{}],
        };
    }

    render() {
        const {data} = this.state;

        return <View>
            <TextInput
                onChangeText={text => {
                    this.changeText = text;
                }}
                style={{
                    height: height / 3,
                    width,
                    backgroundColor: 'white',
                    paddingHorizontal: 5,
                    padding: 0,
                    textAlignVertical: 'top',
                    paddingTop: 5,
                    paddingLeft: 5,
                    borderRadius: 5,
                }}
                placeholder={'希望您能积极的提交平台的不足,请我们及时能知道我们的缺点 ~ ~ 请务必在登录模式下提交,如bug存在将赠送红包'}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                multiline={true}
                autoCapitalize={'none'}
                autoComplete={'off'}
            />
            <View style={{position: 'absolute', bottom: 10, flexDirection: 'row'}}>
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
        return this.changeText;

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

    getType = () => {
        return this.state.data[this.state.checkIndex];
    };

    // get
    render() {
        const {data, checkIndex} = this.state;
        return <View style={{flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white'}}>
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
                        paddingHorizontal: 8,
                        paddingVertical: 8,
                        borderWidth: 1,
                        borderColor: bottomTheme,
                        marginHorizontal: 10,
                        borderRadius: 4,
                        backgroundColor: 'rgb(252,252,252)',
                        borderStyle: 'dashed',
                        // borderWidth: 1,
                    }, checkIndex === index ? {borderColor: bottomTheme} : {borderColor: 'rgba(0,0,0,0.7)'}]}>
                    <Text
                        style={[{color: bottomTheme}, , checkIndex === index ? {color: bottomTheme} : {color: 'rgba(0,0,0,0.7)'}]}>{item.title}</Text>
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
