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


const {timing} = Animated;
const { height} = Dimensions.get('window');

class TaskMenu extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        menuArr: [],
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

    hide = (annimated = true) => {
        // this.props.select(item);
        if (annimated) {
            this._anim = timing(this.animations.top, {
                duration: 200,
                toValue: height + 160,
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
        this.animations.left = new Animated.Value(x - 75);
        this.setState({
            visible: true,
        }, () => {
            this._anim = timing(this.animations.top, {
                duration: 100,
                toValue: y + 25,
                easing: Easing.inOut(Easing.cubic),
            }).start();

        });

    };
    animations = {
        top: new Animated.Value(height+250),
        left: new Animated.Value(0),
    };

    render() {
        const {visible} = this.state;

        return (

            <Modal
                transparent
                visible={visible}
                animationType={'fade'}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide(true);
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
                        {this.props.menuArr.length > 0 && this.props.menuArr.map((item, index, arr) => {
                            return this.genMenu(item.title, item.svg, item.click,index);
                        })}


                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

    genMenu = (title, svgXmlData, click,index) => {
        return <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            onPress={() => {
                this.hide(false);
                click();
            }
            }
            style={{
                width: 100, height: 35,
                alignItems: 'center', flexDirection: 'row',
            }}>
            <SvgUri width={20} style={{marginHorizontal: 5}} fill={'black'} height={20} svgXmlData={svgXmlData}/>
            <Text style={{fontSize: 15}}>{title}</Text>
        </TouchableOpacity>;
    };
}


export default TaskMenu;
