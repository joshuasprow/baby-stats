const main = async () => {
  await import("./tadpoles");
  // const projectId = process.env.FIRESTORE_PROJECT_ID;
  // const babyId = process.env.FIRESTORE_BABY_ID;

  // const app = admin.initializeApp({ projectId });
  // const db = app.firestore();

  // if (!projectId || !babyId) {
  //   throw new Error("Missing config");
  // }

  // await _1667346173_mergeEntriesCollections(db, babyId);
};

try {
  main();
} catch (error) {
  console.error(error);
}
