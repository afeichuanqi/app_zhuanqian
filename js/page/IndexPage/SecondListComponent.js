import React, {PureComponent} from 'react';
import {Dimensions, Platform, StyleSheet, Text, TouchableOpacity, FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import FlatListCommonUtil from './FlatListCommonUtil';
import {bottomTheme, theme} from '../../appSet';
import {getBestNewTask} from '../../util/AppService';
import NavigationUtils from '../../navigator/NavigationUtils';
import EventBus from '../../common/EventBus';
import EventTypes from '../../util/EventTypes';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const lunboHeight = 220;

class SecondListComponent extends PureComponent {
    state = {
        bestNewData: [{}, {}, {}, {}],
    };

    componentDidMount(): void {

        getBestNewTask().then(data => {
            console.log(data);
            this.setState({
                bestNewData: data,
            });
        });
        //跳转到顶部处理事件
        EventBus.getInstance().addListener(EventTypes.scroll_top_for_page, this.listener = data => {
            const {pageName} = data;
            if (pageName == `IndexPage_1`) {
                this.flatList.scrollToTop_();
                this.props.showAnimated(false);
            }
        });
    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
    }

    _renderBestNewItem = ({item, index}) => {
        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({task_id: item.id, test: false}, 'TaskDetails');
            }}
            key={item.id}
            style={{height: 120, width: 120, marginRight: 10}}>
            <FastImage
                style={[styles.imgStyle]}
                source={{uri: item.task_uri}}
                resizeMode={FastImage.resizeMode.stretch}
            />
            <View style={{
                backgroundColor: 'rgba(0,0,0,0.1)', position: 'absolute', top: 0, right: 0,
                width: 120, height: 120,
            }}>
                <View style={{position: 'absolute', right: 5, top: 5}}>
                    <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold'}}>¥{item.reward_price}</Text>
                </View>
                {/*<View style={{position:'absolute',right:5, bottom:10,}}>*/}
                {/*    <Text style={{color: 'white', fontSize: 12,fontWeight:'bold'}}>*/}
                {/*        {item.title}|{item.task_name}*/}
                {/*    </Text>*/}
                {/*</View>*/}
                <View style={{position: 'absolute', left: 5, bottom: 10}}>
                    <Text style={{color: 'white', fontSize: 13, width: 120}}>
                        {item.task_title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>;
    };
    scrollY = new Animated.Value(0);

    _onScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const {showAnimated} = this.props;
        if (Platform.OS === 'android') {

            if ((this.nowY <= 0 || y <= 0) && this.AnimatedIsshow) {
                showAnimated(false);
            }
            if (y < this.nowY) {
                showAnimated(false);
            }
            if (y > this.nowY) {
                showAnimated(true);
            }
        } else {
            if (y > this.nowY && y > 0) {
                showAnimated(true);
            }
            //
            if (y < this.nowY) {
                showAnimated(false);
            }
        }
        this.nowY = y;
    };

    render() {

        const columnTop = Animated.interpolate(this.scrollY, {
            inputRange: [-220, 0, 185],
            outputRange: [lunboHeight + 200, lunboHeight - 15, 20],
            extrapolate: 'clamp',
        });
        return <Animated.View style={{
            // zIndex: -100,
            // elevation: -100,
            // overflow: 'hidden',
            transform: [{translateY: this.props.translateY}],
        }}>
            <View style={{height: 30}}/>
            <FlatListCommonUtil
                ref={ref => this.flatList = ref}
                type={2}
                style={{zIndex: -100, elevation: -100}}
                onLoading={(load) => {
                    this.props.onLoad(load);
                }}
                ListHeaderComponent={
                    <View style={{height: 220}}>
                        <View style={{marginTop: 20, paddingLeft: 10}}>
                            <Text style={{fontSize: 17, opacity: 0.9}}>最新发布</Text>
                        </View>
                        <View style={{paddingHorizontal: 10, marginTop: 10}}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.bestNewData}
                                renderItem={data => this._renderBestNewItem(data)}
                            />
                        </View>
                    </View>
                }
                onScrollBeginDrag={this._onScroll}
                onScrollEndDrag={this._onScroll}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {y: this.scrollY},
                        },
                    },
                ])}
            />

            <Animated.View style={{
                width, height: 40, justifyContent: 'space-between', position: 'absolute',
                backgroundColor: 'white', transform: [{translateY: columnTop}],
            }}>
                <Text
                    style={{
                        fontSize: 12,
                        color: bottomTheme,
                        position: 'absolute',
                        left: 15,
                        top: 16,

                    }}>最近刷新</Text>

                <View style={{
                    width: 50,
                    backgroundColor: bottomTheme,
                    height: 2,
                    position: 'absolute',
                    left: 15,
                    bottom: 3,
                }}/>
            </Animated.View>
        </Animated.View>;
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
        width: 120,
        height: 120,
        borderRadius: 10,
        // 设置高度
        // height:150
    },
});
export default SecondListComponent;

