import axios from 'axios'
import qs from 'qs'
import {Message} from 'element-ui'
// axios.defaults.timeout = 5000;                        //响应时间
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';           //配置请求头

//返回一个Promise(发送post请求)
// export default function fetch(url, params) {
//     return new Promise((resolve, reject) => {
//         axios({
//             method: 'post',
//             url: url,
//             params: params,
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         }).then((res) => {
//             if(res.data.bstatus == 0) {
//                 resolve(res.data);
//             }else {
//                 reject(new Error('bstatus错误'));
//             }
//         }).catch((err) => {
//             reject(err)
//         })
//     })
// }
axios.defaults.timeout = 600000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';           //配置请求头
//axios.defaults.baseURL = 'http://120.78.94.110:8080/eric';   //配置接口地址
axios.defaults.baseURL = '';
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;
},(error) =>{
    return Promise.reject(error);
});
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    let code = res.data.bstatus.code
    if(res.data.bstatus.code != 0){
        Message(res.data.bstatus.des);
        return Promise.reject(code);
    }
    return res;
}, (error) => {
    return Promise.reject(error);
});
//返回一个Promise(发送post请求)
export default function fetch(url, params) {
    //url = url.replace('/api', '');
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response.data.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
               reject(error)
            })
    })
}
