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
  type DocumentData,
} from "firebase/firestore";
import { get, writable } from "svelte/store";
import { z } from "zod";
import { firestore } from "../lib/firebase";
import { newTimestampWithPickerDate } from "./picker-date";
import { user } from "./user";

const Nap = z.object({
  timestamp: z.date(),
  amount: z.number().int().positive(),
});
export type Nap = z.infer<typeof Nap>;

export const naps = writable<Nap[]>([]);

const napsCollection = (uid: string) =>
  query(
    collection(firestore, `users/${uid}/naps`),
    orderBy("timestamp", "desc")
  );

const napsQuery = (uid: string, timestamp: Date) =>
  `users/${uid}/naps/${timestamp.getTime()}`;

const setNapDoc = (uid: string, nap: Nap) =>
  setDoc(doc(firestore, napsQuery(uid, nap.timestamp)), nap);

export const addNap = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const nap = Nap.parse({
    ...value,
    timestamp: newTimestampWithPickerDate(),
  });

  await setNapDoc($user.uid, nap);
};

export const updateNap = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const nap = Nap.parse(value);

  await setNapDoc($user.uid, nap);
};

export const removeNap = async (timestamp: Date) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(doc(firestore, napsQuery($user.uid, timestamp)));
};

const validateNapDoc = (doc: QueryDocumentSnapshot<DocumentData>): Nap => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const nap = Nap.parse({ ...data, timestamp });

  return nap;
};

let subscribed = false;

user.subscribe(($user) => {
  if (subscribed) return;

  if (!$user) return;

  const unsubscribe = onSnapshot(napsCollection($user.uid), (snap) =>
    naps.set(snap.docs.map(validateNapDoc))
  );

  subscribed = true;

  return unsubscribe;
});
