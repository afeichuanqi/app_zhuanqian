import {onLogin,onUploadAvatar,onSetUserSex,onSetUserName,onClearUserinfoAll,onGetUserInFoForToken,onSetShopInfoBgImg,onAddPayAccount,onWechatAuthorizeLogin,onChangePhone,onChangeWechat,onSinaAuthorizeLogin,onChangeSina,onQQAuthorizeLogin,onChangeQQ} from './userinfo';
import {onSetMessageLoad,verifyIdentIdy,onMessageFrom,onAddMesage,onSetMsgStatus,onGetMegForUserid,onSetImageMsgStatus,onMessageInitialiZation} from './message';
import {onSetNoticeMsgIsAllRead,onSelectAllFriend,onSetAllFriendUnRead,onSetNewMsgForRromUserid,onFriendInitialiZation,onSetOtherTypeUnread,setAppeal_2IsRead,setAppeal_3IsRead,onSetNoticeMsg,onSetNoticeMsgIsRead} from './friend';
import {onChangeSocketStatue} from './socketStaus';
import {onSetTaskReleaseInfo} from './taskInfo';
import {onIsOpenImagePicker,onIsAgreePrivacy} from './appsetting';

import {onAddSearchTitle,onDelAllSearchLog} from './search';
export default {
    onLogin,
    onChangePhone,
    onUploadAvatar,
    onSetUserSex,
    onSetUserName,
    onClearUserinfoAll,
    onGetUserInFoForToken,
    onSetShopInfoBgImg,
    onAddPayAccount,
    onWechatAuthorizeLogin,
    onChangeWechat,
    onSinaAuthorizeLogin,
    onChangeSina,
    onQQAuthorizeLogin,
    onChangeQQ,
    //消息列表
    verifyIdentIdy,
    onSetMessageLoad,
    onMessageFrom,
    onAddMesage,
    onSetMsgStatus,
    onGetMegForUserid,
    onSetNewMsgForRromUserid,
    onSetImageMsgStatus,
    onMessageInitialiZation,
    //系统消息处理
    onSetNoticeMsg,
    onSetNoticeMsgIsRead,
    onSetNoticeMsgIsAllRead,
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
    onAddSearchTitle,
    onDelAllSearchLog,
    //appset
    onIsOpenImagePicker,
    onIsAgreePrivacy

}
