// Site settings. These values are safe to publish.

// 1) Sign-in (optional): paste your Firebase web app config to switch on accounts (see SETUP.md).
//    firestore.rules is what keeps each user's data private.
window.TENNO_FIREBASE = {
  // apiKey: "...",
  // authDomain: "your-project.firebaseapp.com",
  // projectId: "your-project",
  // appId: "..."
};

// 2) One-tap profile sync (optional): the address of your free Cloudflare Worker relay
//    (see cloudflare-worker.js and SETUP.md). Leave empty to use the copy-and-paste method.
window.TENNO_PROXY = "";
