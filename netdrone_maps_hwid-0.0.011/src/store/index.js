import { createStore, createLogger } from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";
import state from "./state";
import mutations from "./mutations";

const debug = process.env.NODE_ENV !== "production";

export function initStore(app){
  const store = createStore({
    actions,
    getters,
    state,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
  });
  app.use(store);
}