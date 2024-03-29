/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, TextInput, Dimensions, Text, TouchableOpacity} from 'react-native';
import MyModal from '../../common/MyModalBox';
import SvgUri from 'react-native-svg-uri';
import add_image from '../../res/svg/add_image.svg';
import PickerImage from '../../common/PickerImage';
import Image from 'react-native-fast-image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {width} = Dimensions.get('window');

class TaskPopMenu extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {

        columnArr: [],
        title: '复制数据',
        rightTitle: '添加',


    };

    componentDidMount() {
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    inputData = {};
    stepNo = 0;
    buzhoushuoming = (text) => {
        this.inputData.info = text;
    };
    tianxiewangzhi = (text) => {
        console.log(text);
        this.inputData.inputValue = text;
    };
    erweima = (image) => {
        this.inputData.uri = image;
    };
    shuomingtu = (image) => {
        this.inputData.uri = image;
    };
    shoujixinxi = (text) => {
        this.inputData.collectInfo = text;
    };


    getColumnView = (type, typeData, index) => {
        switch (type) {
            case 1://步骤说明
                return <View
                    key={1}
                    style={{
                        paddingVertical: 10,
                        width: width - 40,
                        paddingHorizontal: 15,
                    }}>
                    <Text style={{fontSize: hp(1.9), color: 'black'}}>{typeData.title}</Text>
                    <TextArea
                        ref={ref => this.textArea = ref}
                        value={this.inputData.info ? this.inputData.info : ''}
                        length={300}
                        showLenInfo={true}
                        placeholder={typeData.placeholder}
                        onChangeText={this.buzhoushuoming}/>

                </View>;
                break;

            case 2://填写网址
                return <View
                    key={2}
                    style={{
                        paddingVertical: 10,
                        width: width - 40,
                        paddingHorizontal: 15,
                    }}>
                    <Text style={{fontSize: hp(1.9), color: 'black'}}>{typeData.title}</Text>
                    <TextInputPro
                        ref={ref => this.textInputPro = ref}
                        inputValue={this.inputData.inputValue ? this.inputData.inputValue : ''}
                        onChangeText={this.tianxiewangzhi}
                        maxLength={300}
                        multiline={false}
                        placeholder={typeData.placeholder}
                        style={{
                            height: 30,
                            backgroundColor: '#e8e8e8',
                            marginTop: 10,
                            fontSize: 13,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                            padding: 0,
                        }}
                    />

                </View>;
                break;
            case 3://选择二维码

                return <View
                    key={3}
                    style={{
                        paddingVertical: 10,
                        width: width - 40,
                        paddingHorizontal: 15,
                    }}>
                    <Text style={{fontSize: hp(1.9), color: 'black'}}>{typeData.title}</Text>
                    {/*<TextArea placeholder={typeData.placeholder} onChangeText={typeData.onChangeText}/>*/}
                    <View style={{width: width - 60, alignItems: 'center'}}>
                        {/*//图片选择 */}
                        <ImageSelect
                            ref={ref => this.imageSelect = ref}
                            image={this.inputData.uri} select={this.erweima}/>
                    </View>
                    <PickerImage includeBase64={false} cropping={false} select={this._selectImg}
                                 ref={ref => this.pickerImg = ref}/>
                </View>;
                break;
            case 4://填写说明图
                return <View
                    key={4}
                    style={{
                        paddingVertical: 10,
                        width: width - 40,
                        paddingHorizontal: 15,
                    }}>
                    <Text style={{fontSize: hp(1.9), color: 'black'}}>{typeData.title}</Text>
                    {/*<TextArea placeholder={typeData.placeholder} onChangeText={typeData.onChangeText}/>*/}
                    <View style={{width: width - 60, alignItems: 'center'}}>
                        {/*//图片选择 */}
                        <ImageSelect
                            image={this.inputData.uri}
                            ref={ref => this.imageSelect = ref}
                            select={this.shuomingtu}
                            width={100}
                            height={140}
                        />
                    </View>
                </View>;
                break;
            case 5://收集信息
                return <View
                    key={5}
                    style={{
                        paddingBottom: 10,
                        width: width - 40,
                        paddingHorizontal: 15,
                    }}>
                    <TextArea
                        ref={ref => this.textArea = ref}
                        value={this.inputData.collectInfo ? this.inputData.collectInfo : ''}
                        length={1000}
                        showLenInfo={false}
                        placeholder={typeData.placeholder}
                        onChangeText={this.shoujixinxi}/>
                </View>;
                break;
        }
    };
    show = (columnTitle, columnArr, type, inputData = {}, forceUpdate = false, rightTitle = '添加', stepNo = 0, timestamp) => {
        this.inputType = type;
        this.inputData = inputData;
        this.stepNo = stepNo;
        this.timestamp = timestamp;
        this.setState({
            columnArr,
            title: columnTitle,
            rightTitle,
        }, () => {
            if (forceUpdate) { //强制render
                this.forceUpdate();
                this.myModal.show();
            } else {
                this.timer = setTimeout(() => {
                    this.myModal.show();
                }, 100);
            }


        });
    };
    hide = () => {
        this.myModal.hide();
    };

    render() {
        const Component = this.state.columnArr.map((item, index, arr) => {
            return this.getColumnView(item.type, item.typeData, index);
        });
        return (
            <MyModal
                ref={ref => this.myModal = ref}
                rightTitle={this.state.rightTitle}
                sureClick={this._sureClick}
                title={this.state.title}
                style={{
                    width: width - 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 5,
                }}>
                {Component}
            </MyModal>
        );
    }

    _checkTextArea = () => {
        const istrue = (this.inputData.info && this.inputData.info.length > 0) ? true : false;
        console.log(istrue);
        this.textArea.showAnimated(!istrue);
        return istrue;
    };
    _checkTextArea_1 = () => {
        const istrue = (this.inputData.collectInfo && this.inputData.collectInfo.length > 0) ? true : false;
        this.textArea.showAnimated(!istrue);
        return istrue;
    };
    _checkTextInputPro = () => {
        const istrue = (this.inputData.inputValue && this.inputData.inputValue.length > 0) ? true : false;
        this.textInputPro.showAnimated(!istrue);
        return istrue;
    };
    _checkImageSelect = () => {
        const istrue = (this.inputData.uri) ? true : false;
        console.log(istrue, this.inputData.uri);
        this.imageSelect.showAnimated(!istrue);
        return istrue;
    };
    _sureClick = () => {
        console.log('我被单击');
        switch (this.inputType) {
            case 1:
                if (this._checkTextArea() && this._checkTextInputPro()) {
                    this.props.sureClick(this.inputData, this.inputType, this.stepNo, this.state.rightTitle, this.timestamp);
                    this.myModal.hide();
                }
                return;
            case 2:
                if (this._checkTextArea() && this._checkImageSelect()) {
                    this.props.sureClick(this.inputData, this.inputType, this.stepNo, this.state.rightTitle, this.timestamp);
                    this.myModal.hide();
                }
                return;
            case 3:
                if (this._checkTextArea() && this._checkTextInputPro()) {
                    this.props.sureClick(this.inputData, this.inputType, this.stepNo, this.state.rightTitle, this.timestamp);
                    this.myModal.hide();
                }
                return;
            case 4:
                if (this._checkTextArea() && this._checkImageSelect()) {
                    this.props.sureClick(this.inputData, this.inputType, this.stepNo, this.state.rightTitle, this.timestamp);
                    this.myModal.hide();
                }
                return;
            case 5:
                if (this._checkTextArea() && this._checkImageSelect()) {
                    this.props.sureClick(this.inputData, this.inputType, this.stepNo, this.state.rightTitle, this.timestamp);
                    this.myModal.hide();
                }
                return;
            case 6:
                if (this._checkTextArea_1()) {
                    this.props.sureClick(this.inputData, this.inputType, this.stepNo, this.state.rightTitle, this.timestamp);
                    this.myModal.hide();
                }
                return;
        }
        //

    };
}

