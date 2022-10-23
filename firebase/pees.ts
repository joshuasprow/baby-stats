import { Pee, PeeAdd } from "baby-stats-models/pees";
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

const getPeesCollection = (db: Firestore, babyId: string) =>
  collection(db, `babies/${babyId}/pees`);

const getPeeDoc = (db: Firestore, babyId: string, id: string) =>
  doc(db, `babies/${babyId}/pees/${id}`);

export const subscribeToPees = (
  db: Firestore,
  babyId: string,
  set: (pees: Pee[]) => void,
) =>
  onSnapshot(
    query(getPeesCollection(db, babyId), orderBy("timestamp", "desc")),
    (pees) => set(pees.docs.map((doc) => Pee.parse(doc.data()))),
  );

export const addPee = async (db: Firestore, babyId: string, value: PeeAdd) => {
  const add = PeeAdd.parse({ ...value });
  const ref = doc(getPeesCollection(db, babyId));
  const pee = Pee.parse({ ...add, id: ref.id });

  await setDoc(ref, pee);

  return pee;
};

export const updatePee = async (db: Firestore, babyId: string, value: Pee) => {
  const pee = Pee.parse({ ...value });
  const ref = getPeeDoc(db, babyId, pee.id);

  await updateDoc(ref, pee);
};

export const removePee = async (db: Firestore, babyId: string, id: string) => {
  await deleteDoc(getPeeDoc(db, babyId, id));
};
