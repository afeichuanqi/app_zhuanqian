/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';

import {Dimensions, Text, View} from 'react-native';
import Image from 'react-native-fast-image';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class EmptyComponent extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    static defaultProps = {

        message: '您还没有收到消息',
        marginTop: 0,
        height: height,
        type: 1,
    };

    render() {
        let source = null;
        const type = this.props.type;
        if (type === 1) {
            source = require('../res/img/empty/task_empty.png');
        } else if (type === 2) {
            source = require('../res/img/empty/message_empty.png');
        }else if (type === 3) {
            source = require('../res/img/empty/favirite_empty.png');
        }else if (type === 4) {
            source = require('../res/img/empty/write_empty.png');
        }
        return (
            <View style={{
                height: this.props.height, justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#fafafa', width,

            }}>
                <View style={{
                    marginTop: this.props.marginTop,
                    alignItems:'center',
                }}>
                    <Image resizeMode={'contain'} source={source} style={{width: 120, height: 120}}/>
                    <Text style={{fontSize: 13, color: 'rgba(0,0,0,0.6)', marginTop: 10}}>{this.props.message} ~
                        ~</Text>
                </View>
            </View>
        );
    }
}

export default EmptyComponent;
