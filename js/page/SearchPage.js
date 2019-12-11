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
import NavigationBar from '../common/NavigationBar';
import NavigationUtils from '../navigator/NavigationUtils';
import LabelBigComponent from '../common/LabelBigComponent';
import BackPressComponent from '../common/BackPressComponent';
import actions from '../action';
import {connect} from 'react-redux';
import {onAddSearchTitle} from '../action/search';
import FlatListCommonUtil from './SearchPage/FlatListCommonUtil';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const topIputHeight = (Platform.OS === 'ios') ? 30 : 30;

class SearchPage extends PureComponent {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {
        showFlatList: false,

    };

    componentDidMount() {
        this.backPress.componentDidMount();

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
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
        const {search, userinfo} = this.props;
        const {showFlatList} = this.state;
        return (<SafeAreaViewPlus
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
                    marginTop: 10,
                }}>

                    <SearchComponent
                        ref={ref => this.searchComponent = ref}
                        placeholder={'任务标题、任务ID、用户名'}
                        height={topIputHeight}
                        onFocus={null}
                        onSubmitEditing={this.onSubmitEditing}
                        clearInput={()=>{
                            this.setState({
                                showFlatList:false
                            })
                        }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._cancelPress}
                    >
                        <Text style={{
                            marginLeft: 10,
                            // opacity: 0.8,
                            fontWeight: '200',
                        }}>取消</Text>
                    </TouchableOpacity>
                </View>
                {showFlatList ?
                    <FlatListCommonUtil token={this.props.userinfo.token} ref={ref => this.flatList = ref}/> :
                    <ScrollView>
                        {/*<SearchColumn labelArray={search.searchArr} title={'热门搜索'}/>*/}
                        <SearchColumn labelArray={search.searchArr} title={'搜索历史'}/>
                    </ScrollView>}


            </SafeAreaViewPlus>
        );
    }

    onSubmitEditing = () => {
        const {onAddSearchTitle} = this.props;
        const searchContent = this.searchComponent.getValue();
        if (searchContent.length > 0) {
            onAddSearchTitle(searchContent);//加入搜索本地的历史记录
            this.setState({
                showFlatList: true,
            }, () => {
                this.flatList.setSearchContent(searchContent);
                this.flatList._updateList(true);

            });
        }
    };
    _cancelPress = () => {
        NavigationUtils.goBack(this.props.navigation);
    };

}

class SearchColumn extends PureComponent {

    static defaultProps = {
        title: '热门搜索',
        labelArray: [],
    };

    render() {
        const {title, labelArray} = this.props;

        return <View style={{marginLeft: 15, marginTop: 20}}>
            <Text style={{
                fontSize: 12,
                opacity: 0.8,
                fontWeight: '200',
            }}>{title}</Text>
            <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
                {labelArray.map((item, index, arr) => {
                    return <LabelBigComponent
                        key={index}
                        paddingHorizontal={10}
                        title={item.title}
                        fontSize={12}
                        paddingVertical={4}
                        marginRight={10}
                        marginTop={10}
                    />;
                })}
            </View>

        </View>;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
    search: state.search,
});
const mapDispatchToProps = dispatch => ({
    onAddSearchTitle: (title, callback) => dispatch(actions.onAddSearchTitle(title, callback)),
});
const SearchPageRedux = connect(mapStateToProps, mapDispatchToProps)(SearchPage);

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
export default SearchPageRedux;
