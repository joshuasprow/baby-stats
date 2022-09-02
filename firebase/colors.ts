import { Colors, ColorsAdd } from "baby-stats-models/colors";
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

const getColorsCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/colors`);

const getColorDoc = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/colors/${id}`);

export const subscribeToColors = (
  db: Firestore,
  uid: string,
  set: (colors: Colors[]) => void,
) =>
  onSnapshot(
    query(getColorsCollection(db, uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => Colors.parse(doc.data()))),
  );

export const addColor = async (
  db: Firestore,
  uid: string,
  value: ColorsAdd,
) => {
  const add = ColorsAdd.parse({ ...value });
  const ref = doc(getColorsCollection(db, uid));
  const color = Colors.parse({ ...add, id: ref.id });

  await setDoc(ref, color);

  return color;
};

export const updateColor = async (
  db: Firestore,
  uid: string,
  value: Colors,
) => {
  const color = Colors.parse({ ...value });
  const ref = getColorDoc(db, uid, color.id);

  await updateDoc(ref, color);
};

export const removeColor = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getColorDoc(db, uid, id));
};
