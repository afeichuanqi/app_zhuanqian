import React, {PureComponent} from 'react';
import MyModalBoxTwo from '../../common/MyModalBoxTwo';
import {Text, TextInput, View, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export default class ToastTaskTopRecommend extends PureComponent {
    static defaultProps = {
        type: 1,
        title: '置顶任务',
    };
    state = {
        item: {},
    };
    show = (item) => {
        this.setState({
            item,
        });
        this.myModalBoxNum.show();
    };
    hide = () => {
        this.myModalBoxNum.hide();
    };
    _sureClick = () => {
        const topNum = this.taskToastContent.getNewTaskNum();
        this.props.sureTopClick(this.state.item, topNum);

    };

    render() {
        const {type} = this.props;

        return <MyModalBoxTwo

            sureClick={this._sureClick}
            title={this.props.title}
            rightTitle={this.props.title}
            ref={ref => this.myModalBoxNum = ref}>
            {type == 1 ? <TaskTop
                item={this.state.item}
                ref={ref => this.taskToastContent = ref}
            /> : type == 2 ? <TaskRecommend
                item={this.state.item}
                ref={ref => this.taskToastContent = ref}
            /> : null}


        </MyModalBoxTwo>;
    }
}

class TaskRecommend extends PureComponent {
    state = {
        price: 0,
        error: false,
    };
    getNewTaskNum = () => {
        return this.numText;
    };

    render() {
        const {price} = this.state;
        return <View style={{backgroundColor: 'white', paddingHorizontal: 10, paddingBottom:10}}>
            <View style={{paddingVertical: 10}}>
                <Text style={{color: 'rgba(0,0,0,0.8)', width: width - 60, fontSize: 13}}>
                    推荐任务将在首页显示
                </Text>
                <Text style={{color: 'rgba(0,0,0,0.8)', width: width - 60, fontSize: 13, marginTop: 5}}>
                    如果当前任务已经在推荐将增加小时数
                </Text>
                <Text style={{color: 'rgba(0,0,0,0.8)', width: width - 60, fontSize: 13, marginTop: 5}}>
                    支持小数(1.5代表1小时30分钟,以此类推)
                </Text>
                {this.props.item.recommendIsExp == 1 ?
                    <Text style={{color: 'red', width: width - 60, fontSize: 13, marginTop: 5}}>
                        当前推荐到期时间:{this.props.item.recommendExpTime}
                    </Text> : <Text style={{color: 'red', width: width - 60, fontSize: 13, marginTop: 5}}>
                        当前没有任何推荐
                    </Text>}
                <TextInput
                    ref={ref => this.textInput = ref}
                    keyboardType={'number-pad'}
                    placeholder={'输入推荐小时数'}
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    maxLength={4}
                    onChangeText={text => {
                        if (parseInt(text) >= 1) {
                            this.textInput.setNativeProps({
                                style: {
                                    borderWidth: 0.3,
                                    borderColor: 'rgba(0,0,0,0.3)',
                                },
                            });
                            this.numText = text;
                            this.setState({
                                price: (parseFloat(text) * 10).toFixed(2),
                            });

                        } else {
                            this.textInput.setNativeProps({
                                style: {
                                    borderWidth: 1,
                                    borderColor: 'red',
                                },
                            });
                        }

                    }}
                    style={{
                        padding: 0,
                        borderWidth: 0.3,
                        borderColor: 'rgba(0,0,0,0.3)',
                        height: 30,
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        marginTop: 10,

                    }}/>
            </View>
            <View style={{height: 20, backgroundColor: 'white'}}>
                <Text style={{color: 'rgba(0,0,0,0.8)'}}>本次置顶所需金额(包含服务费)：{price}元</Text>
            </View>
        </View>;

    }
}

class TaskTop extends PureComponent {
    state = {
        price: 0,
        error: false,
    };
    getNewTaskNum = () => {
        return this.numText;
    };

    render() {
        const {price} = this.state;
        return <View style={{backgroundColor: 'white', paddingHorizontal: 10, paddingBottom:10}}>
            <View style={{paddingVertical: 10,paddingTop:15}}>
                <Text style={{color: 'rgba(0,0,0,0.8)', width: width - 60, fontSize: 13}}>
                    置顶任务将在所有任务数保持前排
                </Text>
                <Text style={{color: 'rgba(0,0,0,0.8)', width: width - 60, fontSize: 13, marginTop: 5}}>
                    如果当前任务已经在置顶将增加小时数
                </Text>
                <Text style={{color: 'rgba(0,0,0,0.8)', width: width - 60, fontSize: 13, marginTop: 5}}>
                    支持小数(1.5代表1小时30分钟,以此类推)
                </Text>
                {this.props.item.topIsExp == 1 ?
                    <Text style={{color: 'red', width: width - 60, fontSize: 13, marginTop: 5}}>
                        当前置顶到期时间:{this.props.item.topExpTime}
                    </Text> : <Text style={{color: 'red', width: width - 60, fontSize: 13, marginTop: 5}}>
                        当前没有任何置顶
                    </Text>}
                <TextInput
                    ref={ref => this.textInput = ref}
                    keyboardType={'number-pad'}
                    placeholder={'输入置顶小时数'}
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    maxLength={4}
                    onChangeText={text => {
                        if (parseInt(text) >= 1) {
                            this.textInput.setNativeProps({
                                style: {
                                    borderWidth: 0.3,
                                    borderColor: 'rgba(0,0,0,0.3)',
                                },
                            });
                            this.numText = text;
                            this.setState({
                                price: (parseFloat(text) * 10).toFixed(2),
                            });

                        } else {
                            this.textInput.setNativeProps({
                                style: {
                                    borderWidth: 1,
                                    borderColor: 'red',
                                },
                            });
                        }

                    }}
                    style={{
                        padding: 0,
                        borderWidth: 0.3,
                        borderColor: 'rgba(0,0,0,0.3)',
                        height: 30,
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        marginTop: 10,

                    }}/>
            </View>
            <View style={{height: 20, backgroundColor: 'white'}}>
                <Text style={{color: 'rgba(0,0,0,0.8)'}}>本次置顶所需金额(包含服务费)：{price}元</Text>
            </View>
        </View>;

    }
}
