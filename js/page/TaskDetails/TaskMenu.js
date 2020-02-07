/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';


const {timing} = Animated;
const {height} = Dimensions.get('window');

class TaskMenu extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        opacity: 0.3,
    };
    state = {
        visible: false,
        left: -100,

    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    hide = (annimated = true) => {
        if (annimated) {
            this._anim = timing(this.animations.opacity, {
                duration: 50,
                toValue: 0,
                easing: Easing.inOut(Easing.ease),
            }).start(() => {
                this.timer = setTimeout(() => {
                    this.setState({
                        visible: false,
                    });
                }, 50);

            });
        } else {
            this.setState({
                visible: false,
            });
        }


    };
    show = (x, y) => {
        this.animations.translateY = y + 330;
        this.animations.left = x - 80;
        this.setState({
            visible: true,
            // left: x - 75,
        }, () => {
            this._anim = timing(this.animations.opacity, {
                duration: 50,
                toValue: 1,
                easing: Easing.inOut(Easing.cubic),
            }).start();

        });

    };
    animations = {
        translateY:0,
        left: 0,
        opacity: new Animated.Value(0),
    };

    render() {
        const {visible} = this.state;

        return (

            <Modal
                transparent
                visible={visible}
                animationType={'none'}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{flex: 1, backgroundColor: `rgba(0,0,0,${this.props.opacity})`}}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide(true);
                                  }}
                >
                    <Animated.View style={{
                        position: 'absolute',
                        top: -300,
                        left: this.animations.left,
                        borderWidth: 0.3,
                        borderColor: 'rgba(0,0,0,0.3)',
                        paddingVertical: 5,
                        paddingHorizontal: 4,
                        backgroundColor: 'white',
                        borderRadius: 5,
                        alignItems: 'center',
                        transform: [{translateY: this.animations.translateY}],
                        opacity:this.animations.opacity,
                        //
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
                        {/*<KeyboardAwareScrollView>*/}
                        {this.props.children}
                        {/*</KeyboardAwareScrollView>*/}


                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

}


export default TaskMenu;
