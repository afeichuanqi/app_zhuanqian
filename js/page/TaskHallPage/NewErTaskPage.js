import React, {PureComponent} from 'react';

import {Dimensions, View, Text, TouchableOpacity, Linking, Clipboard} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FlatListCommonUtil from './FlatListCommonUtil';
import Image from 'react-native-fast-image';
import AnimatedFadeIn from '../../common/AnimatedFadeIn';
import Toast from "react-native-root-toast";


const {height, width} = Dimensions.get('window');

export default class NewErTaskPage extends PureComponent {


    render() {
        return <View>
            <View style={{
                height: hp(5.9),
                width,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 20,
                shadowColor: '#efefef',
                shadowRadius: 5,
                shadowOpacity: 1,
                shadowOffset: {w: 1, h: 1},
                elevation: 0.3,//安卓的阴影
            }}>
                <Image
                    style={{width: hp(2.8), height: hp(2.3)}}
                    source={require('../../res/img/laba.png')}
                />
                <View style={{
                    width: hp(4.8),
                    height: hp(2.6),
                    backgroundColor: '#ef3e5a',
                    marginLeft: 5,
                    borderBottomLeftRadius: 10,
                    borderTopRightRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 0.3,
                    borderColor: 'black',

                }}
                >
                    <Text style={{fontSize: hp(1.7), color: 'white'}}>New</Text>
                </View>
                <Text style={{fontSize: hp(3), color: '#ef3e5a', fontWeight: '700', marginLeft: hp(0.5)}}>:</Text>
                <TouchableOpacity
                    onPress={()=>{
                        Clipboard.setString('1090251007');
                        Toast.show('已经复制到剪切板');
                        Linking.openURL('https://shang.qq.com/wpa/qunwpa?idkey=45f3c1bca7373fad9dc337f7612c29f8a3bb399d43a5f304ee8cd0c65e6f0e39');
                    }}
                >
                    <Text style={{fontSize: hp(2.4),marginTop: hp(0.5),color:'rgba(0,0,0,0.8)'}}>赚客交流群:1090251007~~</Text>
                </TouchableOpacity>
            </View>
            <FlatListCommonUtil
                // ListHeaderComponent={<View style={{height: 15, width, backgroundColor: '#f5f5f5'}}/>}
                EmptyH={height - hp(27) + hp(5.9)}
                statusBarType={'light'}
                device={this.props.device}
                ref={ref => this.flatList = ref}
                onScrollBeginDrag={this._onScroll}
                onScrollEndDrag={this._onScroll}
                onMomentumScrollEnd={this.onMomentumScrollEnd}
                isShowPicLabel={false}
                isNewEr={true}
            />
        </View>;
    }

}
