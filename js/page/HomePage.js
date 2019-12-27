/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Animated, Dimensions, StyleSheet, View, Text, StatusBar} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import RNBootSplash from 'react-native-bootsplash';
import NavigationUtils from '../navigator/NavigationUtils';
import PromotionToast from '../common/PromotionToast';
// import CodePush from 'react-native-code-push';
import Toast from '../common/Toast';

let bootSplashLogo = require('../../assets/bootsplash_logo.png');

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    opacity = new Animated.Value(1);
    translateY = new Animated.Value(0);
    state = {
        showAnimated: true,
    };

    async componentDidMount() {
        // const updateMessage = await CodePush.checkForUpdate() || {};
        // console.log(updateMessage,"updateMessage");
        // await CodePush.sync(
        //     // 第一个参数吗，是个对象，可定义更新的动作
        //     {
        //         // 安装模式 'IMMEDIATE' 立刻安装， ON_NEXT_RESUME 下次启动安装
        //         installMode: CodePush.InstallMode.ON_NEXT_RESUME,
        //
        //         // 强制更新模式下的安装，默认是IMMEDIATE 直接安装
        //         mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
        //
        //         //更新确认弹窗设置，设置系统自带弹窗中的内容
        //         updateDialog: {
        //             mandatoryUpdateMessage: '强制更新内容: ' + updateMessage.description,
        //             mandatoryContinueButtonLabel: '强制更新/确认',
        //             optionalIgnoreButtonLabel: '取消',
        //             optionalInstallButtonLabel: '安装',
        //             optionalUpdateMessage: '本次更新内容: ' + updateMessage.description,
        //             title: '发现新版本'
        //         }
        //     },
        //     // 第二个参数，更新状态检测，返回数字
        //     //0 已经是最新，1 安装完成、等待生效，2 忽略更新，3 未知错误，4 已经在下载了，5 查询更新，6 弹出了更新确认界面，7 下载中，8下载完成
        //     (status) => {
        //
        //         switch (status) {
        //             case 0:
        //                 this.toast.show('已经是最新版本');
        //                 break;
        //             case 1 :
        //                 !updateMessage.isMandatory && this.toast.show('更新完成, 再启动APP更新即生效');
        //                 break;
        //             case 3:
        //                 this.toast.show('出错了，未知错误');
        //                 break;
        //             case 7 :
        //                 this.toast.show('下载中');
        //                 break;
        //             case 8 :
        //                 this.toast.show('8下载完成');
        //                 break;
        //         }
        //     },
        //     // 第三个参数，检测下载过程
        //     ({receivedBytes, totalBytes}) => {
        //         // console.log('DownloadProgress: ', receivedBytes, totalBytes);
        //         // this.setState({
        //         //     receivedBytes: (receivedBytes / 1024).toFixed(2),
        //         //     totalBytes: (totalBytes / 1024).toFixed(2)
        //         // })
        //     },
        // );
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    startAnimated = () => {

        RNBootSplash.hide();
        let useNativeDriver = true;
        Animated.stagger(250, [
            Animated.spring(this.translateY, {useNativeDriver, toValue: -50}),
            Animated.spring(this.translateY, {
                useNativeDriver,
                toValue: Dimensions.get('window').height,
            }),
        ]).start();
        Animated.timing(this.opacity, {
            useNativeDriver,
            toValue: 0,
            duration: 700,
            delay: 250,
        }).start(() => {
            NavigationUtils.navigation = this.props.navigation;
            StatusBar.setBarStyle('dark-content', false);
            StatusBar.setBackgroundColor(theme, false);
            this.setState({
                showAnimated: false,
            },()=>{
                this.promotionToast.show();
            });

        });
    };

    render() {
        const {showAnimated} = this.state;

        return (
            <View style={{flex: 1}}>
                <Toast
                    ref={ref => this.toast = ref}
                />
                {showAnimated && <Animated.View style={[styles.container, {opacity: this.opacity}]}>
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            styles.bootsplash,

                        ]}
                    >
                        <Animated.Image
                            source={bootSplashLogo}
                            fadeDuration={0}
                            onLoadEnd={this.startAnimated}
                            style={[
                                styles.logo,
                                {transform: [{translateY: this.translateY}]},
                            ]}
                        />
                    </Animated.View>
                    <View style={{
                        position: 'absolute',
                        bottom: 100, height: 25, width: Dimensions.get('window').width, alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{color: 'white', fontSize: 22}}>兼职 赚钱</Text>
                        {/*<Text style={{color:'white'}}>芜湖易尔通</Text>*/}

                    </View>

                </Animated.View>}

                <SafeAreaViewPlus
                    topColor={theme}
                    bottomInset={false}
                >
                    <DynamicTabNavigator/>

                </SafeAreaViewPlus>
                <PromotionToast ref={ref => this.promotionToast = ref}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        zIndex: 100,
    },

    bootsplash: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
    },
    logo: {
        height: 100,
        width: 100,
    },
});
export default HomePage;
