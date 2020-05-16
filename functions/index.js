const functions = require("firebase-functions");
const admin = require("firebase-admin");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

exports.scheduledFunctionCrontab = functions.pubsub
  // .schedule("0 3 * * mon")
  .schedule("16 19 * * *")
  .timeZone("America/Chicago")
  .onRun(async (context) => {
    console.log("This will be run every Monday at 3:00 AM Central Time!");
    const week = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let allUser = [];
    let userWeekEx = [];
    let snapshot = await admin.firestore().collection("patients").get();
    snapshot.forEach((doc) => {
      allUser.push(doc.id);
    });
    console.log("All users: ", allUser);

    allUser.forEach((userId) => {
      const exercises = [];
      let weekEx = [];
      week.forEach(async (day) => {
        admin
          .firestore()
          .collection("patients")
          .doc(userId)
          .collection("exercisesets")
          .doc(day)
          .collection("exercises")
          .get()
          .then((setSnapshot) => {
            setSnapshot.forEach(async (ex) => {
              exercises.push(ex.data());
            });
          })
          .then(() => {
            weekEx.push({ day: day, exercises: exercises });
            console.log("Week's exercises: ", weekEx);
          });
      });
      userWeekEx.push({ userId, weekEx });
      console.log("This week's exercises 1: ", userWeekEx);
    });
    console.log("This week's exercises 2: ", userWeekEx);
  });
