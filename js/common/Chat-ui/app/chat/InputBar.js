import React, {PureComponent} from 'react';
import {
    PanResponder,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    Animated,
    TextInput,
    Text, Dimensions,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

export default class InputBar extends PureComponent {
    constructor(props) {
        super(props);
        this.createPanResponder();
        this.inputHeight = 0;
    }

    createPanResponder() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onStartShouldSetPanResponderCapture: (e, gestureState) => false,
            onMoveShouldSetPanResponder: (e, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (e, gestureState) => false,
            onPanResponderGrant: (e, gestureState) => this.onPanResponderGrant(e, gestureState),
            onPanResponderMove: (e, gestureState) => this.onPanResponderMove(e, gestureState),
            onPanResponderTerminationRequest: (e, gestureState) => false,
            onPanResponderRelease: (e, gestureState) => this.onPanResponderRelease(e, gestureState),
            onPanResponderTerminate: (e, gestureState) => null,
            onShouldBlockNativeResponder: (e, gestureState) => true,
        });
    }

    onPanResponderGrant(e, gestureState) {
        const {showVoice, voiceStart} = this.props;
        if (showVoice) {
            voiceStart();
        }
    }

    onPanResponderMove(e, gestureState) {
        const {showVoice, voiceStatus, changeVoiceStatus, rootHeight} = this.props;
        if (showVoice) {
            const compare = Platform.OS === 'ios' ? height - this.inputHeight : rootHeight;
            if (e.nativeEvent.pageY < compare) {
                if (!voiceStatus) {
                    return undefined;
                }
                changeVoiceStatus(false);
            } else {
                if (voiceStatus) {
                    return undefined;
                }
                changeVoiceStatus(true);
            }
        }
    }

    onPanResponderRelease(e, gestureState) {
        const {showVoice, voiceEnd} = this.props;
        if (showVoice) {
            voiceEnd();
        }
    }

    renderIcon = () => {
        const messageContent = this.state.messageContent;
        const {sendIcon, plusIcon, usePlus, sendUnableIcon} = this.props;
        if (usePlus) {
            return messageContent.trim().length ? sendIcon : plusIcon;
        } else {
            return messageContent.trim().length ? sendIcon : sendUnableIcon;
        }
    };
    state = {
        messageContent: '',
    };
    setMessageContent = (text) => {
        this.setState({
            messageContent: text,
        });
    };
    getMessageContent = () => {
        return this.state.messageContent;
    };

    render() {
        const {messageContent} = this.state;

        const {
            // messageContent,
            onSubmitEditing = () => {
            },
            textChange = () => {
            }, onMethodChange = () => {
            }, onContentSizeChange = () => {
            },
            showVoice,
            inputStyle,
            inputOutContainerStyle,
            inputContainerStyle,
            inputHeightFix,
            xHeight,
            isVoiceEnd,
            useVoice,
            useEmoji,
            usePlus,
            inputChangeSize,
            placeholder,
            pressInText,
            pressOutText,
            isShowPanel,
            isPanelShow,
            paddingHeight,
            onFocus,
            isEmojiShow,
            isIphoneX,
        } = this.props;
        const enabled = (() => {
            if (Platform.OS === 'android') {
                if (isPanelShow) {
                    return true;
                }
                if (isEmojiShow) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        })();
        return (
            <Animated.View style={[
                styles.commentBar,
                inputOutContainerStyle,
                Platform.OS === 'ios'
                    ? {paddingBottom: isIphoneX ? xHeight : 0}
                    : {},
            ]}
                           onLayout={(e) => this.inputHeight = e.nativeEvent.layout.height}
            >
                <View style={[{
                    flexDirection: 'row', alignItems: 'center', marginVertical: hp(1.5), paddingHorizontal: wp(3),
                }, inputContainerStyle]}>
                    {/*{*/}
                    {/*  useVoice ? <View style={{ height: 35 + inputHeightFix, justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.7}>*/}
                    {/*    <TouchableOpacity onPress={onMethodChange} activeOpacity={0.7}>*/}
                    {/*      {showVoice ? this.props.keyboardIcon : this.props.voiceIcon}*/}
                    {/*    </TouchableOpacity>*/}
                    {/*  </View> : null*/}
                    {/*}*/}
                    <View style={{
                        marginHorizontal: wp(0.5),
                        borderRadius: 5,
                        borderColor: '#ccc',

                        flex: 1,
                        // borderBottomWidth: 0.5,
                        paddingVertical: 0.8,
                    }}
                    >
                        <TouchableOpacity
                            disabled={!enabled}
                            activeOpacity={1}
                            onPress={() => {
                                onFocus();
                            }}
                        >
                            <TextInput
                                ref={e => (this.input = e)}
                                multiline
                                blurOnSubmit={false}
                                editable={!enabled}
                                placeholder={placeholder}
                                placeholderTextColor={'rgba(0,0,0,0.5)'}
                                onContentSizeChange={onContentSizeChange}
                                underlineColorAndroid='transparent'
                                onChangeText={(messageContent) => {
                                    this.setState({
                                        messageContent,
                                    });
                                }}
                                value={messageContent}
                                style={[styles.commentBar__input, inputStyle]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            useEmoji
                                ? <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => this.props.showEmoji()}
                                    // style={{height:50}}
                                >
                                    {this.props.isEmojiShow ? this.props.keyboardIcon : this.props.emojiIcon}
                                </TouchableOpacity>
                                : null
                        }
                        <TouchableOpacity
                            style={{marginLeft: 8}}
                            onPress={
                                () => {
                                    if (messageContent.trim().length > 0) {
                                        this.setState({
                                            messageContent: '',
                                        });
                                        onSubmitEditing('text', messageContent);
                                    } else {
                                        if (usePlus) {
                                            isShowPanel(!isPanelShow);
                                        } else {
                                            return null;
                                        }
                                    }
                                }
                            }
                            activeOpacity={0.7}>
                            {this.renderIcon()}
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    commentBar: {
        width: width,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
        // borderColor: '#ccc',
        // borderTopWidth: StyleSheet.hairlineWidth
    },
    commentBar__input: {
        // borderRadius: 18,
        height: hp(3.5),
        padding: 0,
        // width: '100%',
        paddingLeft: 5,
        color: 'black',
        // paddingHorizontal: 5
        // backgroundColor: '#f9f9f9'
    },
});
