import Types from '../../action/Types';

const defaultContent = {
    typeData: {id: 1},
    deviceData: {id: 1},
    columnData: {
        orderTimeLimit: {},
        singleOrder: {},
        reviewTime: {},
        TaskInfo: '',
        title: '',
        projectTitle: '',
        orderReplayNum: {},
        rewardPrice: '',
        rewardNum: '',

    },
    stepData: [],
};

export default function onAction(state = defaultContent, action) {
    const {data, type} = action;
    switch (type) {
        case Types.TASK_RELEASE_SET :
            return {
                ...state,
                typeData: data.typeData,
                deviceData: data.deviceData,
                columnData: data.columnData,
                stepData: data.stepData,
            };
        default:
            return state;
    }
}
