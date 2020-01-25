import React, {PureComponent} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ViewUtil from '../../util/ViewUtil';
import {bottomTheme} from '../../appSet';
import NavigationUtils from '../../navigator/NavigationUtils';
import FastImage from 'react-native-fast-image';
import {getEmojis} from '../../util/CommonUtils';
import Emoji from 'react-native-emoji';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');
export default class TaskReleaseItem extends PureComponent {
    render() {
        const {item} = this.props;
        let taskTitle = item.task_title;
        let emojiArr = [];
        const json = getEmojis(taskTitle);
        if (json) {
            taskTitle = json.content;
            emojiArr = json.emojiArr;
        }
        // console.log(item,"item")
        return <View style={{borderBottomWidth: 0.3, borderBottomColor: 'rgba(0,0,0,0.1)'}}>


            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.props.onPress}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    // paddingRight:15,
                    paddingTop: 25,
                    paddingBottom: 25,
                    height: 90,
                    backgroundColor: 'white',
                }}
            >
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: item.task_uri}}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{
                    height: wp(13), width: width - 70, paddingLeft: 10, paddingRight:5, justifyContent: 'space-between',

                }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {/*标题*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp(50),
                        }}>
                            <Text style={{
                                fontSize: wp(3.8),
                                color: 'black',


                            }}
                                  numberOfLines={1}
                            >
                                {item.id} - {taskTitle} {emojiArr.map((item, index) => {
                                return <Emoji key={index} name={item} style={{fontSize: wp(3.8)}}/>;
                            })}

                            </Text>
                            {item.recommendIsExp == 1 && <View style={{
                                height: wp(3.7), width: wp(3.7), borderRadius: 3, backgroundColor: bottomTheme,
                                alignItems: 'center',
                                justifyContent: 'center', marginLeft: 5,
                            }}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 11}}>推</Text>
                            </View>}
                            {item.topIsExp == 1 && <View style={{
                                height: 15, width: 15, borderRadius: 3, backgroundColor: bottomTheme,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 3,
                            }}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 11}}>顶</Text>
                            </View>}
                        </View>
                        {/*价格*/}
                        <View style={{}}>
                            <Text style={{
                                fontSize: wp(4),
                                color: 'red',
                            }}>+{item.reward_price} 元</Text>
                        </View>
                    </View>
                    <View
                        style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {/*标签*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems:'center',
                            justifyContent:'center',
                        }}>
                            <Text style={{fontSize: 13, color: 'rgba(0,0,0,0.8)'}}>{item.typeTitle}</Text>
                            <View style={{height:12,width:0.5, backgroundColor:'rgba(0,0,0,0.5)', marginHorizontal:7}}/>
                            <Text style={{fontSize: 13, color: 'rgba(0,0,0,0.8)'}}>{item.task_name}</Text>
                        </View>
                        {/*剩余数*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: wp(3.1),
                                opacity: 0.7,
                                color: 'black',
                            }}>进行中:{item.task_ing_num}</Text>
                            <View
                                style={{
                                    width: 0.7,
                                    height: 13,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    marginHorizontal: 5,
                                }}/>
                            <Text style={{
                                fontSize: wp(3.1),
                                opacity: 0.7,
                                color: 'black',
                            }}>剩余:{(parseInt(item.reward_num) - parseInt(item.task_sign_up_num)).toString()}</Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
            {(item.task_status == 0 || item.task_status == 2) ? <View style={{
                height: 28,
                paddingVertical: 6,
                paddingHorizontal: 11,
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'rgba(255,255,255,1)',
            }}>

                {ViewUtil.getReviewIco(parseInt(item.review_num), this._reViewClick)}
                <View style={{height: 15, width: 1, marginHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getzhidingIco(this.props.setTopClick)}
                <View style={{height: 15, width: 1, marginHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getrecommendedIco(this.props.setRecommendClick)}
                <View style={{height: 15, width: 1, marginHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getUpdateIco(this.props.updateTaskUpdateTime)}
            </View> : item.task_status == 1 ? <View style={{
                height: 25,
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
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getDeleteIco(this.props.deleteTask)}
            </View> : item.task_status == 3 ? <View style={{
                height: 25,
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
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getDeleteIco(this.props.deleteTask)}
            </View> : null}
        </View>;
    }

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
        width: wp(13),
        height: wp(13),
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
