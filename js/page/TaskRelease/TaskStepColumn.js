/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {Dimensions, View, Text, TextInput, Clipboard, Image, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {theme, bottomTheme} from '../../appSet';
import SvgUri from 'react-native-svg-uri';
import task_delete from '../../res/svg/task_delete.svg';
import task_shangyi from '../../res/svg/task_shangyi.svg';
import task_xiayi from '../../res/svg/task_xiayi.svg';
import task_edit from '../../res/svg/task_edit.svg';
import AnimatedFadeIn from '../../common/AnimatedFadeIn';

const {width, height} = Dimensions.get('window');

class StepBox extends PureComponent {
    render() {
        return <AnimatedFadeIn>
            <View style={{
                marginTop: 10,
                backgroundColor: 'white',
                marginHorizontal: this.props.showUtilColumn ? 5 : 10,
                paddingHorizontal: 5,
                paddingVertical: 15,
                borderWidth: 1,
                borderColor: bottomTheme,
                borderRadius: 5,
            }}>
                <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                    {this.getNumNo(this.props.no)}
                    <Text style={{fontSize: 15, marginLeft: 5,letterSpacing: 3,}}>第{this.props.no}步</Text>
                </View>
                {this.props.children}
                {/*<View style={{height:40}}/>*/}
                {this.props.showUtilColumn &&
                <View style={{paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                    {this.getColumnBtn(task_delete, '删除', 20, this._deleteColumn)}
                    {this.getColumnBtn(task_shangyi, '上移', 21, this._moveUpColumn)}
                    {this.getColumnBtn(task_xiayi, '下移', 19, this._moveDownColumn)}
                    {this.getColumnBtn(task_edit, '编辑', 17, this._editColumn)}
                </View>}


            </View>
        </AnimatedFadeIn>
            ;
    }

    _editColumn = () => {
        const {no, type, typeData} = this.props;
        this.props.utilCick.edit(no, type, typeData);
    };
    _deleteColumn = () => {
        const {no, type, typeData} = this.props;
        console.log('我被触发_deleteColumn');
        this.props.utilCick.delete(no, type, typeData);
    };
    _moveUpColumn = () => {
        const {no, type, typeData} = this.props;
        this.props.utilCick.moveUp(no, type, typeData);
    };
    _moveDownColumn = () => {
        const {no, type, typeData} = this.props;
        this.props.utilCick.moveDown(no, type, typeData);
    };
    getColumnBtn = (svgXmlData, title, size, click) => {
        return <TouchableOpacity
            onPress={click}
            activeOpacity={0.6}
            style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 10}}>
            <SvgUri width={size} height={size} fill={'rgba(0,0,0,0.5)'} svgXmlData={svgXmlData}/>
            <Text style={{marginLeft: 5}}>{title}</Text>
        </TouchableOpacity>;
    };
    getNumNo = (num) => {
        return <View style={{
            width: 20, height: 20, backgroundColor: bottomTheme, borderRadius: 20,
            justifyContent: 'center', alignItems: 'center',
        }}>
            <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>{num}</Text>
        </View>;
    };
}

class TaskStepColumn extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        showUtilColumn: true,
    };
    state = {
        stepDataArr: [
            {'type': 1, 'typeData': {'info': '先打开微信做任务先打开微信做任务先打开微信做任务先打开微信做任务先打开微信做任务先打开微信做任务', 'inputValue': '222'}},
            {'type': 2, 'typeData': {'info': 'wwewq', 'uri': {path: 'wwewadas'}}},
            {'type': 3, 'typeData': {'info': 'wwewq', 'uri': {path: 'wwewadas'}}},
            {'type': 4, 'typeData': {'info': 'wwewq', 'uri': {path: 'wwewadas'}}},
            {'type': 5, 'typeData': {'info': 'wwewq', 'uri': {path: 'wwewadas'}}},
            {'type': 6, 'typeData': {'collectInfo': 'www'}},
        ],
    };
    setStepDataArr = (type, data, stepNo) => {
        const tmpArr = [...this.state.stepDataArr];
        if (stepNo === 0) {
            tmpArr.push({type, typeData: data});
        } else {
            tmpArr[stepNo - 1] = {type, typeData: data};
        }
        this.setState({
            stepDataArr: tmpArr,
        });
    };

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    getStepData = () => {
        return this.state.stepDataArr;

    };
    getStepColumn = (stepNo, type, typeData, utilClick = {}) => {
        switch (type) {
            case 1://输入网址
                return <StepBox showUtilColumn={this.props.showUtilColumn} utilCick={utilClick} no={stepNo} type={type}
                                typeData={typeData}>
                    <View style={{paddingHorizontal: 10}}>
                        <Text style={{marginTop: 20, fontSize: 15,lineHeight: 25,
                            letterSpacing: 0.2,}}>{typeData.info}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        marginTop: 20,
                        justifyContent: 'center',
                        // marginBottom:10,
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                Linking.openURL(typeData.inputValue);
                            }}
                            style={{
                                backgroundColor: bottomTheme, height: 40, width: 100, justifyContent: 'center',
                                alignItems: 'center', borderRadius: 3,
                            }}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>打开链接</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                Clipboard.setString(typeData.inputValue);
                            }}
                            style={{
                                backgroundColor: bottomTheme, height: 40, width: 100, justifyContent: 'center',
                                alignItems: 'center', borderRadius: 3, marginLeft: 10,
                            }}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>复制链接</Text>
                        </TouchableOpacity>
                    </View>
                </StepBox>;
            case 2://二维码
                return <StepBox showUtilColumn={this.props.showUtilColumn} utilCick={utilClick} no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{marginTop: 20, fontSize: 15, paddingHorizontal: 10,lineHeight: 25,
                        letterSpacing: 0.2}}>{typeData.info}</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        paddingHorizontal: 10,
                        justifyContent: 'space-around',
                    }}>

                        <View style={styles.imgBox}>
                            <Image
                                source={{uri: typeData.uri.sourceURL}}
                                style={{width: 120, height: 120, backgroundColor: '#F0F0F0', borderRadius: 3}}
                                resizeMode={'contain'}/>
                        </View>

                        <View style={styles.imgBox}>
                            <View style={{
                                backgroundColor: bottomTheme, height: 40, width: 100, justifyContent: 'center',
                                alignItems: 'center', borderRadius: 3,
                            }}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>保存二维码</Text>
                            </View>
                        </View>
                    </View>
                </StepBox>;
            case 3://复制数据
                return <StepBox showUtilColumn={this.props.showUtilColumn} utilCick={utilClick} no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{marginTop: 20, fontSize: 15, paddingHorizontal: 10,lineHeight: 25,
                        letterSpacing: 0.2}}>{typeData.info}</Text>
                    <View style={{flexDirection: 'row', marginTop: 20, paddingHorizontal: 10, alignItems: 'center'}}>

                        <View style={{
                            width: ((width - 62) / 4) * 3,
                            // height: 80,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            <TextInput
                                value={typeData.inputValue}
                                style={{
                                    padding: 0,
                                    width: ((width - 62) / 4) * 3,
                                    height: 40,
                                    border: 0,
                                    borderRadius: 3,
                                    borderWidth: 1,
                                    borderColor: bottomTheme,
                                    // backgroundColor: 'rgba(0,0,0,0.2)',
                                    paddingHorizontal: 5,
                                }}/>
                        </View>

                        <View style={{
                            width: ((width - 62) / 4),
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 10,
                            borderRadius: 3,
                            // justifyContent:,
                            backgroundColor: bottomTheme,
                        }}>
                            <Text style={{color: 'white'}}>复制数据</Text>
                        </View>
                    </View>
                </StepBox>;
            case 4://图文说明
                return <StepBox showUtilColumn={this.props.showUtilColumn} utilCick={utilClick} no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{marginTop: 20, fontSize: 15, paddingHorizontal: 10,lineHeight: 25,
                        letterSpacing: 0.2}}>{typeData.info}</Text>
                    <View style={{
                        flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, justifyContent: 'center',
                        paddingVertical: 10,
                    }}>

                        <Image
                            source={{uri: typeData.uri.sourceURL}}
                            style={{
                                width: width / 2,
                                // marginBottom: 10,
                                height: width / 1.2,
                                backgroundColor: '#F0F0F0',
                                borderRadius: 3,
                            }}
                            resizeMode={'contain'}/>
                    </View>
                </StepBox>;
            case 5://验证图
                return <StepBox showUtilColumn={this.props.showUtilColumn} utilCick={utilClick} no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{marginTop: 20, fontSize: 15, paddingHorizontal: 10,lineHeight: 25,
                        letterSpacing: 0.2}}>{typeData.info}</Text>
                    <View style={{
                        flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, justifyContent: 'center',
                        paddingVertical: 10,
                    }}>

                        <Image
                            source={{uri: typeData.uri.sourceURL}}
                            style={{
                                width: width / 2,
                                // marginBottom: 10,
                                height: width / 1.2,
                                backgroundColor: '#F0F0F0',
                                borderRadius: 3,
                            }}
                            resizeMode={'contain'}/>
                    </View>
                </StepBox>;
            case 6://收集信息
                return <StepBox showUtilColumn={this.props.showUtilColumn} utilCick={utilClick} no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{marginTop: 20, fontSize: 15, paddingHorizontal: 10,lineHeight: 25,
                        letterSpacing: 0.2}}>{typeData.collectInfo}</Text>
                    <View style={{
                        flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, alignItems: 'center',
                        justifyContent: 'center',
                    }}>


                        <TextInput
                            placeholder={'请按照要求输入文字内容'}
                            // value={}
                            style={{
                                padding: 0,
                                width: width - 42,
                                height: 40,
                                border: 0,
                                borderRadius: 3,
                                borderWidth: 1,
                                borderColor: bottomTheme,
                                // backgroundColor: 'rgba(0,0,0,0.2)',
                                paddingHorizontal: 5,
                                marginTop: 10,
                            }}/>
                    </View>
                </StepBox>;


        }
    };
    _deleteColumn = (stepNo, type, typeData) => {
        const tmpArr = [...this.state.stepDataArr];
        // tmpArr
        tmpArr.splice(stepNo - 1, 1);
        this.setState({
            stepDataArr: tmpArr,
        });
    };
    _moveUpColumn = (stepNo, type, typeData) => {
        const coverIndex = stepNo - 1;
        if (coverIndex <= 0) {
            return;
        }
        const tmpArr = [...this.state.stepDataArr];
        const stepNoUpArr = tmpArr[coverIndex - 1];//上一个数组
        const Arr = tmpArr[coverIndex];//本数组
        tmpArr[coverIndex] = stepNoUpArr;//转换位置
        tmpArr[coverIndex - 1] = Arr;

        this.setState({
            stepDataArr: tmpArr,
        });
    };
    _moveDownColumn = (stepNo, type, typeData) => {
        const coverIndex = stepNo - 1;
        if (coverIndex >= this.state.stepDataArr.length - 1) {
            return;
        }
        const tmpArr = [...this.state.stepDataArr];
        const stepNoDownArr = tmpArr[coverIndex + 1];//下一个数组
        const Arr = tmpArr[coverIndex];//本数组
        tmpArr[coverIndex] = stepNoDownArr;//转换位置
        tmpArr[coverIndex + 1] = Arr;
        this.setState({
            stepDataArr: tmpArr,
        });
    };

    render() {
        const utilClick = {
            edit: this.props.edit,
            delete: this._deleteColumn,
            moveUp: this._moveUpColumn,
            moveDown: this._moveDownColumn,
        };
        return (
            <View>
                {this.state.stepDataArr.map((item, index, arr) => {
                    return this.getStepColumn(index + 1, item.type, item.typeData, utilClick);
                })}
            </View>
        );
    }
}

export default TaskStepColumn;
const styles = StyleSheet.create({
    imgBox: {
        // width: (width - 70) / 2,
        // height: (width - 70) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
