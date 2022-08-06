import { firestore } from "$firebase";
import {
  ENTRY_KINDS,
  type Entry,
  type EntryKind,
} from "baby-stats-models/entries";
import {
  collection,
  CollectionReference,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  Transaction,
  type DocumentData,
} from "firebase/firestore";

const getSnapshotDoc = (uid: string, timestamp: string) =>
  doc(firestore, `users/${uid}/snapshots/${timestamp}`);

const copyEntriesToSnapshot = async <K extends EntryKind>(
  tx: Transaction,
  uid: string,
  kind: K,
  timestamp: string
) => {
  const entriesPath = `users/${uid}/${kind}`;
  const entries = await getDocs(collection(firestore, entriesPath));

  for (const entry of entries.docs) {
    const path = `users/${uid}/snapshots/${timestamp}/${kind}/${entry.id}`;

    tx.set(doc(firestore, path), entry.data());
  }
};

const takeEntriesSnapshot = async (uid: string) => {
  try {
    const createdAt = new Date();
    const timestamp = createdAt.getTime().toString();

    await runTransaction(firestore, (tx) => {
      const ref = getSnapshotDoc(uid, timestamp);

      tx.set(ref, { createdAt });

      return Promise.all(
        ENTRY_KINDS.map((kind) =>
          copyEntriesToSnapshot(tx, uid, kind, timestamp)
        )
      );
    });
  } catch (error) {
    console.error(error);
  }
};

export const subscribeToEntrySnapshots = <
  K extends EntryKind,
  E extends Entry<K>
>(
  uid: string,
  col: CollectionReference<DocumentData>,
  parse: (doc: QueryDocumentSnapshot<DocumentData>) => E,
  set: (entries: E[]) => void
) => {
  let taking = false;

  const take = async () => {
    if (taking) {
      console.log("Already taking snapshot");
      return;
    }

    console.log("Taking snapshot");

    taking = true;

    await takeEntriesSnapshot(uid);

    taking = false;

    console.log("Snapshot taken");
  };

  return onSnapshot(query(col, orderBy("timestamp", "desc")), (snap) => {
    const entries = snap.docs.map(parse);

    set(entries);

    take();
  });
};
