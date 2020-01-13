import Types from '../Types';
import {
    verifyCode,
    uploadAvatar,
    setUserData,
    getUserInfoForToken,
    uploadQiniuImage,
    uploadUserinfoBgImg,
} from '../../util/AppService';

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
            callback(true, data);
            dispatch({
                type: Types.LOGIN_SUCCESS,
                data: data,
            });
        }).catch(msg => {
            callback(false, {msg});
            dispatch({type: Types.LOGIN_FAIL});
        });

    };
}

/**
 * 修改头像
 * @returns {{theme: *, type: string}}
 */
export function onUploadAvatar(token, mime, path, callback) {
    return dispatch => {
        dispatch({type: Types.UPLOAD_AVATAR_LOADING, data: {avatar_url: ''}});
        uploadQiniuImage(token, 'userAvatar', mime, path).then(url => {
            uploadAvatar({imageUrl: url}, token).then((data) => {
                callback(true, data);
                dispatch({
                    type: Types.UPLOAD_AVATAR_SUCCESS,
                    data: {avatar_url: url},
                });
            }).catch((msg) => {
                dispatch({
                    type: Types.UPLOAD_AVATAR_SUCCESS,
                    data: {avatar_url: ''},
                });
                callback(false, {msg});
            });
        }).catch(msg => {
            dispatch({
                type: Types.UPLOAD_AVATAR_SUCCESS,
                data: {avatar_url: ''},
            });
            callback(false, {msg});
        });


    };
}

/**
 * 修改商铺背景墙图片
 * @returns {{theme: *, type: string}}
 */
export function onSetShopInfoBgImg(token, mime, path, callback) {
    return dispatch => {
        // console.log(path);
        dispatch({
            type: Types.CHANGE_SHOPINFO_IMG,
            data: {shopinfo_url: path},
        });
        uploadQiniuImage(token, 'shopBackGroundImg', mime, path).then(url => {
            uploadUserinfoBgImg({imageUrl: url}, token).then((data) => {
                callback(true, data);
                dispatch({
                    type: Types.CHANGE_SHOPINFO_IMG,
                    data: {shopinfo_url: url},
                });
            }).catch((msg) => {
                dispatch({
                    type: Types.CHANGE_SHOPINFO_IMG,
                    data: {shopinfo_url: ''},
                });
                callback(false, {msg});
            });
        }).catch(msg => {
            dispatch({
                type: Types.CHANGE_SHOPINFO_IMG,
                data: {shopinfo_url: ''},
            });
            callback(false, {msg});
        });


    };
    // return {type: Types.CHANGE_SHOPINFO_IMG, data: {url}};
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
            callback(true, data);
            console.log('修改成功拉');
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
            callback(true, data);
            dispatch({
                type: Types.UPLOAD_USER_NAME_SUCCESS,
                data: {username: value},
            });
        }).catch((msg) => {

            callback(false, {msg});
        });

    };
}

/**
 * 增加/更新支付宝帐户
 * @returns {{theme: *, type: string}}
 */
export function onAddPayAccount(name, account, type) {
    console.log(name, account, type);
    if (type === 1) {
        return {type: Types.ADD_ALIPAY_ACCOUNT, data: {name, account}};
    }
    if (type === 2) {
        return {type: Types.ADD_WECHAT_ACCOUNT, data: {name, account}};
    }

}

/**
 *  清空账号信息
 * @returns {{theme: *, type: string}}
 */
export function onClearUserinfoAll() {
    return {type: Types.CLEAR_USERINFO_ALL};
}

/**
 * 根据token获取用户基本信息
 */

export function onGetUserInFoForToken(token, callback) {

    return dispatch => {
        dispatch({type: Types.GET_USER_INFO_LOADING});
        getUserInfoForToken(token).then((data) => {
            console.log(data, 'data');
            callback(true, data);
            dispatch({
                type: Types.GET_USER_INFO_SUCCESS,
                data,
            });
        }).catch((msg) => {

            callback(false, {msg});
            dispatch({type: Types.GET_USER_INFO_FAIL});
        });

    };
}

