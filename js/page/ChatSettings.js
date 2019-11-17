/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Dimensions, StatusBar, Text, TextInput, TouchableOpacity, View} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import Image from 'react-native-fast-image';
import menu_right from '../res/svg/menu_right.svg';
import SvgUri from 'react-native-svg-uri';
import RadioComponent from '../common/RadioComponent';
import {connect} from 'react-redux';
import {insertReportList, selectIsBeBlackList, setToBlackList} from '../util/AppService';
import MyModalBox from '../common/MyModalBox';

const {width, height} = Dimensions.get('window');

class ChatSetting extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;

    }

    state = {};

    componentDidMount() {
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

    }

    _goBackClick = () => {
        this.props.navigation.goBack();
    };

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
        const {userinfo} = this.props;
        // const {token} = userinfo;
        const {fromUserinfo} = this.params;
        // const {userinfo} = this.props;

        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '聊天设置', null, theme, 'black', 16);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <View style={{
                        height: 20,
                        backgroundColor: '#f5f5f5',
                    }}/>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            NavigationUtils.goPage({}, 'ShopInfoPage');
                        }}
                        style={{width, height: 70, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10}}>
                        <Image
                            source={{uri: fromUserinfo.avatar_url}}
                            style={{
                                width: 50, height: 50,
                                borderRadius: 25,
                            }}/>
                        <View style={{marginLeft: 15, alignSelf: 'flex-start', marginTop: 15}}>
                            <Text style={{fontSize: 15, color: 'black'}}>{fromUserinfo.username}</Text>
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
                    titleComponent={<Text style={{fontSize: 12, color: 'red', marginLeft: 10}}>请勿频繁提交或提交不属实的依据</Text>}
                    title={'举报内容'} style={{
                    // height:
                    width: width - 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 5,
                    // borderTopWidth:3,
                    // borderTopColor:'#2196F3',
                }}
                    sureClick={this._sureClick}
                    rightTitle={'举报'}
                    ref={ref => this.myModalBox = ref}>
                    <View style={{
                        paddingBottom: 10,
                        width: width - 40,
                        paddingHorizontal: 15,
                    }}>
                        <TextInput
                            ref={ref => this.textInput = ref}
                            autoCapitalize={'none'}
                            autoComplete={'off'}
                            autoCorrect={'false'}
                            blurOnSubmit={false}
                            onChangeText={this._onChangeText}
                            maxLength={100}
                            multiline={true}

                            style={{
                                height: 130,
                                backgroundColor: '#e8e8e8',
                                marginTop: 10,
                                fontSize: 13,
                                paddingHorizontal: 5,
                                borderRadius: 5,
                                padding: 0,
                                textAlignVertical: 'top',
                            }}

                        />
                    </View>

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
            console.log('成功');
        }).catch(e => {
            console.log('我被触发');
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
