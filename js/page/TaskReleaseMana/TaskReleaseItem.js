import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LabelBigComponent from '../../common/LabelBigComponent';
import ViewUtil from '../../util/ViewUtil';
import {bottomTheme} from '../../appSet';
import NavigationUtils from '../../navigator/NavigationUtils';
import FastImage from 'react-native-fast-image';

export default class TaskReleaseItem extends PureComponent {
    render() {
        const titleFontSize = 14;
        const {item} = this.props;
        return <View style={{}}>
            <TouchableOpacity
                onPress={this.props.onPress}
                activeOpacity={0.6}
                style={{
                    // flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingTop: 18,
                    height: 70,
                    backgroundColor: 'white',
                }}
            >
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: item.task_uri}}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                {/*左上*/}
                <View style={{
                    position: 'absolute',
                    top: 20,
                    left: 55,
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontSize: titleFontSize,
                        color: 'black',
                    }}>{`${item.id} - ${item.task_title}`}</Text>
                </View>
                {/*左下*/}
                <View style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 55,
                    flexDirection: 'row',
                }}>
                    <LabelBigComponent paddingVertical={1} fontSize={10} title={item.task_name}/>
                </View>
                {/*右上*/}
                <View style={{
                    position: 'absolute',
                    top: 20,
                    right: 10,
                }}>
                    <Text style={{
                        fontSize: 15,
                        color: 'red',
                    }}>+{item.reward_price}元</Text>
                </View>
                {/*右下*/}
                <View style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontSize: 11,
                        // color:''
                        opacity: 0.5,
                        // fontWeight: '100',
                    }}>进行中:{item.task_ing_num}</Text>
                    <View style={{height: 10, width: 1, marginHorizontal: 5, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                    <Text style={{
                        fontSize: 11,
                        // color:''
                        opacity: 0.5,
                        // fontWeight: '100',
                    }}>剩余:{(parseInt(item.reward_num) - parseInt(item.task_sign_up_num)).toString()}</Text>
                </View>
            </TouchableOpacity>
            {(this.props.task_status == 0 || this.props.task_status == 2)? <View style={{
                height: 25,
                paddingVertical: 6,
                paddingHorizontal: 11,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.5)',
                flexDirection: 'row',
            }}>

                {ViewUtil.getReviewIco(parseInt(item.review_num), this._reViewClick)}
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getzhidingIco(this.props.setTopClick)}
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getrecommendedIco(this.props.setRecommendClick)}
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
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
                        updatePage: this._updatePage,
                    }, 'TaskRelease');
                })}
                <View style={{height: 10, width: 1, marginHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.3)'}}/>
                {ViewUtil.getDeleteIco(this.props.deleteTask)}
            </View> : null}

            {/*{ViewUtil.getLine()}*/}
            {/**/}
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
        width: 38,
        height: 40,
        borderRadius: 3,
        // 设置高度
        // height:150
    },
});
