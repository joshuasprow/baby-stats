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
} from "firebase/firestore";
import { firestore } from "./index";

const getPoopsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/poops`);

const getPoopDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/poops/${id}`);

export const subscribeToPoops = (uid: string, set: (poops: Poop[]) => void) =>
  onSnapshot(
    query(getPoopsCollection(uid), orderBy("timestamp", "desc")),
    (spoop) => set(spoop.docs.map((doc) => Poop.parse(doc.data()))),
  );

export const addPoop = async (uid: string, value: PoopAdd) => {
  const add = PoopAdd.parse({ ...value });
  const ref = doc(getPoopsCollection(uid));
  const poop = Poop.parse({ ...add, id: ref.id });

  await setDoc(ref, poop);

  return poop;
};

export const updatePoop = async (uid: string, value: Poop) => {
  const poop = Poop.parse({ ...value });
  const ref = getPoopDoc(uid, poop.id);

  await updateDoc(ref, poop);
};

export const removePoop = async (uid: string, id: string) => {
  await deleteDoc(getPoopDoc(uid, id));
};
