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
} from "firebase/firestore";
import { firestore } from "./index";

const getPeesCollection = (uid: string) =>
  collection(firestore, `users/${uid}/pees`);

const getPeeDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/pees/${id}`);

export const subscribeToPees = (uid: string, set: (pees: Pee[]) => void) =>
  onSnapshot(
    query(getPeesCollection(uid), orderBy("timestamp", "desc")),
    (spee) => set(spee.docs.map((doc) => Pee.parse(doc.data())))
  );

export const addPee = async (uid: string, value: PeeAdd) => {
  const add = PeeAdd.parse({ ...value });
  const ref = doc(getPeesCollection(uid));
  const pee = Pee.parse({ ...add, id: ref.id });

  await setDoc(ref, pee);

  return pee;
};

export const updatePee = async (uid: string, value: Pee) => {
  const pee = Pee.parse({ ...value });
  const ref = getPeeDoc(uid, pee.id);

  await updateDoc(ref, pee);
};

export const removePee = async (uid: string, id: string) => {
  await deleteDoc(getPeeDoc(uid, id));
};
