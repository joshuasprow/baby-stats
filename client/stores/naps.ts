import { firestore } from "$firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "baby-stats-firebase";
import { NapAdd, NapNext } from "baby-stats-models/naps";
import { derived, get, writable } from "svelte/store";
import { user } from "./user";

const getNapsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/naps`);

const getNapDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/naps/${id}`);

export const napsLoaded = writable(false);

export const naps = derived<typeof user, NapNext[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(
    query(getNapsCollection($user.uid), orderBy("timestamp", "desc")),
    (snap) => {
      const $naps = snap.docs.map((doc) => NapNext.parse(doc.data()));

      set($naps);

      napsLoaded.set(true);
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
  const nap = NapNext.parse({ ...add, id: ref.id });

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
