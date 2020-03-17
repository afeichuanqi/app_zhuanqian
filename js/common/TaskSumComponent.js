import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions, Platform, Image, ImageBackground} from 'react-native';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import SvgUri from 'react-native-svg-uri';
import {equalsObj, renderEmoji} from '../util/CommonUtils';
import Global from './Global';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
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

    handleLabelText = (text) => {
        let tmpText = '';

        if (text.length > 7) {
            tmpText = text.substring(0, 7) + '...';
        } else {
            tmpText = text;
        }
        return tmpText;
    };

    render() {
        const {item} = this.props;
        // {item.typeTitle}/{item.taskName}
        const labelText = this.handleLabelText(`${item.typeTitle}/${item.taskName}`);
        // console.log(item.rewardPrice.toString().length);
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
                marginTop: 7,
                paddingVertical: hp(1.8),
                width: width - 15,
                alignSelf: 'center',
                paddingHorizontal: 12,

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

                    <FastImage
                        style={{
                            backgroundColor: '#E8E8E8',
                            width: hp(10),
                            height: hp(10),
                            borderRadius: 5,

                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                        source={{uri: item.taskUri}}
                    />
                </TouchableOpacity>
                <View style={{
                    width: wp(55), paddingLeft: wp(2.3),
                    alignSelf: 'flex-start',
                }}>
                    <Text numberOfLines={1} style={{maxWidth: wp(48), flexDirection: 'row'}}>
                        {item && renderEmoji(item.taskTitle, [], hp(2.05), 0, 'black', {}).map((item, index) => {
                            return item;
                        })}
                    </Text>

                    {/*剩余数*/}

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp(0.7),
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
                    <View style={{flexDirection: 'row', flexWrap:'wrap',width:wp(55)}}>
                        {item.recommendIsExp == 1 && <Image
                            resizeMode={'contain'}
                            source={require('../res/img/item_icon/tuijian_item.png')}
                            style={styles.itemIconStyle}

                        />}
                        {item.hotIsExp == 1 && <Image
                            resizeMode={'contain'}
                            source={require('../res/img/item_icon/hot_item.png')}
                            style={styles.itemIconStyle}

                        />}
                        {item.topIsExp == 1 && <Image
                            resizeMode={'contain'}
                            source={require('../res/img/item_icon/top_item.png')}
                            style={styles.itemIconStyle}

                        />}
                        {item.bestNew == 1 && <Image
                            resizeMode={'contain'}
                            source={require('../res/img/item_icon/new_item.png')}
                            style={styles.itemIconStyle}

                        />}

                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationUtils.goPage({userid: item.userId}, 'ShopInfoPage');
                        }}
                        style={{
                            marginTop: hp(0.9),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View>
                                <FastImage
                                    style={[styles.imgStyle]}
                                    source={{uri: item.avatarUrl}}
                                />

                                <SvgUri style={{
                                    position: 'absolute',
                                    right: -hp(0.3),
                                    bottom: -hp(0.2),
                                    backgroundColor: item.sex == 0 ? '#3b8ae8' : '#e893d8',
                                    borderRadius: 20,
                                    padding: 1,
                                }} fill={'white'} width={hp(0.8)} height={hp(0.8)}
                                        svgXmlData={item.sex == 0 ? sex_nan_ : sex_nv_}/>
                            </View>
                            <Text style={{
                                fontSize: hp(1.7),
                                marginLeft: wp(2),
                                color: 'rgba(0,0,0,1)',
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
                    fontSize: hp(3.7),
                    color: '#e6493b',
                    fontWeight: '700',
                }}>{item.rewardPrice.toString().length==1?`${item.rewardPrice}.0`:item.rewardPrice}</Text>
            </View>
            <View style={styles.labelStyle}>

                <Image
                    resizeMode={'stretch'}
                    style={{width: 12, height: 12, marginRight: 1}}
                    source={require('../res/img/item_icon/label_icon.png')}
                />
                <Text
                    maxLength={2}
                    style={styles.labelTextStyle}
                >
                    {labelText}
                </Text>
            </View>

        </TouchableOpacity>;


    }


}

export default TaskSumComponent;
const styles = StyleSheet.create({
    labelStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: bottomTheme,
        paddingHorizontal: 6,
        paddingVertical: Platform.OS === 'android' ? 2 : 3,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius:2,
        borderBottomRightRadius:2,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: wp(35),
        minWidth: wp(18),
        flexDirection: 'row',
    },
    labelTextStyle: {
        fontSize: hp(1.7), color: 'white',
    },
    imgStyle: {
        backgroundColor: '#E8E8E8',
        width: hp(2.4),
        height: hp(2.4),
        borderRadius: hp(2.4) / 2,
    },
    smallFontStyle: {
        letterSpacing: 0.5,
        fontSize: hp(1.6),
        color: 'rgba(0,0,0,0.9)',
    },
    bigFontStyle: {
        fontSize: hp(1.9),
        color: 'red',
        bottom: hp(0.1),
        fontWeight: '500',
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
    itemIconStyle: {
        marginTop:hp(0.5),
        width: hp(6.5),
        height: hp(3),
        marginLeft: hp(0.5),
    },
});
