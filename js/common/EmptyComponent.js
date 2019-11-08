/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import message_nomsg from '../res/svg/message_nomsg.svg';
import kongxiangzi from '../res/svg/kongxiangzi.svg';
import {Dimensions, Text, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';

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
        marginTop:0
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
                height: height, justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#f7f7f7', position: 'absolute', top: 0, zIndex: -1, width,elevation:-1

            }}>
                <View  style={{justifyContent: 'center', marginTop:this.props.marginTop,alignItems: 'center',shadowColor: '#c7c7c7',

                     }}>
                    <SvgUri  width={95} height={94} svgXmlData={this.props.svgXmlData}/>
                    <Text style={{marginTop: 5, color: 'black', opacity: 0.7}}>{this.props.message}</Text>
                </View>
            </View>
        );
    }
}

export default EmptyComponent;
