<template>
  <main>
      <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)">
      </div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button type="button" class="z-50 h-10 sm:h-24 w-10 sm:w-24 text-xs sm:text-xl bg-white text-black rounded-full
          focus:outline-none" @click.prevent="newSong(song)"> <!-- we will create this function in the vuex store and we also pass the song data property.. action -->
          <i class="fas fa-play text-xs sm:text-xl"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-xs sm:text-xl font-bold">{{song.modified_name}}</div>
          <div>{{song.genre}}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title text-xs sm:text-xl">Comments ({{song.comment_count}})</span>
          <i class="fa fa-comments float-right text-green-400 text-xs sm:text-xl"></i>
        </div>
        <div class="p-6">
          <div class="text-white text-center font-bold p-4 mb-4 text-xs sm:text-xl" :class="comment_alert_variant" v-if="comment_show_alert">
            {{comment_alert_message}}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
            <vee-field as="textarea" name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."></vee-field>
              <ErrorMessage class="text-red-500" name="comment"></ErrorMessage>
            <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block text-xs sm:text-xl" :disabled="comment_in_submission">
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded text-xs sm:text-xl">
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <!-- befrie we did comment in comments but since we are sorting it us comment in sortedComment. the sorted comment is a function we created down.-->
      <li class="p-6 bg-gray-50 border border-gray-200 text-xs sm:text-xl" v-for="comment in sortedComments" :key="comment.docID">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold text-xs sm:text-xl">{{comment.name}}</div>
          <time class="text-xs sm:text-xl">{{comment.datePosted}}</time>
        </div>

        <p>
          {{comment.content}}
        </p>
      </li>

    </ul>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase';
import { mapState, mapActions } from 'vuex'; // We imported this so that we can use the userLoggedIn value to hide the form from unAuthenticated user.

export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      comments: [], // so we can push the data into this
      sort: '1',
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted',
    };
  },

  computed: {
    // ...mapState(['userLoggedIn']),
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
    }),

    sortedComments() {
      // we added the slice tha make a copy of the comments
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') { // '1' represent a descending order, in our case(latest commment to oldest comment.
          return new Date(b.datePosted) - new Date(a.datePosted); // ordering the comment by descending order. latest to oldest comment
        }
        return new Date(a.datePosted) - new Date(b.datePosted); // Acending order. oldest to lastest comment
      });
    },
  },

  // // requesting.
  // async created() {
  //   const docSnapshots = await songsCollection.doc(this.$route.params.id).get();

  //   //  If the song doesnot exist they should be directed to the home page
  //   if (!docSnapshots.exists) {
  //     this.$router.push({ name: 'home' });
  //     return;
  //   }

  //   // Updating the query parameter.
  //   const { sort } = this.$route.query;
  //   this.sort = sort === '1' || sort === '2' ? sort : '1';

  //   this.song = docSnapshots.data();
  //   this.getComments();
  // },

  // What is above was refractored to this . we did this for peromance when it is slow internet connection
  async beforeRouteEnter(to, from, next) {
    const docSnapshots = await songsCollection.doc(to.params.id).get();

    next((vm) => {
      //  If the song doesnot exist they should be directed to the home page
      if (!docSnapshots.exists) {
        vm.$router.push({ name: 'home' });
        return;
      }

      // Updating the query parameter.
      const { sort } = vm.$route.query;
      // eslint-disable-next-line no-param-reassign
      vm.sort = sort === '1' || sort === '2' ? sort : '1';

      // eslint-disable-next-line no-param-reassign
      vm.song = docSnapshots.data();

      vm.getComments();
    });
  },

  methods: {
    // mapping the fuction from the store
    ...mapActions(['newSong']),
    // The values parameter is the word in the textarea. which we would be submitting to firebase.
    async addComment(values, { resetForm }) { // the second argument is context but we destructure it to use the resetForm(). this is from vee-validate
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait! Your comment is being submitted';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        songID: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      // storing the coment in firebase collection. using the add().
      await commentsCollection.add(comment);

      // Updating the comment.
      this.song.comment_count += 1;
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count,
      });

      this.getComments();

      this.comment_in_submission = false; // Enabling submission again.
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_message = 'Success! comment added';

      //  After submit we rest the textarea field for more comment.
      resetForm(); // This is from vee-validate.
    },

    // Getting coment and displaying it.
    async getComments() {
      const snapshots = await commentsCollection.where('songID', '==', this.$route.params.id).get(); // Note the where() is used when we want multiple documents from firebase. it will help us retrieve the command related to song.

      this.comments = [];

      // lets loop through the snapshots so we push the data into the comments array.
      snapshots.forEach((doc) => {
        // pushing two properties into the object
        this.comments.push({
          docID: doc.id,
          ...doc.data(), // You must do this. This are the data you created in the comment object. eg the content, datePosted, name, etc

        });
      });
    },
  },

  // query parameter.
  watch: {
    sort(newVal) {
      // this condition will prevent the watcher from updating the route if query already matches the sort value.
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};

</script>
