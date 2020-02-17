import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';

import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import {_handleTypeTitle, equalsObj, renderEmoji} from '../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');

class TaskSumComponent_tmp extends Component {


    // isZuijinTime = (date) => {
    //     const newDate = new Date(date);
    //     const str = newDate.getTime();
    //     const now = Date.now();
    //     return str > (now - 5 * 60 * 1000);
    //
    // };
    static defaultProps = {
        titleFontSize: 15,
        marginHorizontal: 10,
        item: {
            avatarUrl: '',
            recommendIsExp: 1,
            topIsExp: 1,
            typeTitle: '注册',
            taskName: '微信注册',
            rewardPrice: 100,
            rewardNum: 100,
            taskSignUpNum: 5,
            taskPassNum: 2,
        },
        statusBarType: 'dark',
    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (!equalsObj(this.props.item, nextProps.item)) {
            return true;
        }
        return false;
    }

    render() {
        const {item} = this.props;
        let maxWidth = width - 120;

        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: item.taskId}, 'TaskDetailsTmp');
                this.props.onPress && this.props.onPress(item.taskId);
            }}
            style={{
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomWidth: wp(0.2),
                borderBottomColor: '#e2e2e2',
            }}
        >

            <View style={{
                width: wp(96), paddingLeft: wp(2.7), justifyContent: 'space-between', overflow: 'hidden',
                paddingVertical: hp(1.7), paddingTop: hp(2.4), paddingBottom: hp(2.4),

            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/*标题*/}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: hp(2.25),
                                color: 'black',
                                maxWidth: maxWidth,
                                marginRight: wp(2.7),
                            }}>
                            {item && renderEmoji(item.taskTitle, [], hp(2.25), 0, 'black').map((item, index) => {
                                return item;
                            })}
                        </Text>
                    </View>
                    {/*价格*/}
                    <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                        <Text style={{
                            fontSize: hp(2.6),
                            color: 'red',
                            marginRight: wp(0.3),
                        }}>{item.rewardPrice}</Text>
                        <Text style={{
                            fontSize: hp(1.8),
                            color: 'red',
                            fontWeight: '500',
                            top: wp(0.5),
                        }}>元/天</Text>
                    </View>
                </View>
                {/*剩余数*/}

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: wp(2),
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: hp(2.3),
                            color: bottomTheme,
                            bottom: hp(0.2),
                        }}>{parseInt(item.taskSignUpNum)}</Text>
                        <Text style={{
                            fontSize: hp(1.75),
                            color: 'rgba(0,0,0,0.7)',
                        }}>人已报名</Text>
                    </View>

                    <View
                        style={{
                            width: 0.5,
                            height: hp(1.8),
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            marginHorizontal: wp(2),
                        }}/>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: hp(1.75),
                            color: 'rgba(0,0,0,0.7)',
                        }}>剩余</Text>
                        <Text style={{
                            fontSize: hp(2.3),
                            color: 'red',
                            bottom: hp(0.2),
                        }}>{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}</Text>
                        <Text style={{
                            fontSize: hp(1.75),
                            color: 'rgba(0,0,0,0.7)',
                        }}>个名额</Text>
                    </View>

                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: hp(1),
                    }}>
                    {/*标签*/}
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <LabelBigComponent
                            contaiStyle={{backgroundColor: '#fafafa'}}
                            // textStyle={{color: '#2196F3'}}
                            paddingHorizontal={wp(2)}
                            fontSize={hp(1.70)}
                            title={_handleTypeTitle(item.typeTitle)}/>
                        <LabelBigComponent
                            contaiStyle={{backgroundColor: '#fafafa'}}
                            // contaiStyle={{borderWidth: 0.2, borderColor: '#2196F3',backgroundColor:'white'}}
                            // textStyle={{color: '#2196F3'}}
                            paddingHorizontal={wp(2)}
                            fontSize={hp(1.70)} title={item.taskName}/>
                    </View>
                </View>
            </View>

        </TouchableOpacity>;


    }

    // _handleTypeTitle = (text) => {
    //     if (text == '注册') {
    //         return '全国';
    //     } else if (text == '投票') {
    //         return '兰州';
    //     } else if (text == '关注') {
    //         return '厦门';
    //     } else if (text == '浏览') {
    //         return '福州';
    //     } else if (text == '下载') {
    //         return '南宁';
    //     } else if (text == '转发') {
    //         return '乌鲁木齐';
    //     } else if (text == '发帖') {
    //         return '济南';
    //     } else if (text == '回帖') {
    //         return '珠海';
    //     } else if (text == '高价') {
    //         return '北京';
    //     } else if (text == '电商') {
    //         return '呼和浩特';
    //     } else if (text == '实名') {
    //         return '哈尔滨';
    //     } else if (text == '特单') {
    //         return '南昌';
    //     } else if (text == '砍价') {
    //         return '贵阳';
    //     } else if (text == '其它') {
    //         return '上海';
    //     } else {
    //         return '海口';
    //     }
    // };
}

export default TaskSumComponent_tmp;
const styles = StyleSheet.create({
    imgStyle: {
        backgroundColor: '#E8E8E8',
        width: wp(5.3),
        height: wp(5.3),
        borderRadius: wp(5.3) / 2,
    },
    labelStyle: {
        height: hp(2.3),
        paddingHorizontal: wp(0.8),
        borderRadius: 3,
        borderWidth: wp(0.2),
        borderColor: bottomTheme,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
});
