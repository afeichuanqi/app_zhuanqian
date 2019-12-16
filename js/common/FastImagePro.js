/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Image, ActivityIndicator, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {equalsObj} from '../util/CommonUtils';
import Global from './Global';

class FastImagePro extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isSuccess: false,
    };
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

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (Platform.OS === 'android') {
            if (!this.props.source.uri || this.props.source.uri !== nextProps.source.uri) {
                if (nextProps.source.uri && nextProps.source.uri.startsWith('http:')) {
                    const url = nextProps.source.uri;
                    Image.getSize(
                        url,
                        (width: number, height: number) => {
                            const index = Global.imageSizeArr.findIndex(item => item.url == url);
                            if (index === -1) {
                                Global.imageSizeArr.push({url, width, height});
                            } else {
                                Global.imageSizeArr[index].width = width;
                                Global.imageSizeArr[index].height = height;
                            }
                        });
                }
            }
        }

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
        // console.log('isSuccess', this.props);
        return <View>
            <FastImage
                {...this.props}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
                onLoad={this.onLoad}
            />
            {/*<Text style={{textAlign:}}>*/}
            {!isSuccess && <View style={[style, {
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }]}>
                {/*<ActivityIndicator size="small" color="black"/>*/}
                <Image
                    style={{width: 50, height: 50}}
                    source={require('../res/img/image_loading.gif')}
                />
            </View>}
        </View>;

    }
}


export default FastImagePro;
