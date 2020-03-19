import React, {PureComponent} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ViewUtil from '../../util/ViewUtil';
import {bottomTheme} from '../../appSet';
import NavigationUtils from '../../navigator/NavigationUtils';
import FastImage from 'react-native-fast-image';
import {renderEmoji} from '../../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, {Easing} from 'react-native-reanimated';

const {timing} = Animated;
const {width} = Dimensions.get('window');
export default class TaskReleaseItem extends PureComponent {
    animations = {
        scale: new Animated.Value(1),
    };
    state = {
        hide: false,
    };

    render() {
        const {item} = this.props;
        const {hide} = this.state;
        if (hide) {
            return null;
        }
        return <Animated.View style={{
            borderBottomWidth: 0.3,
            borderBottomColor: 'rgba(0,0,0,0.1)',
            // transform: [{scale: this.animations.scale}],
            opacity:this.animations.scale,
        }}>


            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.props.onPress}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingTop: hp(3),
                    height:  hp(12),
                    backgroundColor: 'white',
                }}
            >
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: item.task_uri}}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{
                    height:hp(7),
                    width: wp(85),
                    paddingLeft: 15,
                    paddingRight: 5,
                    justifyContent: 'space-between',
                    // alignSelf:'center',

                    // paddingVertical:1,

                }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {/*标题*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp(50),
                        }}>
                            <Text style={{
                                fontSize: hp(2.2),
                                color: 'black',


                            }}
                                  numberOfLines={1}
                            >
                                {item && renderEmoji(`${item.id} - ${item.task_title}`, [], hp(2.1), 0, 'black').map((item, index) => {
                                    return item;
                                })}
                            </Text>
                            {item.recommendIsExp == 1 && <View style={{
                                height: hp(2), width:  hp(2), borderRadius: 3, backgroundColor: bottomTheme,
                                alignItems: 'center',
                                justifyContent: 'center', marginLeft: 5,
                            }}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: hp(1.6)}}>推</Text>
                            </View>}
                            {item.topIsExp == 1 && <View style={{
                                height:  hp(2), width:  hp(2), borderRadius: 3, backgroundColor: bottomTheme,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 3,
                            }}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: hp(1.6)}}>顶</Text>
                            </View>}
                        </View>
                        {/*价格*/}
                        <View style={{}}>
                            <Text style={{
                                fontSize: hp(2.5),
                                color: 'red',
                            }}>+{item.reward_price.toString().length===1?`${item.reward_price}.0`:item.reward_price} 元</Text>
                        </View>
                    </View>
                    <View
                        style={{height:hp(2),flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',

                        }}>
                        {/*标签*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{fontSize: hp(1.7), color: 'rgba(0,0,0,0.8)'}}>{item.typeTitle}</Text>
                            <View style={{
                                height: hp(1.3),
                                width: 0.5,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                marginHorizontal: 5,
                            }}/>
                            <Text style={{fontSize: hp(1.7), color: 'rgba(0,0,0,0.8)'}}>{item.task_name}</Text>
                        </View>
                        {/*剩余数*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: hp(1.7),
                                opacity: 0.7,
                                color: 'black',
                            }}>进行中:{item.task_ing_num}</Text>
                            <View
                                style={{
                                    width: 0.7,
                                    height: hp(1.4),
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    marginHorizontal: 5,
                                }}/>
                            <Text style={{
                                fontSize: hp(1.7),
                                opacity: 0.7,
                                color: 'black',
                            }}>剩余:{(parseInt(item.reward_num) - parseInt(item.task_sign_up_num)).toString()}</Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
            {(item.task_status == 0 || item.task_status == 2) ? <View style={{
                height: hp(3),
                paddingVertical: 6,
                paddingHorizontal: hp(1),
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'rgba(255,255,255,1)',
            }}>

                {ViewUtil.getReviewIco(parseInt(item.review_num), this._reViewClick)}
                <View style={{height: 15, width: 1, marginHorizontal: hp(1), backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getzhidingIco(this.props.setTopClick)}
                <View style={{height: 15, width: 1, marginHorizontal: hp(1), backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getrecommendedIco(this.props.setRecommendClick)}
                <View style={{height: 15, width: 1, marginHorizontal: hp(1), backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getUpdateIco(this.props.updateTaskUpdateTime)}
            </View> : item.task_status == 1 ? <View style={{
                height: hp(3),
                paddingVertical: 6,
                paddingHorizontal: 11,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,1)',
                flexDirection: 'row',
            }}>

                {ViewUtil.getReReviewIco(() => {
                    // const {taskid} = this.params;
                    NavigationUtils.goPage({
                        task_id: this.props.item.id,
                        update: false,
                        // updatePage: this._updatePage,
                    }, 'TaskRelease');
                })}
                <View style={{height: 10, width: 1, marginHorizontal: hp(1), backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getDeleteIco(() => {
                    this.props.deleteTask((bool) => {
                        bool && this.hideItem();
                        // console.log(bool);
                    });
                })}
            </View> : item.task_status == 3 ? <View style={{
                height: hp(3),
                paddingVertical: 6,
                paddingHorizontal: 11,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,1)',
                flexDirection: 'row',
            }}>

                {ViewUtil.getReReviewIngIco(() => {
                    // const {taskid} = this.params;
                    NavigationUtils.goPage({
                        task_id: this.props.item.id,
                        update: false,
                        // updatePage: this._updatePage,
                    }, 'TaskRelease');
                })}
                <View style={{height: 10, width: 1, marginHorizontal: hp(1), backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getDeleteIco(this.props.deleteTask)}
            </View> : null}
        </Animated.View>;
    }

    hideItem = () => {
        timing(this.animations.scale, {
            duration: 500,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            this.setState({
                hide: true,
            });
        });
    };
    _reViewClick = () => {
        const {item} = this.props;
        this.props.reViewClick(item);
    };
}
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: bottomTheme,
        // 设置宽度
        width: hp(7),
        height:  hp(7),
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
