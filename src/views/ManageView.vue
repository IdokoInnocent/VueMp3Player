<template>

  <main>
       <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <upload-view  :addSong=addSong></upload-view>
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title text-xs sm:text-xl">My Songs</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-xs sm:text-xl"></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <composition-item v-for="(song, i) in songs" :key="song.docID" :song="song" :updateSong="updateSong" :index="i" :removeSong="removeSong" :updateUnsavedFlag=updateUnsavedFlag></composition-item>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

</template>

<script>
// defining guards in component.
// We have to import the store to have access to the userloggedIn property in the state.
// import store from '@/store';
import UploadView from '@/components/UploadView.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { songsCollection, auth } from '@/includes/firebase';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'manage',
  components: {
    UploadView,
    CompositionItem,
  },

  data() {
    return {
      songs: [],
      // for keeping track of any unsavedform when editing
      unsavedFlag: false,
    };
  },

  // Querying the database. we want t request for the songs the user has uploaded from firebase.
  // firebase will need to be imported if we want to make a request to firebase
  async created() {
    // quering the firebase databsae.
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get();
    snapshot.forEach(this.addSong);
  },

  methods: {
    // This function is to update the song once we edit it in the compositionItem componenet. withod doing, when we edit song it won't reflect.
    // "i" is the index of the value to update
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    // // This function is to update the song once we deleted it in the compositionItem componenet. withod doing, when we delete song it won't reflect.
    removeSong(i) {
      this.songs.splice(i, 1);
    },

    // updating the list of songs after an upload by the user.
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };
      this.songs.push(song);
    },

    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  // this is called when a user is filling a form and mistakenly navigate to another page. so this will ask if the user is sure wants to leave the page.
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  },
  // Canceling uploads with refs
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
//   beforeRouteEnter(to, from, next) {
//     // if user is loogedin they have access to the manage page
//     if (store.state.userLoggedIn) {
//       next();
//     // else we ridirect them to the homepage.
//     } else {
//       next({ name: 'home' });
//     }
//   },
};
</script>
