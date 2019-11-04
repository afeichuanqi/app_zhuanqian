import Types from '../../action/Types';

const defaultContent = {
    title: '精选',
}

export default function onAction(state = defaultContent, action) {

    const {type, title} = action;
    switch (type) {
        case Types.BAR_TITLE_CHANGE :
            return {
                ...state,
                title: title,
            }
        default:
            return state
    }
}