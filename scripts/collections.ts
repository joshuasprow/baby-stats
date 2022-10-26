import { DocumentData, Firestore, Query } from "firebase-admin/firestore";
import { Paths } from "./path";

const deleteQueryBatch = async (
  db: Firestore,
  query: Query,
  resolve: (value: void | PromiseLike<void>) => void
) => {
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
};

const deleteCollection = async (
  db: Firestore,
  path: string,
  batchSize: number = 500
) => {
  const ref = db.collection(path);
  const query = ref.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
};

const getCollectionDocs = async (db: Firestore, path: string) => {
  const ref = db.collection(path);
  const docs = await ref.get();

  return docs.docs.map((doc) => doc.data());
};

const setCollectionDocs = async (
  db: Firestore,
  path: string,
  docs: DocumentData[]
) => {
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
};

export const migrateCollection = async (db: Firestore, path: Paths) => {
  const docs = await getCollectionDocs(db, path.source);

  await setCollectionDocs(db, path.target, docs);
};
