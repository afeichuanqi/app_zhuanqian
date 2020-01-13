import React from 'react';
import {ActivityIndicator, Modal, PermissionsAndroid, StatusBar} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import Global from './Global';
import {saveImg} from '../util/ImageUtil';
import Toast from './Toast';
import {bottomTheme, theme} from '../appSet';

export default class ImageViewerModal extends React.Component {
    state = {
        visible: false,
        index: 0,
        images: [{}],
    };
    static defaultProps = {
        statusBarType: 'light',
    };

    constructor(props) {
        super(props);
        this.type = props.statusBarType;
    }

    setStatusBar = (type) => {
        if (type === 'dark') {
            StatusBar.setBarStyle('dark-content', false);
            StatusBar.setBackgroundColor(theme, false);
        }
        if (type === 'light') {
            StatusBar.setBarStyle('light-content', false);
            StatusBar.setBackgroundColor(bottomTheme, false);
        }

        if (type === 'translucent') {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('rgba(0,0,0,0)', true);
        }

        if (type === 'no-translucent') {
            StatusBar.setTranslucent(false);
            StatusBar.setBackgroundColor(bottomTheme, true);
        }
        if (type === 'self') {
            StatusBar.setBarStyle('light-content', false);
            StatusBar.setBackgroundColor('black', false);
        }
    };
    show = (images, activeUrl = '', statusBarStyle = '') => {

        this.setStatusBar('self');
        if (statusBarStyle.length > 0) {
            this.type = statusBarStyle;
        }
        let activeIndex = 0;
        const tmpImages = [...images];
        for (let i = 0; i < tmpImages.length; i++) {
            const index = i;
            const images = tmpImages[index];
            const findindex = Global.imageSizeArr.findIndex(item => images.url == item.url);
            if (findindex !== -1) {
                tmpImages[index].width = Global.imageSizeArr[findindex].width;
                tmpImages[index].height = Global.imageSizeArr[findindex].height;
            }

            if (i === tmpImages.length - 1) {
                if (activeUrl != '') {
                    activeIndex = tmpImages.findIndex(item => item.url == activeUrl);
                }
                this.setState({
                    index: activeIndex,
                    images: tmpImages,
                    visible: true,
                });
            }
        }


    };
    hide = () => {
        this.setStatusBar(this.type);
        this.setState({visible: false});
    };

    renderImage = (props) => {
        return <FastImage {...props}/>;
    };

    onLoadSuccess = (url, width, height) => {
        const index = Global.imageSizeArr.findIndex(item => item.url == url);
        if (index === -1) {
            Global.imageSizeArr.push({url, width, height});
        } else {
            Global.imageSizeArr[index].width = width;
            Global.imageSizeArr[index].height = height;
        }
    };
    onDoubleClick = () => {

    };
    loadingRender = () => {
        return <ActivityIndicator/>;
    };
    onSave = async (url) => {
        const bool = await this.checkPermission();
        if (bool) {
            saveImg(url, (msg) => {
                // Global.toast.show(msg);
                this.toast.show(msg);
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

    render() {

        const {visible, images, index} = this.state;

        return <Modal
            visible={visible}
            animationType={'fade'}
            transparent
            onRequestClose={this.hide}
        >
            <Toast
                ref={ref => this.toast = ref}
            />
            <ImageViewer
                loadingRender={this.loadingRender}
                onCancel={this.hide}
                renderImage={this.renderImage}
                onDoubleClick={this.onDoubleClick}
                onSave={this.onSave}
                onClick={this.hide}
                onLoadSuccess={this.onLoadSuccess}
                imageUrls={images}
                index={index}

            />
        </Modal>;

    }

}
