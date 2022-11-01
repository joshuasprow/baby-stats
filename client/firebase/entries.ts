import { type Entry, type EntryKind } from "@baby-stats/models/entries";
import { Feed } from "@baby-stats/models/feeds";
import { Nap } from "@baby-stats/models/naps";
import { Pee } from "@baby-stats/models/pees";
import { Poop } from "@baby-stats/models/poops";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type Firestore,
} from "@firebase/firestore";
import { addDays } from "../lib/dates";

const getEntriesCollection = (db: Firestore, babyId: string) =>
  query(collection(db, "entries"), where("babyId", "==", babyId));

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

export const subscribeToEntries = (
  db: Firestore,
  babyId: string,
  set: (entries: Entry<EntryKind>[]) => void,
) =>
  onSnapshot(
    query(
      getEntriesCollection(db, babyId),
      where("timestamp", ">=", addDays(new Date(), -10)),
      orderBy("timestamp", "desc"),
    ),
    { includeMetadataChanges: true },
    (snap) => set(snap.docs.map((doc) => parseEntry(doc.data()))),
    (error) => console.error(error),
  );

export const addEntry = async (
  db: Firestore,
  babyId: string,
  value: Entry<EntryKind>,
) => {};
