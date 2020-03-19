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
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Global from '../../common/Global';
import {_handleTypeTitle} from '../../util/CommonUtils';
import FastImage from 'react-native-fast-image';

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
        EventBus.getInstance().addListener(EventTypes.change_for_apple, this.listener1 = data => {
            this.updateBestNewList();
        });
    }

    updateBestNewList = () => {
        getBestNewTask({platform: Platform.OS, androidV: Global.android_pay, iosV: Global.apple_pay}).then(data => {
            this.setState({
                bestNewData: data,
            });
        });
    };

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
        EventBus.getInstance().removeListener(this.listener1);
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
            inputRange: [-hp(100), 0, hp(30)],
            outputRange: [hp(133), hp(33), hp(3.2)],
            extrapolate: 'clamp',
        });
        return <Animated.View style={{
            transform: [{translateY: this.props.translateY}],
        }}>
            <View style={{height: hp(2.5)}}/>
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
                    <View style={{height: hp(32), backgroundColor: 'white', zIndex: 10, marginBottom: hp(3)}}>
                        <View style={{marginTop: hp(3), paddingLeft: 15}}>
                            <Text style={{fontSize: hp(2.4), opacity: 0.9, color: 'black'}}>最新发布</Text>
                        </View>
                        <View style={{paddingHorizontal: 10, marginTop: hp(1.5)}}>
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
                width,
                height: hp(5.5),
                position: 'absolute',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: [{translateY: columnTop}],
                alignItems: 'flex-start',
                paddingLeft: 20,
                // top: -4,
            }}>
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row', top: hp(1), justifyContent: 'center',
                }}>
                    <Image
                        resizeMode={'stretch'}
                        style={{
                            height: hp(1.8),
                            width: hp(1.5),

                        }}
                        source={require('../../res/img/indexPage/bestNew.png')}
                    />
                    <Text
                        style={{
                            fontSize: hp(2.1),
                            color: bottomTheme,
                            marginLeft: 4,
                        }}>最近刷新</Text>
                </View>

            </Animated.View>
        </Animated.View>;
    }

    _renderBestNewItem = ({item, index}) => {
        if ((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) {
            return <ScrollItemTmp item={item}/>;
        }
        return <ScrollItem item={item}/>;
    };
}

class ScrollItemTmp extends React.Component {
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
                <FastImage
                    style={{
                        height: 100,
                    }}
                    source={require('../../res/img/indexPage/zhiwei1.png')}
                />

            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <Text numberOfLines={1}
                      style={{fontSize: hp(2), color: 'black', opacity: 0.8}}>{_handleTypeTitle(item.title)}</Text>
                <View style={{
                    width: 2,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: 'black',
                    marginHorizontal: 3,
                    opacity: 0.7,
                }}/>
                <Text numberOfLines={1}
                      style={{fontSize: hp(2), color: 'black', width: 65, opacity: 0.8}}>{item.task_name}</Text>
            </View>
            {item.reward_price && <View style={{
                flexDirection: 'row', alignItems: 'center',
                elevation: 1, marginTop: 3,
            }}>
                <Image resizeMode={'stretch'} source={require('../../res/img/moneys.png')}
                       style={{width: hp(1.8), marginRight: 5, height: hp(2.1)}}/>
                <Text style={{
                    fontSize: hp(2.5),
                    color: 'red',
                    marginRight: 1,

                }}>{item.reward_price}</Text>
                <Text style={{
                    fontSize: hp(1.7),
                    color: 'red',
                    fontWeight: '500',
                    top: 1,
                    marginLeft: 1,

                }}>元/天</Text>
            </View>}


        </TouchableOpacity>;
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
                <View style={{width: hp(23), height: hp(17), marginRight: 10, borderRadius: 5}}/>
                <View style={{height: 15, width: hp(23), marginTop: 5}}/>
                <View style={{height: 20, width: 50, marginTop: 2}}/>
            </SkeletonPlaceholder>;
        }
        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({task_id: item.id, test: false}, 'TaskDetails');
            }}
            key={item.id}
            style={{height:  hp(23), width: hp(24), paddingHorizontal: 5, overflow:'hidden'}}>
            <View style={{width: hp(23)}}>
                <FastImage
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        height: hp(16),
                        borderRadius: hp(1),
                        width:hp(23),
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                    source={{uri: item.task_uri}}
                />

                <Image source={require('../../res/img/yanzhengbiaozhu/zuixin.png')}
                       style={{
                           position: 'absolute', right: 0, top: 0, width: 35, height: 15,
                           borderTopRightRadius: 5,
                       }}/>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
                <Text numberOfLines={1} style={{fontSize: hp(2), color: 'black', opacity: 0.8}}>{item.title}</Text>
                <View style={{
                    width: 2,
                    height: 2,
                    borderRadius:  hp(1),
                    backgroundColor: 'black',
                    marginHorizontal: 3,
                    opacity: 0.7,
                }}/>
                <Text numberOfLines={1}
                      style={{fontSize: hp(2.1), color: 'black', width: 65, opacity: 0.8}}>{item.task_name}</Text>
            </View>
            {item.reward_price && <View style={{
                flexDirection: 'row', alignItems: 'center',
                elevation: 1, marginTop: 3,
            }}>
                <Image resizeMode={'stretch'} source={require('../../res/img/moneys.png')}
                       style={{width: hp(1.5), marginRight: 5, height: hp(1.9)}}/>
                <Text style={{
                    fontSize: hp(2.1),
                    color: 'red',
                    marginRight: 1,

                }}>{item.reward_price}</Text>
                <Text style={{
                    fontSize: hp(1.5),
                    color: 'red',
                    fontWeight: '500',
                    top: 1,
                    marginLeft: 1,

                }}>元</Text>
            </View>}


        </TouchableOpacity>;
    }
}

export default SecondListComponent;

