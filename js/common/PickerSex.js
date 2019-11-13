/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Text, TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import SvgUri from 'react-native-svg-uri';
import sex_nan from '../res/svg/sex_nan.svg';
import sex_nv from '../res/svg/sex_nv.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import sex_nan_ from '../res/svg/sex_nan_.svg';

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
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.select(0);
                                }}
                                style={{width: width / 2, height: 200, justifyContent: 'center', alignItems: 'center'}}>
                                <SvgUri width={70} height={70} svgXmlData={sex_nan}/>
                                <SvgUri style={{marginTop: 10}} width={15} height={15} svgXmlData={sex_nan_}/>

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.select(1);
                                }}
                                style={{width: width / 2, height: 200, justifyContent: 'center', alignItems: 'center'}}>
                                <SvgUri width={70} height={70} svgXmlData={sex_nv}/>
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
