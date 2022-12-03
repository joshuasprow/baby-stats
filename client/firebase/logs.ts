import { parseError } from "@baby-stats/lib/error";
import { Log } from "@baby-stats/models/logs";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Firestore,
} from "@firebase/firestore";
import globalError from "../stores/error";
const getLogsCollection = (db: Firestore) => collection(db, "logs");

const getLogRef = (db: Firestore, id: string) => doc(db, `logs/${id}`);

export const getLogDoc = async (db: Firestore, id: string) => {
  try {
    const doc = await getDoc(getLogRef(db, id));
    const log = Log.parse(doc.data());

    return log;
  } catch (e) {
    const error = parseError(e);

    console.error(error);
    globalError.set(error);
  }

  return null;
};

export const subscribeToLogs = (db: Firestore, set: (logs: Log[]) => void) =>
  onSnapshot(
    query(getLogsCollection(db), orderBy("timestamp", "desc"), limit(100)),
    { includeMetadataChanges: true },
    (snap) => {
      const logs: Log[] = [];

      for (const doc of snap.docs) {
        try {
          const log = Log.parse({ ...doc.data(), id: doc.id });

          logs.push(log);
        } catch (e) {
          const error = parseError(e);

          console.error(error);
          globalError.set(error);

          set(logs);
          return;
        }
      }

      set(logs);
    },
  );

export const updateLog = async (db: Firestore, value: Log) => {
  try {
    const log = Log.parse({ ...value });
    const ref = getLogRef(db, log.id);

    await updateDoc(ref, log);

    return log;
  } catch (e) {
    const error = parseError(e);

    console.error(error);
    globalError.set(error);

    return null;
  }
};
