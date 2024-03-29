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
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {timing} = Animated;
const {width, height} = Dimensions.get('window');

class PopButtomMenu extends PureComponent {
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
        // console.log(item);
        if (item) {
            this.props.select(item);
        }

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
                toValue: -400,
                easing: Easing.inOut(Easing.ease),
            }).start();
        });
    };
    animations = {
        bottom: new Animated.Value(0),
    };

    render() {
        const {visible} = this.state;
        const {menuArr} = this.props;
        const opacity = Animated.interpolate(this.animations.bottom, {
            inputRange: [-400, -100, 0],
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
                        width, position: 'absolute', bottom: -400, backgroundColor: 'white',
                        borderTopLeftRadius: 5, borderTopRightRadius: 5,
                        transform: [{translateY: this.animations.bottom}], opacity,
                    }}>
                        <View style={{
                            width, alignItems: 'center', height: 50, justifyContent: 'center',
                            borderBottomWidth: 1, borderBottomColor: '#e8e8e8',

                        }}>
                            <Text style={{
                                color: 'black', opacity: 0.8, fontSize: hp(2.1),

                            }}>{this.props.popTitle}</Text>
                        </View>
                        <ScrollView style={{height: height / 3}}>
                            {menuArr.map((item, index, arr) => {
                                return this.genMenu(item, index);
                            })}
                        </ScrollView>
                        <View style={{
                            height: 10, backgroundColor: '#e8e8e8',
                        }}/>
                        <TouchableOpacity
                            onPress={() => {
                                this.hide(null);
                            }}
                            style={{
                                width, alignItems: 'center', height: 50, justifyContent: 'center',

                            }}>
                            <Text>取消</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    }

    genMenu = (item) => {
        return <TouchableOpacity
            key={item.id || index}
            activeOpacity={0.6}
            onPress={() => {
                this.hide(item);
            }}
            style={{
                width, alignItems: 'center', paddingVertical: 14,
                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',

            }}>
            <Text style={{fontSize: hp(1.9), color: 'rgba(0,0,0,0.9)'}}>{item.title}</Text>
        </TouchableOpacity>;
    };
}


export default PopButtomMenu;
