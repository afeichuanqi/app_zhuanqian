import {onLogin,onUploadAvatar,onSetUserSex,onSetUserName,onClearUserinfoAll} from './userinfo';
import {verifyIdentIdy,setConnectionStatus,onMessageFrom,onAddMesage,onSetMsgStatus,onGetMegForUserid,onSetImageMsgStatus} from './message';
import {onSelectAllFriend,onSelectAllFriendUnRead,onSetAllFriendUnRead,onSetNewMsgForRromUserid,onSetFriendMsgIsRead} from './friend';
import {onChangeSocketStatue} from './socketStaus';
import {onSetTaskReleaseInfo} from './taskInfo';
export default {
    onLogin,
    onUploadAvatar,
    onSetUserSex,
    onSetUserName,
    onClearUserinfoAll,
    //socket
    verifyIdentIdy,
    setConnectionStatus,
    onMessageFrom,
    onAddMesage,
    onSetMsgStatus,
    onGetMegForUserid,
    onSetNewMsgForRromUserid,
    onSetImageMsgStatus,

    //好友列表
    onSelectAllFriend,
    onSelectAllFriendUnRead,
    onSetAllFriendUnRead,
    onSetFriendMsgIsRead,

    //状态
    onChangeSocketStatue,
    //任务发布信息

    onSetTaskReleaseInfo
}
