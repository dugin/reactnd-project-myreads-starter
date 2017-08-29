import firebase from 'firebase'

// Initialize Firebase
const config = {
    apiKey: "AIzaSyDBcJ99i6_wcoDdFwdgf_g1J7cVcOO5Dlc",
    authDomain: "myreads-10065.firebaseapp.com",
    databaseURL: "https://myreads-10065.firebaseio.com",
    projectId: "myreads-10065",
    storageBucket: "",
    messagingSenderId: "963003594981"
};
firebase.initializeApp(config);

export default firebase;
