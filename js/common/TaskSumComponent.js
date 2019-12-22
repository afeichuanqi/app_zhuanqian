import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
// import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import SvgUri from 'react-native-svg-uri';
import {equalsObj, getEmojis} from '../util/CommonUtils';
import Global from './Global';
import FastImagePro from './FastImagePro';

import Emoji from 'react-native-emoji';

const {width} = Dimensions.get('window');

class TaskSumComponent extends Component {


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
        let maxWidth = width - 100;
        if (item.recommendIsExp == 1) {
            maxWidth -= 40;
        }
        if (item.topIsExp == 1) {
            maxWidth -= 40;
        }
        let taskTitle = item.taskTitle;
        let emojiArr = [];
        const json = getEmojis(taskTitle);
        if (json) {
            taskTitle = json.content;
            emojiArr = json.emojiArr;
        }
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: item.taskId}, 'TaskDetails');
                this.props.onPress && this.props.onPress(item.taskId);
            }}
            style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 25,
                alignItems: 'center',
                backgroundColor: 'white',
                height: 130,
                marginBottom: 5,
            }}
        >

            <View style={{
                height: 50, width: width - 20, paddingLeft: 10, justifyContent: 'space-between',

            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/*标题*/}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        {/*<HTML />*/}

                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 15,
                                color: 'black',
                                fontWeight: '400',
                                maxWidth: maxWidth,
                                marginRight: 10,
                            }}>
                            {item.taskId} - {taskTitle} {emojiArr.map((item) => {
                            return <Emoji name={item} style={{fontSize: 15}}/>;
                        })}
                        </Text>

                        {item.recommendIsExp == 1 && <View style={styles.labelStyle}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 12}}>推荐</Text>
                        </View>}


                        {item.topIsExp == 1 && <View style={styles.labelStyle}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 12}}>置顶</Text>
                        </View>}
                    </View>
                    {/*价格*/}
                    <View style={{flexDirection: 'row', height: 25, alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 19,
                            color: 'red',
                            marginRight: 1,
                        }}>{item.rewardPrice}</Text>
                        <Text style={{
                            fontSize: 14,
                            color: 'red',
                            fontWeight: '500',
                            top: 1,
                        }}>元</Text>
                    </View>
                </View>
                {/*剩余数*/}

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 18,
                            color: bottomTheme,
                            bottom: 2,
                        }}>{parseInt(item.taskPassNum)}</Text>
                        <Text style={{
                            fontSize: 13,
                            color: 'rgba(0,0,0,0.7)',
                        }}>人已完成</Text>
                    </View>

                    <View
                        style={{width: 0.5, height: 13, backgroundColor: 'rgba(0,0,0,0.5)', marginHorizontal: 7}}/>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 13,
                            color: 'rgba(0,0,0,0.7)',
                        }}>剩余</Text>
                        <Text style={{
                            fontSize: 18,
                            color: 'red',
                            bottom: 2,
                        }}>{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}</Text>
                        <Text style={{
                            fontSize: 13,
                            color: 'rgba(0,0,0,0.7)',
                        }}>个名额</Text>
                    </View>

                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8,
                    }}>
                    {/*标签*/}
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <LabelBigComponent
                            contaiStyle={{borderWidth: 0.2, borderColor: '#2196F3',backgroundColor:'white'}}
                            textStyle={{color: '#2196F3'}}
                            paddingHorizontal={8}
                            fontSize={11}
                            title={item.typeTitle}/>
                        <LabelBigComponent
                            contaiStyle={{borderWidth: 0.2, borderColor: '#2196F3',backgroundColor:'white'}}
                            textStyle={{color: '#2196F3'}}
                            paddingHorizontal={8}
                            fontSize={11} title={item.taskName}/>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        Global.imageViewModal.show([{url: item.taskUri}]);
                    }}
                    style={{
                        position: 'absolute',
                        top: 35,
                        right: 0,
                    }}
                >
                    <FastImagePro
                        style={{
                            backgroundColor: '#E8E8E8',
                            width: 60,
                            height: 65,
                            borderRadius: 2,

                        }}
                        source={{uri: item.taskUri}}
                        // resizeMode={FastImage.resizeMode.stretch}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        NavigationUtils.goPage({userid: item.userId}, 'ShopInfoPage');
                    }}
                    style={{
                        marginTop: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View>
                            <FastImagePro
                                loadingHeight={18}
                                loadingWidth={18}
                                style={[styles.imgStyle]}
                                source={{uri: item.avatarUrl}}
                            />
                            <SvgUri style={{
                                position: 'absolute',
                                right: -2,
                                bottom: -2,
                                backgroundColor: item.sex == 0 ? '#3b8ae8' : '#e893d8',
                                borderRadius: 20,

                            }} fill={'white'} width={10} height={10}
                                    svgXmlData={item.sex == 0 ? sex_nan_ : sex_nv_}/>
                        </View>
                        <Text style={{fontSize: 13, marginLeft: 10, color: 'black'}}>{item.userName}</Text>
                    </View>


                </TouchableOpacity>
            </View>

        </TouchableOpacity>;


    }


}

export default TaskSumComponent;
const styles = StyleSheet.create({
    imgStyle: {
        backgroundColor: '#E8E8E8',
        width: 20,
        height: 20,
        borderRadius: 25,
    },
    labelStyle: {
        height: 15,
        paddingHorizontal: 3,
        borderRadius: 3,
        borderWidth: 0.8,
        borderColor: bottomTheme,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
});
