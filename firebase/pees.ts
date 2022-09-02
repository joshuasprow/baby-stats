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

const getPeesCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/pees`);

const getPeeDoc = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/pees/${id}`);

export const subscribeToPees = (
  db: Firestore,
  uid: string,
  set: (pees: Pee[]) => void,
) =>
  onSnapshot(
    query(getPeesCollection(db, uid), orderBy("timestamp", "desc")),
    (spee) => set(spee.docs.map((doc) => Pee.parse(doc.data()))),
  );

export const addPee = async (db: Firestore, uid: string, value: PeeAdd) => {
  const add = PeeAdd.parse({ ...value });
  const ref = doc(getPeesCollection(db, uid));
  const pee = Pee.parse({ ...add, id: ref.id });

  await setDoc(ref, pee);

  return pee;
};

export const updatePee = async (db: Firestore, uid: string, value: Pee) => {
  const pee = Pee.parse({ ...value });
  const ref = getPeeDoc(db, uid, pee.id);

  await updateDoc(ref, pee);
};

export const removePee = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getPeeDoc(db, uid, id));
};
