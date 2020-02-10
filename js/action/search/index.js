import Types from '../Types';
/**
 * 搜索
 * @returns {{theme: *, type: string}}
 */
export function onAddSearchTitle(title) {
    return {type: Types.ADD_SEARCH_TITLE, data: {title: title}}
}
/**
 * 删除所有搜索记录
 * @returns {{theme: *, type: string}}
 */
export function onDelAllSearchLog() {
    return {type: Types.DELETE_ALL_SEARCH_LOG, data: {}}
}


