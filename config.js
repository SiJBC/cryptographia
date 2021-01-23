// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6S2OOvNO3RufH2XBA6Oaf3Dkwp6pQsZM",
    authDomain: "crypto-trend-35198.firebaseapp.com",
    databaseURL: "https://crypto-trend-35198-default-rtdb.firebaseio.com",
    projectId: "crypto-trend-35198",
    storageBucket: "crypto-trend-35198.appspot.com",
    messagingSenderId: "4109588346",
    appId: "1:4109588346:web:35f93d7105b36a8eb628c3",
    measurementId: "G-1VBL79RFK8"
  };

  firebase.initializeApp(firebaseConfig)
  const db = firebase.firestore();
  const settings = { timestampsInSnapshots: true};
  db.settings(settings)