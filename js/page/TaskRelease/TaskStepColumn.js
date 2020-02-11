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
    TextInput,
    Clipboard,
    StyleSheet,
    TouchableOpacity,
    Linking, Image,
} from 'react-native';
import {bottomTheme} from '../../appSet';
import SvgUri from 'react-native-svg-uri';
import task_delete from '../../res/svg/task_delete.svg';
import task_shangyi from '../../res/svg/task_shangyi.svg';
import task_xiayi from '../../res/svg/task_xiayi.svg';
import task_edit from '../../res/svg/task_edit.svg';
import AnimatedFadeIn from '../../common/AnimatedFadeIn';
import {uploadQiniuImage} from '../../util/AppService';
import add_image from '../../res/svg/add_image.svg';
import PickerImage from '../../common/PickerImage';
import ImageViewerModal from '../../common/ImageViewerModal';
import {equalsObj, renderEmoji} from '../../util/CommonUtils';
import FastImagePro from '../../common/FastImagePro';
import {saveImg} from '../../util/ImageUtil';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Toast from 'react-native-root-toast';
const {width, height} = Dimensions.get('window');

class StepBox extends PureComponent {
    render() {
        return <AnimatedFadeIn>
            <View style={{
                marginTop: 10,
                backgroundColor: 'white',
                marginHorizontal: this.props.showUtilColumn ? 5 : 10,
                paddingHorizontal: 5,
                paddingVertical: hp(3),
                borderWidth: 1,
                borderColor: bottomTheme,
                borderRadius: 5,
            }}>
                <View style={{flexDirection: 'row', paddingHorizontal: wp(2)}}>
                    {this.getNumNo(this.props.no)}
                    <Text
                        style={{
                            fontSize: hp(2.2),
                            marginLeft: 5,
                            letterSpacing: 3,
                            color: 'black',
                        }}>第{this.props.no}步</Text>
                </View>
                {this.props.children}
                {/*<View style={{height:40}}/>*/}
                {this.props.showUtilColumn &&
                <View style={{paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                    {this.getColumnBtn(task_delete, '删除', hp(2.8), this._deleteColumn)}
                    {this.getColumnBtn(task_shangyi, '上移', hp(2.8), this._moveUpColumn)}
                    {this.getColumnBtn(task_xiayi, '下移', hp(2.8), this._moveDownColumn)}
                    {this.getColumnBtn(task_edit, '编辑', hp(2.8), this._editColumn)}
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
            <Text style={{marginLeft: 5, color: 'black', fontSize: hp(2.2)}}>{title}</Text>
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

class TaskStepColumn extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        // console.log(this.state.stepDataArr, nextState.stepDataArr,"this.state.stepDataArr, nextState.stepDataArr");
        if (this.props.showUtilColumn != nextProps.showUtilColumn
            || this.props.showEditModel != nextProps.showEditModel
            || this.props.isEdit != nextProps.isEdit
            || this.state.stepDataArr != nextState.stepDataArr
            || this.props.stepArr != nextProps.stepArr
        ) {
            return true;
        }
        return false;
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
        if (!equalsObj(this.props.stepArr, nextProps.stepArr)) {
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
            let uploadStatus = 0;
            if (data.uri && Object.prototype.toString.call(data.uri) === '[object String]'
                && (data.uri.indexOf('http://') !== -1 || data.uri.indexOf('http://') !== -1)
            ) {
                uploadStatus = 1;//已经上传完毕的图片
            } else {
                uploadStatus = 0;//需要上传
            }
            tmpArr[stepNo - 1] = {type, typeData: data, timestamp, uploadStatus: uploadStatus};//为修改
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
        this.imageViewerModal.show([{url}]);
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
                            marginTop: 20
                        }}>
                            {typeData && renderEmoji(typeData.info, [], hp(2.15), 0,'black',{lineHeight: 25,
                                letterSpacing: 0.2,}).map((item, index) => {
                                return item;
                            })}
                        </Text>
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
                                if (this.props.isEdit) {
                                    Linking.openURL(typeData.inputValue);
                                } else {
                                    Toast.show('请先报名',{position:Toast.positions.CENTER});
                                }

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
                                if (this.props.isEdit) {
                                    Clipboard.setString(typeData.inputValue);
                                    Toast.show('复制成功');
                                } else {
                                    Toast.show('请先报名',{position:Toast.positions.CENTER});
                                }

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
                        marginTop: 20, fontSize: hp(2.15), paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2, color: 'black',
                    }}>{typeData && renderEmoji(typeData.info, [], hp(2.15), 0,'black',{lineHeight: 25,
                        letterSpacing: 0.2,}).map((item, index) => {
                        return item;
                    })}</Text>
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
                            <FastImagePro
                                loadingType={2}
                                source={{uri: typeData.uri}}
                                style={{
                                    width: wp(33),
                                    height: wp(33), backgroundColor: '#F0F0F0', borderRadius: 3,
                                }}
                                resizeMode={'contain'}/>
                            {uploadStatus == 0 ?//正在上传
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, width: wp(33),
                                    height: wp(33),
                                    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize: 14}}>正在上传</Text>
                                </View>
                                : uploadStatus == -1 ?//上传失败
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: wp(33),
                                        height: wp(33),
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
                                    </View> : uploadStatus == 1 ?
                                        <Image
                                            resizeMode={'contain'}
                                            source={require('../../res/img/yanzhengbiaozhu/erweima.png')}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: 40,
                                                height: 15,
                                            }}/> : null
                            }
                        </TouchableOpacity>

                        <View style={styles.imgBox}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    if (this.props.isEdit) {
                                        saveImg(typeData.uri, (msg) => {
                                            Toast.show(msg);
                                        });
                                    } else {
                                        Toast.show('请先报名哦',{position:Toast.positions.CENTER});
                                    }
                                }}
                                style={{
                                    backgroundColor: bottomTheme, height: 40, width: 100, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 3,
                                }}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>保存二维码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </StepBox>;
            case 3://复制数据
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{
                        marginTop: 20, fontSize: hp(2.15), paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2, color: 'black',
                    }}>{typeData && renderEmoji(typeData.info, [], hp(2.15), 0,'black',{lineHeight: 25,
                        letterSpacing: 0.2,}).map((item, index) => {
                        return item;
                    })}</Text>
                    <View style={{flexDirection: 'row', marginTop: 20, paddingHorizontal: 10, alignItems: 'center'}}>

                        <View style={{
                            width: ((width - 62) / 4) * 3,
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
                                if (this.props.isEdit) {
                                    Clipboard.setString(typeData.inputValue);
                                } else {
                                    Toast.show('请先报名',{position:Toast.positions.CENTER});
                                }

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
                        marginTop: 20, fontSize: hp(2.15), paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2, color: 'black',
                    }}>{typeData && renderEmoji(typeData.info, [], hp(2.15), 0,'black',{lineHeight: 25,
                        letterSpacing: 0.2,}).map((item, index) => {
                        return item;
                    })}</Text>
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
                            <FastImagePro
                                loadingType={2}
                                source={{uri: typeData.uri}}
                                style={{
                                    width: wp(45),
                                    height: wp(55),
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: 3,
                                }}
                                resizeMode={'contain'}
                            />
                            {/*<Image*/}
                            {/*    />*/}
                            {uploadStatus == 0 ?//正在上传
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, width: wp(45),
                                    height: wp(55),
                                    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize: 14}}>正在上传</Text>
                                </View>
                                : uploadStatus == -1 ?//上传失败
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: wp(45),
                                        height: wp(55),
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
                                    </View> : uploadStatus == 1 ?
                                        <Image
                                            resizeMode={'contain'}
                                            source={require('../../res/img/yanzhengbiaozhu/tuwenshuoming.png')}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: 40,
                                                height: 15,
                                            }}/> : null
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
                        marginTop: 20, fontSize: hp(2.15), paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2, color: 'black',
                    }}>{typeData && renderEmoji(typeData.info, [], hp(2.15), 0,'black',{lineHeight: 25,
                        letterSpacing: 0.2,}).map((item, index) => {
                        return item;
                    })}</Text>
                    <View

                        style={{
                            flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, justifyContent: 'center',
                            paddingVertical: 10,
                        }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                this._imageClick(`${typeData.uri}?imageView2/0/q/75|watermark/1/image/aHR0cDovL2ltYWdlcy5lYXN5LXouY24vVmVyaWZpY2F0aW9uUGljMi5wbmc=/dissolve/90/gravity/SouthEast/dx/10/dy/10`);
                            }}
                            style={{marginRight: wp(3)}}>
                            <FastImagePro
                                loadingType={2}
                                source={{uri: `${typeData.uri}?imageView2/0/q/75|watermark/1/image/aHR0cDovL2ltYWdlcy5lYXN5LXouY24vVmVyaWZpY2F0aW9uUGljMi5wbmc=/dissolve/90/gravity/SouthEast/dx/10/dy/10`}}
                                style={{
                                    width: wp(42),
                                    height: wp(53),
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: 3,
                                }}
                                resizeMode={'contain'}/>

                            {uploadStatus == 0 ?//正在上传
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: wp(42),
                                    height: wp(53),
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
                                        width: wp(42),
                                        height: wp(53),
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
                                    </View> : uploadStatus == 1 ?
                                        <Image
                                            resizeMode={'contain'}
                                            source={require('../../res/img/yanzhengbiaozhu/yanzhengtu.png')}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: 40,
                                                height: 15,
                                            }}/> : null
                            }
                        </TouchableOpacity>
                        {/*{}*/}
                        {this.props.showEditModel &&
                        <View style={{
                            width: wp(42),
                            height: wp(53),
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            {uploadStatus1 === -2 ? <TouchableOpacity//未上传验证图
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        // this.
                                        this.refs[`pickerImg`].show(timestamp);

                                    }}
                                    style={{
                                        borderRadius: 5,
                                        width: wp(42),
                                        height: wp(53),
                                        borderWidth: 0.3,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <SvgUri width={50} height={50} svgXmlData={add_image}/>
                                    <Text style={{marginTop: 10, color: 'rgba(0,0,0,0.6)'}}>添加验证图片</Text>
                                </TouchableOpacity>
                                : <TouchableOpacity  //已经上传验证图
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        // this.
                                        this._imageClick(typeData.uri1);
                                    }}
                                    style={{
                                        borderRadius: 5,
                                        width: wp(42),
                                        height: wp(53),
                                        borderWidth: 0.3,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >

                                    <FastImagePro
                                        loadingType={2}
                                        source={{uri: typeData.uri1}}
                                        style={{
                                            width: wp(42),
                                            height: wp(53),
                                            backgroundColor: '#F0F0F0',
                                            borderRadius: 3,
                                        }}
                                        resizeMode={'contain'}/>
                                    {this.props.isEdit ? <TouchableOpacity //是否能修改状态
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

                                    {uploadStatus1 !== 1 && <View style={{ //状态管理
                                        position: 'absolute', top: 0, left: 0, width: wp(42),
                                        height: wp(53), borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.5)',
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
                                                    width: wp(42),
                                                    height: wp(53),
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


                    </View>
                </StepBox>;
            case 6://收集信息
                return <StepBox key={timestamp} timestamp={timestamp} showUtilColumn={this.props.showUtilColumn}
                                utilCick={utilClick}
                                no={stepNo} type={type}
                                typeData={typeData}>
                    <Text style={{
                        marginTop: 20, fontSize: hp(2.15), paddingHorizontal: 10, lineHeight: 25,
                        letterSpacing: 0.2, color: 'black',
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
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    Toast.show('请先报名',{position:Toast.positions.CENTER});
                                }}
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
                                    justifyContent: 'center',
                                    // alignItems:'center',
                                }}>
                                <Text style={{color: 'rgba(0,0,0,0.5)'}}>请按照要求输入文字内容</Text>


                            </TouchableOpacity>

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
        // console.log('我被render');
        return (
            <View style={{marginBottom: 15}}>
                <PickerImage popTitle={'选取验证图'}
                             select={this._selectVerifyImg}
                             ref={`pickerImg`}/>
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
