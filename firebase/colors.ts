import { HslColor, HslColorAdd } from "baby-stats-lib/colors";
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

const getHslColorsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/colors`);

const getHslColorDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/colors/${id}`);

export const subscribeToHslColors = (
  uid: string,
  set: (colors: HslColor[]) => void
) =>
  onSnapshot(
    query(getHslColorsCollection(uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => HslColor.parse(doc.data())))
  );

export const addHslColor = async (uid: string, value: HslColorAdd) => {
  const add = HslColorAdd.parse({ ...value });
  const ref = doc(getHslColorsCollection(uid));
  const color = HslColor.parse({ ...add, id: ref.id });

  await setDoc(ref, color);

  return color;
};

export const updateHslColor = async (uid: string, value: HslColor) => {
  const color = HslColor.parse({ ...value });
  const ref = getHslColorDoc(uid, color.id);

  await updateDoc(ref, color);
};

export const removeHslColor = async (uid: string, id: string) => {
  await deleteDoc(getHslColorDoc(uid, id));
};
