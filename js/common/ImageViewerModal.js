import React, {Component} from 'react';
import {Modal, View, TouchableOpacity, FlatList, Text, Image, Dimensions} from 'react-native';
import ImageTransformer from './TransformableImage';

const {width, height} = Dimensions.get('window');
export default class App extends React.Component {
    state = {
        visible: false,
        index: 0,
        images: {
            url: 'file:///Users/panfeilong/Library/Developer/CoreSimulator/Devices/0DE50456-2114-427D-A503-07FB3CE08516/data/Containers/Data/Application/CEBA7F83-349F-49BE-BAAE-8AE057E0FDB2/tmp/react-native-image-crop-picker/B3C18632-DC7D-4A14-BDC0-834CCBAAAC2C.jpg',
        },
    };
    show = (images) => {
        console.log(images);
        this.setState({
            images,
            visible: true,

        });

    };
    hide = () => {
        this.setState({visible: false});
    };

    render() {

        const {visible,images} = this.state;
        console.log(images,"images");
        return <Modal
            onRequestClose={this.hide}
            animationType={'fade'}
            visible={visible} transparent={true}>
            <View style={{flex: 1, backgroundColor: 'black'}}>
                <ImageTransformer
                    // onTransformGestureReleased={() => true}
                    imgClick={this.hide}
                    style={{width: width, height: height}}
                    source={{uri: images.url}}
                />
            </View>
        </Modal>;
    }

}
