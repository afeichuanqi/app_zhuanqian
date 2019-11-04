import {combineReducers} from "redux";
import theme from './theme';
import bartitle from './bartitle';
import register from './register';
import login_ from './login';
import userinfo from './userinfo';
import hotconfig from './hotconfig';
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
    theme,
    register,
    login_,
    userinfo,
    hotconfig,
    bartitle,

})
export default index;