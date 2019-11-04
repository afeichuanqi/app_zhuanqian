import Types from '../../action/Types';

const defaultContent = {
    msg: '',
    loading: false,
    status: 1,
    user: '',
    pwd: '',
    data: {},
}

export default function onAction(state = defaultContent, action) {
    const {type, msg, user, pwd, data} = action;
    switch (type) {
        case Types.LOGIN_LOADING :
            return {
                ...state,
                loading: true,
                msg: '',
                status: 1,
            }
        case Types.LOGIN_SUCCESS :
            return {
                ...state,
                msg: '',
                loading: false,
                status: 0,
                user,
                pwd,
                data,
            }
        case Types.LOGIN_FAIL :
            return {
                ...state,
                msg: msg,
                loading: false,
                status: -1,
                user: '',
                pwd: '',
                token: '',
            }
        default:
            return state
    }
}