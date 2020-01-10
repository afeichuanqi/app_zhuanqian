import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';

import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import SvgUri from 'react-native-svg-uri';
import {equalsObj, getEmojis} from '../util/CommonUtils';
import Global from './Global';
import FastImagePro from './FastImagePro';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomWidth: wp(0.2),
                borderBottomColor: '#e2e2e2',
            }}
        >

            <View style={{
                width: wp(96), paddingLeft: wp(2.7), justifyContent: 'space-between', overflow: 'hidden',
                paddingVertical: hp(1.7), paddingBottom: hp(2.4),

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
                                fontSize: wp(3.9),
                                color: 'black',
                                maxWidth: maxWidth,
                                marginRight: wp(2.7),
                            }}>
                            {taskTitle} {emojiArr.map((item, index) => {
                            return <Emoji key={index} name={item} style={{fontSize: wp(4.2)}}/>;
                        })}
                        </Text>

                        {item.recommendIsExp == 1 && <View style={styles.labelStyle}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: wp(2.9)}}>推荐</Text>
                        </View>}


                        {item.topIsExp == 1 && <View style={styles.labelStyle}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: wp(2.9)}}>置顶</Text>
                        </View>}
                    </View>
                    {/*价格*/}
                    <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                        <Text style={{
                            fontSize: wp(4.8),
                            color: 'red',
                            marginRight: wp(0.3),
                        }}>{item.rewardPrice}</Text>
                        <Text style={{
                            fontSize: wp(3.3),
                            color: 'red',
                            fontWeight: '500',
                            top: wp(0.5),
                        }}>元</Text>
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
                            fontSize: wp(4),
                            color: bottomTheme,
                            bottom: hp(0.2),
                        }}>{parseInt(item.taskPassNum)}</Text>
                        <Text style={{
                            fontSize: wp(3),
                            color: 'rgba(0,0,0,0.7)',
                        }}>人已完成</Text>
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
                            fontSize: wp(3),
                            color: 'rgba(0,0,0,0.7)',
                        }}>剩余</Text>
                        <Text style={{
                            fontSize: wp(4),
                            color: 'red',
                            bottom: hp(0.2),
                        }}>{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}</Text>
                        <Text style={{
                            fontSize: wp(3),
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
                            fontSize={wp(2.7)}
                            title={item.typeTitle}/>
                        <LabelBigComponent
                            contaiStyle={{backgroundColor: '#fafafa'}}
                            // contaiStyle={{borderWidth: 0.2, borderColor: '#2196F3',backgroundColor:'white'}}
                            // textStyle={{color: '#2196F3'}}
                            paddingHorizontal={wp(2)}
                            fontSize={wp(2.7)} title={item.taskName}/>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        Global.imageViewModal.show([{url: item.taskUri}]);
                    }}
                    style={{
                        position: 'absolute',
                        top: hp(6.5),
                        right: wp(1),
                    }}
                >
                    <FastImagePro
                        style={{
                            backgroundColor: '#E8E8E8',
                            width: wp(15),
                            height: wp(15),
                            borderRadius: 2,

                        }}
                        loadingWidth={wp(15)}
                        loadingHeight={wp(15)}
                        source={{uri: item.taskUri}}
                        // resizeMode={FastImage.resizeMode.stretch}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        NavigationUtils.goPage({userid: item.userId}, 'ShopInfoPage');
                    }}
                    style={{
                        marginTop: wp(2),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View>
                            <FastImagePro
                                loadingHeight={wp(4.5)}
                                loadingWidth={wp(4.5)}
                                style={[styles.imgStyle]}
                                source={{uri: item.avatarUrl}}
                            />
                            <SvgUri style={{
                                position: 'absolute',
                                right: -wp(0.5),
                                bottom: -wp(0.5),
                                backgroundColor: item.sex == 0 ? '#3b8ae8' : '#e893d8',
                                borderRadius: 20,

                            }} fill={'white'} width={wp(2.8)} height={wp(2.8)}
                                    svgXmlData={item.sex == 0 ? sex_nan_ : sex_nv_}/>
                        </View>
                        <Text style={{
                            fontSize: wp(3.2),
                            marginLeft: wp(3.2),
                            color: 'rgba(0,0,0,0.8)',
                        }}>{item.userName}</Text>
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
