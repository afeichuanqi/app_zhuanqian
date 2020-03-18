/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions, Text,
    View, StatusBar, TextInput, TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {setUserWithDrawInfo, uploadQiniuImage} from '../util/AppService';
import actions from '../action';
import Toast from 'react-native-root-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import add_image from '../res/svg/add_image.svg';
import SvgUri from 'react-native-svg-uri';
import PickerImage from '../common/PickerImage';
import FastImagePro from '../common/FastImagePro';

const width = Dimensions.get('window').width;

class WithDrawAccount extends React.Component {
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
        taskData: {},
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        this.backPress.componentDidMount();
        console.log(this.props.userinfo)
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '提现帐户', null, 'white', 'black', 16, null, false, false, '清空', 'black');
        let pay_name = '';
        let pay_account = '';
        let pay_uri = '';
        let pay = '';

        if (this.params.type === 1) {
            pay = '支付宝';
            pay_name = this.props.userinfo.alipay_name;
            pay_account = this.props.userinfo.alipay_account;
            pay_uri = this.props.userinfo.alipay_uri;
        } else {
            pay = '微信';
            pay_name = this.props.userinfo.wechat_name;
            pay_account = this.props.userinfo.wechat_account;
            pay_uri = this.props.userinfo.wechat_uri;
        }
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                    <InputItem
                        ref={ref => this.payUserName = ref}
                        title={pay + '姓名'}
                        value={pay_name}
                    />
                    <InputItem
                        ref={ref => this.payAccount = ref}
                        title={pay + '帐户'}
                        value={pay_account}
                    />
                    <InputPic
                        ref={ref => this.inputPic = ref}
                        userinfo={this.props.userinfo}
                        title={'收款二维码'}
                        pay_uri={pay_uri}

                    />
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.saveAccount}
                        style={{
                            marginTop: 40,
                            borderRadius: 5,
                            width: wp(90),
                            height: hp(8),
                            alignSelf: 'center',
                            backgroundColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text style={{color: 'white', fontSize: hp(2.4)}}>保存</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>

            </SafeAreaViewPlus>
        );
    }

    saveAccount = () => {
        if (!this.props.userinfo.login) {
            Toast.show('请登录');
            return;
        }
        const pay_username = this.payUserName.getValue();
        const pay_account = this.payAccount.getValue();
        const uri = this.inputPic.getUri();
        const pay_type = this.params.type;
        if (!pay_username || pay_username.length === 0) {
            Toast.show('您并没有输入姓名');
            return;
        }
        if (!pay_account || pay_account.length === 0) {
            Toast.show('您并没有输入帐户');
            return;
        }
        if(!uri || uri.length===0){
            Toast.show('请绑定收款二维码');
            return;
        }
        setUserWithDrawInfo({
            pay_username,
            pay_account,
            pay_type,
            pay_uri: uri,
        }, this.props.userinfo.token).then(result => {

            this.props.onAddPayAccount(pay_username, pay_account, pay_type, uri);
            NavigationUtils.goBack(this.props.navigation);
        }).catch(msg => {
            Toast.show(msg);
        });
    };
    page = {
        pageIndex: 0,
    };

}

class InputItem extends React.PureComponent {
    static defaultProps = {
        value: '',
        title: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        };
    }

    getValue = () => {
        return this.state.value;
    };

    render() {
        const {title} = this.props;
        const {value} = this.state;

        return <>
            <View style={{
                height: hp(8),
                width,
                backgroundColor: 'white',
                flexDirection: 'row',
                paddingHorizontal: 15,
                alignItems: 'center',
            }}>
                <Text style={{fontSize: hp(2.1)}}>{title}</Text>
                <TextInput
                    value={value}
                    style={{
                        textAlign: 'right',
                        flex: 1,
                        fontSize: hp(2.1),
                        color: 'rgba(0,0,0,0.5)',
                    }}
                    onChangeText={(text) => {
                        this.setState({
                            value: text,
                        });
                    }}

                />
            </View>
            <View style={{height: 0.3, width, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
        </>;
    }
}

class InputPic extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uploadStatus: (this.props.pay_uri && this.props.pay_uri.length > 0) ? 1 : 0,
            uri: (this.props.pay_uri && this.props.pay_uri.length > 0) ? this.props.pay_uri : '',

        };
    }

    getUri = () => {
        return this.state.uri;
    };

    render() {
        const {title} = this.props;
        const {uploadStatus, uri} = this.state;
        return <>
            <TouchableOpacity
                onPress={() => {
                    this.picker.show();
                }}
                style={{
                    height: hp(13),
                    width,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: hp(2.1)}}>{title}</Text>
                <TouchableOpacity
                    onPress={() => {
                        this.picker.show();
                    }}>
                    {
                        uploadStatus === 0 ? <SvgUri width={35} height={35} svgXmlData={add_image}/>
                            : uploadStatus === 1 ? <FastImagePro
                                loadingType={2}
                                source={{uri: uri}}
                                loadingWidth={30}
                                loadingHeight={30}
                                style={{
                                    width: 40,
                                    height: 40, backgroundColor: '#F0F0F0', borderRadius: 3,
                                }}
                                resizeMode={'contain'}
                            /> : uploadStatus === -1 ?
                            <Text style={{fontSize: 11, color: 'red'}}>上传失败</Text> : uploadStatus === 2 ?
                                <Text style={{fontSize: 11, }}>正在上传</Text> : null
                    }
                </TouchableOpacity>

            </TouchableOpacity>
            <View style={{height: 0.3, width, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
            <PickerImage includeBase64={false} cropping={false} select={this._selectImg}
                         ref={(ref) => this.picker = ref}/>
        </>;
    }

    _selectImg = (imageData, timestamp) => {

        const {userinfo} = this.props;
        if (!userinfo.token) {
            Toast.show('请先登录');
            return;
        }
        this.setState({
            uploadStatus: 2,
        });
        let mime = imageData.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const uri = `file://${imageData.path}`;
        setTimeout(() => {
            uploadQiniuImage(userinfo.token, 'shoukuan', mime, uri).then(URL => {
                this.setState({
                    uploadStatus: 1,
                    uri: URL,
                });
            }).catch(err => {
                this.setState({
                    uploadStatus: -1,
                });
            });
        }, 500);


    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({

    onAddPayAccount: (name, account, type, dataUri) => dispatch(actions.onAddPayAccount(name, account, type, dataUri)),
});
const WithDrawPageRedux = connect(mapStateToProps, mapDispatchToProps)(WithDrawAccount);


export default WithDrawPageRedux;

