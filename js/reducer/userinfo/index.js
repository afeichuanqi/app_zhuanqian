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
            // ,wechat_id,wechat_user,weibo_id,weibo_user
            return {
                ...state,
                loading: false,
                username: data.username,
                userid: data.id,
                token: data.token,
                avatar_url: data.avatar_url,
                task_currency: data.task_currency,
                tota_withdrawal: data.tota_withdrawal,
                guaranteed_amount: data.guaranteed_amount,
                expire_date: data.expire_date,
                reg_date: data.reg_date,
                device_id: data.device_id,
                platform: data.platform,
                phone: data.phone,
                sex: data.sex,
                invite_code: data.invite_code,
                shopinfo_url: data.shopinfo_url,
                game_dividend: data.game_dividend,
                offer_reward_dividend: data.offer_reward_dividend,
                share_dividend: data.share_dividend,
                wechat_id: data.wechat_id,
                wechat_user: data.wechat_user,
                weibo_id: data.weibo_id,
                weibo_user: data.weibo_user,

                login: true,
            };
        case Types.WECHAT_AUTH_SUCCESS :
            return {
                ...state,
                loading: false,
                username: data.username,
                userid: data.id,
                token: data.token,
                avatar_url: data.avatar_url,
                task_currency: data.task_currency,
                tota_withdrawal: data.tota_withdrawal,
                guaranteed_amount: data.guaranteed_amount,
                expire_date: data.expire_date,
                reg_date: data.reg_date,
                device_id: data.device_id,
                platform: data.platform,
                phone: data.phone,
                sex: data.sex,
                invite_code: data.invite_code,
                shopinfo_url: data.shopinfo_url,
                game_dividend: data.game_dividend,
                offer_reward_dividend: data.offer_reward_dividend,
                share_dividend: data.share_dividend,
                wechat_id: data.wechat_id,
                wechat_user: data.wechat_user,
                weibo_id: data.weibo_id,
                weibo_user: data.weibo_user,
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
                tota_withdrawal: data.tota_withdrawal,
                guaranteed_amount: data.guaranteed_amount,
                expire_date: data.expire_date,
                reg_date: data.reg_date,
                device_id: data.device_id,
                platform: data.platform,
                phone: data.phone,
                sex: data.sex,
                invite_code: data.invite_code,
                shopinfo_url: data.shopinfo_url,
                game_dividend: data.game_dividend,
                offer_reward_dividend: data.offer_reward_dividend,
                share_dividend: data.share_dividend,
                wechat_id: data.wechat_id,
                wechat_user: data.wechat_user,
                weibo_id: data.weibo_id,
                weibo_user: data.weibo_user,
                login: true,
            };
        case Types.GET_USER_INFO_FAIL:
            return {
                ...state,
                login: false,
            };
        case Types.CHANGE_PHONE_SUCCESS:
            console.log(data);
            return {
                ...state,
                phone: data.phone,
            };

        case Types.CHANGE_WECHAT_SUCCESS:
            console.log(data);
            return {
                ...state,
                wechat_id: data.wechat_id,
                wechat_user: data.wechat_user,
            };
        case Types.UPLOAD_AVATAR_LOADING:
            return {
                ...state,
                avatar_url: data.avatar_url.length > 0 ? data.avatar_url : state.avatar_url,
                upload_avatar_loading: true,
            };
        case Types.UPLOAD_AVATAR_SUCCESS:
            // console.log(data.avatar_url);
            // console.log(state,"state.avatar_url");
            return {
                ...state,
                avatar_url: data.avatar_url.length > 0 ? data.avatar_url : state.avatar_url,
                upload_avatar_loading: false,
            };

        case Types.CHANGE_SHOPINFO_IMG:
            return {
                ...state,
                shopinfo_url: data.shopinfo_url.length > 0 ? data.shopinfo_url : state.shopinfo_url,
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
        case Types.ADD_ALIPAY_ACCOUNT:
            return {
                ...state,
                alipay_name: data.name,
                alipay_account: data.account,
            };
        case Types.ADD_WECHAT_ACCOUNT:
            return {
                ...state,
                wechat_name: data.name,
                wechat_account: data.account,
            };
        default:
            return state;
    }
}
