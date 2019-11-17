/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Text, StatusBar, Dimensions, TouchableOpacity} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import IndexPage from '../page/IndexPage';
import TaskHallPage from '../page/TaskHallPage';
import {bottomTheme, theme} from '../appSet';
import MessagePage from '../page/MessagePage';
import MyPage from '../page/MyPage';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {TabView} from 'react-native-tab-view';
import hall from '../res/svg/indexPage/hall.svg';
import hallA from '../res/svg/indexPage/hallA.svg';
import home from '../res/svg/indexPage/home.svg';
import homeA from '../res/svg/indexPage/homeA.svg';
import message from '../res/svg/indexPage/message.svg';
import messageA from '../res/svg/indexPage/messageA.svg';
import my from '../res/svg/indexPage/my.svg';
import myA from '../res/svg/indexPage/myA.svg';
import {connect} from 'react-redux';

type Props = {};

const {width, height} = Dimensions.get('window');

class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {
            navigationIndex: 0,
            navigationRoutes: [
                {key: 'index', title: '推荐'},
                {key: 'hall', title: '最新'},
                {key: 'message', title: '最新'},
                {key: 'my', title: '最新'},
            ],
        };
    }

    render() {
        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                <TabView
                    indicatorStyle={{backgroundColor: 'white'}}
                    navigationState={{index: navigationIndex, routes: navigationRoutes}}
                    renderScene={this.renderScene}
                    renderTabBar={() => null}
                    onIndexChange={(index) => {
                        this.setState({navigationIndex: index});
                    }}
                    initialLayout={{width}}
                    lazy={true}
                />
                <BottomBarRedux onPress={(index) => {
                    this.jumpTo(navigationRoutes[index].key);
                }} navigationIndex={navigationIndex} jumpTo={this.jumpTo} navigationRoutes={navigationRoutes}/>
            </SafeAreaViewPlus>

        );
    }

    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'index':
                return <IndexPage/>;
            case 'hall':
                return <TaskHallPage/>;
            case 'message':
                return <MessagePage/>;
            case 'my':
                return <MyPage/>;
        }
    };
}

class BottomBar extends Component {
    render() {
        const {navigationIndex, jumpTo, navigationRoutes, onPress} = this.props;
        const {unMessageLength} = this.props.friend;
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderTopWidth: 0.8,
            borderTopColor: '#c0c0c0',
        }}>
            {this._renderBottomBar(
                navigationIndex === 0 ? homeA : home,
                (index) => {
                    StatusBar.setBarStyle('dark-content', true);
                    StatusBar.setBackgroundColor(theme, true);
                    onPress(index);
                },
                0,
                navigationIndex === 0 ? true : false,
                35,
            )

            }
            {this._renderBottomBar(
                navigationIndex === 1 ? hallA : hall,
                (index) => {
                    StatusBar.setBarStyle('light-content', true);
                    StatusBar.setBackgroundColor(bottomTheme, true);
                    onPress(index);
                },
                1,
                navigationIndex === 1 ? true : false,
                35,
            )}
            {this._renderBottomBar(
                navigationIndex === 2 ? messageA : message,

                (index) => {
                    StatusBar.setBarStyle('light-content', true);
                    StatusBar.setBackgroundColor(bottomTheme, true);
                    onPress(index);
                },
                2,
                navigationIndex === 2 ? true : false,
                37,
                unMessageLength ? unMessageLength : 0,
            )}
            {this._renderBottomBar(
                navigationIndex === 3 ? myA : my,
                (index) => {
                    StatusBar.setBarStyle('light-content', true);
                    StatusBar.setBackgroundColor(bottomTheme, true);
                    onPress(index);
                }, 3,
                navigationIndex === 3 ? true : false,
                37,
            )}
        </View>;
    }

    _renderBottomBar = (svgXmlData, onPress, key, isActive, size = 35, unReadLength = 0) => {

        return <TouchableOpacity
            onPress={() => {
                onPress(key);
            }}
            style={{width: width / 4, height: 50, justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <SvgUri fill={isActive ? bottomTheme : 'rgba(0,0,0,0.5)'} width={size}
                        height={size}
                        svgXmlData={svgXmlData}
                        style={{marginBottom: 2}}
                />
                {unReadLength > 0 && <View style={{
                    position: 'absolute',
                    right: -11,
                    top: 0,
                    backgroundColor: 'red',
                    paddingHorizontal: 5,
                    borderRadius: 8,
                }}>
                    <Text style={{color: 'white', fontSize: 12}}>{unReadLength}</Text>
                </View>}

            </View>


        </TouchableOpacity>;
    };
}

const mapStateToProps = state => ({
    friend: state.friend,
});
const mapDispatchToProps = dispatch => ({});
const BottomBarRedux = connect(mapStateToProps, mapDispatchToProps)(BottomBar);
export default DynamicTabNavigator;
