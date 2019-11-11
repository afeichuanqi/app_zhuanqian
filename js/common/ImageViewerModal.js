import React, {Component} from 'react';
import {Modal, View, TouchableOpacity, FlatList, Text, Image, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
export default class App extends React.Component {
    state = {
        visible: false,
        index: 0,
        images: [{
            'stepNo': 1,
            'url': 'file:///Users/panfeilong/Library/Developer/CoreSimulator/Devices/0DE50456-2114-427D-A503-07FB3CE08516/data/Containers/Data/Application/CEBA7F83-349F-49BE-BAAE-8AE057E0FDB2/tmp/react-native-image-crop-picker/B3C18632-DC7D-4A14-BDC0-834CCBAAAC2C.jpg',
        }, {
            'stepNo': 2,
            'url': 'file:///Users/panfeilong/Library/Developer/CoreSimulator/Devices/0DE50456-2114-427D-A503-07FB3CE08516/data/Containers/Data/Application/CEBA7F83-349F-49BE-BAAE-8AE057E0FDB2/tmp/react-native-image-crop-picker/A193E471-E275-47F5-8C27-65837B154035.jpg',
        }],
    };
    show = (index, images) => {
        console.log(images);
        //
        this.setState({
            images, index,
        }, () => {
            //
            this.setState({
                visible: true,
            });
            setTimeout(() => {
                this.flatList.scrollToIndex({viewPosition: 0, index});
            }, 200);

        });

    };
    hide = () => {
        this.setState({visible: false});
    };

    render() {
        const {visible, index, images} = this.state;
        return <Modal
            onRequestClose={this.hide}
            animationType={'fade'}
            visible={visible} transparent={true}>
            <View style={{flex: 1, backgroundColor: 'black'}}>
                <FlatList

                    ref={ref => this.flatList = ref}
                    data={images}
                    renderItem={data => this._renderIndexPath(data)}
                    keyExtractor={(item, index) => index + ''}
                    horizontal={true}
                    onScroll={this._onScroll}
                    onScrollBeginDrag={this.handleOnScrollBeginDrag}
                    onScrollEndDrag={this.handleOnScrollEndDrag}
                />
            </View>
        </Modal>;
    }

    picIndex = 0;
    handleOnScrollEndDrag = (event) => {
        if (this.scrollX < 0 && this.picIndex == 0) {
            return;
        }
        this.scrollXEnd = event.nativeEvent.contentOffset.x;
        if (this.scrollXEnd > this.scrollXBegin) {
            if (this.scrollXEnd - this.scrollXBegin > width / 2) {
                if (this.picIndex < this.state.images.length - 1) {
                    this.picIndex += 1;

                }

            }
        } else {
            if (this.scrollXBegin - this.scrollXEnd > width / 2) {
                if (this.picIndex > 0) {
                    this.picIndex -= 1;
                }

            }
        }
        this.flatList.scrollToIndex({viewPosition: 0, index: this.picIndex});
    };

    _renderIndexPath = ({item, index}) => {
        return <ImageItem index={index} total={this.state.images.length} onPress={this._picClick} data={item}
                          key={index}/>;
    };
    _picClick = () => {
        this.hide();
    };
    handleOnScrollBeginDrag = (event) => {
        console.log(event.nativeEvent.contentOffset.x);
        this.scrollXBegin = event.nativeEvent.contentOffset.x;
    };

}

class ImageItem extends Component {
    render() {
        const {data} = this.props;

        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.props.onPress}
            >
                <Image

                    source={{uri: data.url}}
                    style={{
                        width: width,
                        // marginBottom: 10,
                        height: height,
                        backgroundColor: 'black',
                        borderRadius: 3,
                    }}
                    resizeMode={'contain'}/>
                <View style={{position: 'absolute', bottom: 0, right: 0}}>

                </View>
            </TouchableOpacity>

            <View style={{position: 'absolute', bottom: 100, width, borderColor: 'rgba(0,0,0,0.5)'}}>
                <Text style={{color: 'white'}}>你好啊</Text>
            </View>
            <View style={{position: 'absolute', bottom: 45, right: 10, borderColor: 'rgba(0,0,0,0.5)'}}>
                <Text style={{color: 'white', fontSize: 16}}>{`${this.props.index + 1}/${this.props.total}`}</Text>
            </View>
        </View>;
    }
}
