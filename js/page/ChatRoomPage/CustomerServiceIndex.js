import React from 'react';
import {View, Text,  Dimensions, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtils from '../../navigator/NavigationUtils';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import {theme} from '../../appSet';
import NavigationBar from '../../common/NavigationBar';
import Toast from '../../common/Toast';
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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, customerInfo[2], null, null, 'black', 16, null, false);
        return <SafeAreaViewPlus
            topColor={theme}
        >
            {navigationBar}
            {TopColumn}
            <Toast
                ref={ref => this.toast = ref}
            />
            <ScrollView style={{flex: 1, backgroundColor: '#e8e8e8'}}>
                <View style={{width, alignItems: 'center', backgroundColor: 'white', paddingBottom: 30}}>
                    <FastImagePro
                        style={{
                            marginTop: hp(3),
                            width: wp(24),
                            height: wp(24),

                            borderRadius: wp(24) / 2,
                        }}
                        source={{uri: customerInfo[3]}}
                    />
                    <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: wp(4.5)}}>{customerInfo[2]}</Text>
                        <SvgUri
                            style={{marginLeft: 5}}
                            width={17}
                            fill={'rgba(0,0,0,0.5)'}
                            height={17}
                            svgXmlData={kefu}/>
                    </View>
                    <View style={{marginTop: 15}}>
                        <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.5)'}}>
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
