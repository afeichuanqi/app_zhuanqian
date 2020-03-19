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
    TouchableOpacity, ScrollView, StatusBar, Image,
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
import FlatListCommonUtil from './SearchPage/FlatListCommonUtil';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Toast from 'react-native-root-toast';
import Global from '../common/Global';

const width = Dimensions.get('window').width;
const topIputHeight = hp(5);

class SearchPage extends PureComponent {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {
        showFlatList: false,

    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
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
                        clearInput={() => {
                            this.setState({
                                showFlatList: false,
                            });
                        }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._cancelPress}
                    >
                        <Text style={{
                            marginLeft: 10,
                            opacity: 0.8,
                            fontSize: hp(1.9),
                        }}>取消</Text>
                    </TouchableOpacity>
                </View>
                {/*<Text style={{width:300, fontSize:15}}>*/}
                {/*    <View style={{ backgroundColor:'red',width:60,height:30}}>*/}
                {/*        <Text style={{color:'blue', fontSize:15}}>啊</Text>*/}
                {/*    </View>*/}
                {/*    <Text style={{color:'red', fontSize:15}}>ss撒啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊sss</Text>*/}
                {/*</Text>*/}
                {showFlatList ?
                    <FlatListCommonUtil token={this.props.userinfo.token} ref={ref => this.flatList = ref}/> :
                    <ScrollView>

                        {((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) && <SearchColumn
                            onDelAllSearchLog={this.props.onDelAllSearchLog}
                            startSearch={this.SearchColumnStartSearch}
                            showDel={false}
                            labelArray={[
                                {title: '网络兼职'},
                                {title: '学生寒假工'},
                                {title: '手机'},
                                {title: '手机工作'},
                                {title: '手机单'},
                            ]}
                            title={'热门搜索'}/>}
                        <SearchColumn
                            onDelAllSearchLog={this.props.onDelAllSearchLog}
                            startSearch={this.SearchColumnStartSearch} labelArray={search.searchArr}
                            title={'搜索历史'}/>

                    </ScrollView>}



            </SafeAreaViewPlus>
        );
    }

    SearchColumnStartSearch = (searchContent) => {
        this.searchComponent.setValue(searchContent);
        this.startSearch(searchContent);
    };
    onSubmitEditing = () => {
        const searchContent = this.searchComponent.getValue();
        this.startSearch(searchContent);
    };
    startSearch = (searchContent) => {
        const {onAddSearchTitle} = this.props;
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
        showDel: true,
    };
    _startSearch = (title) => {
        this.props.startSearch(title);
    };

    render() {
        const {title, labelArray} = this.props;

        return <View style={{paddingHorizontal: 15, marginTop: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{
                    fontSize: hp(2),
                    opacity: 0.8,
                    fontWeight: '200',
                }}>{title}</Text>
                {(labelArray.length > 0 && this.props.showDel) ? <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        this.props.onDelAllSearchLog();
                        Toast.show('清空成功');
                    }}

                >
                    <Image
                        resizeMode={'stretch'}
                        style={{height: hp(1.7), width: hp(1.7)}}
                        source={require('../res/img/searchPage/seach_delete.png')}
                    />

                </TouchableOpacity> : <View/>}


            </View>

            <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
                {labelArray.map((item, index, arr) => {
                    return <LabelBigComponent
                        key={index}
                        onClick={this._startSearch}
                        paddingHorizontal={10}
                        title={item.title}
                        fontSize={hp(1.7)}
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
    onDelAllSearchLog: () => dispatch(actions.onDelAllSearchLog()),
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
