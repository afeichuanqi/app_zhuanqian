/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import SvgUri from 'react-native-svg-uri';
import add_image from '../res/svg/add_image.svg';
import {uploadQiniuImage} from '../util/AppService';
import PickerImage from './PickerImage';
import ImageViewerModal from './ImageViewerModal';
import Toast from 'react-native-root-toast';
class UploadImgsComponent extends PureComponent {
    constructor(props) {
        super(props);
    }

    static defaultProps = {};
    state = {
        data: [{}],
    };

    reStart=()=>{
        this.setState({
            data: [{}],
        })
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }


    render() {

        return (<View style={{marginBottom: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.state.data.map((item, index, arr) => {

                    if (!item.close) {
                        return <TouchableOpacity
                            key={index}
                            ref={ref => this.btn = ref}
                            onPress={() => {
                                if (!this.props.userinfo.login) {
                                    Toast.show('Network Error');
                                    return;
                                }
                                const {uri} = this.state.data[index];
                                if (uri && (uri.indexOf('file://') !== -1 || uri.indexOf('http') !== -1)) {
                                    let uris = [];
                                    for (let i = 0; i < this.state.data.length; i++) {
                                        const item = this.state.data[i];
                                        if (item.uploadStatus == 1) {
                                            uris.push({url: item.uri});
                                        }
                                        if (i === this.state.data.length - 1) {
                                            this.imageView.show(uris, uri);
                                        }
                                    }

                                } else {
                                    this.refs[`picker${index}`].show(index);
                                }

                            }}
                            style={{

                                width: 55,
                                height: 55,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'rgba(0,0,0,0.3)',
                                marginTop: 10, marginRight: 10,
                                borderRadius: 5,

                                borderStyle: 'dashed',
                                borderWidth: 1,
                                marginLeft: 10,
                                // borderWidth:1, borderColor:'rgba(255,0,0,1)',
                            }}>
                            {item.uri ? <Image
                                source={{uri: item.uri}}
                                style={{
                                    width: 55, height: 55,
                                    borderRadius: 0,
                                }}
                            /> : <SvgUri width={35} height={35} svgXmlData={add_image}/>}
                            {item.uploadStatus == 0 &&
                            <View style={{
                                width: 55, height: 55, backgroundColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center', alignItems: 'center', position: 'absolute',

                            }}>
                                <Text style={{fontSize: 12, color: 'white'}}>正在上传</Text>
                            </View>
                            }
                            {item.uploadStatus == -1 &&
                            <TouchableOpacity
                                onPress={() => {
                                    const {userinfo} = this.props;
                                    if(!userinfo.token){
                                        Toast.show('请先登录');
                                        return
                                    }
                                    const tmpArr = [...this.state.data];
                                    const item = tmpArr[index];
                                    const uri = item.uri;
                                    const mimeIndex = uri.lastIndexOf('.');
                                    const mime = uri.substring(mimeIndex + 1, uri.length);
                                    tmpArr[index].uploadStatus = 0;
                                    this.setState({
                                        data: tmpArr,
                                    });
                                    uploadQiniuImage(userinfo.token, 'reUploadStep', mime, uri).then(url => {
                                        tmpArr[index].uploadStatus = 1;
                                        tmpArr[index].uri = url;
                                        this.setState({
                                            data: tmpArr,
                                        });
                                        this.forceUpdate();
                                    }).catch(err => {
                                        tmpArr[index].uploadStatus = -1;
                                        this.setState({
                                            data: tmpArr,
                                        });
                                        this.forceUpdate();
                                    });
                                }}
                                style={{
                                    width: 55, height: 55, backgroundColor: 'rgba(0,0,0,0.5)',
                                    justifyContent: 'center', alignItems: 'center', position: 'absolute',
                                }}>
                                <View style={{
                                    width: 40,
                                    height: 20,
                                    borderRadius: 3,
                                    backgroundColor: 'red',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{fontSize: 9, color: 'white'}}>重新上传</Text>
                                </View>
                            </TouchableOpacity>
                            }
                            {item.uri && <TouchableOpacity
                                onPress={() => {
                                    const tmpArr = [...this.state.data];
                                    let interval = 0;
                                    for (let i = 0; i < tmpArr.length; i++) {
                                        if (JSON.stringify(tmpArr[i]) === '{}') {
                                            interval += 1;

                                        }
                                        if (i === tmpArr.length - 1) {
                                            if (interval >= 1) {
                                                tmpArr[index] = {close: true};
                                                this.setState({
                                                    data: tmpArr,
                                                });
                                            } else {
                                                tmpArr[index] = {};
                                                this.setState({
                                                    data: tmpArr,
                                                });
                                            }
                                        }
                                    }


                                }}
                                style={{
                                    width: 15,
                                    height: 15,
                                    borderRadius: 10,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    right: -5,
                                    top: -5,
                                }}>
                                <Text style={{color: 'white', fontSize: 12}}>X</Text>
                            </TouchableOpacity>}
                            <PickerImage includeBase64={false} cropping={false} select={this._selectImg}
                                         ref={`picker${index}`}/>
                        </TouchableOpacity>;
                    } else {
                        return null;
                    }
                })}
                <ImageViewerModal statusBarType={'dark'}  ref={ref => this.imageView = ref}/>
            </View>
        );
    }

    getImages = () => {
        return this.state.data;
    };
    _selectImg = (imageData, timestamp) => {

        const {userinfo} = this.props;
        if(!userinfo.token){
            Toast.show('请先登录');
            return
        }
        let mime = imageData.mime;
        const mimeIndex = mime.indexOf('/');
        mime = mime.substring(mimeIndex + 1, mime.length);
        const uri = `file://${imageData.path}`;
        const tmpArr = [...this.state.data];
        tmpArr[timestamp] = {uri, uploadStatus: 0};
        let interval = 0;
        let length = tmpArr.length;
        for (let i = 0; i < length; i++) {
            if (tmpArr[i].close) {
                interval += 1;
            }
            if (i === tmpArr.length - 1) {
                if (tmpArr.length - interval < 3) {
                    tmpArr.push({});
                }
                this.setState({
                    data: tmpArr,
                });
                setTimeout(() => {
                    uploadQiniuImage(userinfo.token, 'stepFile', mime, uri).then(URL => {
                        tmpArr[timestamp].uploadStatus = 1;
                        tmpArr[timestamp].uri = URL;
                        this.setState({
                            data: tmpArr,
                        });
                        this.forceUpdate();
                    }).catch(err => {
                        tmpArr[timestamp].uploadStatus = -1;
                        this.setState({
                            data: tmpArr,
                        });
                        this.forceUpdate();
                    });
                }, 500);

            }
        }


    };


}


export default UploadImgsComponent;
