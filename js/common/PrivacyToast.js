/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {ScrollView, Modal, View, Dimensions, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {bottomTheme} from '../appSet';

const {width, height} = Dimensions.get('window');
const { timing} = Animated;

class PrivacyToast extends PureComponent {
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

    hide = (callback=null) => {
        this._anim = timing(this.animations.scale, {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {

        });
        setTimeout(() => {
            this.setState({
                visible: false,
            },callback);
        }, 300);


    };
    show = (callback=null) => {
        this.setState({
            visible: true,
        }, () => {

            this._anim = timing(this.animations.scale, {
                duration: 200,
                toValue: 1,
                easing: Easing.inOut(Easing.ease),
            }).start(callback);

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
                // onRequestClose={this.hide}

            >
                <View style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center',
                    alignItems: 'center',
                }}
                                  // activeOpacity={1}
                    // onPress={this.hide}
                >
                    <Animated.View style={{
                        opacity: this.animations.scale,
                        width: width - 40, backgroundColor: 'white',
                        borderRadius: 10, paddingVertical: 10,


                    }}>
                        <View style={{
                            paddingVertical: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{color: 'rgba(0,0,0,0.9)', fontSize: hp(2.3)}}>隐私政策</Text>
                        </View>
                        <ScrollView
                            style={{paddingHorizontal: 25,height:hp(30)}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.props.click}
                            >
                                <Text style={styles.textStyle}>
                                    简易赚app 一款网上兼职、悬赏、互助平台、在校学生、宝妈、赚客、自由职业者都可以利用空闲时间赚钱
                                    最简单、操作最方便的购物平台老人也能轻松的操作起来,在您使用简易赚的同时,我们可能会获取部分的必要信息,以提供基本服务。
                                </Text>
                                <Text style={[styles.textStyle, {marginTop: 15}]}>
                                    1.上传头像和上传图片时必须您手机的访问相册权限

                                </Text>
                                <Text style={[styles.textStyle, {marginTop: 15}]}>
                                    2.为帮助您发现更多有趣的内容,会基于您的使用习惯推荐更好的任务

                                </Text>
                                <Text style={[styles.textStyle, {marginTop: 15}]}>
                                    3.您可灵活设置您发布内容的公开访问和互动权限

                                </Text>

                                <Text style={{flexDirection: 'row', marginTop: 15, width: width - 90}}>
                                    <Text style={[styles.textStyle, {}]}>
                                        我们非常重视您的个人信息保护,关于个人信息收集和使用的详细信息,您可以点击查询
                                    </Text>
                                    <Text style={[styles.textStyle, {color: bottomTheme}]}>
                                        《隐私保护》
                                    </Text>
                                    <Text style={[styles.textStyle, {}]}>
                                        进行了解

                                    </Text>
                                </Text>
                            </TouchableOpacity>

                        </ScrollView>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            paddingTop: 20,
                        }}>
                            <TouchableOpacity
                                onPress={this.props.cancelClick}
                                style={{width: (width - 100) / 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: hp(2.3), color: 'black'}}>不同意</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.props.sureClick}
                                style={{width: (width - 100) / 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: hp(2.3), color: bottomTheme}}>同意</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                </View>
            </Modal>
        );
    }


}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: hp(2.1),
        letterSpacing: 0.5,
        color: 'rgba(0,0,0,0.8)',
        lineHeight: hp(3),
    },
});

export default PrivacyToast;
