import { type Entry, type EntryKind } from "@baby-stats/models/entries";
import { Feed } from "@baby-stats/models/feeds";
import { Nap } from "@baby-stats/models/naps";
import { Pee } from "@baby-stats/models/pees";
import { Poop } from "@baby-stats/models/poops";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Firestore,
} from "@firebase/firestore";
import { addDays } from "../lib/dates";

const getEntriesCollection = (db: Firestore, babyId: string) =>
  query(
    collection(db, "entries"),
    where("babyId", "==", babyId),
    where("timestamp", ">=", addDays(new Date(), -10)),
  );

export const subscribeToEntries = (
  db: Firestore,
  babyId: string,
  set: (entries: Entry<EntryKind>[]) => void,
) =>
  onSnapshot(getEntriesCollection(db, babyId), (snap) =>
    set(
      snap.docs.map((doc) => {
        const data = doc.data();

        switch (data.kind as EntryKind) {
          case "feeds":
            return Feed.parse(data);
          case "naps":
            return Nap.parse(data);
          case "pees":
            return Pee.parse(data);
          case "poops":
            return Poop.parse(data);
          default:
            throw new Error(`Unknown entry kind: ${data.kind}`);
        }
      }),
    ),
  );
