<template>
  <header-view></header-view>

  <router-view v-slot="{Component}">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <!-- Player -->
  <player-view></player-view>
  <auth-view></auth-view>
</template>

<script>
import PlayerView from '@/components/PlayerView.vue';
import HeaderView from '@/components/HeaderView.vue';
import AuthView from '@/components/AuthView.vue';

export default {
  components: {
    HeaderView,
    AuthView,
    PlayerView,
  },

  created() {
    this.$store.dispatch('init_login');
  },
};
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
