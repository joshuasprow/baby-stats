import {
  type Entry,
  type EntryAdd,
  type EntryKind,
} from "@baby-stats/models/entries";
import { Feed, FeedAdd } from "@baby-stats/models/feeds";
import { Nap, NapAdd } from "@baby-stats/models/naps";
import { Pee, PeeAdd } from "@baby-stats/models/pees";
import { Poop, PoopAdd } from "@baby-stats/models/poops";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type Firestore,
} from "@firebase/firestore";
import { addDays } from "../lib/dates";

const getEntriesCollection = (db: Firestore) => collection(db, "entries");

const getEntryDoc = (db: Firestore, entryId: string) =>
  doc(db, `entries/${entryId}`);

const parseEntry = (value: unknown): Entry<EntryKind> => {
  switch ((value as Entry<any>).kind) {
    case "feeds":
      return Feed.parse(value);
    case "naps":
      return Nap.parse(value);
    case "pees":
      return Pee.parse(value);
    case "poops":
      return Poop.parse(value);
    default:
      throw new Error(`Invalid entry: ${JSON.stringify(value)}`);
  }
};

const parseEntryAdd = (value: unknown): EntryAdd<EntryKind> => {
  switch ((value as Entry<any>).kind) {
    case "feeds":
      return FeedAdd.parse(value);
    case "naps":
      return NapAdd.parse(value);
    case "pees":
      return PeeAdd.parse(value);
    case "poops":
      return PoopAdd.parse(value);
    default:
      throw new Error(`Invalid entry: ${JSON.stringify(value)}`);
  }
};

export const subscribeToEntries = (
  db: Firestore,
  babyId: string,
  set: (entries: Entry<EntryKind>[]) => void,
) =>
  onSnapshot(
    query(
      getEntriesCollection(db),
      where("babyId", "==", babyId),
      where("timestamp", ">=", addDays(new Date(), -10)),
      orderBy("timestamp", "desc"),
    ),
    { includeMetadataChanges: true },
    (snap) => set(snap.docs.map((doc) => parseEntry(doc.data()))),
  );

export const addEntry = async (db: Firestore, value: EntryAdd<EntryKind>) => {
  const add = parseEntryAdd(value);
  const ref = doc(getEntriesCollection(db));
  const entry = parseEntry({ ...add, id: ref.id });

  await setDoc(ref, entry);

  return entry;
};

export const updateEntry = async (db: Firestore, value: Entry<EntryKind>) => {
  const entry = parseEntry(value);
  const ref = getEntryDoc(db, entry.id);

  await updateDoc(ref, entry);

  return entry;
};
