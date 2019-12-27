/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions,  Text, TouchableOpacity} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import cha from '../res/svg/cha.svg';
const {width} = Dimensions.get('window');
import Animated from 'react-native-reanimated';
const {SpringUtils,spring} = Animated;
class ToastSelect extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        width: 200,
        height: 500,
        rightTitle: '添加',
        titleComponent:null,
        title:'温馨提示'
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
            speed: 20,
            toValue:0
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
                bounciness: 13,
                speed: 8,
                toValue:1
            })).start();

        });
    };
    animations = {
        scale: new Animated.Value(0),
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
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center',
                    alignItems: 'center', zIndex: 10
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={[this.props.style, {
                        transform: [{scale: this.animations.scale}], opacity:this.animations.scale,
                        // transform: 1,
                    }]}>

                        <View style={{
                            paddingVertical: 10,
                            width: width - 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 15,
                            backgroundColor:'white',
                            borderTopLeftRadius:5,
                            borderTopRightRadius:5,
                            paddingTop:15,

                        }}>
                            <View style={{flexDirection:'row', alignItems:'flex-end'}}>
                                <Text style={{fontSize: 16,color:'red'}}>{this.props.title}</Text>
                                {this.props.titleComponent}
                            </View>

                            <TouchableOpacity
                                onPress={this.hide}>
                                <SvgUri width={15} height={15} svgXmlData={cha}/>
                            </TouchableOpacity>
                        </View>
                        {this.props.children}
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'white',
                            borderBottomLeftRadius:4, borderBottomRightRadius:4,
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
                                <Text style={{color: 'rgba(0,0,0,0.8)'}}>取消</Text>
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
                                <Text style={{color: 'red'}}>{rightTitle}</Text>
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
