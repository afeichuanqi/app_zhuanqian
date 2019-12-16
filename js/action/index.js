import {onLogin,onUploadAvatar,onSetUserSex,onSetUserName,onClearUserinfoAll,onGetUserInFoForToken} from './userinfo';
import {verifyIdentIdy,onMessageFrom,onAddMesage,onSetMsgStatus,onGetMegForUserid,onSetImageMsgStatus,onMessageInitialiZation} from './message';
import {onSelectAllFriend,onSetAllFriendUnRead,onSetNewMsgForRromUserid,onSetFriendMsgIsRead,onFriendInitialiZation,onSetOtherTypeUnread,setAppeal_2IsRead,setAppeal_3IsRead} from './friend';
import {onChangeSocketStatue} from './socketStaus';
import {onSetTaskReleaseInfo} from './taskInfo';

import {onAddSearchTitle} from './search';
export default {
    onLogin,
    onUploadAvatar,
    onSetUserSex,
    onSetUserName,
    onClearUserinfoAll,
    onGetUserInFoForToken,
    //消息列表
    verifyIdentIdy,

    onMessageFrom,
    onAddMesage,
    onSetMsgStatus,
    onGetMegForUserid,
    onSetNewMsgForRromUserid,
    onSetImageMsgStatus,
    onMessageInitialiZation,
    //好友列表
    onSelectAllFriend,
    // onSelectAllFriendUnRead,
    onSetAllFriendUnRead,
    // onSetFriendMsgIsRead,
    onFriendInitialiZation,
    onSetOtherTypeUnread,
    setAppeal_2IsRead,
    setAppeal_3IsRead,
    //状态
    onChangeSocketStatue,
    //任务发布信息

    onSetTaskReleaseInfo,
    //加入搜索历史
    onAddSearchTitle
}
