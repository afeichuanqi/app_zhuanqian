import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from './LabelBigComponent';
import {bottomTheme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import sex_nan_ from '../res/svg/sex_nan_.svg';
import sex_nv_ from '../res/svg/sex_nv_.svg';
import SvgUri from 'react-native-svg-uri';
import {equalsObj} from '../util/CommonUtils';


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
        let maxWidth = width - 80;
        // const isZuijin = this.isZuijinTime(item.updateTime);
        if (item.recommendIsExp == 1) {
            maxWidth -= 40;
        }
        if (item.topIsExp == 1) {
            maxWidth -= 40;
        }
        // if (isZuijin) {
        //     maxWidth -= 60;
        // }
        return <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                NavigationUtils.goPage({test: false, task_id: item.taskId}, 'TaskDetails');
                this.props.onPress && this.props.onPress(item.taskId);
            }}
            style={{
                flex: 1,
                paddingTop: 15,
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
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 17,
                                color: 'black',
                                fontWeight: '500',
                                maxWidth: maxWidth,
                                marginRight: 10,
                            }}>{item.taskId} - {item.taskTitle}</Text>

                        {item.recommendIsExp == 1 && <View style={styles.labelStyle}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 12}}>推荐</Text>
                        </View>}


                        {item.topIsExp == 1 && <View style={styles.labelStyle}>
                            <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 12}}>置顶</Text>
                        </View>}
                        {/*{isZuijin && <View style={styles.labelStyle}>*/}
                        {/*    <Text style={{color: bottomTheme, fontWeight: 'bold', fontSize: 12}}>最近刷新</Text>*/}
                        {/*</View>}*/}
                    </View>
                    {/*价格*/}
                    <View style={{}}>
                        <Text style={{
                            fontSize: 18,
                            color: 'red',
                            fontWeight: '500',
                        }}>+ {item.rewardPrice}元</Text>
                    </View>
                </View>
                {/*剩余数*/}

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                }}>

                    <Text style={{
                        fontSize: 15,
                        opacity: 0.8,
                        color: 'red',
                    }}>{parseInt(item.taskPassNum)}人已完成</Text>
                    <View
                        style={{width: 0.3, height: 13, backgroundColor: 'rgba(0,0,0,0.5)', marginHorizontal: 10}}/>
                    <Text style={{
                        fontSize: 15,
                        opacity: 0.8,
                        color: 'red',
                    }}>剩余{parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}个名额</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                    }}>
                    {/*标签*/}
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <LabelBigComponent paddingHorizontal={8} fontSize={12} title={item.typeTitle}/>
                        <LabelBigComponent paddingHorizontal={8} fontSize={12} title={item.taskName}/>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={()=>{this.props.imageViewModal.show([{url: item.taskUri}])}}
                    style={{
                        position: 'absolute',
                        top: 30,
                        right: 0,
                    }}
                >
                    <FastImage
                        style={{
                            backgroundColor: '#E8E8E8',
                            width: 65,
                            height: 70,
                            borderRadius: 3,

                        }}
                        source={{uri: item.taskUri}}
                        resizeMode={FastImage.resizeMode.stretch}
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
                            <FastImage
                                style={[styles.imgStyle]}
                                source={{uri: item.avatarUrl}}
                                resizeMode={FastImage.resizeMode.stretch}
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
                        <Text style={{fontSize: 13, marginLeft: 10}}>{item.userName}</Text>
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
