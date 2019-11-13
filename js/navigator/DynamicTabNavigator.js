/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, {Component} from 'react';
import  {StatusBar} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import SvgUri from 'react-native-svg-uri';
import {BottomTabBar} from 'react-navigation-tabs';
import IndexPage from '../page/IndexPage';
import TaskHallPage from '../page/TaskHallPage';
import {bottomTheme, theme} from '../appSet';
import zhuan from '../res/svg/zhuan.svg';
import MessagePage from '../page/MessagePage';
import MyPage from '../page/MyPage';

type Props = {};
const TABS = {
    IndexPage: {
        screen: IndexPage,
        navigationOptions: {
            tabBarLabel: '主页',
            tabBarIcon: ({tintColor, focused}) => (
                <SvgUri width={24} height={24} fill={focused ? bottomTheme : tintColor} svgXmlData={zhuan}/>
            ),
            tabBarOnPress: (navigation, defaultHandler) => {
                navigation.defaultHandler();
                // console.log();
                StatusBar.setBarStyle('dark-content',true)
                StatusBar.setBackgroundColor(theme,true)
                // defaultHandler();
            },
        },
    },
    TaskHallPage: {
        screen: TaskHallPage,
        navigationOptions: {
            tabBarLabel: '大厅',
            tabBarIcon: ({tintColor, focused}) => (
                <SvgUri width={24} height={24} fill={focused ? bottomTheme : tintColor} svgXmlData={zhuan}/>
            ),
            tabBarOnPress: (navigation, defaultHandler) => {
                navigation.defaultHandler();
                // console.log();
                StatusBar.setBarStyle('light-content',true)
                StatusBar.setBackgroundColor(bottomTheme,true)
                // defaultHandler();
            },
        },
    },
    MessagePage: {
        screen: MessagePage,
        navigationOptions: {
            tabBarLabel: '消息',
            tabBarIcon: ({tintColor, focused}) => (
                <SvgUri width={24} height={24} fill={focused ? bottomTheme : tintColor} svgXmlData={zhuan}/>
            ),
            tabBarOnPress: (navigation, defaultHandler) => {
                navigation.defaultHandler();
                // console.log();
                StatusBar.setBarStyle('light-content',true)
                StatusBar.setBackgroundColor(bottomTheme,true)
                // defaultHandler();
            },
        },
    }, MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <SvgUri width={24} height={24} fill={focused ? bottomTheme : tintColor} svgXmlData={zhuan}/>
            ),
            tabBarOnPress: (navigation, defaultHandler) => {
                navigation.defaultHandler();
                // console.log();
                StatusBar.setBarStyle('light-content',true)
                StatusBar.setBackgroundColor(bottomTheme,true)
                // defaultHandler();
            },

        },
    },
};

class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        // console.log('props:', props);
    }

    _tabNavigator = () => {
        if (this.Tabs) {
            return this.Tabs;
        }
        // const {PopularPage, TrendingPage, FavoritePage,SharingPage, MyPage} = TABS;
        // const tabs = {PopularPage, TrendingPage, FavoritePage,SharingPage ,MyPage};//根据需要定制显示的tab
        // HomeForPage.navigationOptions.tabBarLabel = '最新';//动态配置Tab属性
        return this.Tabs = createAppContainer(createBottomTabNavigator(TABS, {
            tabBarComponent: props => {
                return <TabBarcompnent {...props} theme={bottomTheme}/>;
            },
        }));
    };

    render() {
        const Tab = this._tabNavigator();
        return (<Tab/>
        );
    }
}

class TabBarcompnent extends Component {
    render() {
        return (
            <BottomTabBar
                {...this.props}
            />

        );

    }
}

// const mapStateToProps = state => {
//     // console.log('state', state);
//     return {
//         theme: state.theme.theme,
//     }
// }
export default DynamicTabNavigator;
