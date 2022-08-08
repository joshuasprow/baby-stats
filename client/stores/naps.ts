import { firestore } from "$firebase";
import type { TimeRangeAmount } from "baby-stats-models/time-ranges";
import { Nap, NapAdd, NapNext } from "baby-stats-models/naps";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { derived, get, writable } from "svelte/store";
import { user } from "./user";

const getNapsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/naps`);

const getNapDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/naps/${id}`);

// TODO: remove this after migrating all nap records
const fixOldNapAmount = (
  amount: number | { start: Timestamp; end: Timestamp },
  timestamp: Date
): [amount: TimeRangeAmount, fixed: boolean] => {
  if (typeof amount !== "number") {
    return [{ start: amount.start.toDate(), end: amount.end.toDate() }, false];
  }

  const start = new Date(timestamp);
  const end = new Date(timestamp);

  end.setMinutes(start.getMinutes() + amount * 15 /* 15 minutes per "unit" */);

  return [{ start, end }, true];
};

// TODO: remove this after migrating all nap records
let NAP_FIX_QUEUE: NapNext[] = [];

const napFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): NapNext => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const [amount, fixed] = fixOldNapAmount(data.amount, timestamp);

  const nap = NapNext.parse({ ...data, amount, id: doc.id, timestamp });

  if (fixed) {
    NAP_FIX_QUEUE.push(nap);
  }

  return nap;
};

export const napsLoaded = writable(false);

export const naps = derived<typeof user, NapNext[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  let updating = false;

  unsubscribe = onSnapshot(
    query(getNapsCollection($user.uid), orderBy("timestamp", "desc")),
    (snap) => {
      NAP_FIX_QUEUE = [];

      const $naps = snap.docs.map(napFromDoc);

      set($naps);

      napsLoaded.set(true);

      if (NAP_FIX_QUEUE.length === 0) return;
      if (updating) {
        console.log("naps already updating");
        return;
      }

      console.log(`updating ${NAP_FIX_QUEUE.length} fixed naps`);
      updating = true;

      Promise.all(NAP_FIX_QUEUE.map(updateNap))
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          updating = false;
          console.log(`updated  ${NAP_FIX_QUEUE.length} fixed naps`);
        });
    }
  );

  return unsubscribe;
});

export const addNap = async (value: NapAdd) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const add = NapAdd.parse(value);
  const ref = doc(getNapsCollection($user.uid));
  const nap = Nap.parse({ ...add, id: ref.id });

  await setDoc(ref, nap);

  return nap;
};

export const updateNap = async (value: NapNext) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const nap = NapNext.parse(value);
  const ref = getNapDoc($user.uid, nap.id);

  await updateDoc(ref, nap);
};

export const removeNap = async (id: string) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(getNapDoc($user.uid, id));
};
