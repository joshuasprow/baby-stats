import { EntryBase } from "$lib/entry";
import { firestore } from "$lib/firebase";
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
import { newTimestampWithPickerDate } from "./picker-date";
import { user } from "./user";

const PeeAmount = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type PeeAmount = z.infer<typeof PeeAmount>;

const Pee = EntryBase.omit({ amount: true }).extend({
  amount: PeeAmount,
});
export type Pee = z.infer<typeof Pee>;

const peesCollection = (uid: string) =>
  query(
    collection(firestore, `users/${uid}/pees`),
    orderBy("timestamp", "desc")
  );

export const pees = derived<typeof user, Pee[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(peesCollection($user.uid), (snap) => {
    const $pees = snap.docs.map(validatePeeDoc);

    set($pees);
  });

  return unsubscribe;
});

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
    kind: "pees",
    timestamp: newTimestampWithPickerDate(),
  });

  await setPeeDoc($user.uid, pee);
};

export const updatePee = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const pee = Pee.parse({ ...value, kind: "pees" });

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
