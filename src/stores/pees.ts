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

const PeeAmount = [1, 2, 3] as const;
export type PeeAmount = typeof PeeAmount[number];

const Pee = z.object({
  timestamp: z.date(),
  amount: z
    .number()
    .refine(
      (amount) => PeeAmount.some((a) => amount === a),
      `pee amount must be one of: ${PeeAmount.join(", ")}`
    ),
});
export type Pee = z.infer<typeof Pee>;

export const pees = writable<Pee[]>([]);

const peesCollection = (uid: string) =>
  query(
    collection(firestore, `users/${uid}/pees`),
    orderBy("timestamp", "desc")
  );

const peesQuery = (uid: string, timestamp: Date) =>
  `users/${uid}/pees/${timestamp.getTime()}`;

const setPeeDoc = (uid: string, pee: Pee) =>
  setDoc(doc(firestore, peesQuery(uid, pee.timestamp)), pee);

export const addPee = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const pee = Pee.parse({
    ...value,
    timestamp: newTimestampWithPickerDate(),
  });

  await setPeeDoc($user.uid, pee);
};

export const updatePee = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const pee = Pee.parse(value);

  await setPeeDoc($user.uid, pee);
};

export const removePee = async (timestamp: Date) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(doc(firestore, peesQuery($user.uid, timestamp)));
};

const validatePeeDoc = (doc: QueryDocumentSnapshot<DocumentData>): Pee => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const pee = Pee.parse({ ...data, timestamp });

  return pee;
};

let subscribed = false;

user.subscribe(($user) => {
  if (subscribed) return;

  if (!$user) return;

  const unsubscribe = onSnapshot(peesCollection($user.uid), (snap) =>
    pees.set(snap.docs.map(validatePeeDoc))
  );

  subscribed = true;

  return unsubscribe;
});
