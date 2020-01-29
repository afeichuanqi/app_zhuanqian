/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
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
import {setUserWithDrawInfo} from '../util/AppService';
import actions from '../action';
import Toast from 'react-native-root-toast';

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
        let pay = '';
        if (this.params.type === 1) {
            pay = '支付宝';
            pay_name = this.props.userinfo.alipay_name;
            pay_account = this.props.userinfo.alipay_account;
        } else {
            pay = '微信';
            pay_name = this.props.userinfo.wechat_name;
            pay_account = this.props.userinfo.wechat_account;
        }
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
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
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            if (!this.props.userinfo.login) {
                                Toast.show('请登录');
                                return;
                            }
                            const pay_username = this.payUserName.getValue();
                            const pay_account = this.payAccount.getValue();
                            const pay_type = this.params.type;
                            if (pay_username.length === 0) {
                                Toast.show('您并没有输入姓名');
                                return;
                            }
                            if (pay_account.length === 0) {
                                Toast.show('您并没有输入帐户');
                                return;
                            }

                            setUserWithDrawInfo({
                                pay_username,
                                pay_account,
                                pay_type,
                            }, this.props.userinfo.token).then(result => {

                                this.props.onAddPayAccount(pay_username, pay_account, pay_type);
                                NavigationUtils.goBack(this.props.navigation);
                            }).catch(msg => {
                                Toast.show(msg);
                            });
                        }}
                        style={{
                            marginTop: 40,
                            borderRadius: 8,
                            width: wp(90),
                            height: hp(8),
                            alignSelf: 'center',
                            backgroundColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text style={{color: 'white', fontSize: 19}}>保存</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaViewPlus>
        );
    }

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
                <Text style={{fontSize: 16,}}>{title}</Text>
                <TextInput
                    value={value}
                    style={{
                        textAlign: 'right',
                        flex: 1,
                        fontSize: 16,
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

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({

    onAddPayAccount: (name, account, type) => dispatch(actions.onAddPayAccount(name, account, type)),
});
const WithDrawPageRedux = connect(mapStateToProps, mapDispatchToProps)(WithDrawAccount);


export default WithDrawPageRedux;

