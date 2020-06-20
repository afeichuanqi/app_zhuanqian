/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, Image, View, Dimensions, Text, TouchableOpacity, StyleSheet, Clipboard, Linking} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import Toast from "react-native-root-toast";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

const {width, height} = Dimensions.get('window');
const {spring, SpringUtils} = Animated;

class PromotionToast extends PureComponent {
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
            speed: 15,
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
                bounciness: 4,
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
        return (

            <Modal
                transparent
                visible={visible}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}
            >
                <TouchableOpacity style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={{
                        transform: [{scale: this.animations.scale}],
                        opacity: this.animations.scale,
                        flex:1,
                        justifyContent:'center',
                        alignItems:'center',

                    }}>
                        <View style={{
                            width: width -40,
                            backgroundColor:'white',
                            height: height/2.8,
                            borderRadius:10,
                        }}>
                            <Image
                                resizeMode={'contain'}
                                source={require('../res/img/toastImg/joinQQ.png')}
                                style={{
                                    width: 80,
                                    height: 80,
                                    position:'absolute',
                                    top:-40,
                                    left:(width -40)/2 - 40

                                }}
                            />
                            <View style={{
                                flex:1,
                                flexDirection:'row',
                                justifyContent:'space-around',
                                marginTop:55,
                                paddingHorizontal:20,
                            }}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../res/img/toastImg/qqColumnImg.png')}
                                        style={{
                                            width: 100,
                                            height: 100,
                                        }}
                                    />
                                    <View style={{
                                        height: 100,
                                        width:width -100 - 100,
                                        justifyContent:'center',
                                    }}>
                                        <Text style={{
                                            color:'rgba(0,0,0,1)',
                                            fontSize:17,
                                            fontWeight:'bold',
                                        }}>邀请您加入体验群</Text>
                                        <Text style={{
                                            marginTop:10,
                                            color:'rgba(0,0,0,0.7)',
                                            fontSize:15,
                                        }}>简易赚邀请您加入体验群，为您自动复制QQ群号</Text>
                                    </View>

                            </View>
                            <View style={{ width: width -40, flexDirection:'row', position:'absolute', bottom:0}}>
                                <TouchableOpacity
                                    onPress={this.hide}
                                    style={styles.cancelBtnStyle}>
                                    <Text style={{
                                        color:'rgba(0,0,0,0.7)',
                                        fontSize:17,
                                    }}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        Clipboard.setString('1090251007');
                                        Toast.show('已经复制到剪切板', {
                                            position:-20
                                        });
                                        setTimeout(() => {
                                            Linking.openURL('https://jq.qq.com/?_wv=1027&k=kZrrwhm0');
                                            this.hide();
                                        }, 1000)
                                    }}

                                    style={styles.okBtnStyle}>
                                    <Text style={{
                                        color:'#2196F3',
                                        fontSize:17,
                                    }}>点击加入</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    cancelBtnStyle: {
        width:(width -40) / 2,
        justifyContent:'center',
        alignItems:'center',
        height:60,
        borderTopWidth:0.3,
        borderTopColor:'rgba(0,0,0,0.3)',
    },
    okBtnStyle : {
        width:(width -40) / 2,
        justifyContent:'center',
        alignItems:'center',
        height:60,
        borderTopWidth:0.3,
        borderLeftWidth:0.3,
        borderTopColor:'rgba(0,0,0,0.3)',
        borderLeftColor:'rgba(0,0,0,0.3)',
    }

})
export default PromotionToast;
