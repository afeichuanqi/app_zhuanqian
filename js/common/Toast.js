/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Text, TouchableOpacity,Dimensions} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import toast_success from '../res/svg/toast_success.svg';
import toast_error from '../res/svg/toast_error.svg';
import {bottomTheme} from '../appSet';
const {width} = Dimensions.get('window');
class MyModalBox extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        title: 200,
        type: 1,
    };
    state = {
        visible: false,
        type:1,
        title:'',

    };

    componentDidMount() {


    }bottomTheme

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    // hide = () => {
    //     this._anim = timing(this.animations.scale, {
    //         duration: 200,
    //         toValue: 0,
    //         easing: Easing.inOut(Easing.ease),
    //     }).start(() => {
    //         this.timer = setTimeout(() => {
    //             this.setState({
    //                 visible: false,
    //             });
    //         }, 100);
    //
    //     });
    //
    // };
    // show = () => {
    //     this.setState({
    //         visible: true,
    //     }, () => {
    //         this._anim = timing(this.animations.scale, {
    //             duration: 200,
    //             toValue: 1,
    //             easing: Easing.inOut(Easing.cubic),
    //         }).start();
    //
    //     });
    // };
    // animations = {
    //     scale: new Animated.Value(0),
    // };
    show=()=>{
        this.setState({
            visible:true
        })
    }
    hide =()=>{
        this.setState({
            visible:false
        })
    }
    render() {
        const {visible} = this.state;
        const {title, type} = this.props;
        return (

            <Modal
                transparent
                visible={visible}
                animationType={'fade'}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center',
                    alignItems: 'center', zIndex: 10,
                }}
                                  activeOpacity={1}
                                  onPress={this.hide}
                >
                    <View style={{
                        alignItems: 'center',
                        width: width / 3 * 2.5,
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        paddingTop: 20,
                        borderRadius: 5,
                    }}>
                        <View style={{height: 30}}>
                            <Text style={{fontSize: 17, fontWeight: 'bold'}}>{title}</Text>
                        </View>
                        <SvgUri  style={{marginTop: 13, marginBottom: 25}} width={95} height={95} fill={type == 1 ? bottomTheme : 'red'}
                                svgXmlData={type == 1 ? toast_success : toast_error}/>

                        <View style={{width: width / 3 * 2.5, height: 0.5, backgroundColor: 'rgba(0,0,0,0.5)'}}/>

                        <TouchableOpacity
                            onPress={this.hide}
                            style={{paddingVertical: 15, backgroundColor: 'rgba(255,255,255,0.7)'}}>
                            <Text
                                style={{
                                    color: '#4cb1ff',
                                    fontSize: 19,
                                    fontWeight: 'bold',
                                }}>知道了!</Text></TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    _cancel = () => {
        this.hide();
        this.props.cancel && this.props.cancel();
    };

    _sure = () => {
        console.log('确认被单机');
        // this.hide();
        this.props.sureClick();
    };
}


export default MyModalBox;
