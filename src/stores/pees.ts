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
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { derived, get } from "svelte/store";
import { Pee, PeeAdd } from "$models/pees";
import { user } from "./user";

const getPeesCollection = (uid: string) =>
  collection(firestore, `users/${uid}/pees`);

const getPeeDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/pees/${id}`);

const peeFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Pee => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const pee = Pee.parse({ ...data, id: doc.id, timestamp });

  return pee;
};

export const pees = derived<typeof user, Pee[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(
    query(getPeesCollection($user.uid), orderBy("timestamp", "desc")),
    (snap) => {
      const $pees = snap.docs.map(peeFromDoc);

      set($pees);
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
