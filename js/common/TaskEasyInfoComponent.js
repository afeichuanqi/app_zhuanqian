import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavigationUtils from '../navigator/NavigationUtils';
import {renderEmoji} from '../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');

class TaskEasyInfoComponent extends PureComponent {


    static defaultProps = {

        item: {
            imageUrl: '',
            taskTitle: '',
            rewardPrice: 0,
            leftTopText: '',
            leftBottomText: '',


        },
        showTime: false,
    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }


    render() {
        const {showTime, item} = this.props;
        if (item.time && showTime) {
            return <View style={{height: 40, backgroundColor: 'rgba(245,245,245,0.6)'}}>
                <Text style={{position: 'absolute', bottom: 3, left: 10, color: 'rgba(0,0,0,0.6)'}}>{item.time}</Text>
            </View>;
        }
        // let taskTitle = item.taskTitle;
        // let emojiArr = [];
        //
        // const json = getEmojis(taskTitle);
        // if (json) {
        //     taskTitle = json.content;
        //     emojiArr = json.emojiArr;
        // }

        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetails');

            }}

            style={{
                height: hp(9.7), width,
                paddingHorizontal: 10,
                paddingRight: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'white',
            }}>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                    <FastImage
                        style={[styles.imgStyle]}
                        source={{uri: item.imageUrl}}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                    <View style={{justifyContent: 'space-between', marginLeft: 12}}>
                        <Text
                            numberOfLines={1}
                            style={{
                                width: wp(68),
                                fontSize: hp(2.18),
                                color: 'black',

                            }}>
                            {item && renderEmoji(`${item.taskTitle}`, [], 17, 0, 'black').map((item, index) => {
                                return item;
                            })}
                        </Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: 14,
                                opacity: 0.5,
                                color: 'black',
                            }}>{item.leftTopText}</Text>
                            <Text style={{
                                fontSize:14,
                                opacity: 0.5,
                                marginLeft: 10,
                                color: 'black',
                            }}>{item.leftBottomText}</Text>
                        </View>
                    </View>

                </View>

            </View>
            <Text style={{alignSelf: 'center', fontSize: hp(2.3), color: 'red'}}>+{item.rewardPrice}元</Text>
        </TouchableOpacity>;


    }


}

export default TaskEasyInfoComponent;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: wp(10),
        height: wp(10),
        borderRadius: 3,
        // 设置高度
        // height:150
    },
});
