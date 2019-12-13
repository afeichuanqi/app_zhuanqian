/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Image, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {equalsObj} from '../util/CommonUtils';

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
            />
            {!isSuccess && <View style={[style, {
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent:'center',
                alignItems:'center',
            }]}>
                {/*<ActivityIndicator size="small" color="black"/>*/}
                <Image
                    style={{width:50,height:50}}
                    source={require('../res/img/image_loading.gif')}
                />
            </View>}
        </View>;

    }
}


export default FastImagePro;
