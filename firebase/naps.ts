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

const getNapsCollection = (db: Firestore, babyId: string) =>
  collection(db, `babies/${babyId}/naps`);

const getNapDoc = (db: Firestore, babyId: string, id: string) =>
  doc(db, `babies/${babyId}/naps/${id}`);

export const subscribeToNaps = (
  db: Firestore,
  babyId: string,
  set: (naps: Nap[]) => void,
) =>
  onSnapshot(
    query(getNapsCollection(db, babyId), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => Nap.parse(doc.data()))),
  );

export const addNap = async (db: Firestore, babyId: string, value: NapAdd) => {
  const add = NapAdd.parse({ ...value });
  const ref = doc(getNapsCollection(db, babyId));
  const nap = Nap.parse({ ...add, id: ref.id });

  await setDoc(ref, nap);

  return nap;
};

export const updateNap = async (db: Firestore, babyId: string, value: Nap) => {
  const nap = Nap.parse({ ...value });
  const ref = getNapDoc(db, babyId, nap.id);

  await updateDoc(ref, nap);
};

export const removeNap = async (db: Firestore, babyId: string, id: string) => {
  await deleteDoc(getNapDoc(db, babyId, id));
};
