/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text, ScrollView, Dimensions} from 'react-native';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../../appSet';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from '../../util/ViewUtil';
import HTML from 'react-native-render-html';
import {order_rule, release_rule} from '../../res/text/rule';

const {width} = Dimensions.get('window');

class UserProtocol extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    state = {};

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    _goBackClick = () => {
        this.props.navigation.goBack();
    };

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, this.params.type === 1 ? '《简单赚发单规则》' : '《简单赚接单规则》', null, theme, 'black', 16);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                <View>
                    {TopColumn}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                        style={{position: 'absolute', top: 15, right: 10}}>
                        <Text style={{color: bottomTheme}}>关闭</Text>
                    </TouchableOpacity>
                </View>


                <ScrollView style={{
                    paddingHorizontal: 10,
                    color: '#303030',
                }}>
                    <Text style={{
                        fontSize: 15,
                        marginVertical: 10,
                        fontWeight: 'bold',
                    }}>{this.params.type === 1 ? '发单规则如下' : '接单规则如下'}</Text>
                    <HTML onLinkPress={this.onLinkPress}
                          imagesMaxWidth={Dimensions.get('window').width / 1.2}
                          html={this.params.type === 1 ? release_rule : order_rule}
                    />

                </ScrollView>
            </SafeAreaViewPlus>
        );
    }

}

export default UserProtocol;
