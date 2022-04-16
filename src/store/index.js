import { createStore } from 'vuex';
// import auth from './modules/auth';
// import player from './modules/player';

// We did it this way because we are now registering it automatically.
import modules from './modules';

export default createStore({
  // modules: {
  //   auth,
  //   player,
  // },
  modules,
});
