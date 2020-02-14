/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Text, TouchableOpacity} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import cha from '../res/svg/cha.svg';
import {bottomTheme} from '../appSet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {width} = Dimensions.get('window');
import Animated, {Easing} from 'react-native-reanimated';

const {SpringUtils, spring,timing} = Animated;

class ToastSelect extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        width: 200,
        height: 500,
        rightTitle: '添加',
        titleComponent: null,
        title: '温馨提示',
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
            toValue: 200,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {


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
            this._anim = timing(this.animations.bottom, {
                duration: 200,
                toValue: 0,
                easing: Easing.inOut(Easing.ease),
            }).start();

        });
    };
    animations = {
        bottom: new Animated.Value(200),
    };

    render() {
        const {visible} = this.state;
        const {menuArr, rightTitle} = this.props;
        return (

            <Modal
                transparent
                visible={visible}
                // animationType={'fade'}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center',
                    alignItems: 'center', zIndex: 10,

                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={[this.props.style, {
                        opacity: this.animations.scale,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        justifyContent:'center',
                        alignItems:'center',
                        position:'absolute',
                        bottom:20,
                        transform: [{translateY: this.animations.bottom}],
                    }]}>

                        <View style={{
                            paddingVertical: 10,
                            width: width - 40,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingHorizontal: 15,
                            paddingTop: 15,

                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontSize: hp(2.35), color: 'black' , fontWeight:'500'}}>{this.props.title}</Text>
                                {this.props.titleComponent}
                            </View>

                        </View>
                        {this.props.children}
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white',
                            borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this._cancel}
                                style={{
                                    width: (width - 40) / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 50,
                                }}>
                                <Text style={{color: 'rgba(0,0,0,0.9)', fontSize:hp(2.2)}}>取消</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this._sure}
                                style={{
                                    width: (width - 40) / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 50,
                                }}>
                                <Text style={{color: '#2196F3', fontSize:hp(2.2)}}>{rightTitle}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

    _cancel = () => {
        this.hide();
        this.props.cancel && this.props.cancel();
    };

    _sure = () => {
        this.props.sureClick();
    };
}


export default ToastSelect;
