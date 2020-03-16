import {Platform} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import Toast from 'react-native-root-toast';

let defaultConfig = {
        baseUrl: Platform.OS === 'android' ? 'http://bzcgpg.natappfree.cc' : 'http://localhost:3000',//测试
        // baseUrl: 'http://test.xiaofaka.com',//测试
        // baseUrl: 'http://www.easy-z.cn',//测试
        // baseUrl: 'http://39.99.145.203:3000',//测试
        timeout:
            15000,
        headers:
            {
                Accept: 'application/json',
            },
    }
;

let instance = axios;
let baseUrl = defaultConfig.baseUrl + '/';

// const urlWriteList = ['user/sendSms','user/verifyCode'];

class Axios {
    constructor(props) {
        if (props && typeof props === 'object') {
            instance = axios.create(props);
        } else {
            instance = axios.create(defaultConfig);
        }
        //拦截
        instance.interceptors.request.use((config) => {
            // const {url, headers} = config;
            // const item = urlWriteList.find(item => url.indexOf(item) !== -1);
            // if (!item && !headers.token) {//不是白名单 且 没有token
            //     return Promise.reject('您未登录');
            // }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        //日志 响应结果
        instance.interceptors.response.use((response) => {

            return response.data;
        }, (error) => {
            if (error.toString().indexOf('Network Error') !== -1) {
                Toast.show('无网络,请连接网络后重试');
            }
            if (error.toString().indexOf('15000') !== -1) {
                Toast.show('网络超时,请确认当前网络是否可用');
            }
            return Promise.reject(error);
        });
    }


    async get(url, params) {
        try {
            let query = await qs.stringify(params);
            let response = null;
            if (!params) {
                response = await instance.get(baseUrl + url, null);
            } else {
                response = await instance.get(baseUrl + url + '?' + query);
            }
            return response;
        } catch (e) {
            return null;
        }
    }

    async post(url) {
        return this.post(url, null, true, true);
    }

    async post(url, params) {

        if (params instanceof Object) {
            params = await qs.stringify(params);
        }
        try {
            let response = await instance.post(baseUrl + url, params);
            if (response) {
                if (response.code !== 0) {

                }
                if (response.code === 10011) {

                } else if (response.code === 10012 || response.code === 10013 || response.code === 10014 || response.code === 20004) {

                }
            }
            return response;
        } catch (e) {
            return null;
        }
    }

    async post_(url, params, addBaseUri = false) {

        try {
            let response = await instance.post(addBaseUri ? baseUrl + url : url, params);
            if (response) {
                if (response.code !== 0) {

                }
                if (response.code === 10011) {

                } else if (response.code === 10012 || response.code === 10013 || response.code === 10014 || response.code === 20004) {

                }
            }
            return response;
        } catch (e) {
            return null;
        }
    }

    setPostHeader(key, value) {
        instance.defaults.headers.post[key] = value;
    }

    setGetHeader(key, value) {
        instance.defaults.headers.get[key] = value;
    }
}

export default new Axios();
