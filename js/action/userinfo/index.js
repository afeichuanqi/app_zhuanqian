import Types from '../Types';
import {verifyCode, uploadAvatar, setUserData} from '../../util/AppService';

/**
 * 账户登录
 * @returns {{theme: *, type: string}}
 */
export function onLogin(phone, code, platform, DeviceID, device_brand, device_name, device_system_version, device_is_tablet, callback) {
    return dispatch => {
        dispatch({type: Types.LOGIN_LOADING});
        verifyCode({
            phone,
            code,
            platform,
            DeviceID,
            device_brand,
            device_name,
            device_system_version,
            device_is_tablet,
        }).then((data) => {
            callback(true);
            dispatch({
                type: Types.LOGIN_SUCCESS,
                data: data,
            });
        }).catch(msg => {
            callback(false, msg);
        });

    };
}

/**
 * 修改头像
 * @returns {{theme: *, type: string}}
 */
export function onUploadAvatar(token, data, callback) {
    return dispatch => {
        dispatch({type: Types.UPLOAD_AVATAR_LOADING});
        uploadAvatar(data, token).then((data) => {
            callback(true, data);
            console.log(data, 'data');
            dispatch({
                type: Types.UPLOAD_AVATAR_SUCCESS,
                data: {avatar_url: data.imageUrl},
            });
        }).catch((msg) => {
            callback(false, {msg});
        });

    };
}

/**
 * 修改性别
 * @returns {{theme: *, type: string}}
 */
export function onSetUserSex(token, value, callback) {
    const data = {};
    data.key = 'sex';
    data.value = value;
    return dispatch => {
        dispatch({type: Types.UPLOAD_USER_SEX_LOADING});
        setUserData(data, token).then((data) => {
            // console.log();
            callback(true, data);
            console.log('修改成功拉');
            // console.log(data, 'data');
            dispatch({
                type: Types.UPLOAD_USER_SEX_SUCCESS,
                data: {sex: value},
            });
        }).catch((msg) => {
            callback(false, {msg});
        });

    };
}

/**
 * 修改名称
 * @returns {{theme: *, type: string}}
 */
export function onSetUserName(token, value, callback) {
    const data = {};
    data.key = 'username';
    data.value = value;
    return dispatch => {
        dispatch({type: Types.UPLOAD_USER_NAME_LOADING});
        setUserData(data, token).then((data) => {
            // console.log();
            callback(true, data);
            // console.log('修改成功拉');
            // console.log(data, 'data');
            dispatch({
                type: Types.UPLOAD_USER_NAME_SUCCESS,
                data: {username: value},
            });
        }).catch((msg) => {
            callback(false, {msg});
        });

    };
}


