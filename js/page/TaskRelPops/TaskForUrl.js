/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, TextInput, Dimensions, Text, TouchableOpacity} from 'react-native';
import MyModal from '../../common/MyModalBox';
import ChatRoomPage from '../ChatRoomPage';
import SvgUri from 'react-native-svg-uri';
import add_phone from '../../res/svg/add_phone.svg';

const {width, height} = Dimensions.get('window');

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    getColumnView = (type, typeData) => {
        switch (type) {

            case 1://步骤说明
                return <View style={{
                    paddingVertical: 10,
                    width: width - 40,
                    paddingHorizontal: 15,
                }}>
                    <Text style={{fontSize: 13}}>{typeData.title}</Text>
                    <TextArea placeholder={typeData.placeholder} onChangeText={typeData.onChangeText}/>

                </View>;
                break;

            case 2://填写网址
                return <View style={{
                    paddingVertical: 10,
                    width: width - 40,
                    paddingHorizontal: 15,
                }}>
                    <Text style={{fontSize: 13}}>{typeData.title}</Text>
                    <TextInput
                        onChangeText={typeData.onChangeText}
                        maxLength={300}
                        multiline={false}
                        placeholder={typeData.placeholder}
                        style={{
                            height: 30,
                            backgroundColor: '#e8e8e8',
                            marginTop: 10,
                            fontSize: 13,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                        }}
                    />

                </View>;
                break;
            case 3://填写二维码
                return <View style={{
                    paddingVertical: 10,
                    width: width - 40,
                    paddingHorizontal: 15,
                }}>
                    <Text style={{fontSize: 13}}>{'二维码'}</Text>
                    {/*<TextArea placeholder={typeData.placeholder} onChangeText={typeData.onChangeText}/>*/}
                    <View style={{width: width - 60, alignItems: 'center'}}>
                        <View style={{
                            marginTop: 10,
                            width: 80,
                            height: 80,
                            backgroundColor: '#e8e8e8',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.5,
                            borderColor: 'rgba(0,0,0,0.6)',
                        }}>
                            <SvgUri width={50} height={50} svgXmlData={add_phone}/>
                        </View>
                    </View>

                </View>;
                break;

        }
    };

    render() {

        return (
            <MyModal
                title={'输入网址'}
                style={{
                    // height:
                    width: width - 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 5,
                }}>
                {this.getColumnView(1, {title: '步骤说明', placeholder: '适用于需要点击链接访问网页的操作，输入内容，提示打开网址注意事项'})}
                {this.getColumnView(3, {title: '步骤说明', placeholder: '适用于需要点击链接访问网页的操作，输入内容，提示打开网址注意事项'})}
                {/*{this.getColumnView(2, {title: '填写网址', placeholder: '填写网址'})}*/}

            </MyModal>
        );
    }
}

class TextArea extends PureComponent {
    state = {
        length: 0,
        placeholder: '',
    };
    _onChangeText = (text) => {
        this.setState({
            length: text.length,
        });
        this.props.onChangeText(text);
    };

    render() {
        return <View>
            <TextInput
                onChangeText={this._onChangeText}
                maxLength={300}
                multiline={true}
                placeholder={this.props.placeholder}
                style={{
                    height: 80,
                    backgroundColor: '#e8e8e8',
                    marginTop: 10,
                    fontSize: 13,
                    paddingHorizontal: 5,
                    borderRadius: 5,
                }}
            />
            <View style={{
                position: 'absolute',
                right: 5,
                bottom: 0,
            }}>
                <Text style={{color: 'rgba(0,0,0,0.5)'}}>{this.state.length}/300</Text>
            </View>
        </View>;
    }
}

export default HomePage;
