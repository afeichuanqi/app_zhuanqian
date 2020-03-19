import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import {renderEmoji} from '../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


class TaskInfoComponent extends PureComponent {

    static defaultProps = {
        titleFontSize: hp(1.7),
        fontSize: hp(1.7),
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
        showTime: false,
        numberOfLines:2
    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    render() {

        const {titleFontSize, marginHorizontal, item, showTime} = this.props;

        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: item.taskId}, 'TaskDetails');
                this.props.onPress && this.props.onPress(item.taskId);
            }}
            key={item.taskId}
            style={[{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: marginHorizontal,
                paddingTop: hp(1.6),
                paddingBottom: hp(1.6),
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                backgroundColor: 'white',

            },this.props.touchStyle]}
        >
            <FastImage
                style={[styles.imgStyle, this.props.avatarStyle]}
                source={{uri: item.avatarUrl}}
                resizeMode={FastImage.resizeMode.stretch}
            />
            <View style={[{
                 width: wp(82), paddingLeft: 11, justifyContent: 'space-between',

            },this.props.viewStyle]}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/*标题*/}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width:wp(55),
                    }}>
                        <Text
                            numberOfLines={this.props.numberOfLines}
                            style={{
                                // width: width - 150,
                                fontSize: hp(2.12),
                                color: 'black',


                            }}>
                            {item && renderEmoji(`${item.taskTitle}`, [], hp(2.2), 0, 'black').map((item, index) => {
                                return item;
                            })}
                            </Text>


                        {item.recommendIsExp == 1 && <View style={{
                            height: hp(2.1), width: hp(2.1), borderRadius:hp(0.2), backgroundColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center', marginLeft: 5,
                        }}>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: hp(1.8)}}>推</Text>
                        </View>}
                        {item.topIsExp == 1 && <View style={{
                            height: hp(2.1), width: hp(2.1), borderRadius: hp(0.2), backgroundColor: bottomTheme,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 3,
                        }}>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: hp(1.8)}}>顶</Text>
                        </View>}
                    </View>
                    {/*价格*/}
                    <View style={{}}>
                        <Text style={{
                            fontSize: hp(2.4),
                            color: 'red',
                        }}>+{item.rewardPrice.toString().length==1?`${item.rewardPrice}.0`:item.rewardPrice} 元</Text>
                    </View>
                </View>
                <View
                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/*标签*/}
                    <View style={{
                        flexDirection: 'row',
                        marginTop: wp(1)
                    }}>
                        <LabelBigComponent contaiStyle={{backgroundColor: '#f5f5f5',}} fontSize={this.props.fontSize} title={item.typeTitle}/>
                        <LabelBigComponent contaiStyle={{backgroundColor: '#f5f5f5',}} fontSize={this.props.fontSize} title={item.taskName}/>
                    </View>
                    {/*剩余数*/}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: hp(1.7),
                            opacity: 0.5,
                            color: 'black',
                        }}>{parseInt(item.taskPassNum)}人已完成</Text>
                        <View
                            style={{width: 0.7, height: 13, backgroundColor: 'rgba(0,0,0,0.5)', marginHorizontal: 5}}/>
                        <Text style={{
                            fontSize: hp(1.7),
                            opacity: 0.5,
                            color: 'black',
                        }}>剩余{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}</Text>
                    </View>

                </View>
            </View>


        </TouchableOpacity>;


    }


}

export default TaskInfoComponent;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: wp(12.5),
        height: wp(12.5),
        borderRadius: wp(12.5)/2,
        // 设置高度
        // height:150
    },
});
