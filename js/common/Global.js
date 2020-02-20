const Global = {
    imageSizeArr: [],//保存所有已经加载图片的宽高
    activeRouteName: 'IndexPage',//当前最顶端的路由
    IndexPage_Index: 0,
    TaskHallPage_Index: 0,


    //socket方面
    token: '',
    dispatch: {},
    ws: null,
    connectionstatus: false,

    imageViewModal: null,
    //用户服务费
    user_service_fee: 1.05,
    //每小时推荐数
    user_recommend_fee: 10,
    //每小时置顶数
    user_top_fee: 10,
    //苹果支付
    apple_pay: 1,
    android_pay: 1,
    onNewMessage: null,
    //全局弹窗
    toast: null,
};
module.exports = Global;
