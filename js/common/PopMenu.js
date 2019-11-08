/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, Text, TouchableOpacity} from 'react-native';

const {width, height} = Dimensions.get('window');

class PopMenu extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        menuArr: [
            {id: 1, title: '6小时'},
            {id: 2, title: '12小时'},
            {id: 3, title: '1天'},
            {id: 4, title: '2天'},
            {id: 5, title: '3天'},
            {id: 6, title: '4天'},
            {id: 7, title: '5天'},
            {id: 8, title: '一星期'},
        ],
    };
    state = {
        visible: false,

    };

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };
    show = () => {
        this.setState({
            visible: true,
        });
    };

    render() {
        const {visible} = this.state;
        const {menuArr} = this.props;

        return (
            <Modal
                // transparent
                visible={visible}
                transparent={true}
                // supportedOrientations={['portrait']}
                onRequestClose={this.hide}
                animationType={'slide'}
            >
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
                    <View style={{
                        width, position: 'absolute', bottom: 0, backgroundColor: 'white',

                    }}>
                        <View style={{
                            width, alignItems: 'center', paddingVertical: 15,
                            borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
                        }}>
                            <Text style={{color: 'black', opacity: 0.7, fontSize: 12}}>结单审核时间</Text>
                        </View>
                        {menuArr.map((item, index, arr) => {
                            return this.genMenu(item.title);
                        })}
                        <TouchableOpacity
                            onPress={this.hide}
                            style={{
                            width, alignItems: 'center', paddingVertical: 15,
                            borderTopWidth: 10, borderTopColor: '#e8e8e8',
                        }}>
                            <Text>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    genMenu = (title) => {
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.hide}
            style={{
                width, alignItems: 'center', paddingVertical: 15,
                borderBottomWidth: 0.3, borderBottomColor: '#e8e8e8',
            }}>
            <Text>{title}</Text>
        </TouchableOpacity>;
    };
}


export default PopMenu;
