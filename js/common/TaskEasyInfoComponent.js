import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavigationUtils from '../navigator/NavigationUtils';
import Emoji from 'react-native-emoji';
import {getEmojis} from '../util/CommonUtils';

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
        let taskTitle = item.taskTitle;
        let emojiArr = [];

        const json = getEmojis(taskTitle);
        if (json) {
            taskTitle = json.content;
            emojiArr = json.emojiArr;
        }

        return <TouchableOpacity
            onPress={() => {
                NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetails');

            }}

            style={{
                height: 60, width,
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
                    <View style={{justifyContent: 'space-around', marginLeft: 12}}>
                        <Text
                            numberOfLines={1}
                            style={{
                                width: width - 150,
                                fontSize: 14,
                                color: 'black',

                            }}>{taskTitle} {emojiArr.map((item) => {
                            return <Emoji name={item} style={{fontSize: 15}}/>;
                        })}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: 12,
                                opacity: 0.5,
                                color: 'black',
                            }}>{item.leftTopText}</Text>
                            <Text style={{
                                fontSize: 12,
                                opacity: 0.5,
                                marginLeft: 10,
                                color: 'black',
                            }}>{item.leftBottomText}</Text>
                        </View>
                    </View>

                </View>

            </View>
            <Text style={{alignSelf: 'center', fontSize: 17, color: 'red'}}>+{item.rewardPrice}元</Text>
        </TouchableOpacity>;


    }


}

export default TaskEasyInfoComponent;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 40,
        height: 40,
        borderRadius: 3,
        // 设置高度
        // height:150
    },
});
