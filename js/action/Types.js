export default {
    LOGIN_LOADING: 'LOGIN_LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAIL: 'LOGIN_FAIL',

    //获取token
    GET_USER_INFO_LOADING:'GET_USER_INFO_LOADING',
    GET_USER_INFO_SUCCESS:'GET_USER_INFO_SUCCESS',
    GET_USER_INFO_FAIL:'GET_USER_INFO_FAIL',
    //微信授权
    WECHAT_AUTH_LOADING:'WECHAT_AUTH_LOADING',
    WECHAT_AUTH_SUCCESS:'WECHAT_AUTH_SUCCESS',
    WECHAT_AUTH_FAIL:'WECHAT_AUTH_FAIL',
    //微博授权
    SINA_AUTH_LOADING:'SINA_AUTH_LOADING',
    SINA_AUTH_SUCCESS:'SINA_AUTH_SUCCESS',
    SINA_AUTH_FAIL:'SINA_AUTH_FAIL',
    //更换手机号码成功
    CHANGE_PHONE_SUCCESS:'CHANGE_PHONE_SUCCESS',
    //更换微信信息成功
    CHANGE_WECHAT_SUCCESS:'CHANGE_WECHAT_SUCCESS',
    //更换微博信息成功
    CHANGE_WEIBO_SUCCESS:'CHANGE_WEIBO_SUCCESS',
    //更换QQ成功
    CHANGE_QQ_SUCCESS:'CHANGE_QQ_SUCCESS',
    UPLOAD_AVATAR_LOADING: 'UPLOAD_AVATAR_LOADING',
    UPLOAD_AVATAR_SUCCESS: 'UPLOAD_AVATAR_SUCCESS',
    UPLOAD_AVATAR_FAIL: 'UPLOAD_AVATAR_FAIL',

    UPLOAD_USER_SEX_LOADING: 'UPLOAD_USER_SEX_LOADING',
    UPLOAD_USER_SEX_SUCCESS: 'UPLOAD_USER_SEX_SUCCESS',

    UPLOAD_USER_NAME_LOADING: 'UPLOAD_USER_NAME_LOADING',
    UPLOAD_USER_NAME_SUCCESS: 'UPLOAD_USER_NAME_SUCCESS',
    //搜索
    ADD_SEARCH_TITLE:'ADD_SEARCH_TITLE',
    //删除全部搜索记录
    DELETE_ALL_SEARCH_LOG:'DELETE_ALL_SEARCH_LOG',
    //清空账号信息
    CLEAR_USERINFO_ALL:"CLEAR_USERINFO_ALL",
    //增加支付宝账号信息
    ADD_ALIPAY_ACCOUNT:"ADD_ALIPAY_ACCOUNT",
    //增加微信账号信息
    ADD_WECHAT_ACCOUNT:"ADD_WECHAT_ACCOUNT",
    //清空账号信息
    CHANGE_SHOPINFO_IMG:"CHANGE_SHOPINFO_IMG",
    //退出账号
    ACCOUNT_QUIT:'ACCOUNT_QUIT',
    // 验证身份
    VERIFY_IDENTIDY: 'VERIFY_IDENTIDY',
    //服务器状态设置
    SET_CONN_CODE: 'SET_CONN_CODE',
    //发送消息
    MESSAGE_SENDTO_USERID: 'MESSAGE_SENDTO_USERID',
    //发送图片消息
    MESSAGE_FORIMAGE_SENDTO_USERID: 'MESSAGE_FORIMAGE_SENDTO_USERID',
    //发送图片消息成功
    MESSAGE_FORIMAGE_SENDTO_USERID_SUCCESS: 'MESSAGE_FORIMAGE_SENDTO_USERID_SUCCESS',
    //初始化消息队列
    MESSAGE_INIT: 'MESSAGE_INIT',
    //初始化好友列表队列
    FRIEND_INIT: 'FRIEND_INIT',
    //接受消息给当前的消息列表设置新的状态
    MESSAGE_FROMOF_USERID: 'MESSAGE_FROMOF_USERID',
    //接受消息给好友列表设置新的状态
    MESSAGE_FROMOF_USERID_Friend: 'MESSAGE_FROMOF_USERID_Friend',
    //消息送达
    MESSAGE_SENDTO_USERID_STATUS: 'MESSAGE_SENDTO_USERID_STATUS',
    //向聊天数组加入新消息
    MESSAGE_ADD_NEW: 'MESSAGE_ADD_NEW',
    //设置消息状态吗
    MESSAGE_SET_STATUS: 'MESSAGE_SET_STATUS',
    // 设置图片消息状态吗
    // MESSAGE_SET_STATUS: 'MESSAGE_SET_STATUS',

    ACCOUNT_QUIT_RESPONSE:'ACCOUNT_QUIT_RESPONSE',


    //返回所有好友消息
    MESSAGE_FRIEND_ALL:"MESSAGE_FRIEND_ALL",
    //查询所有好友消息
    MESSAGE_SELECT_ALL:"MESSAGE_SELECT_ALL",
    //查询所有好友的未读消息数
    MESSAGE_SELECT_FRIEND_NO_READ_LENGTH:"MESSAGE_SELECT_FRIEND_NO_READ_LENGTH",
    //查询所有好友的未读消息数成功
    MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS:"MESSAGE_SELECT_FRIEND_NO_READ_LENGTH_SUCCESS",
    //设置当前账号的指定好友id消息为已读
    MESSAGE_SET_USER_ID_IS_READ:"MESSAGE_SET_USER_ID_IS_READ",
    //设置当前账号的指定好友id消息为已读成功
    MESSAGE_SET_USER_ID_IS_READ_SUCCESS:"MESSAGE_SET_USER_ID_IS_READ_SUCCESS",
    //获取指定userid的聊天记录
    MESSAGE_GET_FRIENDUSERID_ALL_MES:"MESSAGE_GET_FRIENDUSERID_ALL_MES",
    //获取指定userid的聊天记录成功
    MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS:"MESSAGE_GET_FRIENDUSERID_ALL_MES_SUCCESS",
    //设置message获取状态
    MESSAGE_SET_IS_LOAD:"MESSAGE_SET_IS_LOAD",

    //设置指定msgid为读取
    MESSAGE_SET_MSG_ID_READ:"MESSAGE_SET_MSG_ID_READ",
    //设置指定msgid为读取成功
    MESSAGE_SET_MSG_ID_READ_SUCCESS:"MESSAGE_SET_MSG_ID_READ_SUCCESS",
    //全局提示当前socket连接状态
    SET_SOCKET_STATUS_TEXT:"SET_SOCKET_STATUS_TEXT",




    //设置任务发布
    TASK_RELEASE_SET:"TASK_RELEASE_SET",

    //设置其他类型未读消息数
    FRIEND_SET_OTHER_MSG_UN_READ:'FRIEND_SET_OTHER_MSG_UN_READ',
    FRIEND_SET_APPEAL_2_MSG_UN_READ:'FRIEND_SET_APPEAL_2_MSG_UN_READ',
    FRIEND_SET_APPEAL_3_MSG_UN_READ:'FRIEND_SET_APPEAL_3_MSG_UN_READ',
    //设置其他类型未读消息数
    FRIEND_SET_OTHER_MSG_UN_READ_APPEAL2:'FRIEND_SET_OTHER_MSG_UN_READ_APPEAL2',
    //设置其他类型未读消息数
    FRIEND_SET_OTHER_MSG_UN_READ_APPEAL3:'FRIEND_SET_OTHER_MSG_UN_READ_APPEAL3',


    //收到系统消息
    NOTICE_USER_MESSAGE:'NOTICE_USER_MESSAGE',
    // GET_NOTICE_LIST:'GET_NOTICE_LIST',

    //
    NEW_NOTICE_MSG:'NEW_NOTICE_MSG',
    SET_NEW_NOTICE_MSG_IS_READ:'SET_NEW_NOTICE_MSG_IS_READ',
    SET_NEW_NOTICE_MSG_IS_ALL_READ:'SET_NEW_NOTICE_MSG_IS_ALL_READ',


    //设置是否打开过照片选择器
    SET_IS_OPEN_IMAGE_PICKER:"SET_IS_OPEN_IMAGE_PICKER",
    //设置是否打开过照片选择器
    AGREE_PRIVACY:"AGREE_PRIVACY",
};

