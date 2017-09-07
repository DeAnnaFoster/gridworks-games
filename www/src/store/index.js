import axios from 'axios'
import vue from 'vue'
import vuex from 'vuex'
import router from '../router'

var production = !window.location.host.includes('localhost');
var baseUrl = production ? '//gridworksgames.herokuapp.com/' : '//localhost:3000/';

let api = axios.create({
  baseURL: baseUrl,  // + 'api'
  timeout: 4000,
  withCredentials: true
})

let auth = axios.create({
  baseURL: baseUrl,
  timeout: 4000,
  withCredentials: true
})

vue.use(vuex)

var store = new vuex.Store({

  state: {
    activeUser1: {},
    loggedIn: null
    // activeUser2: {},
    // gamestats: {}
  },

  mutations: {
    setUser(state, data) {
      state.activeUser1 = data || {}
    },
    setLoggedIn(state, data) {
      state.loggedIn = data
    },

    // setActiveUser2(state, data) {
    //   state.activeUser2 = data
    // },

    // setGameStats(state, data) {
    //   state.users = data
    // },

    handleError(state, err) {
      state.error = err
    }
  },

  actions: {
    getUser({ commit, dispatch }, user) {
      api('users/' + user._id)
        .then(res => {
          commit('setActiveUser1', res.data.data)
        })
        .catch(err => {
          commit('handleError', err)
        })
    },

    // createUser({ commit, dispatch }, user) {
    //   api.post('users/', user)
    //     .then(res => {
    //       dispatch('getUsers')
    //     })
    //     .catch(err => {
    //       commit('handleError', err)
    //     })
    // },

    updateUser({ commit, dispatch }, user) {
      api.put('users/' + user._id)
        .then(res => {
          dispatch('getUsers')
        })
        .catch(err => {
          commit('handleError', err)
        })
    },

    register({ commit, dispatch }, accountUser) {
      //console.log('user: ', accountUser)
      auth.post('register', accountUser)
        .then(res => {
          commit('setActiveUser1', res.data.data)
          if (!res.data.data) {
            router.push('/Home');
          }

        })
        .catch(err => {
          commit('handleError', err)
        })
    },


    login({ commit, dispatch }, accountUser) {
      auth.post('login', accountUser)
        .then(res => {
          commit('setUser', res.data.data)
          commit('setLoggedIn', true)
          if (!res.data.data) {
            router.push('/Home');
          }
        })
        .catch(err => {
          commit('handleError', err)
        })
    },

    logout({ commit, dispatch }, credentials) {
      auth.delete('/logout')
        .then(res => {
          console.log(res.message)
          commit('setLoggedIn', false)
        }).catch(err => {
          commit('handleError', err)
        })
    },

    authenticate({ commit, dispatch }) {
      auth('/authenticate')
        .then(res => {
          if (res.data.data._id) {
            console.log('Ready to commit!')
            commit('setLoggedIn', true)
            commit('setUser', res.data.data)
            commit('setUser', res.data.data)
          } else {
            commit('setLoggedIn', false)
            console.log('No session found!')
          }
        }).catch(err => {
          commit('handleError', err)
          commit('setLoggedIn', false)
        })
    },

    //  updateTaskParent({ commit, dispatch }, data) {
    //   var update = { listId: data.listId }
    //   //console.log(update);
    //   api.put('tasks/' + data.taskId + '/', update)
    //     .then(res => {
    //       console.log('made it this far')
    //       dispatch('getTasks', task)
    //     })
    //     .catch(err => {
    //       commit('handleError', err)
    //     })
    // },

    handleError({ commit, dispatch }, err) {
      commit('handleError', err)
    }
  }


})

export default store