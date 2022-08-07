import { firestore } from "$firebase";
import { Nap, NapAdd } from "baby-stats-models/naps";
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
import { derived, get } from "svelte/store";
import type { ZodType, ZodError } from "zod";
import { user } from "./user";

const getNapsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/naps`);

const getNapDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/naps/${id}`);

const napFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Nap => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const nap = Nap.parse({ ...data, id: doc.id, timestamp });

  return nap;
};

export const parseNap = <N extends Nap | NapAdd>(
  type: ZodType<N>,
  nap: N
): [N, null] | [null, ZodError<N>] => {
  try {
    return [type.parse(nap), null];
  } catch (error) {
    return [null, error as ZodError<N>];
  }
};

export const addNapFields = <N extends Nap | NapAdd>(
  type: ZodType<N>,
  nap: N,
  fields: Partial<N>
) => parseNap(type, { ...nap, ...fields });

export const naps = derived<typeof user, Nap[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(
    query(getNapsCollection($user.uid), orderBy("timestamp", "desc")),
    (snap) => {
      const $naps = snap.docs.map(napFromDoc);

      set($naps);
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

export const updateNap = async (value: Nap) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const nap = Nap.parse(value);
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
