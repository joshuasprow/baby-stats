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
import { z } from "zod";
import { db } from "../firebase";
import { baby } from "./baby";

export const ChartPee = Pee.merge(
  z.object({ group: z.string().default("") }),
).transform((pee) => ({
  ...pee,
  timestamp: pee.timestamp.toDate(),
}));
export type ChartPee = z.infer<typeof ChartPee>;

export const chart = derived<typeof baby, ChartPee[]>(baby, ($baby, set) => {
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
});
