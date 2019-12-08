import {isFriendChat} from '../util/AppService';
import ChatSocket from '../util/ChatSocket';

export default class NavigationUtils {

    static goPage(params, page) {
        const navigation = NavigationUtils.navigation;
        if (!navigation) {
            return;
        }
        navigation.navigate(
            page,
            {
                ...params,
            });
    }
    /**
     * 返回上上一页
     */
    static goBack(navigation, key = '') {
        navigation.goBack(key);
    }

    /**
     * 跳转到首页
     */
    static toHomePage(navigation) {
        // const {navigation} = params;

        NavigationUtils.navigation.navigate('Main');
    }


    /**
     * 跳转到指定页面
     */
    static toselfSetPage(params, page) {
        const navigation = NavigationUtils.navigation;
        if (!navigation) {
            return;
        }
        navigation.navigate(
            page,
            {
                ...params,
            });
    }

    /**
     * 跳到聊天详情页面
     */
    // static toChatRoomPage(columnType,task_id,toUserid,token){
    //     isFriendChat({
    //         columnType,
    //         taskid: task_id,
    //         toUserid: toUserid,
    //     }, token).then(result => {
    //         // console.log(result, 'result');
    //         if (result.id) {
    //             NavigationUtils.goPage({},'ChatRoomPage');
    //
    //             this.FriendId = result.id;
    //         }
    //
    //     });
    // }
}
