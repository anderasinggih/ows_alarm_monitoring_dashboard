import * as types from "./mutation-types";

const mutations = {
  [types.AGE_INCREASE](state) {
    state.age++;
  }
};

export default mutations;
