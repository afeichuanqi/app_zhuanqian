/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Dimensions, StatusBar, Text, TextInput, TouchableOpacity, View} from 'react-native';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import {theme} from '../../appSet';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtils from '../../navigator/NavigationUtils';
import Image from 'react-native-fast-image';
import menu_right from '../../res/svg/menu_right.svg';
import SvgUri from 'react-native-svg-uri';
import RadioComponent from '../../common/RadioComponent';
import {connect} from 'react-redux';
import {insertReportList, selectIsBeBlackList, setToBlackList} from '../../util/AppService';
import MyModalBox from '../../common/MyModalBox';
import BackPressComponent from '../../common/BackPressComponent';
import Toast from '../../common/Toast';

const {width, height} = Dimensions.get('window');

class ChatSetting extends PureComponent {
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
        const {userinfo} = this.props;
        const {token} = userinfo;
        const {fromUserinfo} = this.params;
        let toUserid = fromUserinfo.id;
        selectIsBeBlackList({
            beUserid: toUserid,
        }, token).then((result) => {
            this.radioComponent.setChecked(result.isBlack);
        }).catch(e => {
        });
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
        const {fromUserinfo} = this.params;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '聊天设置', null, theme, 'black', 16, () => {
        }, false);
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
                    <View style={{
                        height: 20,
                        backgroundColor: '#f5f5f5',
                    }}/>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            NavigationUtils.goPage({userid: fromUserinfo.id}, 'ShopInfoPage');
                        }}
                        style={{width, height: 70, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10}}>
                        <Image
                            source={{uri: fromUserinfo.avatar_url}}
                            style={{
                                width: 50, height: 50,
                                borderRadius: 25,
                            }}/>
                        <View style={{marginLeft: 15, height: 50, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 15, color: 'black'}}>{fromUserinfo.username}</Text>
                            <Text style={{color: 'rgba(0,0,0,0.7)'}}>ID:{fromUserinfo.id}</Text>
                        </View>
                        <SvgUri style={{position: 'absolute', right: 15, top: 30}} width={15} height={15}
                                svgXmlData={menu_right}/>
                    </TouchableOpacity>
                    <View style={{
                        height: 20,
                        backgroundColor: '#f5f5f5',
                    }}/>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        // onPress={click}
                        style={{
                            height: 40,
                            width,
                            paddingHorizontal: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',

                        }}>
                        <Text style={{fontSize: 14, color: 'rgba(0,0,0,0.9)'}}>{'屏蔽此人'}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
                            <RadioComponent ref={ref => this.radioComponent = ref} select={this._select}/>
                        </View>

                    </TouchableOpacity>
                    <View style={{
                        height: 20,
                        backgroundColor: '#f5f5f5',
                    }}/>
                    <TouchableOpacity
                        onPress={() => {
                            this.myModalBox.show();
                        }}
                        style={{
                            height: 35,
                            backgroundColor: 'red',
                            marginHorizontal: 20,
                            width: width - 20,
                            alignSelf: 'center',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 16, color: 'white'}}>举报此人</Text>
                    </TouchableOpacity>
                </View>
                <MyModalBox
                    title={'举报内容'}
                    style={{
                        width: width - 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: 5,
                    }}
                    sureClick={this._sureClick}
                    rightTitle={'举报'}
                    ref={ref => this.myModalBox = ref}>
                    <TextInput
                        ref={ref => this.textInput = ref}
                        autoCapitalize={'none'}
                        autoComplete={'off'}
                        autoCorrect={false}
                        blurOnSubmit={false}
                        onChangeText={this._onChangeText}
                        maxLength={100}
                        multiline={true}
                        style={{
                            height: 130,
                            backgroundColor: '#f7f7f7',
                            padding: 0,
                            paddingTop: 8,
                            width: width - 40,
                            fontSize: 13,
                            paddingHorizontal: 10,
                            textAlignVertical: 'top',
                        }}

                    />

                </MyModalBox>
            </SafeAreaViewPlus>
        );
    }

    reportText = '';
    _onChangeText = (text) => {
        this.reportText = text;
    };
    _sureClick = () => {
        if (this.reportText.length == 0) {
            this.textInput.setNativeProps({
                borderWidth: 1,
                borderColor: 'red',
            });
        } else {
            this.textInput.setNativeProps({
                borderWidth: 0,
            });
            const {userinfo} = this.props;
            const {token} = userinfo;
            const {fromUserinfo} = this.params;
            let toUserid = fromUserinfo.id;
            insertReportList({
                beUserid: toUserid,
                reportText: this.reportText,
            }, token).then(() => {
                this.myModalBox.hide();
                this.reportText = '';
                this.toast.show('举报成功')
            });
        }

    };
    _select = (isCheck) => {
        const {userinfo} = this.props;
        const {token} = userinfo;
        const {fromUserinfo} = this.params;
        let toUserid = fromUserinfo.id;
        // if (isCheck) {
        setToBlackList({
            beUserid: toUserid,
            is_black: isCheck ? 1 : 0,
        }, token).then(() => {
        }).catch(e => {
            this.radioComponent.setChecked(!isCheck);
        });
    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
const ChatSettingRedux = connect(mapStateToProps, mapDispatchToProps)(ChatSetting);
// const SettingPageRedux = connect(mapStateToProps, mapDispatchToProps)(SettingPage);
export default ChatSettingRedux;
