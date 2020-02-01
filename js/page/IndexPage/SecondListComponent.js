import React, {PureComponent} from 'react';
import {Dimensions, Platform, Image, Text, TouchableOpacity, FlatList, View} from 'react-native';
import Animated from 'react-native-reanimated';
import FlatListCommonUtil from './FlatListCommonUtil';
import {bottomTheme} from '../../appSet';
import {getBestNewTask} from '../../util/AppService';
import NavigationUtils from '../../navigator/NavigationUtils';
import EventBus from '../../common/EventBus';
import EventTypes from '../../util/EventTypes';
import SkeletonPlaceholder from '../../common/SkeletonPlaceholder';
import FastImagePro from '../../common/FastImagePro';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');
const lunboHeight = 220;

class SecondListComponent extends PureComponent {
    state = {
        bestNewData: [{}, {}, {}, {}],
    };

    componentDidMount(): void {
        this.updateBestNewList();

        //跳转到顶部处理事件
        EventBus.getInstance().addListener(EventTypes.scroll_top_for_page, this.listener = data => {
            const {pageName} = data;
            if (pageName == `IndexPage_1`) {
                this.flatList.scrollToTop_();
                this.props.showAnimated(false);
            }
        });
    }

    updateBestNewList = () => {
        getBestNewTask().then(data => {
            this.setState({
                bestNewData: data,
            });
        });
    };

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
    }


    scrollY = new Animated.Value(0);

    _onScroll = (event) => {
        const items = this.flatList.getItemLength();
        if (items < 3) {
            return;
        }
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
    onMomentumScrollEnd = (e) => {
        if (Platform.OS === 'ios') {
            this.nowY = e.nativeEvent.contentOffset.y;
        }

    };

    render() {
        const columnTop = Animated.interpolate(this.scrollY, {
            inputRange: [-220, 0, lunboHeight - 30],
            outputRange: [lunboHeight + 220 + 3, lunboHeight + 3, 30 + 0],
            extrapolate: 'clamp',
        });
        return <Animated.View style={{
            transform: [{translateY: this.props.translateY}],
        }}>
            <View style={{height: 30}}/>
            <FlatListCommonUtil
                EmptyHeight={height - 350}
                ref={ref => this.flatList = ref}
                type={2}
                style={{zIndex: -100, elevation: -100}}
                onLoading={(load) => {
                    this.props.onLoad(load);
                }}
                onRefresh={this.updateBestNewList}
                ListHeaderComponent={
                    <View style={{height: 235, backgroundColor: 'white', zIndex: 10}}>
                        <View style={{marginTop: 15, paddingLeft: 15}}>
                            <Text style={{fontSize: hp(2.5), opacity: 0.9, color: 'black'}}>最新发布</Text>
                        </View>
                        <View style={{paddingHorizontal: 10, marginTop: 10}}>
                            <FlatList
                                keyExtractor={(item, index) => index + ''}
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
                onMomentumScrollEnd={this.onMomentumScrollEnd}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {y: this.scrollY},
                        },
                    },
                ])}
            />

            <Animated.View style={{
                width, height: 40, position: 'absolute', justifyContent: 'center',
                backgroundColor: 'white', transform: [{translateY: columnTop}], alignItems: 'flex-start',
                marginLeft: 10,

            }}>
                <View style={{
                    alignItems: 'center',
                    paddingHorizontal: 5, paddingVertical: 4,

                }}>
                    <Text
                        style={{
                            fontSize: hp(2.15),
                            color: bottomTheme,
                        }}>最近刷新</Text>
                    <View style={{width:60,height:2, backgroundColor:bottomTheme,top:5, borderRadius:5}}/>
                </View>

            </Animated.View>
        </Animated.View>;
    }

    _renderBestNewItem = ({item, index}) => {
        return <ScrollItem item={item}/>;
    };
}

class ScrollItem extends React.Component {
    state = {
        loadEnd: false,

    };

    render() {

        const {item} = this.props;

        if (!item.task_name) {
            return <SkeletonPlaceholder minOpacity={0.2}>
                <View style={{width: 140, height: 100, marginRight: 10, borderRadius: 5}}/>
                <View style={{height: 15, width: 100, marginTop: 5}}/>
                <View style={{height: 20, width: 50, marginTop: 2}}/>
            </SkeletonPlaceholder>;
        }
        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({task_id: item.id, test: false}, 'TaskDetails');
            }}
            key={item.id}
            style={{height: 160, width: 140, paddingHorizontal: 5}}>
            <View style={{width: 130}}>
                <FastImagePro
                    loadingType={1}
                    loadingWidth={130}
                    loadingHeight={100}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        height: 100,
                        borderRadius: 5,
                    }}
                    // resizeMode={'stretch'}
                    source={{uri: item.task_uri}}
                />
                <Image source={require('../../res/img/yanzhengbiaozhu/zuixin.png')}
                       style={{
                           position: 'absolute', right: 0, top: 0, width: 35, height: 15,
                           borderTopRightRadius: 5,
                       }}/>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
                <Text numberOfLines={1} style={{fontSize: wp(3.3), color: 'black', opacity: 0.7}}>{item.title}</Text>
                <View style={{
                    width: 2,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: 'black',
                    marginHorizontal: 3,
                    opacity: 0.7,
                }}/>
                <Text numberOfLines={1}
                      style={{fontSize: hp(1.9), color: 'black', width: 65, opacity: 0.7}}>{item.task_name}</Text>
            </View>
            {item.reward_price && <View style={{
                flexDirection: 'row', alignItems: 'center',
                elevation: 1, marginTop: 1,
            }}>
                <Text style={{
                    fontSize: hp(2.2),
                    color: 'red',
                    marginRight: 1,

                }}>{item.reward_price}</Text>
                <Text style={{
                    fontSize: hp(1.7),
                    color: 'red',
                    fontWeight: '500',
                    top: 1,

                }}>元</Text>
            </View>}


        </TouchableOpacity>;
    }
}

export default SecondListComponent;

