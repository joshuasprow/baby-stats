import { DocumentData, Firestore, Query } from "firebase-admin/firestore";
import { ZodObject, ZodRawShape } from "zod";
import { parseError } from "./error";
import { Paths, Result } from "./models";

const deleteCollectionBatch = async (
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
    deleteCollectionBatch(db, query, resolve);
  });
};

export const deleteCollection = async (
  db: Firestore,
  path: string,
  batchSize: number = 500
) => {
  const ref = db.collection(path);
  const query = ref.orderBy("__name__").limit(batchSize);

  try {
    await new Promise((resolve, reject) =>
      deleteCollectionBatch(db, query, resolve).catch(reject)
    );

    return null;
  } catch (error) {
    return parseError(error);
  }
};

export const getCollectionDocs = async <
  Z extends ZodObject<ZodRawShape> | DocumentData = DocumentData
>(
  db: Firestore,
  path: string,
  model?: Z
): Promise<Result<Z[]>> => {
  console.log(`Getting docs from ${path}`);

  const ref = db.collection(path);
  const { docs } = await ref.get();

  try {
    return [
      docs.map((doc) => (model ? model.parse(doc.data()) : doc.data())),
      null,
    ];
  } catch (error) {
    return [null, parseError(error)];
  }
};

export const setCollectionDocs = async (
  db: Firestore,
  { babyId, userId, path }: { babyId: string; userId: string; path: string },
  docs: DocumentData[]
) => {
  console.log(`Setting ${docs.length} docs to ${path}`);
  const collectionRef = db.collection(path);

  let batch = db.batch();
  let count = 0;

  for (const doc of docs) {
    const ref = collectionRef.doc(doc.id);

    batch.set(ref, { ...doc, babyId, userId });

    count += 1;

    if (count === 500) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }

  await batch.commit();
};
