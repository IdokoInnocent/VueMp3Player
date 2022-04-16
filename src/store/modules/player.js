import { Howl } from 'howler';
import helper from '@/includes/helper';

export default {
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00', // current position of the song in the progress bar
    duration: '00:00', // duration of the song
    playerProgress: '0%', // Progress bar when the song is playing.
  },
  getters: {
    // change the icon to pause or play
    // eslint-disable-next-line consistent-return
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
  mutations: {
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },

    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek()); // the seek() function is from howler library
      state.duration = helper.formatTime(state.sound.duration()); // from howler

      // Player progress bar.
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  actions: {
    // Playing audio.
    async newSong({ commit, state, dispatch }, payload) {
      // We don,t want the song to play when it is already playing when the play button is clicked.
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }
      // In accordance with the first step, we want to store the song data inside the state using the commit function.
      commit('newSong', payload); // The name of the mutation is the same name as the function(newSong). it is not a must.

      // playing the song.
      state.sound.play();

      // Listening for an event called play
      state.sound.on('play', () => {
        // updating the duration and seek state properties.
        requestAnimationFrame(() => {
          // dispatchin an action for updating the state.
          dispatch('progress');
        });
      });
    },

    // toggling audio.
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        // eslint-disable-next-line no-useless-return
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },

    progress({ commit, state, dispatch }) {
      commit('updatePosition'); // define this function in the mutation object.

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },

    // changing the audio position if the timeline is clicked.
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        // eslint-disable-next-line no-useless-return
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;

      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
};
