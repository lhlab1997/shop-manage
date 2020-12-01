import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: window.sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
    userName : ''
  },
  mutations: {
    getUserName(state,name) {
      state.userName = name
    }
  },
  actions: {
  },
  getters: {
  },
  modules: {
  }
})
