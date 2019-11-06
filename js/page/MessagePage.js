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
    TouchableOpacity,
    RefreshControl,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {bottomTheme, theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import SvgUri from 'react-native-svg-uri';
import message_xitong from '../res/svg/message_xitong.svg';
import message_nomsg from '../res/svg/message_nomsg.svg';
import zaixiankefu from '../res/svg/zaixiankefu.svg';
import FastImage from 'react-native-fast-image';
import Animated, {Easing} from 'react-native-reanimated';
import NavigationUtils from '../navigator/NavigationUtils';

const {timing} = Animated;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class MessagePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);

    }

    render() {
        let statusBar = {
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
            // barStyle: 'light-content',
            // hidden: false,
        };
        let navigationBar = <NavigationBar
            // showStatusBarHeight={true}
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        return (
            <View style={{flex: 1}}>
                {navigationBar}
                <View style={{
                    height: 40,
                    width,
                    backgroundColor: bottomTheme,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{color: 'white', fontSize: 17}}>互动</Text>
                </View>

                <MsgList/>
                {/*<View style={{flex:1, backgroundColor:'white',marginTop:50}}>*/}
                {/*    */}
                {/*</View>*/}

            </View>
        );
    }
}

class MessageColumn extends PureComponent {
    render() {
        return <View style={{
            width: width - 20,
            height: 100,
            backgroundColor: 'white',
            position: 'absolute',
            top: 0,
            borderRadius: 10,
            shadowColor: '#d9d9d9',
            shadowRadius: 5,
            shadowOpacity: 1,
            shadowOffset: {w: 1, h: 1},
            elevation: 10,//安卓的阴影
            flexDirection: 'row',
            justifyContent: 'space-around',
        }}>
            <MessageColumnItem svgXmlData={message_xitong} title={'系统通知'}/>
            <MessageColumnItem svgXmlData={zaixiankefu} title={'在线客服'} size={48}/>
            <MessageColumnItem/>
            <MessageColumnItem/>
        </View>;
    }
}

class MsgList extends Component {
    state = {
        friendData: [
            {id:1,name:'张三',message:'你好啊',date:'2010年5月6日'}
        ],
        isLoading: false,
        hideLoaded: true,
    };
    params = {
        pageIndex: 0,
    };

    render() {
        const {friendData, isLoading, hideLoaded} = this.state;

        return <FlatList
            ListEmptyComponent={<View style={{
                height: height - 220, justifyContent: 'center', alignItems: 'center',

            }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <SvgUri width={95} height={95} svgXmlData={message_nomsg}/>
                    <Text style={{marginTop: 10, color: 'black', opacity: 0.7}}>您还没有收到消息</Text>
                </View>
            </View>}
            ListHeaderComponent={
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        height: 35,
                        width,
                        backgroundColor: bottomTheme,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,

                    }}/>

                    <MessageColumn/>
                    <View style={{height: 70}}/>
                </View>

            }
            style={{
                flex: 1, backgroundColor: 'white',
            }}
            ref={ref => this.flatList = ref}
            data={friendData}
            scrollEventThrottle={1}
            renderItem={data => this._renderIndexPath(data)}
            keyExtractor={(item, index) => index + ''}
            refreshControl={
                <RefreshControl
                    // title={'更新任务中'}
                    refreshing={isLoading}
                    onRefresh={() => this.onRefresh()}
                />
            }
            onScroll={this._onScroll}
            ListFooterComponent={() => this.genIndicator(hideLoaded)}
            onEndReached={() => {
                console.log('onEndReached.....');
                // 等待页面布局完成以后，在让加载更多
                if (this.canLoadMore) {
                    this.onLoading();
                    this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                }
            }}
            // onScrollEndDrag={this._onScrollEndDrag}
            windowSize={300}
            onEndReachedThreshold={0.01}
            onMomentumScrollBegin={() => {
                console.log('我被触发');
                this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
            }}
        />;
    }

    onRefresh = () => {
        this.setState({
            isLoading: true,
        });
        // this.props.onRefresh(true);
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
            // this.props.onRefresh(false);
        }, 1000);
    };
    _renderIndexPath = ({item, index}) => {
        return <MessageItemComponent item={item}/>;
    };

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.params.pageIndex === 0 || !this.params.pageIndex ? null : <View
                style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10}}>没有更多了哦</Text>
            </View>;
    }

    onLoading = () => {
        console.log('onLoading触发中');
        this.setState({
            hideLoaded: false,
        });
        const data = [...this.state.friendData];
        // data.push([...data]);
        let tmpData = [];
        for (let i = 0; i < 10; i++) {
            console.log(i);
            tmpData.push({id: 10004, name: 'aluo', message: '你好啊'});
        }
        setTimeout(() => {
            this.setState({
                friendData: data.concat(tmpData),
            }, () => {
                // this
                // this.setState({
                //     hideLoaded: true,
                // });
            });
        }, 2000);

    };
}

