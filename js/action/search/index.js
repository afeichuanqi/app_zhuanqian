import Types from '../Types';
/**
 * 搜索
 * @returns {{theme: *, type: string}}
 */
export function onAddSearchTitle(title) {
    return {type: Types.ADD_SEARCH_TITLE, data: {title: title}}
}


