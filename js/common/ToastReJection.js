/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Animated, Text, TouchableOpacity, ScrollView} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import cha from '../res/svg/cha.svg';
import Image from 'react-native-fast-image';
import ImageViewerModal from './ImageViewerModal';
import {theme, bottomTheme} from '../appSet';
const {width, height} = Dimensions.get('window');

class MyModalBox extends PureComponent {
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
        rejection: {},
    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    hide = () => {
        this._anim = Animated.timing(this.animations.translateY, {
            duration: 200,
            toValue: -height,
            // easing: Easing.inOut(Easing.ease),
        }).start(() => {
            this.setState({
                visible: false,
            });

        });

    };
    show = (rejection) => {
        this.setState({
            visible: true,
            rejection: rejection,
        }, () => {
            this._anim = Animated.timing(this.animations.translateY, {
                // useNativeDriver: true,
                duration: 200,
                toValue: 1,
                // easing: Easing.inOut(Easing.cubic),
            }).start();

        });
    };
    animations = {
        translateY: new Animated.Value(-height),
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
                        transform: [{translateY: this.animations.translateY}],
                        // transform: [{translateY: this.animations.translateY}],
                        // transform: 1,
                    }]}>

                        <View style={{
                            paddingVertical: 10,
                            width: width - 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 15,
                            backgroundColor: bottomTheme,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            height:50, alignItems:'center',

                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 15, color: 'white'}}>{this.props.title}</Text>
                                {this.props.titleComponent}
                            </View>

                            <TouchableOpacity
                                onPress={this.hide}>
                                <SvgUri width={15} height={15} fill={'rgba(255,255,255,0.7)'} svgXmlData={cha}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 30}}>
                            <Text style={{width: width - 70, opacity:0.8,fontSize:15}}>{this.state.rejection.turnDownInfo}</Text>
                            {this.state.rejection.image && this.state.rejection.image.length > 0 &&
                            <View style={{flexDirection: 'row', marginTop: 30}}>
                                {this.state.rejection.image.map((item, index, arr) => {
                                    return <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            this.imgModal.show({url: item});
                                        }}
                                    >
                                        <Image
                                            source={{uri: item}}
                                            style={{
                                                width: 55, height: 55,
                                                borderRadius: 0,
                                                marginRight: 10,
                                                backgroundColor:'#e8e8e8',
                                            }}
                                        />
                                    </TouchableOpacity>;
                                })}
                            </View>}


                        </View>
                        <ImageViewerModal ref={ref => this.imgModal = ref}/>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white',
                            borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopWidth:0.3, borderTopColor:'#e1e1e1',
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
                                <Text style={{color: 'rgba(0,0,0,0.7)'}}>取消</Text>
                            </TouchableOpacity>
                            <View style={{height:50,width:0.5, backgroundColor:'#e8e8e8'}}/>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this._sure}
                                style={{
                                    width: (width - 40) / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 50,
                                    // backgroundColor:'white',
                                }}>
                                <Text style={{color: bottomTheme}}>{rightTitle}</Text>
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
