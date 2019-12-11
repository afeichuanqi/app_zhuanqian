import Types from '../../action/Types';

const defaultContent = {
    searchArr: [],
};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.ADD_SEARCH_TITLE :
            const searchArr = [...state.searchArr];
            searchArr.unshift({title: data.title});
            const temArr = searchArr.slice(0, 30);
            return {
                ...state,
                searchArr: temArr,
            };
        default:
            return state;
    }
}
