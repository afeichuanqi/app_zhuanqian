import React from 'react';
import {Platform} from 'react-native';

import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import WelcomePage from '../page/Welcome';
import HomePage from '../page/HomePage';
import {createReactNavigationReduxMiddleware, createReduxContainer} from "react-navigation-redux-helpers";
import CardStackStyleInterpolator from 'react-navigation-stack/lib/module/views/StackView/StackViewStyleInterpolator'
import {connect} from 'react-redux';

export const rootCom = "Init";//设置根路由
const InitNavigator = createStackNavigator({
    Welcome: {
        screen: WelcomePage,
        navigationOptions: {
            header: null,
        }
    }
});
const IOS_MODAL_ROUTES = ['VideoPlayPage', 'MyVipPage'];

const dynamicModalTransition = (transitionProps, prevTransitionProps) => {
    const isModal = IOS_MODAL_ROUTES.some(
        screenName =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    )
    if (isModal) {
        return {
            screenInterpolator: Platform.OS === 'ios' ? CardStackStyleInterpolator.forFadeFromBottomAndroid : CardStackStyleInterpolator.forInitial,
        };
    } else {
        return {
            screenInterpolator: Platform.OS === 'android' ? CardStackStyleInterpolator.forVertical : CardStackStyleInterpolator.forHorizontal,
        };
    }


};
const MainNavigator = createStackNavigator({
        HomePage: {
            screen: HomePage,
            navigationOptions: {
                header: null,
            }
        }


    },
    {
        // defaultNavigationOptions: {
        //     gesturesEnabled: true,
        // },
        initialRouteName: 'HomePage',
        // transitionConfig: () => ({
        //     screenInterpolator: CardStackStyleInterpolator.forInitial,
        // })
        // transitionConfig: () => ({
        //     screenInterpolator: StackViewStyleInterpolator.forHorizontal,
        // }),
        transitionConfig: dynamicModalTransition
    },
);
const AppContainer = createSwitchNavigator({
        Init: InitNavigator,
        Main: MainNavigator,
    }, {
        navigationOptions: {
            header: null,
        },

    }
)
export const RootNavigator = createAppContainer(AppContainer);
/**
 * 1。初始化react-
 navigation与redux的中间件
 该方法的一个很大的作用就是为了reduxifyNavigator的key设置actionSubscribers(行为订阅者)

 */
export const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root',
)
/**
 * 2。将根导航器组件传递给reduxifyNavigator函数，
 * 并返回一个将
 navigation'state和dispatch函数作为props的新组件
 注意：要在createNavigationReduxMiddleware之后执行
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');
/**
 * 3.State到Props的映射关系
 */
const mapStateToProps = state => ({
    state: state.nav,//V2
});
/**
 * 4.连接React组件与redux Store
 *
 * */
export default connect(mapStateToProps)(AppWithNavigationState);
