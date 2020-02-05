import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions, Platform} from 'react-native';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import SvgUri from 'react-native-svg-uri';
import {equalsObj, renderEmoji} from '../util/CommonUtils';
import Global from './Global';
import FastImagePro from './FastImagePro';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');

class TaskSumComponent extends Component {

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
        boxStyle: {
            paddingHorizontal: 5,
            paddingVertical: 1,
            borderRadius: 10,
            backgroundColor: bottomTheme,
            alignItems: 'center',
            justifyContent: 'center',
            // borderWidth:0.5,
            // borderColor:'rgba(0,0,0,0.6)',
        },
        boxTextColor: 'white',
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

    getItemTextColor = (item) => {
        let textArr = [];
        let color = '';
        if (item.recommendIsExp == 1) {
            textArr.push('推荐');
            color = '#54ba98';
        }
        if (item.topIsExp == 1) {
            textArr.push('置顶');
            color = '#ff2756';
        }
        if (item.hotIsExp == 1) {
            textArr.push('热门');
            color = '#f76fbc';
        }
        if (item.bestNew == 1) {
            textArr.push('最新');
            color = '#2196F3';
        }
        return {
            text: textArr.join('/'),
            color,
        };
    };

    render() {
        const {item} = this.props;
        const labelBoxStyle = this.getItemTextColor(item);
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: item.taskId}, 'TaskDetails');
                this.props.onPress && this.props.onPress(item.taskId);
            }}
            style={{
                backgroundColor: 'white',
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
                paddingVertical: hp(1.8),
                width: width - 10,
                alignSelf: 'center',
                paddingHorizontal: 10,

            }}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        Global.imageViewModal.show([{url: item.taskUri}], '', this.props.statusBarType);
                    }}
                    style={{alignSelf: 'flex-start'}}
                >
                    <FastImagePro
                        style={{
                            backgroundColor: '#E8E8E8',
                            width: hp(11),
                            height: hp(11),
                            borderRadius: 5,

                        }}
                        loadingWidth={hp(11)}
                        loadingHeight={hp(11)}
                        source={{uri: item.taskUri}}
                    />
                </TouchableOpacity>
                <View style={{
                    width: wp(55), paddingLeft: wp(2.7),
                    alignSelf: 'flex-start',
                }}>
                    <Text

                        style={{
                            fontSize: hp(2.25),
                            color: 'black',
                            maxWidth: wp(55),

                        }}>
                        {item && renderEmoji(item.taskTitle, [], hp(2.1), 0, 'black', {}).map((item, index) => {
                            return item;
                        })}
                    </Text>
                    {/*剩余数*/}

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: Platform.OS === 'android' ? hp(0.7) : hp(0.9),
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[styles.bigFontStyle]}>{parseInt(item.taskPassNum)}</Text>
                            <Text style={[styles.smallFontStyle, {marginLeft: 1}]}>人已完成</Text>
                        </View>

                        <View
                            style={styles.fengefu}/>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.smallFontStyle}>剩余</Text>
                            <Text
                                style={[styles.bigFontStyle, {marginHorizontal: 1}]}>{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}</Text>
                            <Text style={styles.smallFontStyle}>个名额</Text>
                        </View>

                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: Platform.OS === 'android' ? hp(0.7) : hp(1.1),
                        }}>
                        {/*标签*/}
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <View style={this.props.boxStyle}>
                                <Text
                                    style={{fontSize: hp(1.3), color: this.props.boxTextColor}}>{item.typeTitle}</Text>
                            </View>
                            <View
                                style={[this.props.boxStyle, {marginLeft: 5}]}>
                                <Text style={{fontSize: hp(1.3), color: this.props.boxTextColor}}>{item.taskName}</Text>
                            </View>
                        </View>
                    </View>


                    <TouchableOpacity
                        onPress={() => {
                            NavigationUtils.goPage({userid: item.userId}, 'ShopInfoPage');
                        }}
                        style={{
                            marginTop: Platform.OS === 'android' ? hp(0.7) : hp(1.1),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View>
                                <FastImagePro
                                    loadingHeight={hp(1.5)}
                                    loadingWidth={hp(1.5)}
                                    style={[styles.imgStyle]}
                                    source={{uri: item.avatarUrl}}
                                />
                                <SvgUri style={{
                                    position: 'absolute',
                                    right: -hp(0.3),
                                    bottom: -hp(0.2),
                                    backgroundColor: item.sex == 0 ? '#3b8ae8' : '#e893d8',
                                    borderRadius: 20,
                                    zIndex: 10,
                                    padding: 1,

                                }} fill={'white'} width={hp(0.8)} height={hp(0.8)}
                                        svgXmlData={item.sex == 0 ? sex_nan_ : sex_nv_}/>
                            </View>
                            <Text style={{
                                fontSize: hp(1.7),
                                marginLeft: wp(2),

                                color: 'rgba(0,0,0,1)',
                                // letterSpacing: 0.5,
                            }}>{item.userName}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {/*价格*/}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{
                    fontSize: hp(2.1),
                    color: '#e6493b',
                    fontWeight: '600',
                    top: hp(0.5),
                }}>￥</Text>
                <Text style={{
                    fontSize: hp(3.5),
                    color: '#e6493b',
                    fontWeight: '700',
                    // marginRight: wp(0.3),
                }}>{item.rewardPrice}</Text>

            </View>
            {labelBoxStyle.text.length > 0 && <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: labelBoxStyle.color,
                paddingHorizontal: 5,
                paddingVertical: Platform.OS === 'android' ? 1 : 2,
                borderTopRightRadius: 5,
                borderBottomLeftRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: wp(35),
                minWidth: wp(18),

            }}>
                <Text style={{fontSize: hp(1.6), color: 'white', letterSpacing: 0.5}}>{labelBoxStyle.text}</Text>
            </View>}

        </TouchableOpacity>;


    }


}

export default TaskSumComponent;
const styles = StyleSheet.create({
    imgStyle: {
        backgroundColor: '#E8E8E8',
        width: hp(2.9),
        height: hp(2.9),
        borderRadius: hp(2.9) / 2,
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
    smallFontStyle: {
        letterSpacing: 0.5,
        fontSize: hp(1.5),
        color: 'rgba(0,0,0,0.9)',
    },
    bigFontStyle: {
        fontSize: hp(2.3),
        color: 'red',
        bottom: hp(0.2),
        // fontWeight: '500',
    },
    fengefu: {
        width: 0.5,
        fontWeight: '500',
        height: hp(1.3),
        backgroundColor: 'rgba(0,0,0,1)',
        marginHorizontal: wp(1),
    },
    contaiStyle: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cecccd',
    },
    boxStyle: {
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 10,
        backgroundColor: bottomTheme,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
