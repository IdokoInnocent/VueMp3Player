import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCnqwg2-LY0QpSZDPDxQAKzPNX3XZk91iU',
  authDomain: 'music-app-d6d95.firebaseapp.com',
  projectId: 'music-app-d6d95',
  storageBucket: 'music-app-d6d95.appspot.com',
  appId: '1:20555178230:web:e878ec973fc6a187844cd7',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// for authentication(email and password)
const auth = firebase.auth();

// for other information about the user like(name, age etc).
const db = firebase.firestore();

// for storage. In our case, music upload to firebase
const storage = firebase.storage();

// data persistence: Firebase way of caching datd.
db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

// creatin collection for users
const usersCollection = db.collection('users');

// songs collection
const songsCollection = db.collection('songs');

// comment collection
const commentsCollection = db.collection('comments');

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage,
};
