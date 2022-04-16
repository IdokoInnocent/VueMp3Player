<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <!-- We do not want our home page to have active class only on links. so we added the no-active property. -->
      <router-link class="text-white font-bold uppercase text-xs sm:text-2xl mr-2" :to="{name: 'home'}" exact-active-class="no-active">Music</router-link>
      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mb-1 sm:mt-2">
          <!-- Navigation Links -->
           <li>
              <router-link class="px-2 text-white  text-xs sm:text-xl" :to="{name: 'about'}">About</router-link>
            </li>
          <li v-if="!userLoggedIn">
            <!--eslint-disable-next-line max-len-->
            <a class="px-2 text-white  text-xs sm:text-2xl" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
          </li>

          <!-- There is one problem. We can't use the v-else directive multiple times except we wrap it in a template tag -->
          <template v-else>
            <li>
              <router-link class="px-2 text-white text-xs sm:text-xl" :to="{name: 'manage'}">Manage</router-link>
            </li>
             <li>
              <a class="px-2 text-white text-xs sm:text-xl" href="#" @click="signout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'HeaderView',
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
    }),
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),

    // ...mapActions(['signout']), // Do this instead of what is below.
    // we used this one because we want the user to be redirected when the logout.
    signout() {
      this.$store.dispatch('signout');
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' });
      }
    },
  },
};
</script>

<style>

</style>
