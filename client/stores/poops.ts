import { firestore } from "$lib/firebase";
import { Poop, PoopAdd } from "baby-stats-models/poops";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { derived, get } from "svelte/store";
import { user } from "./user";

const getPoopsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/poops`);

const getPoopDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/poops/${id}`);

const poopFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Poop => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const poop = Poop.parse({ ...data, id: doc.id, timestamp });

  return poop;
};

export const poops = derived<typeof user, Poop[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(
    query(getPoopsCollection($user.uid), orderBy("timestamp", "desc")),
    (snap) => {
      const $poops = snap.docs.map(poopFromDoc);

      set($poops);
    }
  );

  return unsubscribe;
});

export const addPoop = async (value: PoopAdd) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const add = PoopAdd.parse({ ...value });
  const ref = doc(getPoopsCollection($user.uid));
  const poop = Poop.parse({ ...add, id: ref.id });

  await setDoc(ref, poop);

  return poop;
};

export const updatePoop = async (value: Poop) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const poop = Poop.parse({ ...value });
  const ref = getPoopDoc($user.uid, poop.id);

  await updateDoc(ref, poop);
};

export const removePoop = async (id: string) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(getPoopDoc($user.uid, id));
};
