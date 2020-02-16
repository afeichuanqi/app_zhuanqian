/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import actions from '../action';
import {connect} from 'react-redux';
import BackPressComponent from '../common/BackPressComponent';
import Toast from 'react-native-root-toast';
import SvgUri from 'react-native-svg-uri';
import phone_input_clear from '../res/svg/phone_input_clear.svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {getInvitationCode, setInvitationCode} from '../util/AppService';

const {width} = Dimensions.get('window');

class InvitationCodePage extends React.Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.params = this.props.navigation.state.params;
        this.state = {
            text: '',
            status: 0,
        };
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };


    componentDidMount() {
        this.updatePage();
        this.backPress.componentDidMount();
    }

    updatePage = () => {
        getInvitationCode(this.props.userinfo.token).then(result => {
            if (result.InvitationCode && result.InvitationCode.length > 0) {
                this.setState({
                    text: result.InvitationCode,
                    status: 1,
                });
            } else {
                this.setState({
                    status: 0,
                    text: this.params.invitationId ? this.params.invitationId : '',
                });
            }
        }).catch(msg => {
            this.setState({
                status: -1,
            });
        });
    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }


    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
            barStyle: 'dark-content',
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '输入邀请码', null, theme, 'black', 16, () => {
            const {onSetUserName, userinfo} = this.props;
            onSetUserName(userinfo.token, this.state.text, (bool, msg) => {
                if (bool) {
                    Toast.show('修改成功');
                } else {
                    Toast.show(msg);
                }


            });
        }, false, false, '确定');
        const Container = this.state.text.length > 0 ? TouchableOpacity : View;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    justifyContent: 'space-between',
                    marginHorizontal: 10,
                    marginTop: 30,
                }}>
                    <TextInput
                        onChangeText={text => {
                            this.setState({
                                text,
                            });
                        }}
                        maxLength={6}
                        editable={this.state.status === 0}
                        placeholderTextColor={'rgba(0,0,0,0.6)'}
                        placeholder={'输入好友邀请码（向介绍人索取）'}
                        style={{
                            fontSize: hp(2.1),
                            width: width - 60,
                            borderBottomWidth: 0.3,
                            borderBottomColor: '#d7d7d7',
                            padding: 0,
                            height: 30,
                        }}
                        value={this.state.text}/>
                    <View
                        style={{flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 40, top: 16}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: bottomTheme}}>{this.state.text.length}</Text>
                            <Text style={{opacity: 0.5}}>/6</Text>
                        </View>
                        {(this.state.text.length > 0 && this.state.status === 0) && <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    text: '',
                                });
                            }}
                            style={{marginLeft: 5}}
                            activeOpacity={0.7}>
                            <SvgUri width={13}
                                    height={13}
                                    fill={'rgba(0,0,0,0.6)'}
                                    svgXmlData={phone_input_clear}/>
                        </TouchableOpacity>}
                    </View>


                </View>
                {this.state.status === 0 && <Container
                    onPress={this._sureClick}
                    style={{
                        height: hp(6),
                        width: wp(80),
                        marginHorizontal: wp(10),
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: bottomTheme,
                        borderRadius: 5,
                        marginTop: hp(4),
                        opacity: this.state.text.length > 0 ? 1 : 0.5,
                    }}>
                    <Text style={{fontSize: hp(2.3), color: 'white'}}>提交邀请码</Text>
                </Container>}
                {
                    (this.state.status === 1 || this.state.status === -1) && <View
                        onPress={this._sureClick}
                        style={{
                            height: hp(6),
                            width: wp(80),
                            marginHorizontal: wp(10),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: bottomTheme,
                            borderRadius: 5,
                            marginTop: hp(4),
                            opacity: 0.5,
                        }}>
                        <Text style={{fontSize: hp(2.3), color: 'white'}}>{
                            this.state.status === 1 ? ' ✓ 已成功邀请' : this.state.status === -1 ? '未登录' : ''
                        }</Text>
                    </View>
                }
            </SafeAreaViewPlus>
        );
    }


    username = '';
    _sureClick = () => {
        if (this.state.text.length !== 6) {
            Toast.show('邀请码错误');
            return;
        }
        setInvitationCode({invite_code: this.state.text}, this.props.userinfo.token).then(result => {
            const invite_userid = result.invite_userid;
            Toast.show(`邀请ID:${invite_userid}成功`);
            this.updatePage();
        }).catch(msg => {
            Toast.show(msg);
        });
    };


}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onSetUserName: (token, value, callback) => dispatch(actions.onSetUserName(token, value, callback)),
});
const InvitationCodePageRedux = connect(mapStateToProps, mapDispatchToProps)(InvitationCodePage);
export default InvitationCodePageRedux;
