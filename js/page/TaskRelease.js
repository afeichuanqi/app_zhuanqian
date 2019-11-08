/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import {View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import menu_right from '../res/svg/menu_right.svg';
import SvgUri from 'react-native-svg-uri';
import PopMenu from '../common/PopMenu';

const {width, height} = Dimensions.get('window');

class TaskRelease extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '任务发布', null, bottomTheme, 'white', 16);
        // const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <ScrollView style={{backgroundColor: '#e8e8e8'}}>
                    <TypeSelect/>
                    <TypeSelect style={{marginTop: 10}} title={'支持设备'} typeArr={[
                        {id: 1, title: '全部'},
                        {id: 2, title: '安卓'},
                        {id: 3, title: '苹果'},
                    ]}/>
                    <BottomInfoForm/>
                </ScrollView>

            </SafeAreaViewPlus>
        );
    }
}

class BottomInfoForm extends Component {
    genFormItem = (title, info, showRight = false, modelName) => {
        return <View style={{
            width, flexDirection: 'row', height: 40, paddingHorizontal: 10, paddingVertical: 10,
            alignItems: 'center',
        }}>
            <Text style={{width: 70}}>{title}</Text>
            {showRight ? <TouchableOpacity
                    activeOpacity={1}
                    onPress={()=>{
                        this.dateMenu.show();
                    }}
                    style={{flex: 1}}>
                    <Text>{info}</Text>
                </TouchableOpacity>

                :
                <TextInput style={{flex: 1}}
                           placeholder={info}
                />}

            {showRight && <SvgUri width={10} style={{marginLeft: 5}} height={10} svgXmlData={menu_right}/>}
        </View>;
    };

    render() {
        return <View style={{marginTop: 10, backgroundColor: 'white'}}>
            {this.genFormItem('项目名称', '请输入项目名')}
            {this.genFormItem('标题', '关键字')}
            {this.genFormItem('任务说明', '需求备注')}
            {this.genFormItem('接单时限', '1小时', true, this.dateMenu)}
            {this.genFormItem('审核时间', '1天', true)}
            <PopMenu ref={ref => this.dateMenu = ref}/>

        </View>;
    }
}

class TypeSelect extends PureComponent {
    static defaultProps = {
        title: '请选择类型',
        typeArr: [
            {id: 1, title: '注册'},
            {id: 2, title: '投票'},
            {id: 3, title: '关注'},
            {id: 4, title: '浏览'},
            {id: 5, title: '下载'},
            {id: 6, title: '转发'}, {id: 7, title: '下载'},
            {id: 8, title: '转发'}, {id: 9, title: '下载'},
            {id: 10, title: '转发'}, {id: 11, title: '下载'},
            {id: 12, title: '转发'}, {id: 13, title: '下载'},
            {id: 14, title: '转发'}, {id: 15, title: '下载'},
        ],
        index: 0,
    };
    state = {
        typeIndex: 0,
    };

    render() {
        const {title, typeArr} = this.props;
        const {typeIndex} = this.state;

        return <View style={[{backgroundColor: 'white', paddingBottom: 20}, this.props.style]}>
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
                <Text style={{fontSize: 15}}>{title}</Text>
            </View>
            <View style={{

                flexDirection: 'row',
                flexWrap: 'wrap',

            }}>
                {typeArr.map((item, index, arr) => {
                    return <TypeComponent checked={typeIndex === item.id ? true : false} ref={`typeBtn${item.id}`}
                                          key={item.id}
                                          onPress={this._typeClick}
                                          data={item} index={item.id}/>;

                })}

            </View>
        </View>;
    }

    _typeClick = (index, data, checked) => {
        if (checked) {
            this.setState({
                typeIndex: index,
            });
        }

    };
}

class TypeComponent extends Component {
    static defaultProps = {
        data: {id: 1, title: 'test'},
    };


    componentDidMount(): void {

    }


    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.checked != nextProps.checked) {
            console.log('我该更新了');
            return true;
        }
        return false;
    }

    _onPress = () => {
        this.props.onPress(this.props.index, this.props.data, true);

    };

    render() {
        const {checked, data} = this.props;

        return <TouchableOpacity
            onPress={this._onPress}
            style={[{
                width: width / 4 - 20, height: 25, marginTop: 10, backgroundColor: '#f1f1f1', justifyContent: 'center',
                alignItems: 'center', marginHorizontal: 10, borderRadius: 3,
            }, !checked ? {backgroundColor: '#f3f3f3'} : {
                backgroundColor: 'rgba(33,150,243,0.1)',
                borderWidth: 0.3, borderColor: bottomTheme,
            }]}>
            <Text style={[{
                fontSize: 14,
                color: 'rgba(255,255,255,0.5)',
                opacity: 0.8,
            }, !checked ? {
                color: 'black',
                opacity: 0.7,
            } : {color: bottomTheme}]}>{data.title}</Text>
        </TouchableOpacity>;
    }
}

export default TaskRelease;