class TextInputPro extends PureComponent {
    state = {
        inputValue: this.props.inputValue,
    };
    _onChangeText = (text) => {
        this.setState({
            inputValue: text,
        });
        this.props.onChangeText(text);
    };
    showAnimated = (show) => {
        // this._anim = timing(this.animations.width, {
        //     duration: 200,
        //     toValue: show ? 1 : 0,
        //     easing: Easing.inOut(Easing.linear),
        // }).start();
        this.textInput.setNativeProps({
            style: {
                borderWidth: show ? 1 : 0.3,
                borderColor: show ? `rgba(255, 0, 0, 1)` : 'rgba(0,0,0,0.3)',
            },
        });

    };


    render() {
        return <TextInput
            ref={ref => this.textInput = ref}
            autoCapitalize={'none'}
            autoComplete={'off'}
            autoCorrect={false}
            blurOnSubmit={false}
            value={this.state.inputValue}
            onChangeText={this._onChangeText}
            maxLength={300}
            multiline={false}
            placeholder={this.props.placeholder}
            placeholderTextColor={'#727272'}
            style={{
                height: hp(3.5),
                marginTop: 10,
                fontSize: hp(1.9),
                paddingHorizontal: 5,
                borderRadius: 5,
                padding: 0,
                // paddingTop:3,

                borderWidth: 0.3,
                borderColor: 'rgba(0,0,0,0.3)',
            }}
        />;
    }
}

