export default {
  setUser(state, payload) {
    state.user = payload;
  },
  setToken(state, payload) {
    state.token = payload;
  },
  setUsers(state, payload) {
    state.users = payload;
  },
  setIter(state, payload) {
    state.iter[payload.iter] = payload.data;
  },
  setChecks(state, payload) {
    state.checks = payload;
  },

  setMatches(state, payload) {
    state.matches = payload;
  }
}
