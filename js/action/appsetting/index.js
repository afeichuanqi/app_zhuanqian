import Types from '../Types';


/**
 * 设置已经打开过照片选择器
 * @returns {{theme: *, type: string}}
 */
export function onIsOpenImagePicker(bool) {
    return {type: Types.SET_IS_OPEN_IMAGE_PICKER, data: {bool}};
}
/**
 * 同意隐私政策
 * @returns {{theme: *, type: string}}
 */
export function onIsAgreePrivacy(bool) {
    return {type: Types.AGREE_PRIVACY, data: {bool}};
}
/**
 * 同意隐私政策
 * @returns {{theme: *, type: string}}
 */
export function onSetAppPay(i) {
    return {type: Types.SET_APP_PAY, data: {i}};
}


