/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {ActivityIndicator, Modal, TouchableOpacity} from 'react-native';

class LoddingModal extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        width: 200,
        height: 500,
        rightTitle: '添加',
        titleComponent: null,
    };
    state = {
        visible: false,

    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    hide = () => {
        this.setState({
            visible: false,
        });

    };
    show = () => {
        this.setState({
            visible: true,
        }, () => {


        });
    };


    render() {
        const {visible} = this.state;

        return (
            <Modal
                transparent
                visible={visible}
                // animationType={'fade'}
                supportedOrientations={['portrait']}
                onRequestClose={this.hide}

            >
                <TouchableOpacity style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center',
                    alignItems: 'center', zIndex: 10, borderRadius: 5,
                }}
                                  activeOpacity={1}
                                  // onPress={() => {
                                  //     this.hide();
                                  // }}
                >

                    <ActivityIndicator
                        size="large" color={'white'}/>
                </TouchableOpacity>
            </Modal>
        );
    }

}


export default LoddingModal;
