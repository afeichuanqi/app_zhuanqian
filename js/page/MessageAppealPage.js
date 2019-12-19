/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    RefreshControl,
    FlatList,
    StatusBar, TextInput, ActivityIndicator,
} from 'react-native';
import {theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import Animated from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import ViewUtil from '../util/ViewUtil';
import jiaoliu from '../res/svg/jiaoliu.svg';
import BackPressComponent from '../common/BackPressComponent';
import {getUserAppealFriendList} from '../util/AppService';
import EventBus from '../common/EventBus';
import MessageItemComponent from './MessagePage/MessageItemComponent';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


class MessageAppealPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.task_id = this.params.task_id || 0;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        this.timer && clearInterval(this.timer);

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    render() {
        console.log(this.params.keyword, 'this.params.keyword');

        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            // showStatusBarHeight={true}
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        const {type} = this.params;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, type == 2 ? '申诉消息' : type == 3 ? '投诉消息' : type == 4 ? '聊天消息' : '', jiaoliu, null, null, null, () => {

        }, false);


        return (
            <View style={{flex: 1}}>
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <View style={{width: width, height: 30, paddingHorizontal: 10}}>

                        <TextPro
                            value={this.task_id}
                            onSubmitEditing={this.onSubmitEditing}
                        />
                    </View>
                    <MsgList ref={ref => this.myList = ref}
                             task_id={this.task_id}
                             type={type}
                             userinfo={this.props.userinfo}
                             keyword={this.params.keyword}
                    />
                </View>

            </View>
        );
    }

    onSubmitEditing = (content) => {
        this.myList.setKeyWord(content);
    };
    animations = {
        val: new Animated.Value(1),
    };
}

class TextPro extends Component {
    state = {
        content: this.props.value,
    };

    render() {
        const {content} = this.state;

        return <TextInput
            placeholder={'请输入任务ID、用户ID、用户名 '}
            returnKeyType={'search'}
            style={{
                padding: 0,
                // borderWidth:0.3,
                // borderColor:'rgba(0,0,0,0.5)',
                height: 25,
                backgroundColor: '#f2f2f2',
                borderRadius: 3,
                paddingLeft: 5,
            }}
            value={content}
            onChangeText={(text) => {
                this.setState({
                    content: text,
                });
            }}
            onBlur={() => {
                this.props.onSubmitEditing(this.state.content);
            }}
            // onSubmitEditing={() => {
            //     this.props.onSubmitEditing(this.state.content);
            // }}
        />;
    }
}


class MsgList extends Component {
    state = {
        friendData: [],
        isLoading: false,
        hideLoaded: true,
    };
    setKeyWord = (setKeyWord, update = true) => {
        this.page.keyWord = setKeyWord;
        if (update) {
            const {type, userinfo} = this.props;
            getUserAppealFriendList({
                columnType: type,
                pageIndex: this.page.pageIndex,
                keyword: this.page.keyWord,
            }, userinfo.token).then(result => {
                this.setState({
                    friendData: result,
                    hideLoaded: result.length >= 20 ? false : true,
                });
            });
        }
        // this.updatePage(true);
    };

    constructor(props) {
        super(props);
        this.page = {pageIndex: 20, keyWord: this.props.keyword};
        console.log(this.page);
    }

    componentDidMount(): void {
        EventBus.getInstance().addListener(`update_message_appeal_${this.props.type}_page`, this.listener = data => {
            const {type, userinfo} = this.props;
            getUserAppealFriendList({
                columnType: type,
                pageIndex: this.page.pageIndex,
                keyword: this.page.keyWord,
            }, userinfo.token).then(result => {
                this.setState({
                    friendData: result,
                    hideLoaded: result.length >= 20 ? false : true,
                });
            });
        });
        this.updatePage(true);
    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
    }

    render() {
        // const friendData = this.props.friend.friendArr;

        const {isLoading, hideLoaded, friendData} = this.state;
        return <FlatList
            ListEmptyComponent={<EmptyComponent height={height - 100}/>}

            style={{
                flex: 1,

            }}
            ref={ref => this.flatList = ref}
            data={friendData}
            scrollEventThrottle={1}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={this.onRefresh}
                />
            }

            // windowSize={300}
            onEndReachedThreshold={0.01}
            onMomentumScrollBegin={() => {
                this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
            }}
            ListFooterComponent={() => this.genIndicator(hideLoaded)}
            onEndReached={() => {
                setTimeout(() => {
                    // 等待页面布局完成以后，在让加载更多
                    if (this.canLoadMore && friendData.length >= 20) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }, 100);
            }}
        />;
    }

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.page.pageIndex < 40 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: 13}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    onLoading = () => {
        this.updatePage(false);
    };

    onRefresh = () => {
        this.updatePage(true);
    };
    updatePage = (refreshing) => {
        const {userinfo, type} = this.props;
        if (refreshing) {
            this.page = {pageIndex: 20, keyWord: this.props.keyword};
            this.setState({
                isLoading: true,
            });
        } else {
            this.page = {pageIndex: this.page.pageIndex + 20};
        }


        getUserAppealFriendList({
            columnType: type,
            pageIndex: this.page.pageIndex,
            keyword: this.page.keyWord,
        }, userinfo.token).then(result => {
            // console.log(result, 'result\'');
            this.setState({
                friendData: result,
                isLoading: false,
                hideLoaded: result.length >= 20 ? false : true,
            });
        }).catch(err => {
            this.setState({
                isLoading: false,
                hideLoaded: true,
            });
        });

    };
    _renderIndexPath = ({item, index}) => {
        return <MessageItemComponent token={this.props.userinfo.token}
                                     key={item.FriendId} item={item}/>;


    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
const MessagePageRedux = connect(mapStateToProps, mapDispatchToProps)(MessageAppealPage);


export default MessagePageRedux;
