import Types from '../Types';

/**
 * 主题变更
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onChangetheme(theme) {
    return {type: Types.CHANGE_THERE_COLOR, theme: theme};
}