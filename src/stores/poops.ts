import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { derived, get } from "svelte/store";
import { z } from "zod";
import { EntryBase } from "../lib/entry";
import { firestore } from "../lib/firebase";
import { newTimestampWithPickerDate } from "./picker-date";
import { user } from "./user";

const PoopAmount = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type PoopAmount = z.infer<typeof PoopAmount>;

const Poop = EntryBase.omit({ amount: true }).extend({
  amount: PoopAmount,
});
export type Poop = z.infer<typeof Poop>;

const poopsCollection = (uid: string) =>
  query(
    collection(firestore, `users/${uid}/poops`),
    orderBy("timestamp", "desc")
  );

export const poops = derived<typeof user, Poop[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(poopsCollection($user.uid), (snap) => {
    const $poops = snap.docs.map(validatePoopDoc);

    set($poops);
  });

  return unsubscribe;
});

const poopsQuery = (uid: string, timestamp: Date) =>
  `users/${uid}/poops/${timestamp.getTime()}`;

const setPoopDoc = (uid: string, poop: Poop) =>
  setDoc(doc(firestore, poopsQuery(uid, poop.timestamp)), poop);

export const addPoop = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const poop = Poop.parse({
    ...value,
    timestamp: newTimestampWithPickerDate(),
  });

  await setPoopDoc($user.uid, poop);
};

export const updatePoop = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const poop = Poop.parse(value);

  await setPoopDoc($user.uid, poop);
};

export const removePoop = async (timestamp: Date) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(doc(firestore, poopsQuery($user.uid, timestamp)));
};

const validatePoopDoc = (doc: QueryDocumentSnapshot<DocumentData>): Poop => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const poop = Poop.parse({ ...data, timestamp });

  return poop;
};
