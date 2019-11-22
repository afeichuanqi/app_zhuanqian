import React from 'react';

import {
    createAppContainer,
    createSwitchNavigator,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../page/Welcome';
import HomePage from '../page/HomePage';
import SearchPage from '../page/SearchPage';
import ShopInfoPage from '../page/ShopInfoPage';
import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers';
import {connect} from 'react-redux';
import ChatRoomPage from '../page/ChatRoomPage';
import LoginPage from '../page/LoginPage';
import EnterCodePage from '../page/EnterCodePage';
import TaskReleaseMana from '../page/TaskReleaseMana';
import TaskRelease from '../page/TaskRelease';
import {Testing} from '../page/Testing';
import TaskDetails from '../page/TaskDetails';
import SettingPage from '../page/SettingPage';
import ChatSettings from '../page/ChatSettings';
import AccountSetting from '../page/SettingPage/AccountSetting';
import UserProtocol from '../page/SettingPage/UserProtocol';
import MyTaskReview from '../page/MyTaskReview';
import TaskTurnDownPage from '../page/TaskTurnDownPage';
import MyOrderManaPage from '../page/MyOrderManaPage';
import TaskSendFromUserList from '../page/TaskSendFromUserList';

export const rootCom = 'Init';//设置根路由
const InitNavigator = createStackNavigator({
    Welcome: {
        screen: WelcomePage,
        navigationOptions: {
            header: null,
        },
    },
});

// const dynamicModalTransition = (transitionProps, prevTransitionProps) => {
//     const isModal = IOS_MODAL_ROUTES.some(
//         screenName =>
//             screenName === transitionProps.scene.route.routeName ||
//             (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName),
//     );
//     if (isModal) {
//         return {
//             screenInterpolator: Platform.OS === 'ios' ? CardStackStyleInterpolator.forFadeFromBottomAndroid : CardStackStyleInterpolator.forInitial,
//         };
//     } else {
//         return {
//             screenInterpolator: Platform.OS === 'android' ? CardStackStyleInterpolator.forVertical : CardStackStyleInterpolator.forHorizontal,
//         };
//     }
//
//
// };
const MainNavigator = createStackNavigator({
        HomePage: {
            screen: HomePage,
            navigationOptions: {
                header: null,
            },
        },
        SearchPage: {
            screen: SearchPage,
            navigationOptions: {
                header: null,
            },

        },
        ChatRoomPage: {
            screen: ChatRoomPage,
            navigationOptions: {
                header: null,
            },
        },
        ShopInfoPage: {
            screen: ShopInfoPage,
            navigationOptions: {
                header: null,
            },
        },
        LoginPage: {
            screen: LoginPage,
            navigationOptions: {
                header: null,
            },
        },
        EnterCodePage: {
            screen: EnterCodePage,
            navigationOptions: {
                header: null,
            },
        },
        TaskReleaseMana: {
            screen: TaskReleaseMana,
            navigationOptions: {
                header: null,
            },
        },
        TaskRelease: {
            screen: TaskRelease,
            navigationOptions: {
                header: null,
            },
        },
        TaskDetails: {
            screen: TaskDetails,
            navigationOptions: {
                header: null,
            },
        },
        Testing: {
            screen: Testing,
            navigationOptions: {
                header: null,
            },
        },
        SettingPage: {
            screen: SettingPage,
            navigationOptions: {
                header: null,
            },
        },
        AccountSetting: {
            screen: AccountSetting,
            navigationOptions: {
                header: null,
            },
        },
        UserProtocol: {
            screen: UserProtocol,
            navigationOptions: {
                header: null,
            },
        },
        ChatSettings: {
            screen: ChatSettings,
            navigationOptions: {
                header: null,
            },
        },
        MyTaskReview: {
            screen: MyTaskReview,
            navigationOptions: {
                header: null,
            },
        },
        TaskTurnDownPage: {
            screen: TaskTurnDownPage,
            navigationOptions: {
                header: null,
            },
        },
        MyOrderManaPage: {
            screen: MyOrderManaPage,
            navigationOptions: {
                header: null,
            },
        },
        TaskSendFromUserList: {
            screen: TaskSendFromUserList,
            navigationOptions: {
                header: null,
            },
        },


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
        // transitionConfig: dynamicModalTransition,
    },
);
const AppContainer = createSwitchNavigator({
        Init: InitNavigator,
        Main: MainNavigator,
    }, {
        navigationOptions: {
            header: null,
        },

    },
);
export const RootNavigator = createAppContainer(AppContainer);
/**
 * 1。初始化react-
 navigation与redux的中间件
 该方法的一个很大的作用就是为了reduxifyNavigator的key设置actionSubscribers(行为订阅者)

 */
export const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root',
);
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
