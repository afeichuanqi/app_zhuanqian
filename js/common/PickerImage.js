/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal,View, Dimensions, Text, TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';

const {timing} = Animated;
const {width, height} = Dimensions.get('window');

class PopMenu extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        select: () => {
        },
        popTitle: '选取照片',
        includeBase64: false,
        cropping: false,
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
        this._anim = timing(this.animations.bottom, {
            duration: 200,
            toValue: -(200 + (width / 3)),
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            this.timer = setTimeout(() => {
                this.setState({
                    visible: false,
                });
            }, 100);

        });

    };
    show = () => {
        this.setState({
            visible: true,
        }, () => {
            this._anim = timing(this.animations.bottom, {
                duration: 100,
                toValue: 0,
                easing: Easing.inOut(Easing.cubic),
            }).start();
        });
    };
    animations = {
        bottom: new Animated.Value(-(200 + (width / 3))),
    };
    _selTakePhone = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: this.props.cropping,
            includeBase64: this.props.includeBase64,
        }).then(image => {
            this.hide();
            this.props.select(image);
        });

    };
    _selAlbum = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: this.props.cropping,
            includeBase64: this.props.includeBase64,
        }).then(image => {
            this.hide();
            this.props.select(image);
            // console.log(image);

        });
    };

    render() {
        const {visible} = this.state;

        return (

            <Modal
                transparent
                visible={visible}
                animationType={'fade'}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide(null);
                                  }}
                >
                    <Animated.View style={{
                        width, position: 'absolute', bottom: this.animations.bottom, backgroundColor: 'white',
                        borderTopLeftRadius: 10, borderTopRightRadius: 10,
                    }}>
                        <View style={{
                            width, alignItems: 'center', height: 50, justifyContent: 'center',
                            borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
                        }}>
                            <Text style={{color: 'black', opacity: 0.7, fontSize: 12}}>{this.props.popTitle}</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this._selTakePhone}
                            style={{
                                width, alignItems: 'center', paddingVertical: 15,
                                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',
                            }}>
                            <Text>{'拍一张照片'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this._selAlbum}
                            style={{
                                width, alignItems: 'center', paddingVertical: 15,
                                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',
                            }}>
                            <Text>{'从相册选一张'}</Text>
                        </TouchableOpacity>
                        <View style={{
                            height: 10, backgroundColor: '#e8e8e8',
                        }}/>
                        <TouchableOpacity
                            onPress={() => {
                                this.hide(null);
                            }}
                            style={{
                                width, alignItems: 'center', height: 50, justifyContent: 'center',

                            }}>
                            <Text>取消</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    }

}


export default PopMenu;
