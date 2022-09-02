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
  type Firestore,
} from "firebase/firestore";

const getPoopsCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/poops`);

const getPoopDoc = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/poops/${id}`);

export const subscribeToPoops = (
  db: Firestore,
  uid: string,
  set: (poops: Poop[]) => void,
) =>
  onSnapshot(
    query(getPoopsCollection(db, uid), orderBy("timestamp", "desc")),
    (spoop) => set(spoop.docs.map((doc) => Poop.parse(doc.data()))),
  );

export const addPoop = async (db: Firestore, uid: string, value: PoopAdd) => {
  const add = PoopAdd.parse({ ...value });
  const ref = doc(getPoopsCollection(db, uid));
  const poop = Poop.parse({ ...add, id: ref.id });

  await setDoc(ref, poop);

  return poop;
};

export const updatePoop = async (db: Firestore, uid: string, value: Poop) => {
  const poop = Poop.parse({ ...value });
  const ref = getPoopDoc(db, uid, poop.id);

  await updateDoc(ref, poop);
};

export const removePoop = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getPoopDoc(db, uid, id));
};
