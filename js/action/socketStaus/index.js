import Types from '../Types';

/**
 * TOKEN验证
 * @returns {{theme: *, type: string}}
 */
// 设置statusbar text 状态
export function onChangeSocketStatue(text) {
    // console.log(code, 'code');
    return {type: Types.SET_SOCKET_STATUS_TEXT, data: {statusText: text}};
}
