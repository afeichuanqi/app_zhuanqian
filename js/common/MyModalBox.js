/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Text, ImageBackground, TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import SvgUri from 'react-native-svg-uri';
import cha from '../res/svg/cha.svg';
import {bottomTheme} from '../appSet';

const {width} = Dimensions.get('window');
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
        const {rightTitle} = this.props;
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
                    alignItems: 'center', zIndex: 10,
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={[this.props.style, {
                        transform: [{scale: this.animations.scale}],
                    }]}>

                        <ImageBackground
                            source={require('../res/img/backgroundtoast.png')}
                            style={{
                                paddingVertical: 10,
                                width: width - 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 15,
                                backgroundColor: bottomTheme,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                paddingTop: 20,
                                paddingBottom: 15,

                            }}>
                            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 16, color: 'white'}}>{this.props.title}</Text>
                                {this.props.titleComponent}
                            </View>

                            <TouchableOpacity
                                onPress={this.hide}>
                                <SvgUri width={15} height={15} fill={'rgba(255,255,255,0.8)'} svgXmlData={cha}/>
                            </TouchableOpacity>
                        </ImageBackground>
                        {this.props.children}
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this._cancel}
                                style={{
                                    width: (width - 40) / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 50,
                                    top: 1,
                                    // backgroundColor:'red',
                                }}>
                                <Text style={{color: 'rgba(0,0,0,0.8)'}}>取消</Text>
                            </TouchableOpacity>
                            <ImageBackground
                                style={{width: (width - 40) / 2,height: 50,top: 1,justifyContent: 'center',
                                    alignItems: 'center', backgroundColor: bottomTheme,}}
                                source={require('../res/img/buttombackground.png')}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={this._sure}
                                    >
                                    <Text style={{color: 'white'}}>{rightTitle}</Text>
                                </TouchableOpacity>
                            </ImageBackground>
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
        // console.log('确认被单机');
        // this.hide();
        this.props.sureClick();
    };
}


export default MyModalBox;
