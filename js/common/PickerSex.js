/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Text, TouchableOpacity,Image} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import SvgUri from 'react-native-svg-uri';

import sex_nv_ from '../res/svg/sex_nv_.svg';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
            duration: 100,
            toValue: 0,
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
                toValue: -(200 + (width / 3)),
                easing: Easing.inOut(Easing.ease),
            }).start();
        });
    };
    animations = {
        bottom: new Animated.Value(0),
    };

    render() {
        const {visible} = this.state;
        const opacity = Animated.interpolate(this.animations.bottom, {
            inputRange: [-(200 + (width / 3)), -100, 0],
            outputRange: [1, 0.3, 0],
            extrapolate: 'clamp',
        });
        return (

            <Modal
                transparent
                visible={visible}
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
                        width, position: 'absolute', bottom: -(200 + (width / 3)), backgroundColor: 'white',
                        borderTopLeftRadius: 5, borderTopRightRadius: 5,transform: [{translateY:this.animations.bottom}],opacity
                    }}>
                        <View style={{
                            width, alignItems: 'center', height: hp(7), justifyContent: 'center',
                            borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
                        }}>
                            <Text style={{color: 'black', opacity: 0.9, fontSize: hp(2.1)}}>{this.props.popTitle}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.select(0);
                                }}
                                style={{width: width / 2, height: hp(35), justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../res/img/sex_nan.png')} style={{width:wp(20),height:wp(20)}}/>
                                <SvgUri style={{marginTop: 10}} width={15} height={15} svgXmlData={sex_nan_}/>

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.select(1);
                                }}
                                style={{width: width / 2, height: 200, justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../res/img/sex_nv.png')} style={{width:wp(20),height:wp(20)}}/>
                                <SvgUri style={{marginTop: 10}} width={15} height={15} svgXmlData={sex_nv_}/>

                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    }

}


export default PopMenu;
