import { Poop, PoopAdd } from "models/poops";
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

const getPoopsCollection = (db: Firestore, babyId: string) =>
  collection(db, `babies/${babyId}/poops`);

const getPoopDoc = (db: Firestore, babyId: string, id: string) =>
  doc(db, `babies/${babyId}/poops/${id}`);

export const subscribeToPoops = (
  db: Firestore,
  babyId: string,
  set: (poops: Poop[]) => void,
) =>
  onSnapshot(
    query(getPoopsCollection(db, babyId), orderBy("timestamp", "desc")),
    { includeMetadataChanges: true },
    (snap) => set(snap.docs.map((doc) => Poop.parse(doc.data()))),
  );

export const addPoop = async (
  db: Firestore,
  babyId: string,
  value: PoopAdd,
) => {
  const add = PoopAdd.parse({ ...value });
  const ref = doc(getPoopsCollection(db, babyId));
  const poop = Poop.parse({ ...add, id: ref.id });

  await setDoc(ref, poop);

  return poop;
};

export const updatePoop = async (
  db: Firestore,
  babyId: string,
  value: Poop,
) => {
  const poop = Poop.parse({ ...value });
  const ref = getPoopDoc(db, babyId, poop.id);

  await updateDoc(ref, poop);
};

export const removePoop = async (db: Firestore, babyId: string, id: string) => {
  await deleteDoc(getPoopDoc(db, babyId, id));
};
