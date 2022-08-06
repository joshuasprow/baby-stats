import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const takeSnapshot = functions.firestore
  .document("/users/{userId}/feeds/{feedId}")
  .onWrite(async (change, context) => {
    functions.logger.log("feed write", { data: change.after.data() });
  });
