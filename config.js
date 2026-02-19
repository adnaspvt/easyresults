// config.js - Shared Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyBjnj-jmPUJzmJvk3hu0vC663xTDusNe-Q",
    authDomain: "easyresults.firebaseapp.com",
    projectId: "easyresults",
    storageBucket: "easyresults.firebasestorage.app",
    messagingSenderId: "336950575713",
    appId: "1:336950575713:web:5a7c5f53c407ffe5ec2020",
    measurementId: "G-D82F2D7CXL"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Make the database connection globally available to all files
const db = firebase.firestore();