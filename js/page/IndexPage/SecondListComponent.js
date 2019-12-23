import React, {PureComponent} from 'react';
import {Dimensions, Platform, Image, Text, TouchableOpacity, FlatList, View} from 'react-native';
import Animated from 'react-native-reanimated';
import FlatListCommonUtil from './FlatListCommonUtil';
import {bottomTheme} from '../../appSet';
import {getBestNewTask} from '../../util/AppService';
import NavigationUtils from '../../navigator/NavigationUtils';
import EventBus from '../../common/EventBus';
import EventTypes from '../../util/EventTypes';
// import FastImage from '../../common/FastImage';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from '../../common/SkeletonPlaceholder';
// import LinearGradient from 'react-native-linear-gradient';

const width = Dimensions.get('window').width;
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
        return <ScrollItem item={item}/>;
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
            inputRange: [-200, 0, 205],
            outputRange: [lunboHeight + 210, lunboHeight + 10, 25],
            extrapolate: 'clamp',
        });
        return <Animated.View style={{
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
                    <View style={{height: 250, backgroundColor: 'white'}}>
                        <View style={{marginTop: 20, paddingLeft: 10}}>
                            <Text style={{fontSize: 17, opacity: 0.9, color: 'black'}}>最新发布</Text>
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

class ScrollItem extends React.Component {
    state = {
        loadEnd: false,

    };

    render() {

        const {item} = this.props;

        if (!item.task_name) {
            return <SkeletonPlaceholder minOpacity={0.2}>
                <View style={{width: 140, height: 100, marginRight: 10}}/>
                <View style={{height: 15, width: 100, marginTop: 5}}/>
                <View style={{height: 20, width: 50, marginTop: 2}}/>
            </SkeletonPlaceholder>;
        }
        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({task_id: item.id, test: false}, 'TaskDetails');
            }}
            key={item.id}
            style={{height: 160, width: 150, paddingHorizontal: 5}}>
            <View style={{width: 140}}>
                <FastImage
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',

                        height: 100,
                        borderRadius: 5,
                    }}
                    // resizeMode={'stretch'}
                    source={{uri: item.task_uri}}
                />
                <Image source={require('../../res/img/zuixinfabu.png')}
                       style={{position: 'absolute', right: 0, top: 0, width: 40, height: 15}}/>
            </View>
            <View style={{ width: 140, flexDirection:'row', alignItems:'center', marginTop: 8}}>
                <Text numberOfLines={1} style={{fontSize: 12, color: 'black', opacity:0.7}}>{item.title}</Text>
                <View style={{width:3,height:3, borderRadius:3, backgroundColor:'black', marginHorizontal:2, opacity:0.7}}/>
                <Text numberOfLines={1} style={{fontSize: 12, color: 'black',width: 110, opacity:0.7}}>{item.task_name}</Text>
            </View>
            {item.reward_price && <View style={{
                flexDirection: 'row', height: 25, alignItems: 'center', marginTop: 2,
                zIndex: 10, elevation: 1,
            }}>
                <Text style={{
                    fontSize: 16,
                    color: 'red',
                    marginRight: 1,
                }}>{item.reward_price}</Text>
                <Text style={{
                    fontSize: 13,
                    color: 'red',
                    fontWeight: '500',
                    top: 1,
                }}>元</Text>
            </View>}


        </TouchableOpacity>;
    }
}

export default SecondListComponent;

