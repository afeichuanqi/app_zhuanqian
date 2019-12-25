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

    componentDidMount() {
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
            });
            this.promotionToast.show()
        });
    };

    render() {
        const {showAnimated} = this.state;

        return (
            <View style={{flex: 1}}>
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
