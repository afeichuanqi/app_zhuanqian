import Types from '../../action/Types';

const defaultContent = {
    status: 1,
    loading: true,
    data: {},
}

export default function onAction(state = defaultContent, action) {
    const {type, data, msg} = action;
    switch (type) {
        case Types.USER_GET_LOADING :
            return {
                ...state,
                loading: true,
                status: 1,
            }
        case Types.USER_GET_SUCCESS :
            return {
                ...state,
                status: 0,
                loading: false,
                data: data,

            }
        case Types.USER_GET_FAIL :
            return {
                ...state,
                status: -1,
                loading: false,
                msg: msg,
            }
        case Types.USER_GET_LOSE :
            return {
                ...state,
                status: -2,
                loading: false,
                msg: msg,
            }
        default:
            return state
    }
}