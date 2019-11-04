import Types from '../../action/Types';

const defaultContent = {
    msg: '',
    loading: false,
    status: 1,
    user:'',
    pwd:'',
    email:'',
}

export default function onAction(state = defaultContent, action) {
    const {type, msg,user,pwd,email} = action;
    switch (type) {
        case Types.REGISTER_LOADING :
            return {
                ...state,
                loading: true,
                msg: '',
                status: 1,
            }
        case Types.REGISTER_SUCCESS :
            return {
                ...state,
                msg: msg,
                loading: false,
                status: 0,
                user,
                pwd,
                email
            }
        case Types.REGISTER_FAIL :
            return {
                ...state,
                msg: msg,
                loading: false,
                status: -1,
            }
        default:
            return state
    }
}