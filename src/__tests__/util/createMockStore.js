// @flow
export const createMockStore = (initialState: Object = {}) => {
  let state = initialState
  return {
    getState: () => state,
    setState (nextState: Object) {
      state = nextState
    },
    dispatch: () => {}
  }
}
