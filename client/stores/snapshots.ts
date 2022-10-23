import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  Timestamp as FirestoreTimestamp,
  Transaction,
} from "@firebase/firestore";
import { addDays } from "baby-stats-lib/dates";
import { ENTRY_KINDS, type EntryKind } from "models/entries";
import { z } from "zod";
import { db } from "../firebase";

const Timestamp = z.instanceof(FirestoreTimestamp);

const Snapshot = z.object({
  createdAt: Timestamp,
  expiresAt: Timestamp,
});
type Snapshot = z.infer<typeof Snapshot>;

const getSnapshotDoc = (uid: string, timestamp: string) =>
  doc(db, `users/${uid}/snapshots/${timestamp}`);

const copyEntriesToSnapshot = async <K extends EntryKind>(
  tx: Transaction,
  uid: string,
  kind: K,
  timestamp: string,
) => {
  const entriesPath = `users/${uid}/${kind}`;
  const entries = await getDocs(collection(db, entriesPath));

  for (const entry of entries.docs) {
    const path = `users/${uid}/snapshots/${timestamp}/${kind}/${entry.id}`;

    tx.set(doc(db, path), entry.data());
  }
};

const takeEntriesSnapshot = async (uid: string) => {
  try {
    // uses Firestore TTL to delete after expiresAt
    // https://console.cloud.google.com/firestore/ttl
    const createdAt = new Date();
    const expiresAt = addDays(createdAt, 3);

    const timestamp = createdAt.getTime().toString();

    await runTransaction(db, (tx) => {
      const ref = getSnapshotDoc(uid, timestamp);

      tx.set(ref, { createdAt, expiresAt });

      return Promise.all(
        ENTRY_KINDS.map((kind) =>
          copyEntriesToSnapshot(tx, uid, kind, timestamp),
        ),
      );
    });
  } catch (error) {
    console.error(error);
  }
};

const getLatestSnapshot = async (uid: string) => {
  const { docs } = await getDocs(
    query(
      collection(db, `users/${uid}/snapshots`),
      orderBy("createdAt", "desc"),
      limit(1),
    ),
  );

  if (docs.length === 0) return null;

  const snapshot = Snapshot.parse(docs[0].data());

  return snapshot;
};

/** Checks if snapshot.createdAt is at least one hour old */
const isOneHourOld = (snapshot: Snapshot): boolean => {
  const createdAt = snapshot.createdAt.toDate();
  const now = new Date();

  return now.getTime() - createdAt.getTime() > 60 * 60 * 1000;
};

let taking = false;

export const takeSnapshot = (uid: string) => {
  if (taking) {
    return;
  }

  const take = async () => {
    taking = true;

    const latest = await getLatestSnapshot(uid);

    if (!latest || isOneHourOld(latest)) {
      await takeEntriesSnapshot(uid);
    } else {
      console.warn("Snapshot is less than an hour old");
    }

    taking = false;
  };

  take();
};
