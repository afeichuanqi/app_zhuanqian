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
import {order_rule, release_rule,user_agreement} from '../../res/text/rule';
import BackPressComponent from '../../common/BackPressComponent';
import NavigationUtils from '../../navigator/NavigationUtils';
import {getAppSoftText} from '../../util/AppService';


class UserProtocol extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            html: this.params.type === 1 ? release_rule : this.params.type === 2 ? order_rule : this.params.type === 3 ? user_agreement : '',
        };
    }


    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        this.backPress.componentDidMount();
        getAppSoftText({ziduan: this.params.type === 1 ? 'release_rule' : this.params.type === 2 ? 'order_rule' : this.params.type === 3 ? 'user_agreement' : ''}).then(result => {
            if (result) {
                this.setState({
                    html: result[this.params.type === 1 ? 'release_rule' : this.params.type === 2 ? 'order_rule' : this.params.type === 3 ? 'user_agreement' : ''],
                });
            }

        });

    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }


    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
            barStyle: 'dark-content',
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        const {html} = this.state;

        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, this.params.type === 1 ? '《简单赚发单规则》' : this.params.type === 2 ? '《简单赚接单规则》' : this.params.type === 3 ? '用户协议' : '', null, theme, 'black', 16, null, false);
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
                    // flexDirection:,
                }}>
                    <Text style={{
                        fontSize: 15,
                        marginVertical: 10,
                        fontWeight: 'bold',
                    }}>{this.params.type === 1 ? '发单规则如下' : this.params.type === 2 ? '接单规则如下' : this.params.type === 3 ? '用户协议' : ''}</Text>
                    <HTML onLinkPress={this.onLinkPress}
                          imagesMaxWidth={Dimensions.get('window').width / 1.2}
                          html={html}
                    />

                </ScrollView>
            </SafeAreaViewPlus>
        );
    }

}

export default UserProtocol;
