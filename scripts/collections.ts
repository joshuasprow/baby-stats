import { DocumentData, Firestore, Query } from "firebase-admin/firestore";

async function deleteQueryBatch(
  db: Firestore,
  query: Query,
  resolve: (value: void | PromiseLike<void>) => void
) {
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

async function deleteCollection(
  db: Firestore,
  path: string,
  batchSize: number = 500
) {
  const ref = db.collection(path);
  const query = ref.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

/**
 * @param {Firestore} db
 * @param {string} path
 */
async function getCollectionDocs(db: Firestore, path: string) {
  const ref = db.collection(path);
  const docs = await ref.get();

  return docs.docs.map((doc) => doc.data());
}
/**
 * @param {Firestore} db
 * @param {string} path
 * @param {DocumentData[]} docs
 */
async function setCollectionDocs(
  db: Firestore,
  path: string,
  docs: DocumentData[]
) {
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

export async function migrateCollections({
  db,
  userId,
  babyId,
}: {
  db: Firestore;
  userId: string;
  babyId: string;
}) {
  for (const collection of ["feeds", "naps", "pees", "poops"]) {
    const userPath = `users/${userId}/${collection}`;
    const babyPath = `babies/${babyId}/${collection}`;

    await deleteCollection(db, babyPath);

    const docs = await getCollectionDocs(db, userPath);

    await setCollectionDocs(db, babyPath, docs);
  }
}
