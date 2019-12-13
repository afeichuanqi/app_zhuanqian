/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, Dimensions, TextInput} from 'react-native';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../../appSet';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtils from '../../navigator/NavigationUtils';
import actions from '../../action';
import {connect} from 'react-redux';
import BackPressComponent from '../../common/BackPressComponent';
import Toast from '../../common/Toast';

const {width} = Dimensions.get('window');

class UpdateUserName extends PureComponent {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        const {userinfo} = this.props;
        this.state = {
            text: userinfo.login ? userinfo.username : '',
        };
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
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
            barStyle: 'dark-content',
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '昵称', null, theme, 'black', 16, () => {
            const {onSetUserName, userinfo} = this.props;
            onSetUserName(userinfo.token, this.state.text, (bool,msg) => {
                if(bool){
                    this.toast.show('修改成功');
                }else{
                    this.toast.show(msg);
                }


            });
        }, false, true, '确定');
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    justifyContent: 'space-between',

                }}>
                    <TextInput
                        onChangeText={text => {
                            this.setState({
                                text,
                            });
                        }}
                        maxLength={12}
                        style={{
                            fontSize: 14,
                            width: width - 20,
                            borderBottomWidth: 0.3,
                            borderBottomColor: '#e8e8e8',
                            // paddingBottom: 10,
                            padding: 0,
                            height: 30,
                        }} value={this.state.text}/>
                    <View>
                        <View style={{flexDirection: 'row', position: 'absolute', right: 10, top: 10}}>
                            <Text style={{color: bottomTheme}}>{this.state.text.length}</Text>
                            <Text style={{opacity: 0.5}}>/12</Text>
                        </View>
                    </View>


                </View>


            </SafeAreaViewPlus>
        );
    }


    username = '';
    _sureClick = () => {
        if (this.username.length == 0) {
            this.textInput.setNativeProps({
                style: {borderWidth: 1, borderColor: `rgba(255, 0, 0, 1)`},
            });
        } else {
            this.textInput.setNativeProps({
                style: {borderWidth: 0},
            });

        }
    };
    _onChangeText = (text) => {
        this.username = text;
    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetUserSex: (token, value, callback) => dispatch(actions.onSetUserSex(token, value, callback)),
    onSetUserName: (token, value, callback) => dispatch(actions.onSetUserName(token, value, callback)),
    // onClearUserinfoAll: () => dispatch(actions.onClearUserinfoAll()),
});
const UpdateUserNameRedux = connect(mapStateToProps, mapDispatchToProps)(UpdateUserName);
export default UpdateUserNameRedux;
