import Types from '../../action/Types';

const defaultContent = {login: false, msgArr: []};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.LOGIN_LOADING :
            return {
                ...state,
                loading: true,
                msgArr: [],
            };
        case Types.LOGIN_SUCCESS :
            return {
                ...state,
                loading: false,
                username: data.username,
                userid: data.id,
                token: data.token,
                avatar_url: data.avatar_url,
                task_currency: data.task_currency,
                income_dividend: data.income_dividend,
                tota_withdrawal: data.tota_withdrawal,
                guaranteed_amount: data.guaranteed_amount,
                expire_date: data.expire_date,
                reg_date: data.reg_date,
                device_id: data.device_id,
                platform: data.platform,
                phone: data.phone,
                sex: data.sex,
                invite_code:data.invite_code,
                login: true,
            };
        case Types.LOGIN_FAIL://登录失败
            return {
                ...state,
                login: false,
            };
        case Types.GET_USER_INFO_SUCCESS  ://获取个人信息
            return {
                ...state,
                loading: false,
                username: data.username,
                userid: data.id,
                avatar_url: data.avatar_url,
                task_currency: data.task_currency,
                income_dividend: data.income_dividend,
                tota_withdrawal: data.tota_withdrawal,
                guaranteed_amount: data.guaranteed_amount,
                expire_date: data.expire_date,
                reg_date: data.reg_date,
                device_id: data.device_id,
                platform: data.platform,
                phone: data.phone,
                sex: data.sex,
                invite_code:data.invite_code,
                login: true,
            };
        case Types.GET_USER_INFO_FAIL:
            return {
                ...state,
                login: false,
            };
        case Types.UPLOAD_AVATAR_LOADING:
            return {
                ...state,
                avatar_url: data.avatar_url,
                upload_avatar_loading: true,
            };
        case Types.UPLOAD_AVATAR_SUCCESS:
            return {
                ...state,
                avatar_url: data.avatar_url,
                upload_avatar_loading: false,
            };
        case Types.UPLOAD_USER_SEX_SUCCESS:
            return {
                ...state,
                sex: data.sex,
            };
        case Types.UPLOAD_USER_NAME_SUCCESS:
            return {
                ...state,
                username: data.username,
            };
        case Types.CLEAR_USERINFO_ALL:
            return defaultContent;
        default:
            return state;
    }
}
