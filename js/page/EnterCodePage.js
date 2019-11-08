/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, TextInput, Dimensions, TouchableOpacity, Keyboard} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';

const {width, height} = Dimensions.get('window');

class EnterCodePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {};
    phone = '';

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        // const {phone} = this.state;

        let statusBar = {
            hidden: false,
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '', null);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <Text style={{
                        marginTop: 40,
                        marginLeft: 40,
                        fontSize: 20,
                    }}>输入验证码</Text>
                    <Text style={{
                        marginLeft: 40,
                        fontSize: 12,
                        marginTop: 10,
                        opacity: 0.6,
                    }}>验证码已经发送至88888888888</Text>
                    <CodeInput/>
                    <TouchableOpacity style={{
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        marginTop: 20,
                        paddingHorizontal: 40,
                    }}>
                        <Text style={{color: bottomTheme, fontSize: 13}}>重新发送</Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaViewPlus>
        );
    }

    _goBackClick = () => {
        NavigationUtils.goBack(this.props.navigation);
    };
}

class CodeInput extends PureComponent {
    codeText = '';
    static defaultProps = {
        iptNum: 4,

    };

    constructor(props) {
        super(props);
        this.iptArrayNum = new Array(props.iptNum);


    }

    componentDidMount() {


    }

    getCodeIpt = (index) => {

        console.log('我被触发1');
        return <View style={{
            width: 50,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#e8e8e8',
            marginHorizontal: 5,
        }}>
            <TextInput
                value={this.iptArrayNum[index]}
                keyboardType={'number-pad'}
                autoFocus={index == 0 ? true : false}
                onKeyPress={({nativeEvent}) => {
                    if (index == 0) {
                        return;
                    }
                    if (nativeEvent.key === 'Backspace') {
                        this.refs[`text${index - 1}`].focus();
                        this.iptArrayNum[index - 1] = '';
                        if (index == this.props.iptNum - 1) {
                            this.iptArrayNum[index] = '';
                        }
                    }
                    this.forceUpdate();
                }}
                onChangeText={(text) => {
                    if (text.length > 0) {
                        // const iptArray = this.state.iptArray;
                        this.iptArrayNum[index] = text;
                        if (index + 1 <= this.props.iptNum - 1) {//防止最后一个进行focus
                            this.refs[`text${index + 1}`].focus();
                        }
                        if (index + 1 == this.props.iptNum) {
                            alert(this.iptArrayNum.join(''));

                            this.forceUpdate();
                            // console.log(this.iptArrayNum);
                        }
                    }
                    this.forceUpdate();
                }}
                ref={`text${index}`}
                maxLength={1}
                style={{
                    fontSize: 20,
                    marginLeft: 25,
                    width: 50,

                }}/>
        </View>;
    };

    render() {
        const {iptNum} = this.props;
        const iptArray = [];
        for (let i = 0; i < iptNum; i++) {
            iptArray.push(this.getCodeIpt(i));
        }
        return <View style={{
            marginTop: 40, justifyContent: 'space-between', alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 40,
        }}>
            {iptArray.map((item, index, arr) => {
                return item;
            })}
        </View>;
    }
}

export default EnterCodePage;
