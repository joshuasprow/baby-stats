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
import { get, writable } from "svelte/store";
import { z } from "zod";
import { firestore } from "../lib/firebase";
import { newTimestampWithPickerDate } from "./picker-date";
import { user } from "./user";

const PoopAmount = [1, 2, 3] as const;
export type PoopAmount = typeof PoopAmount[number];

const Poop = z.object({
  timestamp: z.date(),
  amount: z
    .number()
    .refine(
      (amount) => PoopAmount.some((a) => amount === a),
      `poop amount must be one of: ${PoopAmount.join(", ")}`
    ),
});
export type Poop = z.infer<typeof Poop>;

export const poops = writable<Poop[]>([]);

const poopsCollection = (uid: string) =>
  query(
    collection(firestore, `users/${uid}/poops`),
    orderBy("timestamp", "desc")
  );

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

let subscribed = false;

user.subscribe(($user) => {
  if (subscribed) return;

  if (!$user) return;

  const unsubscribe = onSnapshot(poopsCollection($user.uid), (snap) =>
    poops.set(snap.docs.map(validatePoopDoc))
  );

  subscribed = true;

  return unsubscribe;
});
