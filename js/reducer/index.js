import {combineReducers} from "redux";
import userinfo from './userinfo';
import {rootCom, RootNavigator} from "../navigator/AppNavigators";
//1.指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));
/**
 * 创建自己的navigation reducer
 */
const navReducer = (state = navState, action) => {
    const nextState = RootNavigator.router.getStateForAction(action, state);
    return nextState || state;
}
/**
 * 3.合并reducer
 *
 * */
const index = combineReducers({
    nav: navReducer,
    userinfo,

})
export default index;
