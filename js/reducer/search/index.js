import Types from '../../action/Types';

const defaultContent = {
    searchArr: [],
};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.ADD_SEARCH_TITLE :

            const searchArr = [...state.searchArr];
            const findIndex = searchArr.findIndex(item => item.title == data.title);
            if (findIndex !== -1) {
                searchArr.splice(findIndex,1);
            }
            searchArr.unshift({title: data.title});
            const temArr = searchArr.slice(0, 30);
            return {
                ...state,
                searchArr: temArr,
            };
        case Types.DELETE_ALL_SEARCH_LOG:
            return {
                ...state,
                searchArr: [],
            };
        default:
            return state;
    }
}
