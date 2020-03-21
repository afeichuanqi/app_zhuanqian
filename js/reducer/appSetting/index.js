import Types from '../../action/Types';

const defaultContent = {isOpenImagePicker: false, agreePrivacy: false, appPay: 1, isUpdate5Toast: true};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.SET_IS_OPEN_IMAGE_PICKER :
            return {
                ...state,
                isOpenImagePicker: data.bool,
            };
        case Types.AGREE_PRIVACY :
            return {
                ...state,
                agreePrivacy: data.bool,
            };
        case Types.SET_APP_PAY :
            return {
                ...state,
                appPay: data.i,
            };
        case Types.IS_SET_UPDATE_TOAST :
            return {
                ...state,
                isUpdate5Toast: data.bool,
            };
        default:
            return state;
    }
}
