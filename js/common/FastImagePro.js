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
        this.setState({
            isSuccess: false,
        });
    };
    onLoadEnd = () => {
        this.setState({
            isSuccess: true,
        });
    };

    // componentDidMount(): void {
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


    // }


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
        loadingType: 1,

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
        const {style, loadingType, loadingWidth, loadingHeight} = this.props;
        let borderRadius = 0;
        if (Object.prototype.toString.call(style) === '[object Array]') {
            borderRadius = style[0].borderRadius;
        } else {
            borderRadius = style.borderRadius;
        }
        const {isSuccess} = this.state;
        let ComponentView = null;
        if (loadingType === 1) {
            ComponentView = <View style={[style, {
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',

            }]}>
                <Image
                    style={{
                        width: loadingWidth,
                        height: loadingHeight,
                        borderRadius: borderRadius,
                    }}
                    source={require('../res/img/imgLoading.png')}
                />
            </View>;
        } else if (loadingType === 2) {
            ComponentView = <View style={[style, {
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',

            }]}>
                <Image
                    style={{
                        width: loadingWidth,
                        height: loadingHeight,
                    }}
                    source={require('../res/img/image_loading.gif')}
                />
            </View>;
        }

        return <View>
            <FastImage
                {...this.props}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
                onLoad={this.onLoad}
            />
            {!isSuccess && ComponentView}
        </View>;

    }
}


export default FastImagePro;
