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
						if(data.level == 2) {
							resolve({
								brandName: data.name,
								userId: params.userId,
								path: '/company/stock/list',
								level: data.level
							})							
						}else {
							resolve({
								brandName: data.name,
								userId: params.userId,
								path: '/company/account/list',
								level: data.level
							})							
						}
												
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