import {Platform} from 'react-native';
import axios from 'axios';
import qs from 'qs';
// import Toast from "../../common/RootToast";

let defaultConfig = {
        baseUrl: Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000',//测试
        // baseUrl: 'http://is8zdp.natappfree.cc',//测试
        // baseUrl: 'http://47.99.133.97:3000',//测试
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

class Axios {
    constructor(props) {
        if (props && typeof props === 'object') {
            instance = axios.create(props);
        } else {
            instance = axios.create(defaultConfig);
        }
        //拦截
        instance.interceptors.request.use((config) => {
            return config;
        }, (error) => {
            // console.log(error);

            return Promise.reject(error);
        });

        //日志 响应结果
        instance.interceptors.response.use((response) => {

            return response.data;
        }, (error) => {
            if (error.toString().indexOf('Network Error') !== -1) {
                // Toast.show('无网络,请连接网络后重试')
            }
            if (error.toString().indexOf('15000') !== -1) {
                // Toast.show('网络超时,请确认当前网络是否可用')
            }
            // console.log(error.toString());
            // Toast.show(error.toString())
            // console.log(error);
            return Promise.reject(error);
        });
    }


    async get(url, params) {
        try {
            let query = await qs.stringify(params);
            let response = null;
            if (!params) {
                response = await instance.get(baseUrl + url,null);
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
        // console.log({phone:'15061142750'} instanceof Object,"params instanceof Object")
        if (params instanceof Object) {
            params = await qs.stringify(params);
            // console.log(params);
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
    async post_(url, params) {

        try {
            let response = await instance.post(url, params);
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