class ImageSelect extends PureComponent {
    state = {
        image: this.props.image,
    };
    static defaultProps = {
        height: 80,
        width: 80,
    };
    showAnimated = (show) => {
        this.btn.setNativeProps({
            style: {
                borderColor: show ? 'red' : 'rgba(0,0,0,0.3)',
                borderWidth: show ? 1 : 0.3,
            },
        });
        // this._anim = timing(this.animations.width, {
        //     duration: 200,
        //     toValue: show ? 1 : 0.6,
        //     easing: Easing.inOut(Easing.linear),
        // }).start();
    };


    render() {
        // console.log(this.state.image, '111');
        // if(this.state.image && this.state.image.path){
        //     console.log(this.state.image.path);
        // }
        // const scale = Animated.interpolate(this.animations.scale, {
        //     inputRange: [0, 1],
        //     outputRange: [0.9, 1],
        //     extrapolate: 'clamp',
        // });
        return <View>
            <TouchableOpacity
                ref={ref => this.btn = ref}
                onPress={() => {
                    this.pickerImg.show();
                }}

                style={{
                    marginTop: 10,
                    width: this.props.width,
                    height: this.props.height,
                    // backgroundColor: '#e8e8e8',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 0.3,
                    borderColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 5,

                    // borderWidth:1, borderColor:'rgba(255,0,0,1)',
                }}>
                {this.state.image ?
                    <Image
                        // key={`image-${index}`}
                        style={{
                            width: this.props.width, height: this.props.height, backgroundColor: '#F0F0F0',

                        }}
                        source={{uri: this.state.image}}
                        resizeMode={'contain'}
                    />
                    :
                    <SvgUri width={50} height={50} svgXmlData={add_image}/>}
            </TouchableOpacity>
            <PickerImage includeBase64={false} cropping={false} select={this._selectImg}
                         ref={ref => this.pickerImg = ref}/>
        </View>;
    }

    _selectImg = (image) => {

        this.setState({
            image: image ? `file://${image.path}` : null,
        });
        this.props.select(image);
    };
}

class TextArea extends PureComponent {

    state = {
        length: 0,
        placeholder: '',
        value: this.props.value,
    };
    _onChangeText = (text) => {
        this.setState({
            length: text.length,
            value: text,
        });
        this.props.onChangeText(text);
    };
    showAnimated = (show) => {
        // this._anim = timing(this.animations.width, {
        //     duration: 200,
        //     toValue: show ? 1 : 0,
        //     easing: Easing.inOut(Easing.linear),
        // }).start();
        this.textInput.setNativeProps({
            style: {
                borderWidth: show ? 1 : 0.3,
                borderColor: show ? `rgba(255, 0, 0, 1)` : 'rgba(0,0,0,0.3)',
            },
        });

    };

    render() {

        return <View>
            <TextInput
                ref={ref => this.textInput = ref}
                autoCapitalize={'none'}
                autoComplete={'off'}
                autoCorrect={false}
                blurOnSubmit={false}
                value={this.state.value}
                onChangeText={this._onChangeText}
                maxLength={this.props.length}
                multiline={true}
                placeholder={this.props.placeholder}
                placeholderTextColor={'#727272'}
                style={{
                    height: hp(9),
                    // backgroundColor: '#e8e8e8',

                    marginTop: 10,
                    fontSize: hp(1.9),
                    paddingHorizontal: 5,
                    borderRadius: 5,
                    padding: 0,
                    textAlignVertical: 'top',
                    paddingTop: 5,
                    borderWidth: 0.3,
                    borderColor: 'rgba(0,0,0,0.3)',
                    // borderColor: `rgba(255, 0, 0, 1)`,

                }}
            />
            {this.props.showLenInfo && <View style={{
                position: 'absolute',
                right: 5,
                bottom: 0,
            }}>
                <Text style={{color: 'rgba(0,0,0,0.5)'}}>{this.state.length}/{this.props.length}</Text>
            </View>}

        </View>;
    }
}

export default TaskPopMenu;
