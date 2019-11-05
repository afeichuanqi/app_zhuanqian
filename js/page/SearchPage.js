/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet, Platform,
    TouchableOpacity, ScrollView,
} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import SearchComponent from '../common/SearchComponent';
import Animated from 'react-native-reanimated';
import NavigationBar from '../common/NavigationBar';
import NavigationUtils from '../navigator/NavigationUtils';
import LabelBigComponent from '../common/LabelBigComponent';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const topIputHeight = (Platform.OS === 'ios') ? 30 : 30;

class SearchPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {};

    componentDidMount() {


    }

    position = new Animated.Value(0);
    topBarTop = new Animated.Value(0);

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        let statusBar = {
            hidden: false,
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {/*顶部搜索栏样式*/}
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#e8e8e8',
                }}>

                    <SearchComponent
                        placeholder={'搜索任务ID1'}
                        height={topIputHeight}
                        onFocus={this.SearchOnFocus}
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._cancelPress}
                    >
                        <Text style={{
                            marginLeft: 10,
                            // opacity: 0.8,
                            fontWeight: '100',
                        }}>取消</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <SearchColumn title={'热门搜索'}/>
                    <SearchColumn title={'搜索历史'}/>
                </ScrollView>

            </SafeAreaViewPlus>
        );
    }

    _cancelPress = () => {
        NavigationUtils.goBack(this.props.navigation);
    };

}

class SearchColumn extends PureComponent {
    static defaultProps = {
        title: '热门搜索',
        labelArray: [
            {id: 1, title: '学生'},
            {id: 2, title: '服务员'},
            {id: 3, title: 'test2'},
            {id: 2, title: '服务员'},
            {id: 3, title: 'test2'},
            {id: 2, title: '服务员'},
            {id: 3, title: 'test2'},
            {id: 2, title: '服务员'},
            {id: 3, title: 'test2'},
            {id: 2, title: '服务员'},
            {id: 3, title: 'test2'},
        ],
    };

    render() {
        const {title, labelArray} = this.props;

        return <View style={{marginLeft: 10, marginTop: 20}}>
            <Text style={{
                fontSize: 12,
                opacity: 0.8,
                fontWeight: '100',
            }}>{title}</Text>
            <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
                {labelArray.map((item, index, arr) => {
                    return <LabelBigComponent
                        paddingHorizontal={10}
                        title={item.title}
                        fontSize={11}
                        paddingVertical={3}
                        marginRight={10}
                        marginTop={10}
                    />;
                })}
            </View>

        </View>;
    }
}

const styles = StyleSheet.create({
    carousel: {
        flex: 1,
        // justifyContent:'center'
    },
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: width,
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
export default SearchPage;
