import React, {PureComponent} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LabelBigComponent from '../../common/LabelBigComponent';
import ViewUtil from '../../util/ViewUtil';
import {bottomTheme} from '../../appSet';
import NavigationUtils from '../../navigator/NavigationUtils';
import FastImage from 'react-native-fast-image';
const {width} = Dimensions.get('window');
export default class TaskReleaseItem extends PureComponent {
    render() {
        const {item} = this.props;
        return <View style={{}}>


            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.props.onPress}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingTop: 25,
                    paddingBottom: 25,
                    height: 90,
                    backgroundColor:'white',
                }}
            >
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: item.task_uri}}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{
                    height: 50, width: width - 70, paddingLeft: 10, justifyContent: 'space-between',

                }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {/*标题*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: 15,
                                color: 'black',

                            }}>{`${item.id} - ${item.task_title}`}</Text>
                            {item.recommendIsExp == 1 && <View style={{
                                height: 15, width: 15, borderRadius: 3, backgroundColor: bottomTheme,
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
                                fontSize: 16,
                                color: 'red',
                            }}>+{item.reward_price} 元</Text>
                        </View>
                    </View>
                    <View
                        style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {/*标签*/}
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <LabelBigComponent paddingVertical={1} fontSize={12} title={item.task_name}/>
                            {/*<LabelBigComponent title={item.taskName}/>*/}
                        </View>
                        {/*剩余数*/}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: 13,
                                opacity: 0.5,
                            }}>进行中:{item.task_ing_num}</Text>
                            <View
                                style={{width: 0.7, height: 13, backgroundColor: 'rgba(0,0,0,0.5)', marginHorizontal: 5}}/>
                            <Text style={{
                                fontSize: 13,
                                opacity: 0.5,
                            }}>剩余:{(parseInt(item.reward_num) - parseInt(item.task_sign_up_num)).toString()}</Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
            {(this.props.task_status == 0 || this.props.task_status == 2)? <View style={{
                height: 28,
                paddingVertical: 6,
                paddingHorizontal: 11,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.8)',
                flexDirection: 'row',
            }}>

                {ViewUtil.getReviewIco(parseInt(item.review_num), this._reViewClick)}
                <View style={{height: 15, width: 1, marginHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getzhidingIco(this.props.setTopClick)}
                <View style={{height: 15, width: 1, marginHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getrecommendedIco(this.props.setRecommendClick)}
                <View style={{height: 15, width: 1, marginHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getUpdateIco(this.props.updateTaskUpdateTime)}
            </View> : this.props.task_status == 1 ? <View style={{
                height: 25,
                paddingVertical: 6,
                paddingHorizontal: 11,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.5)',
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
            </View> : null}
        </View>
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
        width:49,
        height: 52,
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
