/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {ScrollView, Modal, View, Dimensions, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {bottomTheme} from '../appSet';

const {width, height} = Dimensions.get('window');
const { timing} = Animated;

class PrivacyToast extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        width: 200,
        height: 500,
        rightTitle: '添加',
        titleComponent: null,
    };
    state = {
        visible: false,

    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    hide = (callback) => {
        this._anim = timing(this.animations.scale, {
            duration: 100,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {

        });
        setTimeout(() => {
            this.setState({
                visible: false,
            },callback);
        }, 100);


    };
    show = (callback) => {
        this.setState({
            visible: true,
        }, () => {

            this._anim = timing(this.animations.scale, {
                duration: 100,
                toValue: 1,
                easing: Easing.inOut(Easing.ease),
            }).start(callback);

        });
    };
    animations = {
        scale: new Animated.Value(0),
    };

    render() {
        const {visible} = this.state;
        return (

            <Modal
                transparent
                visible={visible}
                supportedOrientations={['portrait']}

            >
                <View style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center',
                    alignItems: 'center',
                }}
                >
                    <Animated.View style={{
                        opacity: this.animations.scale,
                        width: width - 40, backgroundColor: 'white',
                        borderRadius: 10, paddingVertical: 10,



                    }}>
                        <View
                            style={{padding: 20}}>
                            <Text style={[styles.textStyle,{paddingHorizontal: 20}]}>
                                简易赚仅会将您的信息用于提供服务和改善体验,我们将全力保障您的信息安全,请同意后使用
                            </Text>
                        </View>


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingVertical: 10,
                            paddingTop: 20,
                        }}>
                            <TouchableOpacity
                                onPress={this.props.sureClick}
                                style={{width: (width - 100) , justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: hp(2.3), color: 'black'}}>知道了</Text>
                            </TouchableOpacity>

                        </View>
                    </Animated.View>

                </View>
            </Modal>
        );
    }


}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: hp(2.2),
        letterSpacing: 0.3,
        color: 'rgba(0,0,0,0.8)',
        lineHeight: hp(3),
    },
});

export default PrivacyToast;
