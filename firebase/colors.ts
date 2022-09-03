import { Colors, ColorsAdd, DEFAULT_THEME } from "baby-stats-models/colors";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
import { getUser } from "./users";

const getColorsCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/colors`);

const getColorsRef = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/colors/${id}`);

const handleColorsSnapshot =
  (db: Firestore, uid: string, set: (colors: Colors[]) => void) =>
  async (snap: QuerySnapshot) => {
    let colors = snap.docs.map((doc) => Colors.parse(doc.data()));

    if (colors.length > 0) return set(colors);

    const defaultColor = await addColors(db, uid, DEFAULT_THEME);

    return set([defaultColor]);
  };

export const subscribeToColors = (
  db: Firestore,
  uid: string,
  set: (colors: Colors[]) => void,
) =>
  onSnapshot(
    query(getColorsCollection(db, uid), orderBy("timestamp", "desc")),
    handleColorsSnapshot(db, uid, set),
  );

export const getUserTheme = async (
  db: Firestore,
  uid: string,
  themeId: null | string,
) => {
  if (!themeId) return null;

  const doc = await getDoc(getColorsRef(db, uid, themeId));

  return Colors.parse(doc.data());
};

export const getUserThemes = async (db: Firestore, uid: string) => {
  const docs = await getDocs(getColorsCollection(db, uid));

  const themes: Colors[] = [];

  docs.forEach((doc) => {
    try {
      themes.push(Colors.parse(doc.data()));
    } catch (error) {
      console.error(error);
    }
  });

  return themes;
};

export const addColors = async (
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

export const updateColors = async (
  db: Firestore,
  uid: string,
  value: Colors,
) => {
  const color = Colors.parse({ ...value });
  const ref = getColorsRef(db, uid, color.id);

  await updateDoc(ref, color);
};

export const removeColors = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getColorsRef(db, uid, id));
};
