/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {
    Modal,
    View,
    Dimensions,
    Animated,
    Text,
    TouchableOpacity,
    ScrollView,
    Clipboard,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import Image from 'react-native-fast-image';
import JShareModule from 'jshare-react-native';
import Toast from 'react-native-root-toast';
import ImageUtil from '../util/ImageUtil';
import emoji from 'node-emoji';

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


        });
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, 150);
    };
    utilType = 1;
    show = (item = {}, utilType = 1) => {
        this.shareInfo = Object.assign(this.shareInfo, item);
        this.utilType = utilType;
        // console.log(this.shareInfo);
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
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                style={{paddingHorizontal: 20, marginTop: 5}}>

                                {this.getMenu('QQ', require('../res/img/share/qq.png'), () => {
                                    if (this.utilType === 1) {
                                        this.shareUtil('qq');
                                    } else {
                                        this.shareUtil2('qq');
                                    }
                                })}
                                {this.getMenu('QQ空间', require('../res/img/share/qqZone.png'), () => {
                                    if (this.utilType === 1) {
                                        this.shareUtil('qzone');
                                    } else {
                                        this.shareUtil2('qzone');
                                    }

                                })}
                                {this.getMenu('微信', require('../res/img/share/wechat.png'), () => {
                                    if (this.utilType === 1) {
                                        this.shareUtil('wechat_session');
                                    } else {
                                        this.shareUtil2('wechat_session');
                                    }

                                })}
                                {this.getMenu('朋友圈', require('../res/img/share/pengyouquan.png'), () => {
                                    if (this.utilType === 1) {
                                        this.shareUtil('wechat_timeLine');
                                    } else {
                                        this.shareUtil2('wechat_timeLine');
                                    }

                                })}
                                {this.getMenu('微博', require('../res/img/share/xinlangweibo.png'), () => {
                                    if (this.utilType === 1) {
                                        this.shareUtil('sina_weibo');
                                    } else {
                                        this.shareUtil2('sina_weibo');
                                    }

                                })}
                                {/*{this.getMenu('微博还有', require('../res/img/share/xinlangweibo.png'), () => {*/}
                                {/*    this.shareUtil('sina_weibo_contact');*/}
                                {/*})}*/}
                                {this.getMenu('复制链接', require('../res/img/share/copyurl.png'), () => {
                                    Clipboard.setString('http://www.easy-z.cn/share/');
                                    Toast.show('复制成功', {position: Toast.positions.CENTER});
                                })}


                            </ScrollView>

                        </View>

                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

    shareInfo = {
        title: '15元悬赏任务,赏金可以立即提现！ - 简易赚',
        text: '下载简易赚APP，完成悬赏任务即可赚取赏金！',
        imageUrl: 'http://image.easy-z.cn/logo_share1.png',
        url: 'http://www.easy-z.cn',
    };
    shareUtil = (platform) => {

        let data = {
            type: 'link',
            platform: platform, // 分享到指定平台
            title: emoji.emojify(this.shareInfo.title, () => '').substring(0, 40),
            text: emoji.emojify(this.shareInfo.text, () => '').substring(0, 40),
            imageUrl: this.shareInfo.imageUrl,
            url: this.shareInfo.url,

        };

        JShareModule.share(data, () => {

        }, (msg) => {
            // console.log(msg);
            if (msg.code === 40009) {
                Toast.show('您未安装应用');
            } else {
                Toast.show('分享失败');
            }
        });
    };
    shareUtil2 = async (platform) => {
        let data = {
            type: 'image',
            platform: platform, // 分享到指定平台
            // imagePath: 'http://images.easy-z.cn/share_util.png',
            // text:'需要你的帮助',
            imagePath: 'http://images.easy-z.cn/share_util.png',
            imageUrl: 'http://images.easy-z.cn/share_util.png',
        };
        if (Platform.OS === 'android') {
            const bool = await this.checkPermission();
            if (bool) {
                ImageUtil.saveImg('http://images.easy-z.cn/share_util.png', (bool, url) => {
                    data.imagePath = url;
                    data.imageUrl = url;
                    // console.log(data);
                    JShareModule.share(data, () => {

                    }, (msg) => {
                        console.log(msg);
                        if (msg.code === 40009) {
                            Toast.show('您未安装应用');
                        } else {
                            Toast.show('分享失败');
                        }
                    });
                });
            }

        } else {
            JShareModule.share(data, () => {

            }, (msg) => {
                // console.log(msg);
                if (msg.code === 40009) {
                    Toast.show('您未安装应用');
                } else {
                    Toast.show('分享失败');
                }
            });
        }


    };
    checkPermission = async () => {
        if (Platform.OS === 'android') {
            //返回Promise类型
            const data = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
            if (!data) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: '申请写权限',
                        message:
                            '简单赚需要您手机的写文件权限',
                        buttonNeutral: '稍后询问',
                        buttonNegative: '拒绝',
                        buttonPositive: '授予',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {//获取成功
                    return true;
                } else {//权限获取失败
                    // this.show('权限获取失败');
                    return false;
                }
            } else {//已经有此权限

                return true;
            }

        } else {//ios
            return true;
        }

    };
    getMenu = (title, source, click) => {
        return <TouchableOpacity
            onPress={() => {
                this.hide();
                setTimeout(() => {
                    click && click();
                }, 300);

            }}
            style={{alignItems: 'center', width: (width - 50) / 6}}>
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
