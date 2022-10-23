const COLLECTION_NAMES = ["feeds", "naps", "pees", "poops"];

/** @param {string} name */
function validateCollectionName(name) {
  if (COLLECTION_NAMES.includes(name)) return;

  throw new Error(`Collection name ${name} is not valid`);
}

/**
 * @param {import("firebase-admin/firestore").Firestore} db
 * @param {import("firebase-admin/firestore").Query} query
 * @param {(value: void | PromiseLike<void>) => void} resolve
 */
async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

/**
 * @param {import("firebase-admin/firestore").Firestore} db
 * @param {string} path
 * @param {number | undefined} batchSize
 */
async function deleteCollection(db, path, batchSize = 500) {
  const ref = db.collection(path);
  const query = ref.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

/**
 * @param {import("firebase-admin/firestore").Firestore} db
 * @param {string} path
 */
async function getCollectionDocs(db, path) {
  const ref = db.collection(path);
  const docs = await ref.get();

  return docs.docs.map((doc) => doc.data());
}
/**
 * @param {import("firebase-admin/firestore").Firestore} db
 * @param {string} path
 * @param {import("firebase-admin/firestore").DocumentData[]} docs
 */
async function setCollectionDocs(db, path, docs) {
  const collectionRef = db.collection(path);

  let batch = db.batch();
  let count = 0;

  for (const doc of docs) {
    const ref = collectionRef.doc(doc.id);

    batch.set(ref, doc);

    count += 1;

    if (count === 500) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }

  await batch.commit();
}

/**
 * @param {{
 *   db: import("firebase-admin/firestore").Firestore;
 *   collectionName: string;
 *   userId: string;
 *   babyId: string;
 * }} options
 */
export async function migrateCollection({
  db,
  collectionName,
  userId,
  babyId,
}) {
  validateCollectionName(collectionName);

  const userPath = `users/${userId}/${collectionName}`;
  const babyPath = `babies/${babyId}/${collectionName}`;

  await deleteCollection(db, babyPath);

  const docs = await getCollectionDocs(db, userPath);

  await setCollectionDocs(db, babyPath, docs);
}
