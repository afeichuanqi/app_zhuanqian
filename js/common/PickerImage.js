/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, PermissionsAndroid, Dimensions, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import ImageUtil from '../util/ImageUtil';

const {timing} = Animated;
const {width} = Dimensions.get('window');

class PickerImage extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        select: () => {
        },
        popTitle: '选取照片',
        includeBase64: false,
        cropping: false,
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

    hide = () => {
        this._anim = timing(this.animations.bottom, {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            setTimeout(()=>{
                this.setState({
                    visible: false,
                });
            },0)

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
                this._anim = timing(this.animations.bottom, {
                    duration: 200,
                    toValue: -400,
                    easing: Easing.inOut(Easing.cubic),
                }).start();
            });
        });

    };
    animations = {
        bottom: new Animated.Value(0),
    };
    _selTakePhone = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: this.props.cropping,
            mediaType: 'photo',
            freeStyleCropEnabled: true,
            showCropGuidelines: true,
            compressImageQuality: 0.7,
            cropperChooseText: '确认',
            cropperCancelText: '取消',
            cropperToolbarTitle: '剪裁图片',
        }).then(image => {
            this.hide();

            this.props.select(image, this.timestamp);
        });

    };
    _selAlbum = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: this.props.cropping,
            mediaType: 'photo',
            freeStyleCropEnabled: true,
            showCropGuidelines: true,
            compressImageQuality: 0.7,
            cropperChooseText: '确认',
            cropperCancelText: '取消',
            cropperToolbarTitle: '剪裁图片',
        }).then(image => {
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
                // animationType={'fade'}
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
                        bottom: -400,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        transform: [{translateY: this.animations.bottom}],
                    }}>
                        {/*<View style={{*/}
                        {/*    width, alignItems: 'center', height: 20, justifyContent: 'center',*/}
                        {/*    borderBottomWidth: 1, borderBottomColor: '#e8e8e8',*/}
                        {/*}}>*/}
                        {/*    <Text style={{color: 'black', opacity: 0.7, fontSize: 12}}>{this.props.popTitle}</Text>*/}
                        {/*</View>*/}
                        {showMorePhotos && <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={photos}
                            keyExtractor={(item, index) => index + ''}
                            renderItem={data => this._renderBestNewItem(data)}
                        />}

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this._selTakePhone}
                            style={{
                                width, alignItems: 'center', paddingVertical: 15,
                                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',
                            }}>
                            <Text>{'拍一张照片'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this._selAlbum}
                            style={{
                                width, alignItems: 'center', paddingVertical: 15,
                                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',
                            }}>
                            <Text style={{}}>{'从相册选一张'}</Text>
                        </TouchableOpacity>
                        {/*<View style={{*/}
                        {/*    height: 10, backgroundColor: '#e8e8e8',*/}
                        {/*}}/>*/}
                        {/*<TouchableOpacity*/}
                        {/*    onPress={() => {*/}
                        {/*        this.hide(null);*/}
                        {/*    }}*/}
                        {/*    style={{*/}
                        {/*        width, alignItems: 'center', height: 50, justifyContent: 'center',*/}

                        {/*    }}>*/}
                        {/*    <Text>取消</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    }

    _renderBestNewItem = ({item, index}) => {
        const {height, width, uri} = item;
        const FlatListItemHeight = 130;
        const size = FlatListItemHeight / height;
        const imgWidth = width * size;
        // console.log(item.uri);

        return <TouchableOpacity
            onPress={() => {
                ImagePicker.openCropper({
                    path: uri,
                    width: (Platform.OS === 'ios') ? width * 2 : width,
                    height: (Platform.OS === 'ios') ? height * 2 : height,
                    freeStyleCropEnabled: true,
                    showCropGuidelines: true,
                    compressImageQuality: 0.7,
                    cropperChooseText: '确认',
                    cropperCancelText: '取消',
                    cropperToolbarTitle: '剪裁图片',
                }).then(image => {
                    this.hide();
                    this.props.select(image, this.timestamp);
                });
                // NavigationUtils.goPage({task_id: item.id, test: false}, 'TaskDetails');
            }}
            key={item.id}
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
