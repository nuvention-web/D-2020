const functions = require("firebase-functions");
const admin = require("firebase-admin");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

// const calcDate = (day) => {
//   let dayNum;
//   switch (day) {
//     case "Monday":
//       dayNum = 0;
//       break;
//     case "Tuesday":
//       dayNum = 1;
//       break;
//     case "Wednesday":
//       dayNum = 2;
//       break;
//     case "Thursday":
//       dayNum = 3;
//       break;
//     case "Friday":
//       dayNum = 4;
//       break;
//     case "Saturday":
//       dayNum = 5;
//       break;
//     case "Sunday":
//       dayNum = 6;
//   }
//   let newDate = new Date();
//   newDate.setDate(newDate.getDate() + dayNum);
//   return newDate;
// };
// const fetchAllExericses = (week, userId) => {
//   return Promise.all(week.map((day) => fetchExerciseSets(day, userId))).then(
//     (userExercisesSets) => ({
//       userId: userId,
//       exercises: userExercisesSets,
//     })
//   );
// };
// const fetchExerciseSets = (day, userId) => {
//   return admin
//     .firestore()
//     .collection("patients")
//     .doc(userId)
//     .collection("exercisesets")
//     .doc(day)
//     .collection("exercises")
//     .get()
//     .then((setSnapshot) => {
//       return {
//         day: day,
//         exercises: setSnapshot.docs.map((doc) => ({
//           exId: doc.id,
//           ...doc.data(),
//         })),
//       };
//     });
// };

// exports.updateHistoryWeekly = functions.pubsub
//   // .schedule("0 3 * * mon")
//   .schedule("0 3 * * mon")
//   .timeZone("America/Chicago")
//   .onRun(async (context) => {
//     console.log("This is being run every Monday at 3:00 AM Central Time!");
//     const week = [
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//       "Sunday",
//     ];
//     let allUser = [];
//     let returnObjArr;
//     let snapshot = await admin.firestore().collection("patients").get();
//     snapshot.forEach((doc) => {
//       allUser.push(doc.id);
//     });

//     Promise.all(allUser.map((userId) => fetchAllExericses(week, userId))).then(
//       async (allUsersWeekExercises) => {
//         returnObjArr = allUsersWeekExercises.map((uEx) =>
//           uEx.exercises.map((ex) => {
//             if (ex !== undefined)
//               return ex.exercises.map((e) => {
//                 if (e !== undefined)
//                   return {
//                     exId: e.exId,
//                     day: ex.day,
//                     complete: false,
//                     date: calcDate(ex.day),
//                     duration: e.duration,
//                     hold: e.hold,
//                     name: e.name,
//                     reps: e.reps,
//                     resistance: e.resistance,
//                     rest: e.rest,
//                     sets: e.sets,
//                     videoId: e.videoId,
//                   };
//               });
//           })
//         );

//         for (let i = 0; i < allUser.length; i++) {
//           // Add to History
//           const historyRef = admin
//             .firestore()
//             .collection("patients")
//             .doc(allUser[i])
//             .collection("history");

//           returnObjArr[i].map((weekEx) => {
//             if (weekEx !== undefined) {
//               weekEx.forEach((obj) => {
//                 // Write to historyRef
//                 historyRef.add(obj).then((docRef) => {
//                   // Update historyId of the updated exercises
//                   admin
//                     .firestore()
//                     .collection("patients")
//                     .doc(allUser[i])
//                     .collection("exercisesets")
//                     .doc(obj.day) // day
//                     .collection("exercises")
//                     .doc(obj.exId) // id
//                     .update({ historyId: docRef.id });
//                 });
//               });
//             }
//           });
//         }
//       }
//     );
//   });

exports.getSubCollections = functions.https.onCall(async (data, context) => {
  const docPath = data.docPath;
  const collections = await admin.firestore().doc(docPath).listCollections();
  const collectionIds = collections.map((col) => col.id);
  return { collections: collectionIds };
});
