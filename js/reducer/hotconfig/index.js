import Types from '../../action/Types';

const defaultContent = {
    loading: true,
    data: {},
    status: -1,
}

export default function onAction(state = defaultContent, action) {
    const {type, data, msg} = action;
    switch (type) {
        case Types.HOT_CONFIG_LOADING:
            return {
                ...state,
                loading: true,
                status: -1,
            }
        case Types.HOT_CONFIG_SUCCESS :
            return {
                ...state,
                loading: false,
                data: data,
                status: 1,

            }
        case Types.HOT_CONFIG_FAIL :
            return {
                ...state,
                loading: false,
                msg: msg,
                status: -1,
            }
        default:
            return state
    }
}