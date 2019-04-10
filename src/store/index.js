import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    author: 'LBR',
    age:16
  },
  mutations: {
    changeAge(state) {
      state.age++
    }
  }
})

export default store