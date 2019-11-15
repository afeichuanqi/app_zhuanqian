import Types from '../Types';

/**
 * TOKEN验证
 * @returns {{theme: *, type: string}}
 */
// 收到查询所有好友消息
export function onSelectAllFriend(friendArr) {
    // console.log(code, 'code');
    return {type: Types.MESSAGE_FRIEND_ALL, data: {friendArr}};
}
// 收到查询所有好友未读消息
export function onSelectAllFriendUnRead(friendArr) {
    // console.log(code, 'code');
    return {type: Types.MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS, data: {friendArr}};
}
// 设置当前的好友所有消息为已读
export function onSetAllFriendUnRead(fromUserid) {
    // console.log(code, 'code');
    return {type: Types.MESSAGE_SET_USER_ID_IS_READ_SUCCESS, data: {fromUserid}};
}



