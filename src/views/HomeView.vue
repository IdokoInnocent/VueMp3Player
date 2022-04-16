<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-red text-center p-px relative">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"></div>
      <div class="container mx-auto">
        <div class="text-red main-header-content">
          <h1 class="font-bold text-white text-base sm:text-xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto text-white  text-xs sm:text-xl header-primary">
            With vue-mp3 you can listen, edit, delete and even comment on an artist song. <br>It is easy to use and also installable on mobile.
            Just relax and enjoy.
          </p>
        </div>
      </div>
      <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png" alt="photo"/>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 text-xs sm:text-xl" v-icon.right.yellow="'headphones-alt'">
          <span class="card-title text-xs sm:text-xl">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist" class="text-xs sm:text-xl">
          <song-item v-for="song in songs" :key="song.docID" :song=song></song-item>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase';
import SongItem from '@/components/SongItem.vue';

export default {
  name: 'HomeView',
  components: {
    SongItem,
  },

  data() {
    return {
      songs: [],
      maxPerPage: 25, // The result to show after a request should be 3.
      pendingRequest: false, // Keeping track of request. Incase a user requst when there is already a pending request.
    };
  },
  async created() {
    // requesting songs
    this.getSongs();

    // requesting more songs when the user scroll to the bottom of the page.
    window.addEventListener('scroll', this.handleScroll); // The scroll event is emitted whenever the user scrolls. We are listening for this event on the window object
  },

  // Removing the the event listener if the user navigates away from the page.
  // Component are unmounted if the user navigates away from the page.
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    // This function is responsible for checking the currentscroll position of the page
    handleScroll() {
      // object destructuring
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;

      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }

      // Next check if the scrollTop and innerHeight properties are equal to the offsetHeight
    },
    async getSongs() {
      // if this is true we will stop the request from running. It will tell our component we already have request for songs being made.
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;

      let snapshots;

      if (this.songs.length) {
        // We want the last document from firebase.
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();
        // Getting the list of songs from firebase. if user is old and there has been uploaded songs in the song array
        snapshots = await songsCollection
          .orderBy('modified_name') // This wiil oredr the doc. it should come first.
          .startAfter(lastDoc) // The startAfter function tells firebase to start looking after specific document
          .limit(this.maxPerPage) // The limit function limits how many results(songs) are return by the Api(firebase)
          .get();
      } else {
        // Getting the list of songs from firebase. if there is no songs in the array
        snapshots = await songsCollection
          .orderBy('modified_name') // This wiil oredr the doc. it should come first.
          .limit(this.maxPerPage) // The limit function limits how many results(songs) are return by the Api(firebase)
          .get();
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
  },
};
</script>
