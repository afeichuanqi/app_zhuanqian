/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    Clipboardl,
    TextInput,
    Clipboard,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from 'react-native';
import Image from 'react-native-fast-image';
import {bottomTheme} from '../../appSet';
import SvgUri from 'react-native-svg-uri';
import task_delete from '../../res/svg/task_delete.svg';
import task_shangyi from '../../res/svg/task_shangyi.svg';
import task_xiayi from '../../res/svg/task_xiayi.svg';
import task_edit from '../../res/svg/task_edit.svg';
import AnimatedFadeIn from '../../common/AnimatedFadeIn';
import { uploadQiniuImage} from '../../util/AppService';
import add_image from '../../res/svg/add_image.svg';
import PickerImage from '../../common/PickerImage';
import ImageViewerModal from '../../common/ImageViewerModal';

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
                    <Text style={{fontSize: 15, marginLeft: 5, letterSpacing: 3}}>第{this.props.no}步</Text>
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
        </AnimatedFadeIn>;
    }

    _editColumn = () => {
        const {no, type, typeData, timestamp} = this.props;
        console.log(no, type, typeData, timestamp, 'no, type, typeData, timestamp');
        this.props.utilCick.edit(no, type, typeData, timestamp);
    };
    _deleteColumn = () => {
        const {no, type, typeData, timestamp} = this.props;
        this.props.utilCick.delete(no, type, typeData, timestamp);
    };
    _moveUpColumn = () => {
        const {no, type, typeData, timestamp} = this.props;
        this.props.utilCick.moveUp(no, type, typeData, timestamp);
    };
    _moveDownColumn = () => {
        const {no, type, typeData, timestamp} = this.props;
        this.props.utilCick.moveDown(no, type, typeData, timestamp);
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
        showEditModel: false,
        isEdit: true,
    };
    state = {
        stepDataArr: this.props.stepArr || [],
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.stepArr.length !== nextProps.stepArr.length) {
            this.setState({
                stepDataArr: nextProps.stepArr,
            });
        }
    }

    images = [];
    setStepDataArr = (type, data, stepNo, timestamp) => {
        // console.log(type,  stepNo,"datadata");
        const tmpArr = [...this.state.stepDataArr];
        if (stepNo === 0) {//为添加
            tmpArr.push({type, typeData: data, timestamp, uploadStatus: 0});
        } else {
            tmpArr[stepNo - 1] = {type, typeData: data, timestamp, uploadStatus: 0};//为修改
        }
        this.setState({
            stepDataArr: tmpArr,
        });
    };
    _resetUploadImage = (timestamp, type = 1) => {//重新上传
        const {userinfo} = this.props;
        const tmpArr = [...this.state.stepDataArr];
        const index = tmpArr.findIndex((n) => timestamp == n.timestamp);
        if (index != -1) {
            const item = tmpArr[index];
            const data = item.typeData;
            let fun = null, uri = '';
            if (type === 1) {
                fun = this.setImageStatusOrUrl;
                uri = data.uri;

            } else {
                fun = this.setImageStatusOrUrl_1;
                uri = data.uri1;
            }
            if (uri && uri.indexOf('file://') != -1) {//确认是本地照片

                fun(timestamp, 0, '');
                const mimeIndex = uri.lastIndexOf('.');
                const mime = uri.substring(mimeIndex + 1, uri.length);
                // const path = `file://${image.path}`;
                console.log(uri, mime, 'mimemime');
                uploadQiniuImage(userinfo.token, 'reUploadStep', mime, uri).then(url => {
                    fun(timestamp, 1, url);
                }).catch(err => {
                    fun(timestamp, -1, '');
                });
            }
        }
    };

    setImageStatusOrUrl_1 = (timestamp, status, urlImage) => {
        const tmpArr = [...this.state.stepDataArr];
        const index = tmpArr.findIndex((n) => timestamp == n.timestamp);
        if (index != -1) {
            const item = tmpArr[index];
            const data = item.typeData;

            if (data.uri1) {
                if (status === 1) {
                    data.uri1 = urlImage;
                }
                item.typeData = data;
                item.uploadStatus1 = status;
                tmpArr[index] = item;
                this.setState({
                    stepDataArr: tmpArr,
                });
            }
        }
    };
    setImageStatusOrUrl = (timestamp, status, urlImage) => {
        const tmpArr = [...this.state.stepDataArr];
        const index = tmpArr.findIndex((n) => timestamp == n.timestamp);
        if (index !== -1) {
            const item = tmpArr[index];
            const data = item.typeData;

            if (data.uri) {
                if (status === 1) {
                    data.uri = urlImage;
                }
                item.typeData = data;
                item.uploadStatus = status;
                tmpArr[index] = item;
                this.setState({
                    stepDataArr: tmpArr,
                });
            }
        }
    };


    componentDidMount() {


    }

    componentWillUnmount() {

    }

    getStepData = () => {
        return this.state.stepDataArr;

    };

    _imageClick = (url) => {
        this.imageViewerModal.show({url});


    };

    getStepColumn = (stepNo, type, typeData, utilClick = {}, timestamp, uploadStatus, uploadStatus1) => {
        switch (type) {
            case 1://输入网址
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <View style={{paddingHorizontal: 10}}>
                        <Text style={{
                            marginTop: 20, fontSize: 15, lineHeight: 25,
                            letterSpacing: 0.2,
                        }}>{typeData.info}</Text>
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
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{
                        marginTop: 20, fontSize: 15, paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2,
                    }}>{typeData.info}</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        paddingHorizontal: 10,
                        justifyContent: 'space-around',
                    }}>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                this._imageClick(typeData.uri);
                            }}
                            style={styles.imgBox}>
                            <Image
                                source={{uri: typeData.uri}}
                                style={{width: 120, height: 120, backgroundColor: '#F0F0F0', borderRadius: 3}}
                                resizeMode={'contain'}/>
                            {uploadStatus == 0 ?//正在上传
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, width: 120, height: 120,
                                    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize: 14}}>正在上传</Text>
                                </View>
                                : uploadStatus == -1 ?//上传失败
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: 120,
                                        height: 120,
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{color: 'white', fontSize: 13}}>上传失败</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this._resetUploadImage(timestamp);
                                            }}
                                            style={{
                                                backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5,
                                                borderRadius: 3, marginTop: 8,
                                            }}>
                                            <Text style={{color: 'white', fontSize: 12}}>点击重传</Text>
                                        </TouchableOpacity>
                                    </View> : null
                            }
                        </TouchableOpacity>

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
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{
                        marginTop: 20, fontSize: 15, paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2,
                    }}>{typeData.info}</Text>
                    <View style={{flexDirection: 'row', marginTop: 20, paddingHorizontal: 10, alignItems: 'center'}}>

                        <View style={{
                            width: ((width - 62) / 4) * 3,
                            // height: 80,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            <TextInput
                                editable={false}
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

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                Clipboard.setString(typeData.inputValue);
                                // this.toast.show('复制成功 ~ ~');
                            }}
                            style={{
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
                        </TouchableOpacity>
                    </View>
                </StepBox>;
            case 4://图文说明
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{
                        marginTop: 20, fontSize: 15, paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2,
                    }}>{typeData.info}</Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            this._imageClick(typeData.uri);
                        }}
                        style={{
                            flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, justifyContent: 'center',
                            paddingVertical: 10,
                        }}>
                        <View>
                            <Image
                                source={{uri: typeData.uri}}
                                style={{
                                    width: width / 2,
                                    // marginBottom: 10,
                                    height: width / 1.5,
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: 3,
                                }}
                                resizeMode={'contain'}/>
                            {uploadStatus == 0 ?//正在上传
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, width: width / 2, height: width / 1.5,
                                    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize: 14}}>正在上传</Text>
                                </View>
                                : uploadStatus == -1 ?//上传失败
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: width / 2,
                                        height: width / 1.5,
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{color: 'white', fontSize: 13}}>上传失败</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this._resetUploadImage(timestamp);
                                            }}
                                            style={{
                                                backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5,
                                                borderRadius: 3, marginTop: 8,
                                            }}>
                                            <Text style={{color: 'white', fontSize: 12}}>点击重传</Text>
                                        </TouchableOpacity>
                                    </View> : null
                            }
                        </View>

                    </TouchableOpacity>

                </StepBox>;
            case 5://验证图
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{
                        marginTop: 20, fontSize: 15, paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2,
                    }}>{typeData.info}</Text>
                    <View

                        style={{
                            flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, justifyContent: 'center',
                            paddingVertical: 10,
                        }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                this._imageClick(typeData.uri);
                            }}
                            style={{marginRight: 15}}>
                            <Image
                                source={{uri: typeData.uri}}
                                style={{
                                    width: (width - 80) / 2,
                                    // marginBottom: 10,
                                    height: (width - 80) / 1.5,
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: 3,
                                }}
                                resizeMode={'contain'}/>

                            {uploadStatus == 0 ?//正在上传
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: (width - 80) / 2,
                                    height: (width - 80) / 1.5,
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize: 14}}>正在上传</Text>
                                </View>
                                : uploadStatus == -1 ?//上传失败
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: (width - 80) / 2,
                                        height: (width - 80) / 1.5,
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{color: 'white', fontSize: 13}}>上传失败</Text>
                                        <TouchableOpacity
                                            onPress={() => {

                                                this._resetUploadImage(timestamp, 1);
                                            }}
                                            style={{
                                                backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5,
                                                borderRadius: 3, marginTop: 8,
                                            }}>
                                            <Text style={{color: 'white', fontSize: 12}}>点击重传</Text>
                                        </TouchableOpacity>
                                    </View> : null
                            }
                        </TouchableOpacity>
                        {/*{}*/}
                        {this.props.showEditModel &&
                        <View style={{
                            width: (width - 80) / 2,
                            height: (width - 80) / 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            {uploadStatus1 === -2 ? <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        // this.
                                        this.refs[`pickerImg${timestamp}`].show(timestamp);

                                    }}
                                    style={{
                                        borderRadius: 5,
                                        width: (width - 80) / 2,
                                        height: (width - 80) / 1.5,
                                        borderWidth: 0.3,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <SvgUri width={50} height={50} svgXmlData={add_image}/>
                                    <Text style={{marginTop: 10, color: 'rgba(0,0,0,0.6)'}}>添加验证图片</Text>
                                </TouchableOpacity>
                                : <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        // this.
                                        this._imageClick(typeData.uri1);
                                    }}
                                    style={{
                                        borderRadius: 5,
                                        width: (width - 80) / 2,
                                        height: (width - 80) / 1.5,
                                        borderWidth: 0.3,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >

                                    <Image
                                        source={{uri: typeData.uri1}}
                                        style={{
                                            width: (width - 80) / 2,
                                            // marginBottom: 10,
                                            height: (width - 80) / 1.5,
                                            backgroundColor: '#F0F0F0',
                                            borderRadius: 3,
                                        }}
                                        resizeMode={'contain'}/>
                                    {this.props.isEdit ? <TouchableOpacity
                                        onPress={() => {
                                            this._clearPic(timestamp);
                                        }}
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 20,
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            position: 'absolute',
                                            right: -5,
                                            top: -5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{color: 'white'}}>X</Text>
                                    </TouchableOpacity> : null}

                                    {uploadStatus1 !== 1 && <View style={{
                                        position: 'absolute', top: 0, left: 0, width: (width - 80) / 2,
                                        height: (width - 80) / 1.5, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.5)',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {uploadStatus1 === 0
                                            ?
                                            <Text style={{color: 'white', fontSize: 15}}>正在上传</Text>
                                            :
                                            uploadStatus1 === -1
                                                ?
                                                <View style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: (width - 80) / 2,
                                                    height: (width - 80) / 1.5,
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                    <Text style={{color: 'white', fontSize: 14}}>上传失败</Text>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this._resetUploadImage(timestamp, 2);
                                                        }}
                                                        style={{
                                                            backgroundColor: 'red',
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 5,
                                                            borderRadius: 3,
                                                            marginTop: 15,
                                                        }}>
                                                        <Text style={{color: 'white', fontSize: 14}}>点击重传</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <Text style={{color: 'white', fontSize: 15}}>未知原因</Text>
                                        }

                                    </View>}

                                </TouchableOpacity>
                            }
                        </View>}

                        <PickerImage popTitle={'选取验证图'} includeBase64={true} cropping={false}
                                     select={this._selectVerifyImg}
                                     ref={`pickerImg${timestamp}`}/>
                    </View>
                </StepBox>;
            case 6://收集信息
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{
                        marginTop: 20, fontSize: 15, paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2,
                    }}>{typeData.collectInfo}</Text>
                    <View style={{
                        flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {this.props.isEdit ? <TextInput
                                // onBlur={this._onblur}
                                editable={true}
                                placeholder={'请按照要求输入文字内容'}
                                onChangeText={(text) => {
                                    const tmpArr = this.state.stepDataArr;
                                    const index = tmpArr.findIndex((n) => timestamp == n.timestamp);
                                    tmpArr[index].typeData.collectInfoContent = text;
                                }}
                                // value={}
                                style={{
                                    padding: 0,
                                    width: width - 42,
                                    height: 40,
                                    border: 0,
                                    borderRadius: 3,
                                    borderWidth: 1,
                                    borderColor: bottomTheme,
                                    paddingHorizontal: 5,
                                    marginTop: 10,
                                }}/>
                            :

                            <TextInput
                                editable={false}
                                style={{
                                    padding: 0,
                                    width: width - 42,
                                    height: 40,
                                    border: 0,
                                    borderRadius: 3,
                                    borderWidth: 1,
                                    borderColor: bottomTheme,
                                    paddingHorizontal: 5,
                                    marginTop: 10,
                                    textAlign: 'auto',

                                }}>
                                {typeData.collectInfoContent}
                            </TextInput>
                        }

                    </View>
                </StepBox>;


        }
    };
    _clearPic = (timestamp) => {
        const tmpArr = [...this.state.stepDataArr];
        const index = tmpArr.findIndex(data => data.timestamp === timestamp);
        if (index != -1) {
            const item = tmpArr[index];
            const data = item.typeData;

            if (data.uri1) {

                data.uri1 = '';
                item.uploadStatus1 = -2;
                tmpArr[index] = item;
                this.setState({
                    stepDataArr: tmpArr,
                });
            }
        }
    };
    _selectVerifyImg = (imageData, timestamp) => {
        const temArr = [...this.state.stepDataArr];
        const index = temArr.findIndex(data => data.timestamp === timestamp);
        if (index !== -1) {
            const item = temArr[index];
            item.typeData.uri1 = `file://${imageData.path}`;
            item.uploadStatus1 = 0;//设置正在上传
            this.setState({
                stepDataArr: temArr,
            });
            let mime = imageData.mime;
            const mimeIndex = mime.indexOf('/');
            mime = mime.substring(mimeIndex + 1, mime.length);
            const path = `file://${imageData.path}`;
            // 上传七牛云
            setTimeout(() => {
                uploadQiniuImage(this.props.userinfo.token, 'sendTaskFrom', mime, path).then(url => {
                    this.setImageStatusOrUrl_1(timestamp, 1, url);
                }).catch(err => {
                    this.setImageStatusOrUrl_1(timestamp, -1, '');
                });

            }, 500);

        }

    };
    _deleteColumn = (stepNo, type, typeData) => {
        const tmpArr = [...this.state.stepDataArr];
        tmpArr.splice(stepNo - 1, 1);
        this.setState({
            stepDataArr: tmpArr,
        });
    };

    _moveUpColumn = async (stepNo, type, typeData) => {
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
            <View style={{marginBottom: 15}}>

                {this.state.stepDataArr.map((item, index, arr) => {
                    return this.getStepColumn(index + 1, item.type, item.typeData, utilClick, item.timestamp, item.uploadStatus,
                        typeof (item.uploadStatus1) === 'undefined' ? -2 : item.uploadStatus1);
                })}
                <ImageViewerModal
                    ref={ref => this.imageViewerModal = ref}
                />
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
