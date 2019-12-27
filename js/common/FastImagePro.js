/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Image, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {equalsObj} from '../util/CommonUtils';
import Global from './Global';

class FastImagePro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSuccess: false,
        };
    }


    onLoadStart = () => {
        // if (Platform.OS === 'ios') {
            this.setState({
                isSuccess: false,
            });
        // }
    };
    onLoadEnd = () => {
        // if (Platform.OS === 'ios') {
            this.setState({
                isSuccess: true,
            });
        // }
    };

    componentDidMount(): void {
        // if (Platform.OS === 'android') {
        //     const url = this.props.source.uri;
        //     const index = Global.imageSizeArr.findIndex(item => item.url == url);
        //     if (index === -1) {
        //         Image.getSize(
        //             url,
        //             (width: number, height: number) => {
        //                 if (index === -1) {
        //                     Global.imageSizeArr.push({url, width, height});
        //                 } else {
        //                     Global.imageSizeArr[index].width = width;
        //                     Global.imageSizeArr[index].height = height;
        //                 }
        //                 this.setState({
        //                     isSuccess: true,
        //                 });
        //             });
        //     } else {
        //         this.setState({
        //             isSuccess: true,
        //         });
        //     }
        // }


    }


    onLoad = (e) => {
        if (Platform.OS === 'ios') {
            if (this.props.source.uri && this.props.source.uri.startsWith('http:')) {
                const width = e.nativeEvent.width;
                const height = e.nativeEvent.height;
                const url = this.props.source.uri;

                const index = Global.imageSizeArr.findIndex(item => item.url == url);
                if (index === -1) {
                    Global.imageSizeArr.push({url, width, height});
                } else {
                    Global.imageSizeArr[index].width = width;
                    Global.imageSizeArr[index].height = height;
                }
            }
        }


    };
    static defaultProps = {
        loadingWidth: 50,
        loadingHeight: 50,

    };

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.isSuccess !== nextState.isSuccess
            || !equalsObj(this.props.source, nextProps.source)
        ) {
            return true;
        }
        return false;
    }

    render() {
        const {style} = this.props;
        const {isSuccess} = this.state;
        return <View>
            <FastImage
                {...this.props}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
                onLoad={this.onLoad}
            />
            {!isSuccess && <View style={[style, {
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',

            }]}>
                <Image
                    style={{
                        width: this.props.loadingWidth,
                        height: this.props.loadingHeight,
                    }}
                    source={require('../res/img/image_loading.gif')}
                />
            </View>}
        </View>;

    }
}


export default FastImagePro;
