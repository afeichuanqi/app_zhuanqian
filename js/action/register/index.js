import Types from '../Types';
import {starRegister} from '../../util/AppService'

/**
 * 主题变更
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onRegister(username, password, email, Platforms, DeviceID,invite) {
    return dispatch => {
        dispatch({type: Types.REGISTER_LOADING})
        const data = {};
        data.userName = username;
        data.passWord = password;
        data.email = email;
        data.Platforms = Platforms;
        data.DeviceID = DeviceID;
        data.invite=invite;

        starRegister(data).then(msg => {
            dispatch({type: Types.REGISTER_SUCCESS, msg: msg, user: username, pwd: password, email})
        }).catch(err => {
            dispatch({type: Types.REGISTER_FAIL, msg: err})
        })

    }
}