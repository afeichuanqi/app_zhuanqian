import React from 'react';
import {View, Text,  Dimensions, ScrollView,Image} from 'react-native';
import {connect} from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtils from '../../navigator/NavigationUtils';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import {theme} from '../../appSet';
import NavigationBar from '../../common/NavigationBar';
import FastImagePro from '../../common/FastImagePro';
import SvgUri from 'react-native-svg-uri';
import kefu from '../../res/svg/kefu.svg';

const {width} = Dimensions.get('window');

class CustomerServiceIndex extends React.Component {
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    // componentDidMount(): void {
    //     this.toast.show(this.params.customerInfo.length);
    // }

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        const customerInfo = this.params.customerInfo;
        // const customerInfos = customerInfo.spi
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, customerInfo[2], null, null, 'black', hp(2.4), null, false);
        return <SafeAreaViewPlus
            topColor={theme}
        >
            {navigationBar}
            {TopColumn}
            <ScrollView style={{flex: 1, backgroundColor: '#e8e8e8'}}>
                <View style={{width, alignItems: 'center', backgroundColor: 'white', paddingBottom: 30}}>
                    <FastImagePro
                        style={{
                            marginTop: hp(3),
                            width: hp(12),
                            height: hp(12),

                            borderRadius: hp(12) / 2,
                        }}
                        source={{uri: customerInfo[3]}}
                    />
                    <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: hp(2.5)}}>{customerInfo[2]}</Text>
                        <Image
                            source={require('../../res/img/kefu.png')}
                            style={{marginLeft: 5,width:hp(6),height:hp(2.4), borderRadius:3}}
                        />
                    </View>
                    <View style={{marginTop: 15}}>
                        <Text style={{fontSize: hp(1.9), color: 'rgba(0,0,0,0.5)'}}>
                            HI 我是客服{customerInfo[2]},让我们一起了解简易赚 ~ ~
                        </Text>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaViewPlus>;
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
const CustomerServiceIndexRedux = connect(mapStateToProps, mapDispatchToProps)(CustomerServiceIndex);
export default CustomerServiceIndexRedux;
