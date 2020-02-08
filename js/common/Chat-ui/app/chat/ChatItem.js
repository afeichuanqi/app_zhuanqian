import React, {PureComponent} from 'react';
import {
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    Text,
    StyleSheet, Dimensions, Platform,
} from 'react-native';
import Image from 'react-native-fast-image';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import {EMOJIS_DATA} from '../source/emojis';
import {renderEmoji} from '../../../../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {width} = Dimensions.get('window');

const PATTERNS = {
        url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i,
        phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
        emoji: new RegExp('\\/\\{[a-zA-Z_]{1,14}\\}'),
        localEmoji: new RegExp(/:([a-zA-Z0-9_\-\+]+):/g),
    }
;

export default class ChatItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isSelect: false,
        };
    }

    componentDidMount() {
        // this.subscription = DeviceEventEmitter.addListener('INIT_PROGRESS', () => this.setState({progress: 2}))
    }

    componentWillUnmount() {
        // this.subscription && this.subscription.remove()
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isOpen) {
            this.setState({isSelect: false});
        } else {
            if (nextProps.currentIndex === parseInt(nextProps.rowId) && this.props.currentIndex !== parseInt(nextProps.rowId)) {
                this.setState({isSelect: true});
            }
        }
    }


    _matchContentString = (textContent, views, isSelf) => {
        // 匹配得到index并放入数组中
        // let emojiArrs = textContent.match(PATTERNS.localEmoji);
        //
        // if (emojiArrs) {
        //     emojiArrs.forEach((item, index) => {
        //         views.push(<Emoji_ key={index} name={item} style={{fontSize: 15}}/>);
        //         // emojiArr.push(item);
        //         textContent = textContent.replace(item, '');
        //     });
        // }
        const {leftMessageTextStyle, rightMessageTextStyle} = this.props;
        if (textContent.length === 0) {
            return;
        }
        let emojiIndex = textContent.search(PATTERNS.emoji);
        let checkIndexArray = [];

        // 若匹配不到，则直接返回一个全文本
        if (emojiIndex === -1) {
            return  renderEmoji(textContent,views,hp(2.1),0,'black',isSelf ? rightMessageTextStyle : leftMessageTextStyle,23);//匹配系统表情控
        } else {
            checkIndexArray.push(emojiIndex);
            // 取index最小者
            let minIndex = Math.min(...checkIndexArray);
            // 将0-index部分返回文本
            const ContentText = textContent.substring(0, minIndex);
            renderEmoji(ContentText,views,hp(2.1),0,'black',isSelf ? rightMessageTextStyle : leftMessageTextStyle,23);//匹配系统表情控
            // views.push(<Text style={isSelf ? rightMessageTextStyle : leftMessageTextStyle}
            //                  key={'firstTextView' + (Math.random() * 100)}>{ContentText}</Text>);

            // 将index部分作分别处理
            this._matchEmojiString(textContent.substring(minIndex), views);
        }
    };

    _matchEmojiString = (emojiStr, views, isSelf) => {
        let castStr = emojiStr.match(PATTERNS.emoji);
        let emojiLength = castStr[0].length;

        let emojiImg = EMOJIS_DATA[castStr[0]];

        if (emojiImg) {
            views.push(<Image key={emojiStr} style={styles.subEmojiStyle} resizeMethod={'auto'} source={emojiImg}/>);
        }
        this._matchContentString(emojiStr.substring(emojiLength), views, isSelf);
    };

    _getActualText = (textContent, isSelf) => {
        let views = [];
        this._matchContentString(textContent, views, isSelf);
        return views;
    };

    _renderContent = (isSelf) => {
        const {message, isOpen, messageErrorIcon, reSendMessage, rowId} = this.props;
        const {content = {}, type = ''} = message;
        const {loading} = this.state;
        switch (type) {
            case 'text':
                if (this.props.renderTextMessage === undefined) {
                    return (
                        <TextMessage
                            rightMessageBackground={this.props.rightMessageBackground}
                            leftMessageBackground={this.props.leftMessageBackground}
                            reSendMessage={reSendMessage}
                            isOpen={isOpen}
                            isSelf={isSelf}
                            messageErrorIcon={messageErrorIcon}
                            message={message}
                            views={this._getActualText(content, isSelf)}
                            onMessageLongPress={this.props.onMessageLongPress}
                            onMessagePress={this.props.onMessagePress}
                            rowId={this.props.rowId}
                            lastReadAt={this.props.lastReadAt}
                            showIsRead={this.props.showIsRead}
                            isReadStyle={this.props.isReadStyle}
                            chatType={this.props.chatType}
                        />
                    );
                } else {
                    return this.props.renderTextMessage({
                        isOpen,
                        isSelf,
                        message,
                        views: this._getActualText(message.content),
                        index: parseInt(rowId),
                    });
                }
            case 'image':
                if (this.props.renderImageMessage === undefined) {
                    return (
                        <ImageMessage
                            rightMessageBackground={this.props.rightMessageBackground}
                            leftMessageBackground={this.props.leftMessageBackground}
                            reSendMessage={reSendMessage}
                            isOpen={isOpen}
                            isSelf={isSelf}
                            messageErrorIcon={messageErrorIcon}
                            message={message}
                            onMessageLongPress={this.props.onMessageLongPress}
                            onMessagePress={this.props.onMessagePress}
                            rowId={this.props.rowId}
                            lastReadAt={this.props.lastReadAt}
                            showIsRead={this.props.showIsRead}
                            isReadStyle={this.props.isReadStyle}
                            chatType={this.props.chatType}
                        />
                    );
                } else {
                    return this.props.renderImageMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }

            case 'location':
                if (this.props.renderLocationMessage === undefined) {
                    return null;
                } else {
                    return this.props.renderLocationMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }
            case 'share':
                if (this.props.renderShareMessage === undefined) {
                    return null;
                } else {
                    return this.props.renderShareMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }
            case 'videoCall':
                if (this.props.renderVideoCallMessage === undefined) {
                    return null;
                } else {
                    return this.props.renderVideoCallMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }
            case 'voiceCall':
                if (this.props.renderVoiceCallMessage === undefined) {
                    return null;
                } else {
                    return this.props.renderVoiceCallMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }
            case 'redEnvelope':
                if (this.props.renderRedEnvelopeMessage === undefined) {
                    return null;
                } else {
                    return this.props.renderRedEnvelopeMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }
            case 'file':
                if (this.props.renderFileMessage === undefined) {
                    return null;
                } else {
                    return this.props.renderFileMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }
            case 'system':

                if (this.props.renderSystemMessage === undefined) {
                    const msgs = message.content.split('|');
                    if (msgs.length == 0) {
                        return null;
                    }
                    const title = msgs[0];
                    const content = msgs[1];
                    const btnTitle = msgs[2];
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={message.onClick}
                            style={{
                                width: wp(95), backgroundColor: 'white', paddingTop: hp(2.5), paddingHorizontal: wp(3.5),
                                borderRadius: 3, paddingBottom: hp(1.25),
                            }}>
                            <Text style={{fontSize: hp(2.2), fontWeight: 'bold', color: 'black'}}>{title}</Text>
                            <Text
                                style={{
                                    fontSize:hp(1.9),
                                    color: 'rgba(0,0,0,0.5)',
                                    marginTop: 10,
                                    marginBottom: 10,
                                }}>{content}</Text>

                            {(btnTitle && btnTitle.length > 0) ? <View style={{
                                paddingVertical: hp(0.5),
                                width: wp(95),
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                borderTopWidth: 0.3,
                                borderTopColor: 'rgba(0,0,0,0.1)',
                                paddingTop:hp(1)
                            }}>
                                <Text style={{color: '#2196F3', fontSize:hp(2.0)}}>{btnTitle}</Text>
                            </View> : null}


                        </TouchableOpacity>
                    );
                } else {
                    return this.props.renderSystemMessage({isOpen, isSelf, message, index: parseInt(rowId)});
                }
        }
    };

    renderCheck = () => {
        if (this.props.renderMessageCheck === undefined) {
            if (this.state.isSelect) {
                return (
                    <View style={styles.check}>
                        {this.props.messageSelectIcon}
                    </View>
                );
            } else {
                return <View style={styles.unCheck}/>;
            }
        } else {
            return this.props.renderMessageCheck(this.state.isSelect);
        }
    };

    render() {
        const {user = {}, guzhuInfo, message, isOpen, selectMultiple, avatarStyle = {}, rowId, chatType, showUserName, userNameStyle} = this.props;
        const isSelf = user.id == message.targetId;
        const {type} = message;
        const avatar = isSelf ? user.avatar : message.chatInfo.avatar;
        const nickName = isSelf ? '' : message.chatInfo.nickName;
        const avatarSource = typeof (avatar) === 'number' ? avatar : {uri: avatar};
        const Element = isOpen ? TouchableWithoutFeedback : View;
        const showName = showUserName && type !== 'system';
        return (
            <View>
                <Element
                    onPress={() => {
                        this.setState({isSelect: !this.state.isSelect});
                        selectMultiple(!this.state.isSelect, parseInt(rowId), message);
                    }}
                >
                    <View>
                        {
                            type === 'system'
                                ? null
                                : <TouchableOpacity activeOpacity={1}>
                                    {
                                        message.renderTime ? this.props.renderMessageTime(message.time) : null
                                    }
                                </TouchableOpacity>
                        }
                        <TouchableOpacity
                            onPress={() => this.props.closeAll()}
                            disabled={isOpen}
                            activeOpacity={1}
                            style={[styles.chat, isSelf ? styles.right : styles.left]} ref={(e) => (this.content = e)}
                        >
                            {
                                !isSelf && isOpen && type !== 'system' &&
                                <View>
                                    {this.renderCheck()}
                                </View>
                            }
                            {
                                type === 'system'
                                    ? null
                                    : <TouchableOpacity
                                        activeOpacity={0.7}
                                        disabled={isOpen}
                                        onPress={() => this.props.onPressAvatar(isSelf, message.targetId, message.isAdmin)}
                                    >
                                        {this.props.renderAvatar ? (
                                            this.props.renderAvatar(message)
                                        ) : (
                                            <Image source={avatarSource} style={[styles.avatar, avatarStyle]}/>
                                        )}
                                    </TouchableOpacity>
                            }
                            <View style={[
                                {justifyContent: showName ? 'flex-start' : 'center'},
                                type === 'system' && {flex: 1},
                            ]}>
                                {
                                    showName ?
                                        <View style={{
                                            marginBottom: 10,
                                            marginLeft: !isSelf ? wp(2) : 0, alignItems: 'center',
                                            marginRight: isSelf ? wp(2) : 0,
                                            flexDirection: 'row', justifyContent: isSelf ? 'flex-end' : 'flex-start',
                                        }}>
                                            <View style={{
                                                backgroundColor: message.isAdmin ? '#eaa121' : message.targetId == guzhuInfo.guzhuUserId ? 'red' : '#2196F3',
                                                paddingHorizontal: 7,
                                                paddingVertical: Platform.OS == 'android' ? 1 : 2,
                                                borderRadius: 4,
                                                marginRight: 5,
                                            }}>
                                                <Text style={{
                                                    fontSize: hp(1.6),
                                                    color: 'white',
                                                }}>{message.isAdmin ? '客服' : message.targetId == guzhuInfo.guzhuUserId ? '雇主' : '接单'}</Text>
                                            </View>
                                            <Text style={{
                                                fontSize: hp(1.8),
                                                color: '#888888',
                                            }}>{isSelf ? user.username : nickName}</Text>
                                        </View>
                                        : null
                                }
                                {this._renderContent(isSelf)}
                            </View>
                            {
                                isSelf && isOpen && type !== 'system' &&
                                <View
                                    style={{flex: 1}}
                                >
                                    {this.renderCheck()}
                                </View>
                            }
                        </TouchableOpacity>

                        {
                            this.props.renderErrorMessage(message.sendStatus)
                        }
                    </View>
                </Element>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    commentBar: {
        width: width,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderColor: '#ccc',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    subEmojiStyle: {
        width: 23,
        height: 23,
        marginHorizontal: 1.5,
        marginTop:3,

    },
    commentBar__input: {
        borderRadius: 18,
        height: 26,
        width: '100%',
        padding: 0,
        paddingHorizontal: 20,
        // backgroundColor: '#f9f9f9'
    },
    circle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 0.8,
    },
    chat: {
        paddingHorizontal: 10,
        paddingVertical: 14,
    },
    right: {
        flexDirection: 'row-reverse',
    },
    left: {
        flexDirection: 'row',
    },
    txtArea: {},
    voiceArea: {
        borderRadius: 12,
        maxWidth: width - 160,
        justifyContent: 'center',
        minHeight: 30,
    },
    avatar: {
        marginLeft: 8,
        borderRadius: wp(13)/2,
        width: wp(13),
        height: wp(13),
    },
    check: {
        width: 20,
        height: 20,
        backgroundColor: 'green',
        borderRadius: 10,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unCheck: {
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        borderWidth: 0.6,
        borderRadius: 10,
        borderColor: '#9c9c9c',
        marginTop: 14,
    },
    system_container: {
        flex: 1,
        alignItems: 'center',
    },
    system_button: {
        backgroundColor: 'rgba(240, 240, 240, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    system_text: {
        fontSize: 12,
    },
    userName: {
        fontSize: 12,
        color: '#858585',
        marginBottom: 10,
        marginLeft: 14,
    },
});
