const functions = require("firebase-functions");
const admin = require("firebase-admin");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

const fetchAllExericses = (week, userId) => {
  return Promise.all(week.map((day) => fetchExerciseSets(day, userId))).then(
    (userExercisesSets) => ({
      userId: userId,
      exercises: userExercisesSets,
    })
  );
};
const fetchExerciseSets = (day, userId) => {
  let exercises = [];
  let weekEx = [];
  return admin
    .firestore()
    .collection("patients")
    .doc(userId)
    .collection("exercisesets")
    .doc(day)
    .collection("exercises")
    .get()
    .then((setSnapshot) => {
      return {
        day: day,
        exercises: setSnapshot.docs.map((doc) => doc.data()),
      };
    });
};

exports.scheduledFunctionCrontab = functions.pubsub
  // .schedule("0 3 * * mon")
  .schedule("37 20 * * *")
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

    Promise.all(allUser.map((userId) => fetchAllExericses(week, userId))).then(
      (allUsersWeekExercises) => {
        userWeekEx = allUsersWeekExercises;
        console.log("All user's exercises: ", userWeekEx);
        // write to database
      }
    );
  });
