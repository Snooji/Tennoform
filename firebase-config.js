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

// 2) One-tap profile sync on every platform: the Google Apps Script relay
//    (google-apps-script-relay.gs, deploy steps in SETUP.md). Leave empty to sync PC accounts only.
window.TENNO_PROXY = "https://script.google.com/macros/s/AKfycbyLDkG0FRDXvErEfJx0NC1IaHj_I_wI4SROjQVgMUhoIXbyDZkBiIIY-i19KXMqKKeJug/exec";

// 3) iPhone home-screen sign-in: set to true after adding https://tennoform.com/__/auth/handler
//    to the Google OAuth client's "Authorized redirect URIs" (see SETUP.md).
window.TENNO_SELF_AUTH = true;
