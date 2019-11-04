import Types from '../Types';
import {getHotConfig} from '../../util/AppService'

/**
 * 用戶 中心
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onHotConfig(token) {
    return dispatch => {
        dispatch({type: Types.HOT_CONFIG_LOADING})
        // console.log("onHotConfig");
        getHotConfig().then(data => {
            dispatch({type: Types.HOT_CONFIG_SUCCESS,data:data})
        }).catch(err => {
            dispatch({type: Types.HOT_CONFIG_FAIL, msg: err})
        })

    }
}