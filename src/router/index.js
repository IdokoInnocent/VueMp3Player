import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/views/HomeView.vue';
// import About from '@/views/AboutView.vue';
// import Manage from '@/views/ManageView.vue';
// import Song from '@/views/SongView.vue';
import store from '@/store';

// We are importing the route this way instaead of what is above for performance purpose.
// This is importing route components dynamically.
const Home = () => import('@/views/HomeView.vue');
const About = () => import('@/views/AboutView.vue');
const Manage = () => import(/* webpackChunckName: "groupedChunk" */'@/views/ManageView.vue'); // this is called name chunk. so when this page is visted the other page below is also loaded in the sme chunk.
const Song = () => import(/* webpackChunckName: "groupedChunk" */'@/views/SongView.vue');

const routes = [
  // each object in the array is called "record"
  {
    // naming route
    name: 'home',
    path: '/',
    component: Home,
  },

  {
    name: 'about',
    path: '/about',
    component: About,
  },

  {
    name: 'manage',
    path: '/manage-music',
    meta: {
      requiresAuth: true,
    },
    component: Manage,

    // defining guard to a specific route.
    beforeEnter: (to, from, next) => {
      next();
    },
  },

  // we changed the path from "manage" to "manage-music".
  // but we want the browser to know that it is the same manage.
  // so we created another record to redirect the user to the page.
  {
    path: '/manage',
    redirect: { name: 'manage' },
  },
  //  Patth parameter. We are going to create a route for individual song pages.
  // This is where route parameter come in handy. We want to be able to store the id in the url.
  // Catching a path that does not exist.

  {
    name: 'song',
    path: '/song/:id', // Telling the router that this segment is dynamic.
    component: Song,
  },

  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Adding active links.
  linkExactActiveClass: 'text-yellow-500',
});

// Defing global route guard. This is similar to what we commented in the manage.vue component.
// we are doing it globally here. while if you want it in a particular component you do it like the one we commented in the manage.vue component.
router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }
  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
