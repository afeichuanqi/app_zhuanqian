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
    View, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import {getAllOrderForType,  userBuyOrder} from '../util/AppService';
import SkeletonPlaceholder from '../common/SkeletonPlaceholder';
import ToastSelect from '../common/ToastSelectTwo';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const width = Dimensions.get('window').width;

class UserUpdateOrderPage extends PureComponent {
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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '刷新包购买', null, 'white', 'black', hp(2), null, false);

        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <ScrollView style={{flex: 1, backgroundColor: '#efefef'}}>
                    <View>
                        <Text style={{
                            color: 'rgba(0,0,0,0.5)',
                            paddingTop: 15,
                            paddingHorizontal: 10,
                            marginBottom: 10,
                            fontSize: hp(2),
                        }}>购买须知：刷新包使用期限不限，不支持退订，请确认后购买</Text>

                    </View>
                    <View style={{marginTop: 10}}>
                        <RadioCheck ref={ref => this.radioCheck = ref}/>

                    </View>


                </ScrollView>
                <View style={{
                    flexDirection: 'row', position: 'absolute',
                    bottom: 0,
                }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            NavigationUtils.goBack(this.props.navigation);
                        }}
                        style={{

                            width: width / 2,
                            height:  hp(9),
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{color: 'black', fontSize: hp(2.4)}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            this.toastS.show();
                        }}
                        style={{
                            width: width / 2,
                            height: hp(9),
                            backgroundColor: bottomTheme,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{color: 'white', fontSize: hp(2.4)}}>提交</Text>
                    </TouchableOpacity>
                </View>
                <ToastSelect
                    sureTitle={'确认购买'}
                    sureClick={() => {
                        this.toastS.hide();
                        const orderId = this.radioCheck.getItem().id;
                        userBuyOrder({id: orderId}, this.props.userinfo.token).then(result => {
                            Toast.show('购买成功');
                        }).catch(msg => {
                            Toast.show(msg);
                        });
                    }}
                    ref={ref => this.toastS = ref}/>
            </SafeAreaViewPlus>
        );
    }

}

class RadioCheck extends PureComponent {
    getItem = () => {
        return this.state.data[this.state.checkIndex];
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            checkIndex: 0,
        };
    }

    getType = () => {
        return this.state.data[this.state.checkIndex];
    };

    componentDidMount() {
        getAllOrderForType({type: 1, pageIndex: 1}, '').then(result => {
            this.setState({
                data: result,
            });
        });
    }

    render() {

        const {data, checkIndex} = this.state;

        if (data.length === 0) {
            return <View
                style={{flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 20, backgroundColor: 'white'}}>
                {[{}, {}, {}, {}, {}, {}, {}, {}].map(() => {
                    return <SkeletonPlaceholder minOpacity={0.2}>
                        <View style={{
                            marginHorizontal: 10,
                            height: 30,
                            width: (width - 40) / 2,
                            marginBottom: 15,
                            // borderWidth: 1,
                        }}/>

                    </SkeletonPlaceholder>;
                })}
            </View>;
        }
        return <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 20, backgroundColor: 'white'}}>
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
                        paddingVertical: hp(2),
                        borderWidth: 0.3,
                        borderColor: bottomTheme,
                        marginHorizontal: 10,
                        borderRadius: hp(1),
                        backgroundColor: 'rgb(252,252,252)',
                        // borderStyle: 'dashed',
                        width: (width - 40) / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: hp(1.5),
                        // borderWidth: 1,
                    }, checkIndex === index ? {borderColor: bottomTheme} : {borderColor: 'rgba(0,0,0,0.3)'}]}>
                    <Text
                        style={[{
                            color: bottomTheme,
                            fontSize: hp(2.2),
                        }, , checkIndex === index ? {color: bottomTheme} : {color: 'rgba(0,0,0,0.7)'}]}>{item.title}</Text>
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
const UserUpdateOrderPagePageRedux = connect(mapStateToProps, mapDispatchToProps)(UserUpdateOrderPage);


export default UserUpdateOrderPagePageRedux;
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
