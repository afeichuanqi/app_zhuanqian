/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, Image, Dimensions, Text,  TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';

const {width, height} = Dimensions.get('window');
const {timing} = Animated;

class MyModalBox extends PureComponent {
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
        this._anim = timing(this.animations.scale, {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            this.setState({
                visible: false,
            });

        });

    };
    show = () => {
        this.setState({
            visible: true,
        }, () => {
            this._anim = timing(this.animations.scale, {
                duration: 200,
                toValue: 1,
                easing: Easing.inOut(Easing.ease),
            }).start();

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
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={[this.props.style, {
                        transform: [{scale: this.animations.scale}],
                    }]}>
                        <Image

                            source={require('../res/img/toastImg/yaoqinghaoyouImg.png')}
                            style={{
                                width: width,
                                height: height / 1.5,
                            }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                this.hide();
                                NavigationUtils.goPage({}, 'FriendPromotionPage');
                            }}
                            style={{marginTop: 20, alignItems: 'center'}}>
                            <Image
                                resizeMode={'contain'}
                                source={require('../res/img/toastImg/yaoqinghaoyouBtn.png')}
                                style={{
                                    width: width / 2,
                                    height: 70,
                                }}
                            />
                        </TouchableOpacity>
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


export default MyModalBox;
