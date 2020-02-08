/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Text, ImageBackground, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import SvgUri from 'react-native-svg-uri';
import cha from '../res/svg/cha.svg';
import {bottomTheme} from '../appSet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {width} = Dimensions.get('window');
const {SpringUtils, spring} = Animated;

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
        this._anim = spring(this.animations.scale, SpringUtils.makeConfigFromBouncinessAndSpeed({
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
            this._anim = spring(this.animations.scale, SpringUtils.makeConfigFromBouncinessAndSpeed({
                ...SpringUtils.makeDefaultConfig(),
                bounciness: 13,
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
        const {rightTitle} = this.props;
        const opacity = Animated.interpolate(this.animations.scale, {
            inputRange: [0, 0.3, 1],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
        });
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
                    alignItems: 'center', zIndex: 10,borderRadius:5,
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={[this.props.style, {
                        transform: [{scale: this.animations.scale}], opacity:opacity,
                        borderRadius:5,
                    }]}>

                        <ImageBackground
                            imageStyle={{
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                            }}
                            source={require('../res/img/backgroundtoast.png')}
                            style={{
                                width: width - 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 15,
                                backgroundColor: bottomTheme,

                                paddingTop: 20,
                                paddingBottom: 15,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,

                            }}>
                            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 17, color: 'white'}}>{this.props.title}</Text>
                                {this.props.titleComponent}
                            </View>

                            <TouchableOpacity
                                onPress={this.hide}>
                                <SvgUri width={15} height={15} fill={'rgba(255,255,255,0.8)'} svgXmlData={cha}/>
                            </TouchableOpacity>
                        </ImageBackground>
                        {this.props.children}
                        <View style={{flexDirection: 'row',borderBottomRightRadius:5,}}>
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
                                <Text style={{color: 'rgba(0,0,0,0.8)',fontSize:15}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this._sure}
                            >
                                <ImageBackground
                                    imageStyle={{
                                        borderBottomRightRadius:5,
                                    }}
                                    style={{
                                        width: (width - 40) / 2, height: 50, top: 1, justifyContent: 'center',
                                        alignItems: 'center', backgroundColor: bottomTheme, borderBottomRightRadius:5,
                                    }}
                                    source={require('../res/img/buttombackground.png')}>

                                    <Text  style={{color: 'white', fontSize:15}}>{rightTitle}</Text>

                                </ImageBackground>
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


export default MyModalBox;
