import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import NavigationUtils from '../../navigator/NavigationUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {timing} = Animated;

import FastImage from 'react-native-fast-image';
import {getCurrentTime} from '../../common/Chat-ui/app/chat/utils';
import Global from '../../common/Global';

import FastImagePro from '../../common/FastImagePro';
import {renderEmoji} from '../../util/CommonUtils';
import AnimatedFadeIn from '../../common/AnimatedFadeIn';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const width = Dimensions.get('window').width;
export default class MessageItemComponent extends Component {

    static defaultProps = {
        titleFontSize: 15,
        marginHorizontal: 20,

    };


    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    animations = {
        scale: new Animated.Value(1),
    };
    _onPressIn = () => {
        //隐藏box
        this._anim = timing(this.animations.scale, {
            duration: 100,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };
    _onPressOut = () => {
        //隐藏box
        // this._anim = timing(this.animations.scale, {
        //     duration: 500,
        //     toValue: 1,
        //     easing: Easing.inOut(Easing.ease),
        // }).start();
        this.animations.scale.setValue(1);
    };
    _onPress = () => {


        const {item} = this.props;
        const {columnType, taskId, taskTitle, avatar_url, username, userid, unReadLength, taskUri, sendFormId} = item;
        const fromUserinfo = {
            avatar_url: avatar_url,
            id: userid,
            username: username,
            taskTitle: taskTitle,

        };
        NavigationUtils.goPage({
            fromUserinfo: fromUserinfo,
            columnType,
            task_id: taskId,
            taskTitle,
            taskUri,
            sendFormId,
        }, 'ChatRoomPage');
    };

    render() {

        const scale = Animated.interpolate(this.animations.scale, {
            inputRange: [0, 1],
            outputRange: [0.95, 1],
            extrapolate: 'clamp',
        });
        const {marginHorizontal, item} = this.props;
        const {avatar_url, columnType, msg, msg_type, unReadLength, username, taskUri} = item;
        return <AnimatedFadeIn>
            <AnimatedTouchableOpacity
                onPress={this._onPress}
                activeOpacity={1}
                style={{
                    flexDirection: 'row',
                    marginHorizontal: marginHorizontal,
                    paddingVertical: 0,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#f0f0f0',
                    transform: [{scale}],
                    height: hp(12),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                onPressIn={this._onPressIn}
                onPressOut={this._onPressOut}
            >

                <View>
                    <View style={{flexDirection: 'row'}}>
                        <View>
                            <FastImagePro
                                loadingType={1}
                                loadingWidth={ hp(7.5)}
                                loadingHeight={ hp(7.5)}
                                style={[styles.imgStyle]}
                                source={{uri: avatar_url}}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                            {unReadLength ? unReadLength > 0 && <View style={{
                                borderRadius: hp(3),
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                top: -hp(1), right:unReadLength.toString().length>1? -hp(2):-hp(1),
                                backgroundColor: 'red',
                                paddingHorizontal: hp(0.8),
                                borderWidth: 2,
                                borderColor: 'white',
                            }}>
                                <Text style={{
                                    fontSize: hp(1.5),
                                    color: 'white',
                                }}>{unReadLength}</Text>
                            </View> : null}
                        </View>
                        <View style={{justifyContent: 'space-around'}}>
                            {/*左上*/}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: hp(1.9),
                                    color: 'black',
                                    opacity: 0.9,
                                    marginLeft: 10,
                                }}>{username}</Text>
                                <Text style={{
                                    marginLeft: 10,
                                    fontSize: hp(1.6),
                                    color: (columnType == 2 || columnType == 3) ? 'red' : 'black',
                                    opacity: 0.5,
                                }}>{
                                    columnType == 1 ? `任务咨询` : columnType == 2 ? '申诉消息' : columnType == 3 ? '投诉消息' : columnType == 4 ? '聊天消息' : columnType == 5 ? '驳回沟通' : ''
                                }</Text>


                            </View>
                            {/*中间*/}
                            <Text
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                style={{
                                    fontSize: hp(1.8),
                                    color: 'black',
                                    opacity: 0.7,
                                    marginLeft: 10,
                                    width: (width - 100) / 2,
                                }}>{msg_type == 'text' ? renderEmoji(msg, [], hp(1.7), 0, 'black') : msg_type == 'image' ? '[图片]' : msg_type == 'system' ? '[系统消息]' : ''}
                            </Text>
                        </View>

                    </View>


                    <View style={{
                        marginLeft: hp(6)+20,
                        marginTop: 5,
                    }}>
                        <Text style={{
                            fontSize: hp(1.55),
                            color: 'black',
                            opacity: 0.6,

                        }}>{getCurrentTime(parseInt(item.sendDate))}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        Global.imageViewModal.show([{url: taskUri}]);
                    }}
                >
                    <FastImagePro
                        loadingWidth={hp(6)}
                        loadingHeight={hp(6)}
                        style={{
                            backgroundColor: '#9d9d9d',
                            // 设置宽度
                            width: hp(6),
                            height: hp(6),
                            borderRadius: 2,
                        }}
                        source={{uri: taskUri}}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                </TouchableOpacity>


            </AnimatedTouchableOpacity>
        </AnimatedFadeIn>;


    }


}
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: hp(7.5),
        height: hp(7.5),
        borderRadius: 3,
        // 设置高度
        // height:150
    },
});
