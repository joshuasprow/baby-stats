/**
 * @param {import("firebase-admin/firestore").Firestore} db
 * @param {string} collectionPath
 * @param {number | undefined} batchSize
 * @returns {Promise<void>}
 */
export async function deleteCollection(db, collectionPath, batchSize = 500) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

/**
 * @param {import("firebase-admin/firestore").Firestore} db
 * @param {import("firebase-admin/firestore").Query} query
 * @param {(value: void | PromiseLike<void>) => void} resolve
 * @returns {Promise<void>}
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
