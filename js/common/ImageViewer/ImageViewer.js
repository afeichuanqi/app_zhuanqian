import React, {Component} from 'react';
import {StyleSheet, Image, Dimensions, Text, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class ImageExample extends Component {

    render() {
        const images = [{
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576155012114&di=867e1081f8b8f5310360ddbdb80a84b8&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F11%2F20%2F35%2F77i58PICzwn.jpg'
        }, {
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576155012115&di=12db94f2983139df17c09647fceaea33&imgtype=0&src=http%3A%2F%2Ffile04.16sucai.com%2Fd%2Ffile%2F2015%2F0417%2F309a1058647104845307bb338221485e.jpg'
        }, {
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576155012115&di=f73d1105effd639147e7b1828db100ef&imgtype=0&src=http%3A%2F%2Fimg.bimg.126.net%2Fphoto%2FygtcxNtqBcH6kqzLKUS_9A%3D%3D%2F5760666873360998521.jpg'
        }]
        return (
            <Modal visible={true} transparent={true}>
                <ImageViewer
                    loadingRender={()=>{
                        return <ActivityIndicator
                            style={{color: 'red'}}
                        />
                    }}

                    imageUrls={images}/>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    wrapper: {
        borderColor: 'green',
        borderWidth: 2,
        overflow: 'hidden',
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

        backgroundColor: 'black',
    },
});
