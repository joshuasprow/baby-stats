import { Log, LogAdd } from "@baby-stats/models/logs";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
  type Firestore,
  type QuerySnapshot,
} from "@firebase/firestore";
import Queue from "../lib/queue";

const getLogsCollection = (db: Firestore) => collection(db, "logs");

const getLogRef = (db: Firestore, id: string) => doc(db, `logs/${id}`);

export const getLogDoc = async (db: Firestore, id: string) => {
  const doc = await getDoc(getLogRef(db, id));

  return Log.parse(doc.data());
};

export const subscribeToLogs = (db: Firestore, set: (logs: Log[]) => void) =>
  onSnapshot(
    query(getLogsCollection(db), orderBy("timestamp", "desc"), limit(100)),
    { includeMetadataChanges: true },
    (snap) =>
      set(snap.docs.map((doc) => Log.parse({ ...doc.data(), id: doc.id }))),
  );

export const updateLog = async (db: Firestore, value: Log) => {
  const log = Log.parse({ ...value });
  const ref = getLogRef(db, log.id);

  await updateDoc(ref, log);

  return log;
};
