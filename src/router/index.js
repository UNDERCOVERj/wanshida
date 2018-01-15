import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import storeClientList from '@/components/store/client/list'
import storeClientOrder from '@/components/store/client/order'
import storeClientDetails from '@/components/store/client/Details'
import storeStockIndex from '@/components/store/stock/index'
import storeStockList from '@/components/store/stock/list'
import storeStockRecord from '@/components/store/stock/record'
import storeTechnicianList from '@/components/store/technician/list'
import storeTechnicianDetails from '@/components/store/technician/details'
import storeProjectList from '@/components/store/project/list'

import companyAccountList from '@/components/company/account/list'
import companyStoreList from '@/components/company/store/list'
import companyStorePerformance from '@/components/company/store/performance'
import companyStoreIndex from '@/components/company/store/index'
import companyStoreStockList from '@/components/company/store/stock-list'
import companyStoreStockRecord from '@/components/company/store/stock-record'

import companyStockIndex from '@/components/company/stock/index'
import companyStockList from '@/components/company/stock/list'
import companyStockRecord from '@/components/company/stock/record'

import store from '@/components/store/home'
import company from '@/components/company/home'

import error from '@/components/error'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login/:type', // login in & login out
      component: login
    },
    {
      path: '/store', // /store/home
      component: store,
      children: [
        {
          path: 'client/list', // /store/client/list
          component: storeClientList
        },
        {
          path: 'client/order', // /store/client/order
          component: storeClientOrder
        },
        {
          path: 'client/details',
          component: storeClientDetails
        },
        {
          path: 'stock', // /store/stock
          component: storeStockIndex,
          children: [
            {
              path: 'list',
              component: storeStockList // /store/stock/list
            },
            {
              path: 'record',
              component: storeStockRecord // /store/stock/list
            }
          ]
        },
        {
          path: 'technician/list', // /store/technician/list
          component: storeTechnicianList
        },
        {
          path: 'technician/details', // /store/technician/details
          component: storeTechnicianDetails
        },
        {
          path: 'project/list', // /store/project/list
          component: storeProjectList
        }

      ]
    },
    {
      path: '/company',  // /company
      component: company,
      children: [
        {
          path: 'account/list', // /company/account/list
          component: companyAccountList
        },
        {
          path: 'store/list', // /company/store/list
          component: companyStoreList
        },
        {
          path: 'store/performance',  // /company/store/performance
          component: companyStorePerformance
        },
        {
          path: 'store/stock',  // /company/store/stock
          component: companyStoreIndex,
          children: [
            {
              path: 'list', // /company/store/stock/list
              component: companyStoreStockList
            },
            {
              path: 'record', // /company/store/stock/record
              component: companyStoreStockRecord
            }
          ]
        },
        {
          path: 'stock',
          component: companyStockIndex,
          children: [
            {
              path: 'list',
              component: companyStockList// /company/stock/list
            },
            {
              path: 'record',
              component: companyStockRecord// /company/stock/record
            }
          ]
        }
      ]
    },
    {
      path: '/error',
      component: error
    }
  ]
})
router.beforeEach((to, from, next) => {
  let path = to.path;
  if(path.indexOf('/login') == -1) {//非登录页
     if(path.indexOf('/store') == 0) {
      let storeId = localStorage.getItem('storeId');
      if(storeId) {
        next()
      }else {
        next({path: '/login/store'})
      }
     }else if(path.indexOf('/company') == 0) {
      let companyId = localStorage.getItem('companyId');
      if(companyId) {
        next()
      }else {
        next({path: '/login/store'})
      }      
     }
  }else {
    next();
  }
})
export default router
