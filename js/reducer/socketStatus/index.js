import Types from '../../action/Types';

const defaultContent = {
    statusText: '',
};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.SET_SOCKET_STATUS_TEXT :
            return {
                ...state,
                statusText: data.statusText,
            };

        default:
            return state;
    }
}
