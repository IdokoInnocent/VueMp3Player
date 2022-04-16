<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-small border-b border-gray-200">
            <span class="card-title text-xs sm:text-xl">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <!-- Upload Dropbox -->
            <div
                class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                    border-gray-400 text-gray-400 transition duration-500 hover:text-white
                    hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class = "{'bg-green-400 border-green-400 border-solid': is_dragover}"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover= false"
                @dragover.prevent.stop="is_dragover= true"
                @dragenter.prevent.stop="is_dragover= true"
                @dragleave.prevent.stop="is_dragover= false"
                @drop.prevent.stop="upload($event)">
                <h5>Drop your files here</h5>
            </div>
            <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
            <input type="file" multiple @change="upload($event)">
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4 text-xs sm:text-xl" v-for="upload in uploads" :key="upload.name">
                <!-- File Name -->
                <div class="font-bold text-xs sm:text-xl" :class="upload.text_class">
                    <i :class="upload.icon"></i>{{upload.name}}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                  <!-- Inner Progress Bar -->
                  <div class="transition-all progress-bar text-xs sm:text-xl"
                    :class="upload.variant"
                    :style="{ width: upload.current_progress + '%'}">
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';

export default {
  name: 'UploadView',

  data() {
    return {
      is_dragover: false,
      uploads: [], //
    };
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false;
      //   object destructuring
      //   The file array is actually an object. We don't have access to the looping function. we need to convert this object into an array.
      //   const { files } = $event.dataTransfer;
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]; // converting an object into an array.
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          // eslint-disable-next-line no-useless-return
          return; // This return statement wiil end the cuurent iteration of the loop. if the user makes it up to this point we can begin to upload the file to firebase.
        }

        // Hnadling offline upload.
        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          });
          return;
        }

        // uploading to firebase.
        const storageRef = storage.ref(); // You need to create a reference folder (music-app-d6d95.appspot.com) the root directory.
        const songsRef = storageRef.child(`songs/${file.name}`); // A subdirectory where the songs will be stored in firebase (music-app-d6d95.appspot.com/songs/baddest.mp3).

        const task = songsRef.put(file); // put to firebase.

        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;

        // making the progress bar functional
        // Remember thi s takes three callback function.
        // The event will let us know the progress of the upload, if the upload failed or succeded. Then we wil pass three function to handle each one
        task.on('state_changed', (snapshot) => {
          // To get hou much has been uploaded so far.
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].current_progress = progress;
        }, () => {
          this.uploads[uploadIndex].variant = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].text_class = 'text-red-400';
        }, async () => {
          // storing the songs in the database.
          const song = {
            uid: auth.currentUser.uid, // Represents the currentuser who is logged into the application
            display_Name: auth.currentUser.displayName,
            original_name: task.snapshot.ref.name,
            modified_name: task.snapshot.ref.name, // Nmae of the song after uploading
            genre: '',
            comment_count: 0,
          };

          song.url = await task.snapshot.ref.getDownloadURL();
          const songRef = await songsCollection.add(song); // Adds the songs to the collection

          const songSnapshot = await songRef.get();
          this.addSong(songSnapshot);

          // updating the ui for successful upload.
          this.uploads[uploadIndex].variant = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].text_class = 'text-green-400';
        });
      });
    },

    // we want to use this method in the manage.vue component.
    // cancelUploads() {
    //   this.uploads.forEach((upload) => {
    //     upload.task.cancel();
    //   });
    // },
  },

  // Cancleing uploads if the user navigates away from the page when uploading to firebase using lifcycle function.
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>

<style>

</style>
