/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import kongxiangzi from '../res/svg/kongxiangzi.svg';
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
        svgXmlData: kongxiangzi,
        message: '您还没有收到消息',
        marginTop: 0,
        height: height,
    };

    render() {

        // const {interVal} = this.state;
        //
        // let statusBar = {
        //     hidden: false,
        // };
        // let navigationBar = <NavigationBar
        //     hide={true}
        //     statusBar={statusBar}
        // />;
        return (
            <View style={{
                height: this.props.height, justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#fafafa', width,

            }}>
                <View style={{
                    justifyContent: 'center',
                    marginTop: this.props.marginTop,
                    alignItems: 'center',
                    shadowColor: '#f5f5f5',

                }}>
                    <Image source={require('../res/img/kongxiangzi.png')} style={{width: 80, height: 50}}/>
                    <Text style={{marginTop: 20, fontSize: 13,color: 'black', opacity: 0.7}}>{this.props.message} ~ ~</Text>
                </View>
            </View>
        );
    }
}

export default EmptyComponent;
