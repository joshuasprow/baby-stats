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
  type Firestore,
} from "firebase/firestore";

const getNapsCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/naps`);

const getNapDoc = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/naps/${id}`);

export const subscribeToNaps = (
  db: Firestore,
  uid: string,
  set: (naps: Nap[]) => void,
) =>
  onSnapshot(
    query(getNapsCollection(db, uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => Nap.parse(doc.data()))),
  );

export const addNap = async (db: Firestore, uid: string, value: NapAdd) => {
  const add = NapAdd.parse({ ...value });
  const ref = doc(getNapsCollection(db, uid));
  const nap = Nap.parse({ ...add, id: ref.id });

  await setDoc(ref, nap);

  return nap;
};

export const updateNap = async (db: Firestore, uid: string, value: Nap) => {
  const nap = Nap.parse({ ...value });
  const ref = getNapDoc(db, uid, nap.id);

  await updateDoc(ref, nap);
};

export const removeNap = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getNapDoc(db, uid, id));
};
