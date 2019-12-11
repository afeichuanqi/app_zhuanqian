import userinfo from './userinfo';
import friend from './friend';
import taskInfo from './taskInfo';
import message from './message';
import search from './search';
import socketStatus from './socketStatus';
import {persistCombineReducers} from 'redux-persist';
import {rootCom, RootNavigator} from '../navigator/AppNavigators';
import storage from '@react-native-community/async-storage';
//1.指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));
/**
 * 创建自己的navigation reducer
 */
const navReducer = (state = navState, action) => {

    const nextState = RootNavigator.router.getStateForAction(action, state);
    state.type = action.type;
    state.key = action.key;

    return nextState || state;
};
/**
 * 3.合并reducer
 *
 * */
const index = {
        nav: navReducer,
        userinfo,
        message,
        friend,
        socketStatus,
        taskInfo,
        search,
    }
;
const config = {
    key: 'root',
    storage,
    whitelist: ['userinfo', 'taskInfo', 'search'],
};
let reducer = persistCombineReducers(config, index);
export default reducer;
