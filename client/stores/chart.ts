import { EntryKindEnum } from "@baby-stats/models/entries";
import { Pee } from "@baby-stats/models/pees";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { derived } from "svelte/store";
import type { z } from "zod";
import { db } from "../firebase";
import { baby } from "./baby";

const DOW = new Map([
  [0, "Sun"],
  [1, "Mon"],
  [2, "Tue"],
  [3, "Wed"],
  [4, "Thu"],
  [5, "Fri"],
  [6, "Sat"],
]);

const transformTimestamp = (timestamp: Pee["timestamp"]) => {
  const date = timestamp.toDate();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = DOW.get(date.getDay());

  return { date, group: `${dow} ${m}/${d}` };
};

export const ChartPee = Pee.transform((pee) => ({
  ...pee,
  ...transformTimestamp(pee.timestamp),
}));
export type ChartPee = z.infer<typeof ChartPee>;

export const chart = derived<typeof baby, ChartPee[]>(
  baby,
  ($baby, set) => {
    let unsubscribe = () => {};

    if (!$baby) {
      set([]);
      return unsubscribe;
    }

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const ref = query(
      collection(db, "entries"),
      where("babyId", "==", $baby.id),
      where("kind", "==", EntryKindEnum.Values.pees),
      where("timestamp", ">=", twoMonthsAgo),
      limit(100),
    );

    unsubscribe = onSnapshot(
      ref,
      (snap) => set(snap.docs.map((doc) => ChartPee.parse(doc.data()))),
      (error) => console.error(error),
    );

    return unsubscribe;
  },
  [],
);
