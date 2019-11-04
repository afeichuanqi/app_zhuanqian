import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';
import {middleware} from '../navigator/AppNavigators';
//日志打印系统的中间件
const logger = store => next => action => {
    // if(typeof action==='function'){
    //     console.log('dispatching a function');
    // }else {
    //     console.log('dispatching ', action);
    // }
    return next(action);
}
const middlewares = [
    middleware,
    logger,
    thunk
]
/**
 * 创建store
 */
export default createStore(reducers, applyMiddleware(...middlewares));
