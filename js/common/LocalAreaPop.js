/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, ScrollView, Text, TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import SvgUri from 'react-native-svg-uri';
import wangzhi from '../res/svg/wangzhi.svg';
import erweima from '../res/svg/erweima.svg';
import fuzhi from '../res/svg/fuzhi.svg';
import tuwen from '../res/svg/tuwen.svg';
import yanzhengtu from '../res/svg/yanzhengtu.svg';
import shouji from '../res/svg/shouji.svg';

const {timing} = Animated;
const {width, height} = Dimensions.get('window');

class LocalAreaPop extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        menuArr: [
            {id: 1, title: '6小时'},
            {id: 2, title: '12小时'},
            {id: 3, title: '1天'},
            {id: 4, title: '2天'},
            {id: 5, title: '3天'},
            {id: 6, title: '4天'},
            {id: 7, title: '5天'},
            {id: 8, title: '一星期'},
        ],
        popTitle: '接单审核时限',
    };
    state = {
        visible: false,

    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    hide = (item) => {
        // this.props.select(item);
        this._anim = timing(this.animations.top, {
            duration: 100,
            toValue: height + 160,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            this.timer = setTimeout(() => {
                this.setState({
                    visible: false,
                });
            }, 100);

        });

    };
    show = (x, y) => {
        this.setState({
            visible: true,
        }, () => {
            this._anim = timing(this.animations.left, {
                duration: 0,
                toValue: x - 75,
                easing: Easing.inOut(Easing.cubic),
            }).start(() => {
                this._anim = timing(this.animations.top, {
                    duration: 50,
                    toValue: y + 25,
                    easing: Easing.inOut(Easing.cubic),
                }).start();
            });

        });
    };
    animations = {
        top: new Animated.Value(height + 160),
        left: new Animated.Value(-75),
    };
    render() {
        const {visible} = this.state;
        const {menuArr} = this.props;

        return (

            <Modal
                transparent
                visible={visible}
                animationType={'none'}
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
                        position: 'absolute',
                        top: this.animations.top,
                        left: this.animations.left,
                        borderWidth: 0.3,
                        borderColor: 'rgba(0,0,0,0.3)',
                        paddingVertical: 5,
                        paddingHorizontal: 4,
                        backgroundColor: 'white',
                        borderRadius: 5,
                        alignItems: 'center',
                    }}>
                        <View style={{
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            borderWidth: 6,
                            borderTopColor: 'rgba(0,0,0,0)',//下箭头颜色
                            borderLeftColor: 'rgba(0,0,0,0)',//右箭头颜色
                            borderBottomColor: '#fff',//上箭头颜色
                            borderRightColor: 'rgba(0,0,0,0)',//左箭头颜色
                            position: 'absolute',
                            top: -12,
                            left: 83,
                        }}/>
                        {this.genMenu('输入网址', wangzhi)}
                        {this.genMenu('二维码', erweima)}
                        {this.genMenu('复制数据', fuzhi)}
                        {this.genMenu('图文说明', tuwen)}
                        {this.genMenu('验证图', yanzhengtu)}
                        {this.genMenu('收集信息', shouji)}


                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

    genMenu = (title, svgXmlData) => {
        return <TouchableOpacity
            activeOpacity={0.6}
            style={{
                width: 100, height: 35,
                alignItems: 'center', flexDirection: 'row',
            }}>
            <SvgUri width={20} style={{marginHorizontal: 5}} fill={'black'} height={20} svgXmlData={svgXmlData}/>
            <Text style={{fontSize: 15}}>{title}</Text>
        </TouchableOpacity>;
    };
}


export default LocalAreaPop;
