// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './vuex/store.js'
import { Cascader, Loading, Button, Select, Input, Form, FormItem, Table, TableColumn, Badge, Radio, RadioGroup, Dialog, DatePicker, Pagination, Option, Col } from 'element-ui'
require('normalize.css')
Vue.use(Vuex)

Vue.use(Cascader)
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Badge)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Option)
Vue.use(Col)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store: new Vuex.Store(store),
  template: '<App/>',
  components: { App }
})
