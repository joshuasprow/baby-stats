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
import { Pee, PeeAdd } from "baby-stats-models/pees";
import { derived, get, writable } from "svelte/store";
import { user } from "./user";

const getPeesCollection = (uid: string) =>
  collection(firestore, `users/${uid}/pees`);

const getPeeDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/pees/${id}`);

export const peesLoaded = writable(false);

export const pees = derived<typeof user, Pee[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(
    query(getPeesCollection($user.uid), orderBy("timestamp", "desc")),
    (snap) => {
      const $pees = snap.docs.map((doc) => Pee.parse(doc.data()));

      set($pees);

      peesLoaded.set(true);
    }
  );

  return unsubscribe;
});

export const addPee = async (value: PeeAdd) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const add = PeeAdd.parse({ ...value });
  const ref = doc(getPeesCollection($user.uid));
  const pee = Pee.parse({ ...add, id: ref.id });

  await setDoc(ref, pee);

  return pee;
};

export const updatePee = async (value: Pee) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const pee = Pee.parse({ ...value });
  const ref = getPeeDoc($user.uid, pee.id);

  await updateDoc(ref, pee);
};

export const removePee = async (id: string) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(getPeeDoc($user.uid, id));
};
