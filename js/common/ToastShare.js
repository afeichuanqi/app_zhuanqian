/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Animated, Text, TouchableOpacity,ScrollView} from 'react-native';
import Image from 'react-native-fast-image';


const {width, height} = Dimensions.get('window');

class ToastShare extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {};
    state = {
        visible: false,
    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    hide = () => {
        this._anim = Animated.timing(this.animations.translateY, {
            duration: 200,
            toValue: 150,
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
            this._anim = Animated.timing(this.animations.translateY, {
                duration: 200,
                toValue: 1,
            }).start();

        });
    };
    animations = {
        translateY: new Animated.Value(150),
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
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center',
                    alignItems: 'center', zIndex: 10,
                }}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={[this.props.style, {
                        transform: [{translateY: this.animations.translateY}],
                        position: 'absolute', bottom: 0,
                    }]}>
                        <View style={{height: 90, width: width, backgroundColor: 'white'}}>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 12,
                                color: 'black',
                                opacity: 0.8,
                                marginVertical: 5,
                            }}>分享至</Text>
                            <ScrollView
                                horizontal={true}
                                style={{ paddingHorizontal: 20, marginTop: 5}}>

                                {this.getMenu('QQ', require('../res/img/share/qq.png'), null)}
                                {this.getMenu('QQ空间', require('../res/img/share/qqZone.png'), null)}
                                {this.getMenu('微信', require('../res/img/share/wechat.png'), null)}
                                {this.getMenu('朋友圈', require('../res/img/share/pengyouquan.png'), null)}
                                {this.getMenu('微博', require('../res/img/share/xinlangweibo.png'), null)}
                                {this.getMenu('复制链接', require('../res/img/share/copyurl.png'), null)}


                            </ScrollView>

                        </View>

                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

    getMenu = (title, source, click) => {
        return <TouchableOpacity
            onPress={() => {
                this.hide();
                click && click();
            }}
            style={{alignItems: 'center', marginRight: 15}}>
            <Image
                style={{height: 25, width: 25, marginHorizontal: 8}}
                source={source}
                resizeMode={Image.resizeMode.stretch}
            />
            <Text style={{
                fontSize: 12,
                color: 'black',
                opacity: 0.8,
                marginTop: 5,
                // marginVertical: 5,
            }}>{title}</Text>
        </TouchableOpacity>;
    };

}


export default ToastShare;
