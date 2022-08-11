import { Nap, NapAdd } from "baby-stats-models/naps";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./index";

const getNapsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/naps`);

const getNapDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/naps/${id}`);

export const subscribeToNaps = (uid: string, set: (naps: Nap[]) => void) =>
  onSnapshot(
    query(getNapsCollection(uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => Nap.parse(doc.data())))
  );

export const addNap = async (uid: string, value: NapAdd) => {
  const add = NapAdd.parse({ ...value });
  const ref = doc(getNapsCollection(uid));
  const nap = Nap.parse({ ...add, id: ref.id });

  await setDoc(ref, nap);

  return nap;
};

export const updateNap = async (uid: string, value: Nap) => {
  const nap = Nap.parse({ ...value });
  const ref = getNapDoc(uid, nap.id);

  await updateDoc(ref, nap);
};

export const removeNap = async (uid: string, id: string) => {
  await deleteDoc(getNapDoc(uid, id));
};
