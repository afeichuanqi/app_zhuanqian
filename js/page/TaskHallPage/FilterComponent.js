import React, {PureComponent, Component} from 'react';

import Animated, {Easing} from 'react-native-reanimated';
import {Dimensions, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {bottomTheme} from '../../appSet';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const {width, height} = Dimensions.get('window');
const {timing} = Animated;
export default class FilterComponent extends PureComponent {
    static defaultProps = {
        typeArray: [
            {id: 1, title: '注册', type: 1},
            {id: 2, title: '投票', type: 1},
            {id: 3, title: '关注', type: 1},
            {id: 4, title: '浏览', type: 1},
            {id: 5, title: '下载', type: 1},
            {id: 6, title: '转发', type: 1},
            {id: 7, title: '发帖', type: 1},
            {id: 8, title: '回帖', type: 1},
            {id: 9, title: '高价', type: 2},
            {id: 10, title: '电商', type: 2},
            {id: 11, title: '实名', type: 2},
            {id: 12, title: '特单', type: 2},
            {id: 13, title: '砍价', type: 2},
            {id: 14, title: '其它', type: 2},

        ],
    };
    typeMap = new Map();
    _typeClick = (index, data, checked) => {
        this.typeMap.set(data.id, checked);
    };
    // hide
    animations = {
        translateY: new Animated.Value(0),
    };
    show = () => {
        //折罩层显示
        this.containerBox.setNativeProps({
            style: {
                height,
            },
        });
        //隐藏box
        this._anim = timing(this.animations.translateY, {
            duration: 300,
            toValue: 1,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };
    hide = () => {
        //隐藏box
        this._anim = timing(this.animations.translateY, {
            duration: 300,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            //折罩层隐藏
            this.containerBox.setNativeProps({
                style: {
                    height: 0,
                },
            });
        });
    };

    render() {
        const translateY = Animated.interpolate(this.animations.translateY, {
            inputRange: [0, 1],
            outputRange: [-260, 40],
            extrapolate: 'clamp',
        });
        const opacity = Animated.interpolate(this.animations.translateY, {
            inputRange: [0, 1],
            outputRange: [0, 0.6],
            extrapolate: 'clamp',
        });
        const {typeArray} = this.props;
        return <View ref={ref => this.containerBox = ref} style={{
            position: 'absolute',
            top: 40,
            height: 0,
            width,
            zIndex: 1,
            elevation: 0.1,
        }}>
            {/*/!*遮罩层*!/*/}

            <AnimatedTouchableOpacity
                activeOpacity={0.6}
                onPress={this._cancelClick}
                style={{
                    flex: 1, backgroundColor: '#b4b4b4',
                    opacity: opacity,

                }}/>
            {/*box*/}
            <Animated.View style={{
                position: 'absolute', transform: [{translateY}],

            }}>
                <ScrollView style={{
                    height: 180,
                    width,
                    // top: ,
                    zIndex: 2,
                    backgroundColor: 'white',
                }}>
                    {/*栏目二*/}
                    <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 5}}>
                        <View style={{
                            height: 10, width: 3, backgroundColor: bottomTheme,

                        }}/>
                        <View style={{marginLeft: 15}}>
                            <Text style={{
                                // color: 'red',
                                opacity: 0.7,
                            }}>简单</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap', marginBottom: 20,
                    }}>

                        {typeArray.map((item, index, arr) => {
                            if (item.type == 1) {
                                return <TypeComponent ref={`typeBtn${item.id}`} key={item.id} onPress={this._typeClick}
                                                      data={item} index={index}/>;
                            }


                        })}
                    </View>
                    {/*栏目一*/}
                    <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 5}}>
                        <View style={{
                            height: 10, width: 3, backgroundColor: bottomTheme,
                        }}/>
                        <View style={{marginLeft: 15}}>
                            <Text style={{
                                // color: 'red',
                                opacity: 0.7,
                            }}>收益高</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: 20,
                    }}>

                        {typeArray.map((item, index, arr) => {
                            if (item.type == 2) {
                                return <TypeComponent ref={`typeBtn${item.id}`} key={item.id} onPress={this._typeClick}
                                                      data={item} index={index}/>;
                            }

                        })}
                    </View>

                </ScrollView>
                <View
                    style={{
                        height: 80, width, backgroundColor: 'white', zIndex: 2, flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'space-around', borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                    }}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this._ResetClick}
                        style={{
                            width: width / 2 - 60, height: 30, borderWidth: 1, borderColor: '#e8e8e8',
                            justifyContent: 'center', borderRadius: 5,
                        }}>
                        <Text style={{alignSelf: 'center', color: 'black', opacity: 0.7}}>
                            重置
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._sureClick}
                        activeOpacity={0.6}
                        style={{
                            width: width / 2, height: 30, borderWidth: 1, borderColor: '#e8e8e8',
                            justifyContent: 'center', backgroundColor: bottomTheme, borderRadius: 5,
                        }}>
                        <Text style={{alignSelf: 'center', color: 'white'}}>
                            确定
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>


        </View>;
    }

    _ResetClick = () => {
        this.typeMap.forEach((value, key, map) => {
            this.refs[`typeBtn${key}`].ResetStatus();
        });
    };
    _sureClick = () => {
        // console.log(this.typeMap);
        const tmpArr = [];
        this.typeMap.forEach(function (value, key, map) {
            if (value) {
                tmpArr.push(key);
            }
        });

        // console.log(tmpArr);
        this.props.sureClick(tmpArr);
        this.hide();
    };
    _cancelClick = () => {

        this.props.cancelClick();
        this.hide();
    };
}

class TypeComponent extends Component {
    static defaultProps = {
        index: 0,

        data: {id: 1, title: 'test'},
    };
    state = {
        checked: this.props.checked,
    };

    componentDidMount(): void {
        // EventBus.getInstance().addListener(EventTypes.search_btn_click, this.listener = data => {
        //     console.log(this.props.navigation.isFocused(), 'this.props.navigation.isFocused()');
        //     if (this.props.navigation.isFocused()) {
        //
        //         this._getHotContent();
        //     }
        // });
    }

    ResetStatus = () => {
        if (this.state.checked) {
            this.setState({
                checked: false,
            });
        }
    };

    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.checked != nextProps.checked || this.state.checked != nextState.checked) {
            return true;
        }
        return false;
    }

    _onPress = () => {
        const {index, data} = this.props;
        const {checked} = this.state;
        this.setState({
            checked: !checked,
        }, () => {
            this.props.onPress(index, data, this.state.checked);
        });

    };

    render() {
        const {data} = this.props;
        const {checked} = this.state;

        return <TouchableOpacity
            onPress={this._onPress}
            style={[{
                width: width / 4 - 20,
                height: 25,
                marginTop: 10,
                backgroundColor: '#f1f1f1',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10,
                borderRadius: 3,
                borderWidth: 0.3,
                borderColor: 'rgba(0,0,0,0.2)',
            }, !checked ? {backgroundColor: '#f6f6f6'} : {
                backgroundColor: 'rgba(33,150,243,0.1)',
                borderWidth: 0.3, borderColor: bottomTheme,
            }]}>
            <Text style={[{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                opacity: 0.8,
            }, !checked ? {
                color: 'black',
                opacity: 0.5,
            } : {color: bottomTheme}]}>{data.title}</Text>
        </TouchableOpacity>;
    }
}