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
} from "firebase/firestore";
import { firestore } from "./index";

const getColorsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/colors`);

const getColorDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/colors/${id}`);

export const subscribeToColors = (
  uid: string,
  set: (colors: Colors[]) => void
) =>
  onSnapshot(
    query(getColorsCollection(uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => Colors.parse(doc.data())))
  );

export const addColor = async (uid: string, value: ColorsAdd) => {
  const add = ColorsAdd.parse({ ...value });
  const ref = doc(getColorsCollection(uid));
  const color = Colors.parse({ ...add, id: ref.id });

  await setDoc(ref, color);

  return color;
};

export const updateColor = async (uid: string, value: Colors) => {
  const color = Colors.parse({ ...value });
  const ref = getColorDoc(uid, color.id);

  await updateDoc(ref, color);
};

export const removeColor = async (uid: string, id: string) => {
  await deleteDoc(getColorDoc(uid, id));
};
