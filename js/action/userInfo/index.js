import Types from '../Types';
import {getUserInfo, createUserInfo} from '../../util/AppService'
import {writeUserInfo} from "../../util/DButils";

/**
 * 用戶 中心
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onUserInfo(token) {
    return dispatch => {
        dispatch({type: Types.USER_GET_LOADING})
        getUserInfo(token).then(datas => {
            if (datas.status === 0) {
                if (datas.data) {
                    const data = datas.data;
                    data.userId = 1;
                    // res.
                    writeUserInfo(datas.data);//寫入本地數據庫
                    dispatch({type: Types.USER_GET_SUCCESS, data: data})
                } else {
                    dispatch({type: Types.USER_GET_LOSE, msg: '用戶信息失效', data: {}})
                }
            } else if (datas.status === 403) {
                dispatch({type: Types.USER_GET_LOSE, msg: '用戶信息失效', data: {}})
            }

        }).catch(err => {
            dispatch({type: Types.USER_GET_FAIL, msg: err})
        })

    }
}

export function onCreateUserInfo(uuid) {
    return dispatch => {
        dispatch({type: Types.CREATE_USER_LOADING})
        createUserInfo(uuid).then(datas => {
            if (datas.status == 0) {
                const data = {};
                data.username = `遊客--${uuid}`;
                data.password = uuid;
                data.userId = 1;
                data.isExpired = false;
                writeUserInfo(data);//寫入本地數據庫
                dispatch({type: Types.CREATE_USER_SUCCESS, data: datas.data})

            }
        }).catch(err => {
            dispatch({type: Types.CREATE_USER_SUCCESS, msg: err})
        })

    }
}
