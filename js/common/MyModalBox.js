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
import cha from '../res/svg/cha.svg';

const {timing} = Animated;
const {width, height} = Dimensions.get('window');

class MyModalBox extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        width: 200,
        height: 500,
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
        this._anim = timing(this.animations.scale, {
            duration: 200,
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
            this._anim = timing(this.animations.scale, {
                duration: 200,
                toValue: 1,
                easing: Easing.inOut(Easing.cubic),
            }).start();

        });
    };
    animations = {
        scale: new Animated.Value(0),
    };

    render() {
        const {visible} = this.state;
        const {menuArr} = this.props;

        return (

            <Modal
                transparent
                visible={true}
                animationType={'none'}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center',
                    alignItems: 'center',
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide(null);
                                  }}
                >
                    <Animated.View style={[this.props.style, {
                        transform: [{scale: 1}],
                    }]}>
                        <View style={{
                            paddingVertical: 10,
                            width: width - 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 15,
                        }}>
                            <Text style={{fontSize: 16}}>{this.props.title}</Text>
                            <TouchableOpacity
                                onPress={this.hide}>
                                <SvgUri width={15}   height={15} svgXmlData={cha}/>
                            </TouchableOpacity>
                        </View>
                        {this.props.children}
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View style={{width:(width - 40)/2, justifyContent:'center', alignItems:'center',height:50}}>
                                <Text style={{color:'rgba(0,0,0,0.8)'}}>取消</Text>
                            </View>
                            <View style={{
                                height:20,
                                width:1.5,
                                backgroundColor:'rgba(0,0,0,0.5)',
                                marginTop:15
                            }}/>
                            <View style={{width:(width - 40)/2, justifyContent:'center', alignItems:'center',height:50}}>
                                <Text style={{color:'red'}}>添加</Text>
                            </View>
                        </View>
                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }


}


export default MyModalBox;
