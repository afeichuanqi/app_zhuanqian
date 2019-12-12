/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Image, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';

class FastImagePro extends PureComponent {
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

    render() {
        const {style} = this.props;
        const {isSuccess} = this.state;
        return <View>
            <FastImage
                {...this.props}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
            />
            {!isSuccess && <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: style.width,
                height: style.height,
            }}>
                <Image
                    style={style}
                    source={require('../res/img/image_loading.gif')}
                />
            </View>}
        </View>;

    }
}


export default FastImagePro;
