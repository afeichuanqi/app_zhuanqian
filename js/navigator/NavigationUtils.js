export default class NavigationUtils {

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
}
