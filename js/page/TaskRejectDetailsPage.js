/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions,
    StyleSheet,
    View, Text, StatusBar, TouchableOpacity, ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import FastImage from 'react-native-fast-image';
import Image from 'react-native-fast-image';
import ImageViewerModal from '../common/ImageViewerModal';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class TaskRejectDetailsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };


    componentDidMount() {
        this.backPress.componentDidMount();
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

    render() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '驳回详情', null, 'white', 'black', 16, null, false);
        // const {taskData, isLoading, hideLoaded} = this.state;
        const {item} = this.params;
        console.log(item);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}

                <ScrollView style={{flex: 1}}>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetails');
                        }}
                        style={{
                            paddingHorizontal: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottomWidth: 0.3,
                            borderBottomColor: '#e8e8e8',
                            paddingBottom: 10,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                            <FastImage
                                style={[styles.imgStyle]}
                                source={{uri: item.avatar_url}}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                            <View style={{marginLeft: 15, justifyContent: 'space-around', width: width - 180}}>
                                <View>
                                    <Text>
                                        {item.task_title}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        style={{fontSize: 13, opacity: 0.7}}>{item.task_name} | {item.task_info}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetails');
                            }}
                            style={{
                                backgroundColor: bottomTheme,
                                width: 80,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 20,
                            }}>
                            <Text
                                style={{color: 'white'}}>{(item.isSignUpExp == 1 && parseInt(item.align_num) <= 1) ? '重新提交' : '查看任务'}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View style={{paddingHorizontal: 15, marginTop: 30}}>
                        <Text>{JSON.parse(item.rejectionContent).turnDownInfo}</Text>
                        <View style={{marginTop: 30}}>

                            {JSON.parse(item.rejectionContent).image && JSON.parse(item.rejectionContent).image.length > 0 &&
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                {JSON.parse(item.rejectionContent).image.map((item, index, arr) => {
                                    return <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            this.imgModal.show({url: item});
                                        }}
                                    >
                                        <Image
                                            source={{uri: item}}
                                            style={{
                                                width: 120, height: 120,
                                                borderRadius: 0,
                                                marginRight: 10,
                                                backgroundColor: '#e8e8e8',
                                            }}
                                        />

                                    </TouchableOpacity>;
                                })}
                            </View>}
                        </View>
                        <Text style={{textAlign: 'right', opacity: 0.7, fontSize: 12, marginTop: 20}}>
                            当前状态:{item.again_send_status == 1 ? '已重新提交' : item.again_send_status == 2 ? '最终审核' :
                            (item.isSignUpExp == 0 && item.align_num <= 1) ? '已放弃重新提交' :
                                (item.isSignUpExp == 1 && parseInt(item.align_num) <= 1) ? '允许重新提交' : ''
                        } | 被驳回次数:{item.align_num ? item.align_num : 0}次
                        </Text>

                    </View>

                </ScrollView>
                <ImageViewerModal ref={ref => this.imgModal = ref}/>
            </SafeAreaViewPlus>
        );
    }

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const TaskRejectDetailsPageRedux = connect(mapStateToProps, mapDispatchToProps)(TaskRejectDetailsPage);


export default TaskRejectDetailsPageRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 55,
        height: 55,
        borderRadius: 40,
        // 设置高度
        // height:150
    },
});
