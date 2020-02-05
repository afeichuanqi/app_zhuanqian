import Types from '../../action/Types';

const defaultContent = {isOpenImagePicker: false, agreePrivacy: false};

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
        default:
            return state;
    }
}
