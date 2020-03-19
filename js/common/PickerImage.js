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
    PermissionsAndroid,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Platform,
    View,
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import ImageUtil from '../util/ImageUtil';
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
const {timing, SpringUtils, spring} = Animated;
const {width} = Dimensions.get('window');
export const ImgOption = Platform.OS === 'android' ? {
    cropping: true,
    mediaType: 'photo',
    freeStyleCropEnabled: true,
    showCropGuidelines: true,
    compressImageQuality: 0.7,
    cropperChooseText: '确认',
    cropperCancelText: '取消',
    cropperToolbarTitle: '剪裁图片',

} : {
    width: 1800,
    height: 1200,
    cropping: true,
    mediaType: 'photo',
    freeStyleCropEnabled: true,
    showCropGuidelines: true,
    compressImageQuality: 0.7,
    cropperChooseText: '确认',
    cropperCancelText: '取消',
    cropperToolbarTitle: '剪裁图片',
};

class PickerImage extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        select: () => {
        },
        popTitle: '选取照片',
        includeBase64: false,
        cropping: true,
        showMorePhotos: true,
    };
    state = {
        visible: false,
        photos: [],

    };
    checkPermission = async () => {
        if (Platform.OS === 'android') {
            //返回Promise类型
            const data = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (!data) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: '申请读权限',
                        message:
                            '简单赚需要您手机的读文件权限',
                        buttonNeutral: '稍后询问',
                        buttonNegative: '拒绝',
                        buttonPositive: '授予',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {//获取成功
                    return 1;
                } else {//权限获取失败
                    // this.show('权限获取失败');
                    return 1;
                }
            } else {//已经有此权限

                return 1;
            }

        } else {//ios
            return 1;
        }

    };


    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    hide = (hideAnimated = false, callback) => {
        if (hideAnimated) {
            this.setState({
                visible: false,
            }, callback);
            return;
        }

        this._anim = timing(this.animations.bottom, {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            setTimeout(() => {
                this.setState({
                    visible: false,
                });
            }, 0);

        });


    };
    show = async (timestamp = 0) => {
        await this.checkPermission();//等待权限获取完毕
        ImageUtil.getMorePhotos({
            first: 20,
            groupTypes: 'All',
            assetType: 'Photos',
        }, (bool, data) => {
            this.timestamp = timestamp;
            this.setState({
                visible: true,
                photos: data,
            }, () => {
                spring(this.animations.bottom, SpringUtils.makeConfigFromBouncinessAndSpeed({
                    ...SpringUtils.makeDefaultConfig(),
                    bounciness: 10,
                    speed: 8,
                    toValue: -400,
                })).start();
                // this._anim = timing(this.animations.bottom, {
                //     duration: 200,
                //     toValue: -400,
                //     easing: Easing.inOut(Easing.cubic),
                // }).start();
            });
        });

    };
    animations = {
        bottom: new Animated.Value(0),
    };
    _selTakePhone = () => {
        ImagePicker.openCamera(ImgOption).then(image => {
            this.hide();

            this.props.select(image, this.timestamp);
        });

    };
    _selAlbum = () => {
        ImagePicker.openPicker(ImgOption).then(image => {
            this.hide();
            this.props.select(image, this.timestamp);

        });
    };

    render() {
        const {visible, photos} = this.state;
        const {showMorePhotos} = this.props;

        return (

            <Modal
                transparent
                visible={visible}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.hide();
                                  }}
                >
                    <Animated.View style={{
                        width,
                        position: 'absolute',
                        bottom: -460,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        transform: [{translateY: this.animations.bottom}],
                    }}>
                        {showMorePhotos && <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={photos}
                            keyExtractor={(item, index) => index + ''}
                            renderItem={data => this._renderBestNewItem(data)}
                            windowSize={10}
                        />}

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this._selTakePhone}
                            style={{
                                width, alignItems: 'center', paddingVertical: 15,
                                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',
                            }}>
                            <Text style={{color: 'black', fontSize:hp(1.8)}}>{'拍一张照片'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this._selAlbum}
                            style={{
                                width, alignItems: 'center', paddingVertical: 15,
                                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',
                            }}>
                            <Text style={{color: 'black' ,fontSize:hp(1.8)}}>{'从相册选一张'}</Text>
                        </TouchableOpacity>
                        <View style={{height: 60, backgroundColor: 'white'}}/>
                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        );
    }

    _renderBestNewItem = ({item, index}) => {
        let {height, width, uri} = item;
        const FlatListItemHeight = hp(14);
        const size = FlatListItemHeight / height;
        const imgWidth = width * size;

        return <TouchableOpacity
            onPress={() => {


                ImagePicker.openCropper({
                    ...ImgOption,
                    path: uri,
                    width: (Platform.OS === 'ios') ? 1800 : width,
                    height: (Platform.OS === 'ios') ? 1200 : height,
                }).then(image => {
                    this.hide(false, () => {

                    });
                    this.props.select(image, this.timestamp);

                });

            }}
            key={item.uri}
            style={{padding: 1}}>
            <Image
                style={{height: FlatListItemHeight, width: imgWidth}}
                source={{uri: uri}}
                // resizeMode={FastImage.resizeMode.stretch}
            />
        </TouchableOpacity>;
    };

}


export default PickerImage;
