/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Dimensions, StyleSheet, View, Text, StatusBar, Platform} from 'react-native';
import {theme, bottomTheme} from '../appSet';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import RNBootSplash from 'react-native-bootsplash';
import NavigationUtils from '../navigator/NavigationUtils';
import PromotionToast from '../common/PromotionToast';
import Toast from 'react-native-root-toast';
import Global from '../common/Global';
import {getAppSetting} from '../util/AppService';
import Animated from 'react-native-reanimated';
import JShareModule from 'jshare-react-native';
import PrivacyToast from '../common/PrivacyToast';
import actions from '../action';
import {connect} from 'react-redux';
import PrivacyToastStep2 from '../common/PrivacyToastStep2';

const {spring} = Animated;

let bootSplashLogo = require('../../assets/bootsplash_logo.png');


class HomePage extends PureComponent {
    constructor(props) {
        super(props);
        NavigationUtils.navigation = this.props.navigation;
    }

    translateY = new Animated.Value(0);
    state = {
        showAnimated: true,
    };

    async componentDidMount() {
        getAppSetting().then(result => {

            Global.user_top_fee = result.user_top_fee;
            Global.user_service_fee = result.user_service_fee;
            Global.user_recommend_fee = result.user_recommend_fee;
        });
        Global.toast = Toast;
        JShareModule.setup();

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    startAnimated = () => {
        RNBootSplash.hide();
        // this.PrivacyToastStep2.show();
        const {appSetting, onIsAgreePrivacy} = this.props;
        // onIsAgreePrivacy(false);
        if (Platform.OS === 'android' && !appSetting.agreePrivacy) {
            this.PrivacyToast.show();
        } else {
            this.hideSelf();
        }
    };
    hideSelf = () => {
        spring(this.translateY, {
            toValue: -50,
            damping: 100,
            mass: 0.1,
            stiffness: 50,
            overshootClamping: false,
            restSpeedThreshold: 20,
            restDisplacementThreshold: 20,
        }).start(() => {
            StatusBar.setTranslucent(false);
            StatusBar.setBarStyle('dark-content', false);
            StatusBar.setBackgroundColor(theme, false);
            spring(this.translateY, {
                toValue: 500,
                damping: 55,
                mass: 1,
                stiffness: 400,
                overshootClamping: false,
                restSpeedThreshold: 1,
                restDisplacementThreshold: 1,
            }).start(() => {
                StatusBar.setHidden(false);

                this.setState({
                    showAnimated: false,
                }, () => {
                    this.promotionToast.show();
                });
            });
        });
    };

    render() {
        const {showAnimated} = this.state;
        const {appSetting, onIsAgreePrivacy} = this.props;

        const opacity = Animated.interpolate(this.translateY, {
            inputRange: [400, 500],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (

            <View style={{flex: 1}}>

                {showAnimated && <Animated.View style={[styles.container, {opacity: opacity}]}>
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
                    </View>
                </Animated.View>}
                <DynamicTabNavigator/>
                <PromotionToast ref={ref => this.promotionToast = ref}/>

                {Platform.OS === 'android' && !appSetting.agreePrivacy && <PrivacyToast
                    click={() => {
                        this.PrivacyToast.hide();
                        NavigationUtils.goPage({type: 3, onBackPress: this.onBackPress}, 'UserProtocol');
                    }}
                    sureClick={() => {
                        this.PrivacyToast.hide();
                        onIsAgreePrivacy(true);
                        this.hideSelf();
                    }}
                    cancelClick={() => {
                        this.PrivacyToast.hide(() => {
                            this.PrivacyToastStep2.show();
                        });
                    }}
                    ref={ref => this.PrivacyToast = ref}/>}
                {Platform.OS === 'android' && !appSetting.agreePrivacy && <PrivacyToastStep2

                    sureClick={() => {
                        this.PrivacyToastStep2.hide(() => {
                            this.PrivacyToast.show();
                        });
                    }}

                    ref={ref => this.PrivacyToastStep2 = ref}/>}
            </View>

        );
    }

    onBackPress = () => {


        setTimeout(()=>{
            StatusBar.setHidden(true);
            StatusBar.setTranslucent(true);
            StatusBar.setBarStyle('light-content', false);
            StatusBar.setBackgroundColor(bottomTheme, false);
            this.PrivacyToast.show();
        },100)
    };
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
const mapStateToProps = state => ({
    appSetting: state.appSetting,
});
const mapDispatchToProps = dispatch => ({
    onIsAgreePrivacy: (bool) => dispatch(actions.onIsAgreePrivacy(bool)),
});
const HomePageRedux = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export default HomePageRedux;
