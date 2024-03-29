import React from 'react';
import {Platform} from 'react-native';
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
import TaskDetails from '../page/TaskDetails';
import SettingPage from '../page/SettingPage';
import ChatSettings from '../page/ChatRoomPage/ChatSettings';
import AccountSetting from '../page/SettingPage/AccountSetting';
import UserProtocol from '../page/SettingPage/UserProtocol';
import MyTaskReview from '../page/MyTaskReview';
import TaskTurnDownPage from '../page/TaskTurnDownPage';
import MyOrderManaPage from '../page/MyOrderManaPage';
import TaskSendFromUserList from '../page/TaskSendFromUserList';
import MessageAppealPage from '../page/MessageAppealPage';
import MyAttentionList from '../page/MyAttentionList';
import TaskOrdersMana from '../page/TaskOrdersMana';
import HisAttentionList from '../page/HisAttentionList';
import UserBillListPage from '../page/UserBillListPage';
import FriendPromotionPage from '../page/FriendPromotionPage';
import UpdateUserName from '../page/SettingPage/UpdateUserName';
import InvitationCodePage from '../page/InvitationCodePage';
import TaskRejectDetailsPage from '../page/TaskRejectDetailsPage';
import MyFavoritePage from '../page/MyFavoritePage';
import MyShieldPage from '../page/MyShieldPage';
import MyViewHistoryPage from '../page/MyViewHistoryPage';
import SystemNotificationPage from '../page/SystemNotificationPage';
import RechargePage from '../page/RechargePage';
import UserUpdateOrderPage from '../page/UserUpdateOrderPage';
import UserFeedbackListPage from '../page/UserFeedbackListPage';
import WithDrawPage from '../page/WithDrawPage';
import CustomerServiceIndex from '../page/ChatRoomPage/CustomerServiceIndex';
import WithDrawPayPage from '../page/WithDrawPayPage';
import WithDrawAccount from '../page/WithDrawAccount';
import AountMePage from '../page/AboutMePage';
import MyPageTmp from '../page/MyPageTmp';
import TaskDetailsTmp from '../page/TaskDetailsTmp';
import OnlineService from '../page/OnlineService';
import ImageExample from '../common/ImageViewer/ImageViewer';
import CardStackStyleInterpolator from 'react-navigation-stack/lib/module/views/StackView/StackViewStyleInterpolator';
import UserFeedbackPage from '../page/UserFeedbackPage';

export const rootCom = 'Init';//设置根路由
const InitNavigator = createStackNavigator({
    Welcome: {
        screen: WelcomePage,
        navigationOptions: {
            header: null,
        },
    },
});
const IOS_MODAL_ROUTES = ['TaskDetails'];
const IOS_MODAL_ROUTES1 = ['ShopInfoPage'];
const dynamicModalTransition = (transitionProps, prevTransitionProps) => {
    const isModal = IOS_MODAL_ROUTES.some(
        screenName =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName),
    );
    const isModal1 = IOS_MODAL_ROUTES1.some(
        screenName =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName),
    );
    // if (isModal1 && Platform.OS === 'android') {
    //     return {
    //         screenInterpolator: CardStackStyleInterpolator.forNoAnimation,
    //     };
    // }
    if (isModal1) {
        return {
            screenInterpolator: Platform.OS === 'android' ? CardStackStyleInterpolator.forNoAnimation : CardStackStyleInterpolator.forHorizontal,
        };
    }
    if (isModal) {
        return {
            screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid,
        };
    } else {
        return {
            screenInterpolator: Platform.OS === 'android' ? CardStackStyleInterpolator.forFadeFromBottomAndroid : CardStackStyleInterpolator.forHorizontal,
        };
    }


};
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
        InvitationCodePage: {
            screen: InvitationCodePage,
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
        WithDrawPayPage: {
            screen: WithDrawPayPage,
            navigationOptions: {
                header: null,
            },
        },
        OnlineService: {
            screen: OnlineService,
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
        MessageAppealPage: {
            screen: MessageAppealPage,
            navigationOptions: {
                header: null,
            },
        },
        TaskOrdersMana: {
            screen: TaskOrdersMana,
            navigationOptions: {
                header: null,
            },
        },
        MyAttentionList: {
            screen: MyAttentionList,
            navigationOptions: {
                header: null,
            },
        },
        HisAttentionList: {
            screen: HisAttentionList,
            navigationOptions: {
                header: null,
            },
        },
        UserBillListPage: {
            screen: UserBillListPage,
            navigationOptions: {
                header: null,
            },
        },
        FriendPromotionPage: {
            screen: FriendPromotionPage,
            navigationOptions: {
                header: null,
            },
        },
        UpdateUserName: {
            screen: UpdateUserName,
            navigationOptions: {
                header: null,
            },
        },
        TaskRejectDetailsPage: {
            screen: TaskRejectDetailsPage,
            navigationOptions: {
                header: null,
            },
        },
        ImageExample: {
            screen: ImageExample,
            navigationOptions: {
                header: null,
            },
        },
        MyFavoritePage: {
            screen: MyFavoritePage,
            navigationOptions: {
                header: null,
            },
        },
        MyShieldPage: {
            screen: MyShieldPage,
            navigationOptions: {
                header: null,
            },
        },
        SystemNotificationPage: {
            screen: SystemNotificationPage,
            navigationOptions: {
                header: null,
            },
        },
        MyViewHistoryPage: {
            screen: MyViewHistoryPage,
            navigationOptions: {
                header: null,
            },
        },
        RechargePage: {
            screen: RechargePage,
            navigationOptions: {
                header: null,
            },
        },
        WithDrawPage: {
            screen: WithDrawPage,
            navigationOptions: {
                header: null,
            },
        },
        UserFeedbackPage: {
            screen: UserFeedbackPage,
            navigationOptions: {
                header: null,
            },
        },
        UserUpdateOrderPage: {
            screen: UserUpdateOrderPage,
            navigationOptions: {
                header: null,
            },
        },
        UserFeedbackListPage: {
            screen: UserFeedbackListPage,
            navigationOptions: {
                header: null,
            },
        },
        WithDrawAccount: {
            screen: WithDrawAccount,
            navigationOptions: {
                header: null,
            },
        },
        CustomerServiceIndex: {
            screen: CustomerServiceIndex,
            navigationOptions: {
                header: null,
            },
        },
        AountMePage: {
            screen: AountMePage,
            navigationOptions: {
                header: null,
            },
        },
        TaskDetailsTmp: {
            screen: TaskDetailsTmp,
            navigationOptions: {
                header: null,
            },
        },
        MyPageTmp: {
            screen: MyPageTmp,
            navigationOptions: {
                header: null,
            },
        },


    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: true,
        },
        initialRouteName: 'HomePage',
        // transitionConfig: () => ({
        //     screenInterpolator: CardStackStyleInterpolator.forInitial,
        // })
        // transitionConfig: () => ({
        //     screenInterpolator: StackViewStyleInterpolator.forHorizontal,
        // }),
        transitionConfig: dynamicModalTransition,
    },
);
const AppContainer = createSwitchNavigator({
        Init: MainNavigator,
        Main: InitNavigator,
        // UserProtocol: UserProtocol,
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
