import {onLogin,onUploadAvatar,onSetUserSex,onSetUserName,onClearUserinfoAll} from './userinfo';
import {verifyIdentIdy,setConnectionStatus,onMessageFrom,onAddMesage,onSetMsgStatus} from './message';
import {onSelectAllFriend,onSelectAllFriendUnRead,onSetAllFriendUnRead} from './friend';
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
    //好友列表
    onSelectAllFriend,
    onSelectAllFriendUnRead,
    onSetAllFriendUnRead

}
