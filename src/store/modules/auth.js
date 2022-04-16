import { auth, usersCollection } from '@/includes/firebase';

export default {
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },

  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },

    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },

  },

  getters: {},

  actions: {
    // The ctx parameter is an object that refernces the store itself. We have access to the same methods and properties you would find in the store. we can use it to commit a mutation.
    // async register(ctx, payload) {
    async register({ commit }, payload) { // we destructure the ctx
      //  userCred = await auth.createUserWithEmailAndPassword(values.email, values.password);
      // The payload parmeter is the data that was pass into the function. In this instance this would be the form data from the registaration form
      const userCred = await auth.createUserWithEmailAndPassword(payload.email, payload.password);

      // we added doc and changed add to set since we are looking for a way to connect the user and the data.
      await usersCollection.doc(userCred.user.uid).set({
        // name: values.name,
        // email: values.email,
        // age: values.age,
        // country: values.country,
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      await userCred.user.updateProfile({
        displayName: payload.name,
      });
      // committing mutation
      commit('toggleAuth');
    },

    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit('toggleAuth');
    },

    async signout({ commit }) {
      await auth.signOut();

      commit('toggleAuth');
    },

    init_login({ commit }) {
      const user = auth.currentUser; // Keeps track of the current user.

      if (user) {
        // commiting mutation
        commit('toggleAuth');
      }
    },
  },

};
