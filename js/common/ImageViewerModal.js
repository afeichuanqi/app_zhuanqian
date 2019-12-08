import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import PhotoView from '@merryjs/photo-viewer';

const {width, height} = Dimensions.get('window');
export default class App extends React.Component {
    state = {
        visible: false,
        index: 0,
        images: [
            {
                source: {
                    uri:
                        'http://wenjian.5irenqi.com/4ee6b320-0bf0-11ea-98fb-3ff2c90f7c8b.jpg',
                },
                // title: "Flash End-of-Life",
                // summary:
                //     "Adobe announced its roadmap to stop supporting Flash at the end of 2020. ",
                // // must be valid hex color or android will crashes
                // titleColor: "#f90000",
                // summaryColor: "green"
            },
        ],
    };
    show = (images) => {
        const tmpImages = [...this.state.images];
        tmpImages[0] = {
            source: {
                uri: images.url,
            },
        };
        this.setState({
            images: tmpImages,
            visible: true,

        });

    };
    hide = () => {
        this.setState({visible: false});
    };

    render() {

        const {visible, images, index} = this.state;

        return <PhotoView
            visible={visible}
            data={images}
            hideShareButton={true}
            hideStatusBar={false}
            initial={index}
            onDismiss={e => {
                this.setState({visible: false});
            }}
        />;

    }

}
