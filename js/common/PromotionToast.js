/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, Image,View, Dimensions, Text, TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';

const {width, height} = Dimensions.get('window');
const {spring, SpringUtils} = Animated;

class PromotionToast extends PureComponent {
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

    hide = () => {

        this._anim = spring(this.animations.scale, SpringUtils.makeConfigFromBouncinessAndSpeed({
            ...SpringUtils.makeDefaultConfig(),
            bounciness: 0,
            speed: 15,
            toValue: 0,
        })).start(() => {

        });
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, 300);


    };
    show = () => {
        this.setState({
            visible: true,
        }, () => {
            this._anim = spring(this.animations.scale, SpringUtils.makeConfigFromBouncinessAndSpeed({
                ...SpringUtils.makeDefaultConfig(),
                bounciness: 10,
                speed: 8,
                toValue: 1,
            })).start();

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
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={{
                        transform: [{scale: this.animations.scale}], opacity: this.animations.scale,


                    }}>
                        <Image

                            source={require('../res/img/toastImg/yaoqinghaoyouImg.png')}
                            style={{
                                width: width,
                                height: height / 1.5,

                            }}
                        />
                        <View style={{marginTop: 20,width, alignItems:'center'}}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    this.hide();
                                    NavigationUtils.goPage({}, 'FriendPromotionPage');
                                }}
                                style={{ }}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../res/img/toastImg/yaoqinghaoyouBtn.png')}
                                    style={{
                                        width: width / 2,
                                        height: 70,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                this.hide();
                            }}
                            style={{
                                width: 30, height: 30,
                                borderRadius: 15, borderWidth: 2,
                                borderColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center',
                                position: 'absolute', right: 20, top: 80,
                            }}>
                            <Text style={{fontSize: 20, color: 'rgba(255,255,255,0.7)'}}>X</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

}


export default PromotionToast;
