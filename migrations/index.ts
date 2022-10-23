import * as admin from "firebase-admin";

const app = admin.initializeApp({ projectId: "baby-stats-10331" });
const db = app.firestore();

db.listCollections().then((collections) => {
  collections.forEach((collection) => {
    console.log(collection.id);
  });
});
