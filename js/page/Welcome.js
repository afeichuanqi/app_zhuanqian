/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {

    Animated,
    Dimensions, StyleSheet,
} from 'react-native';
import NavigationUtils from '../navigator/NavigationUtils';
import RNBootSplash from 'react-native-bootsplash';

let bootSplashLogo = require('../../assets/bootsplash_logo.png');

class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }

    opacity = new Animated.Value(1);
    translateY = new Animated.Value(0);
    opacity1 = new Animated.Value(1);

    componentDidMount() {

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
        ]).start(() => {

        });
        this.timer = setTimeout(() => {
            NavigationUtils.navigation = this.props.navigation;
            NavigationUtils.toHomePage();
        }, 300);
    };

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {

        return (
            <Animated.View style={[styles.container, {opacity: this.opacity1}]}>
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        styles.bootsplash,
                        {opacity: this.opacity},
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
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
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
// const mapStateToProps = state => ({
//     userinfo: state.userinfo,
// });
// const mapDispatchToProps = dispatch => ({
// });
// const WelcomeRedux = connect(mapStateToProps, mapDispatchToProps)(Welcome);
export default Welcome;
