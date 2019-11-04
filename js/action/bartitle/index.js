import Types from '../Types';

/**
 * 主题变更
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function changeBarTitle(title) {
    return {type: Types.BAR_TITLE_CHANGE, title: title};
}