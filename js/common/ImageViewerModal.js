import React from 'react';
import {ActivityIndicator, Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import Global from './Global';
import {saveImg} from '../util/ImageUtil';
import Toast from './Toast';

export default class App extends React.Component {
    state = {
        visible: false,
        index: 0,
        images: [{}],
    };
    show = (images, activeUrl = '') => {
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
                    console.log(activeIndex,"activeIndex");
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
        this.setState({visible: false});
    };
    onCancel = () => {
        this.setState({
            visible: false,
        });
    };
    renderImage = (props) => {
        return <FastImage {...props}/>;
    };
    onClick = () => {
        this.setState({
            visible: false,
        });
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
    onSave = (url) => {
        saveImg(url, (msg) => {
            this.toast.show(msg);
        });
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
                onCancel={this.onCancel}
                renderImage={this.renderImage}
                onDoubleClick={this.onDoubleClick}
                onSave={this.onSave}
                onClick={this.onClick}
                onLoadSuccess={this.onLoadSuccess}
                imageUrls={images}
                index={index}

            />
        </Modal>;

    }

}
