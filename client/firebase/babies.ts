import { Baby } from "@baby-stats/models/babies";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  type Firestore,
} from "@firebase/firestore";

const getBabyRef = (db: Firestore, id: string) => doc(db, `babies/${id}`);

export const getBabyDoc = async (db: Firestore, id: string) => {
  const doc = await getDoc(getBabyRef(db, id));

  return Baby.parse(doc.data());
};

export const subscribeToBaby = (
  db: Firestore,
  id: string,
  set: (baby: Baby) => void,
) => onSnapshot(getBabyRef(db, id), (snap) => set(Baby.parse(snap.data())));

export const updateBaby = async (db: Firestore, value: Baby) => {
  const baby = Baby.parse({ ...value });
  const ref = getBabyRef(db, baby.id);

  await updateDoc(ref, baby);

  return baby;
};
