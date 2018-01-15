import fetch from './axios.js'
let login = (params) => {
		return new Promise((resolve, reject) => {
			fetch('/api/user/login', params)
				.then((data) => {
					if(params.type == 1) {
						resolve({
							brandName: data,
							userId: params.userId,
							path: '/store/client/list'
						})						
					}else if(params.type == 2) {
						resolve({
							brandName: data,
							userId: params.userId,
							path: '/company/account/list'//keng de hen
						})						
					}
				})
				.catch((code) => {
					if(code == 2) {
						reject({
							flag: false,
							text: '账号密码错误'
						})
					}
				})			
		})
		
	}
let getPlainPromise = (url, params) => {
	return new Promise((resolve, reject) => {
		fetch(url, params)
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err)
			})
	})
} 

export default {
	login,
	fetch: getPlainPromise
}