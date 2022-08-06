import { firestore } from "$firebase";
import { addHours } from "baby-stats-lib/dates";
import { ENTRY_KINDS, type EntryKind } from "baby-stats-models/entries";
import {
  collection,
  doc,
  getDocs,
  runTransaction,
  Transaction,
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
    // uses Firestore TTL to delete after expiresAt
    // https://console.cloud.google.com/firestore/ttl
    const createdAt = new Date();
    const expiresAt = addHours(createdAt, 1);

    const timestamp = createdAt.getTime().toString();

    await runTransaction(firestore, (tx) => {
      const ref = getSnapshotDoc(uid, timestamp);

      tx.set(ref, { createdAt, expiresAt });

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

let taking = false;

export const takeSnapshot = (uid: string) => {
  if (taking) {
    return;
  }

  const take = async () => {
    taking = true;

    await takeEntriesSnapshot(uid);

    taking = false;
  };

  take();
};
