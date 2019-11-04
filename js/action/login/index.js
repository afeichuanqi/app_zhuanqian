import Types from '../Types';
import {starLogin} from '../../util/AppService'
import {writeUserInfo} from '../../util/DButils';
/**
 * 主题变更
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onLogin(username, password) {
    return dispatch => {
        dispatch({type: Types.LOGIN_LOADING})
        starLogin(username, password).then(data => {
            data.username = username;
            data.password = password;
            data.userId = 1;
            data.isExpired = false;
            writeUserInfo(data);
            dispatch({type: Types.LOGIN_SUCCESS, data:data})
        }).catch(err => {
            dispatch({type: Types.LOGIN_FAIL, msg: err})
        })

    }
}