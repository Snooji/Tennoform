// Site settings. These values are safe to publish.

// 1) Sign-in (optional): paste your Firebase web app config to switch on accounts (see SETUP.md).
//    firestore.rules is what keeps each user's data private.
window.TENNO_FIREBASE = {
  apiKey: "AIzaSyCB-rOxdVWDmPVcqUQWIe0tfUePlQf-h4I",
  authDomain: "tennoform.firebaseapp.com",
  projectId: "tennoform",
  storageBucket: "tennoform.firebasestorage.app",
  messagingSenderId: "877080991164",
  appId: "1:877080991164:web:6bfae6a07af747755a87b9"
};

// 2) Profile sync is upload-only: players save their own profile page and upload or paste it.
//    Tennoform never contacts Digital Extremes, so there is no relay to set.
window.TENNO_PROXY = ""; /* retired: Tennoform no longer fetches profiles; players upload their own file */

// 3) iPhone home-screen sign-in: set to true after adding https://tennoform.com/__/auth/handler
//    to the Google OAuth client's "Authorized redirect URIs" (see SETUP.md).
window.TENNO_SELF_AUTH = true;
