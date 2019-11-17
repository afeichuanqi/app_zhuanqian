import Types from '../Types';

// 收到查询所有好友未读消息
export function onSetTaskReleaseInfo(data) {
    return {type: Types.TASK_RELEASE_SET, data: data};
}