const topBottomVal = 20;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

class MessageItemComponent extends Component {

    // shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    //     if (this.state.value !== nextState.value) {
    //         return true;
    //     }
    //     return false;
    // }

    static defaultProps = {
        titleFontSize: 16,
        marginHorizontal: 20,

    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    animations = {
        scale: new Animated.Value(1),
    };
    _onPressIn = () => {
        //隐藏box
        this._anim = timing(this.animations.scale, {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };
    _onPressOut = () => {
        //隐藏box
        this._anim = timing(this.animations.scale, {
            duration: 200,
            toValue: 1,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };
    _onPress = () => {
        NavigationUtils.goPage({}, 'ChatRoomPage');
    };

    render() {

        const scale = Animated.interpolate(this.animations.scale, {
            inputRange: [0, 1],
            outputRange: [0.9, 1],
            extrapolate: 'clamp',
        });
        const {titleFontSize, marginHorizontal, item} = this.props;

        return <AnimatedTouchableOpacity
            onPress={this._onPress}
            activeOpacity={1}
            style={{

                flexDirection: 'row',
                marginHorizontal: marginHorizontal,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                transform: [{scale}],
                // backgroundColor:'red',
            }}
            onPressIn={this._onPressIn}
            onPressOut={this._onPressOut}
        >
            <FastImage
                style={[styles.imgStyle]}
                source={{uri: `http://www.embeddedlinux.org.cn/uploads/allimg/180122/2222032V5-0.jpg`}}
                resizeMode={FastImage.stretch}
            />
            {/*左上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                left: 55,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text style={{
                    fontSize: titleFontSize,
                    color: 'black',
                    opacity: 0.9,
                }}>{item.name}</Text>
                <Text style={{marginLeft: 10, fontSize: 12, color: 'black', opacity: 0.5}}>互动消息</Text>

            </View>
            {/*左下*/}
            <View style={{
                position: 'absolute',
                bottom: topBottomVal,
                left: 55,
                flexDirection: 'row',
            }}>
                <Text style={{
                    fontSize: 14,
                    color: 'black',
                    opacity: 0.6,
                }}>{item.message}</Text>
            </View>
            {/*右上*/}
            <View style={{
                position: 'absolute',
                top: topBottomVal,
                right: 0,
            }}>
                <Text style={{
                    fontSize: 11,
                    color: 'black',
                    opacity: 0.5,
                }}>{item.date}</Text>
            </View>

        </AnimatedTouchableOpacity>;


    }


}

class MessageColumnItem extends PureComponent {
    static defaultProps = {
        svgXmlData: message_xitong,
        title: '系统通知',
        size: 45,
    };

    render() {
        const {svgXmlData, title, size} = this.props;

        return <TouchableOpacity
            activeOpacity={0.6}
            style={{width: 80, height: 100, justifyContent: 'center', alignItems: 'center'}}>
            <SvgUri style={{
                shadowColor: '#c7c7c7',
                shadowRadius: 5,
                shadowOpacity: 1,
                shadowOffset: {w: 1, h: 1},
                elevation: 10,//安卓的阴影
            }} width={size} height={size} svgXmlData={svgXmlData}/>
            <Text style={{
                fontSize: 12,
                color: 'black',
                opacity: 0.8,
                marginTop: 5,

            }}>{title}</Text>
        </TouchableOpacity>;
    }
}


export default MessagePage;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 50,
        height: 50,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
