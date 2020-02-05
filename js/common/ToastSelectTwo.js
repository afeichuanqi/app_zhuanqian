/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Text, TouchableOpacity, ScrollView} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import cha from '../res/svg/cha.svg';
import {bottomTheme} from '../appSet';

const {width, height} = Dimensions.get('window');
import Animated, {Easing} from 'react-native-reanimated';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const {SpringUtils, spring} = Animated;

class ToastSelectTwo extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        width: 200,
        height: 500,
        rightTitle: '添加',
        titleComponent: null,
        title: '温馨提示',
        sureTitle: '确定',
        cancelTitle: '取消',
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
        this._anim = spring(this.animations.translateY, SpringUtils.makeConfigFromBouncinessAndSpeed({
            ...SpringUtils.makeDefaultConfig(),
            bounciness: 0,
            speed: 20,
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
            this._anim = spring(this.animations.translateY, SpringUtils.makeConfigFromBouncinessAndSpeed({
                ...SpringUtils.makeDefaultConfig(),
                bounciness: 15,
                speed: 20,
                toValue: -150,
            })).start();

        });
    };
    animations = {
        translateY: new Animated.Value(0),
    };

    render() {
        const {visible} = this.state;
        const {menuArr, rightTitle} = this.props;
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
                        width, position: 'absolute', bottom: -200, backgroundColor: 'white',
                        borderTopLeftRadius: 5, borderTopRightRadius: 5,
                        transform: [{translateY: this.animations.translateY}],
                    }}>
                        <TouchableOpacity
                            onPress={this._sure}
                            style={{
                                width, alignItems: 'center', height: 50, justifyContent: 'center',
                                borderBottomWidth: 1, borderBottomColor: '#e8e8e8',

                            }}>
                            <Text
                                style={{color: 'black', opacity: 0.7, fontSize: wp(3.8)}}>{this.props.sureTitle}</Text>
                        </TouchableOpacity>

                        <View style={{
                            height: 10, backgroundColor: '#e8e8e8',
                        }}/>
                        <TouchableOpacity
                            onPress={this._cancel}
                            style={{
                                width, alignItems: 'center', height: 50, justifyContent: 'center',

                            }}>
                            <Text>{this.props.cancelTitle}</Text>
                        </TouchableOpacity>
                        <View style={{height: 50, width, backgroundColor: 'white'}}>

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


export default ToastSelectTwo;
