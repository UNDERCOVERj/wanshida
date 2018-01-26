import API from '../components/api/api.js'
import {Message} from 'element-ui'
const storeClient = {
  namespaced: true,
  state: {
    tel: '123',
    name: '',
    userId: null
  },
  mutations: {
    changeTel (state, tel) {
      state.tel = tel
    },
    changeName (state, name) {
      state.name = name
    },
    goToClientDetails (state, userId) {
      state.userId = userId
    }
  }
}
const companyStore = {
  namespaced: true,
  state: {
    storeName: ''
  },
  getters: {
    getStoreName: (state) => {
      return state.storeName
    }
  },
  mutations: {
    changeStoreName: (state, name) => {
      state.storeName = name
    }
  }
}

export default {
  state: {
    storeId: '',
    companyId: '',
    selections: []
  },
  getters: {
    getUserId: (state) => {
      return state.storeId
    },
    getCompanyId: (state) => {
      return state.companyId
    },
    getSelections: (state) => {
      return state.selections
    }
  },
  mutations: {
    setStoreId: (state, storeId) => {
      state.storeId = storeId
    },
    setCompanyId: (state, companyId) => {
      state.companyId = companyId
    },
    resetSelections: (state) => {// fix bug
      state.selections = [];
    },
    setLevel1: (state, data) => {
      if(!state.selections.length) {
        const loading = data.vue.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let balanceData = [];
        let loadingTimer = setTimeout(() => {
          loading.close();
          Message('加载项目失败');
        }, 5000);            
        API.fetch('/api/administration/project/list', data.params)
          .then((data) => {
            state.selections = data.projectOnePojoList.map((item) => {
              return {
                label: item.projectName,
                value: item.projectId,
                children: []
              }
            });
            loading.close();
            clearTimeout(loadingTimer);
          })
                  
      }
    },
    selectLevel1: (state, data) => {
      state.selections.forEach((balance) => {
        if(data.value == balance.value) {
          if(!balance.children || balance.children && !balance.children.length) {
            const loading = data.vue.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });  
            let loadingTimer = setTimeout(() => {
              loading.close();
              Message('加载项目失败');
            }, 5000);
            API.fetch('/api/administration/project/two/list', data.params)
              .then((data) => {
                balance.children = data.map((item) => {
                  return {
                    value: item.projectId,
                    label: item.projectName
                  }
                })
                loading.close();
                clearTimeout(loadingTimer);
              })              
          }
          
        }
      })      
    }

  },
  modules: {
    storeClient,
    companyStore
  }
}
