import type { Entry } from "@baby-stats/models/entries";
import type { TimeRangeAmount } from "@baby-stats/models/time";
import { collection, getDocs, query, where } from "@firebase/firestore";
import type { ZodType } from "zod";
import { db } from "../firebase";

const DOW = new Map([
  [0, "Sun"],
  [1, "Mon"],
  [2, "Tue"],
  [3, "Wed"],
  [4, "Thu"],
  [5, "Fri"],
  [6, "Sat"],
]);

const formatTimestamp = (timestamp: Entry["timestamp"]) => {
  const date = timestamp.toDate();

  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = DOW.get(date.getDay());

  return `${dow} ${m}/${d}`;
};

const timeRangeToMinutes = ({ start, end }: TimeRangeAmount) => {
  const startMinutes = start.toMillis() / 1000 / 60;
  const endMinutes = end.toMillis() / 1000 / 60;

  return endMinutes - startMinutes;
};

export const getChartData = async <E extends Entry>(
  babyId: string,
  kind: E["kind"],
  parser: ZodType<E>,
) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const snap = await getDocs(
    query(
      collection(db, "entries"),
      where("babyId", "==", babyId),
      where("kind", "==", kind),
      where("timestamp", ">=", lastMonth),
    ),
  );

  const labels = new Set<string>();
  const indexes = new Map<string, number>();
  const data: number[] = [];

  for (const doc of snap.docs) {
    const entry = parser.parse(doc.data());
    const label = formatTimestamp(entry.timestamp);

    labels.add(label);

    if (!indexes.has(label)) {
      indexes.set(label, indexes.size);
    }

    const index = indexes.get(label);

    if (index === undefined) {
      throw new Error("index is undefined");
    }

    if (data[index] === undefined) {
      data[index] = 0;
    }

    const amount =
      typeof entry.amount === "number"
        ? entry.amount
        : timeRangeToMinutes(entry.amount);

    data[index] += amount;
  }

  return {
    labels: Array.from(labels),
    data,
  };
};
