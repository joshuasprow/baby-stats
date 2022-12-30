import { Entry } from "@baby-stats/models/entries";
import {
  BottleFeed,
  BreastFeed,
  type Feed,
  type FeedSource,
} from "@baby-stats/models/feeds";
import type { TimeRangeAmount } from "@baby-stats/models/time";
import { collection, getDocs, query, where } from "@firebase/firestore";
import type { ChartOptions } from "chart.js";
import { db } from "../firebase";

type Source<K extends Entry["kind"]> = K extends "feeds"
  ? Feed["source"]
  : null;

const DOW = new Map([
  [0, "Sun"],
  [1, "Mon"],
  [2, "Tue"],
  [3, "Wed"],
  [4, "Thu"],
  [5, "Fri"],
  [6, "Sat"],
]);

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getUnitForKind = <K extends Entry["kind"]>(
  kind: K,
  source: Source<K>,
) => {
  switch (kind) {
    case "feeds":
      return source === "bottle" ? "oz" : "mins";
    case "meds":
      return "meds";
    case "naps":
      return "mins";
    case "pees":
      return "pees";
    case "poops":
      return "poops";
    default:
      throw new Error(`Unknown kind: ${kind} ${source}`);
  }
};

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

export const getChartDataDocs = async <K extends Entry["kind"]>(
  babyId: string,
  kind: K,
  source: Source<K>,
) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const ref = collection(db, "entries");

  const constraints = [
    where("babyId", "==", babyId),
    where("kind", "==", kind),
    where("timestamp", ">=", lastMonth),
  ];

  if (kind === "feeds") {
    constraints.push(where("source", "==", source));
  }

  const snap = await getDocs(query(ref, ...constraints));

  return snap.docs;
};

const entryToChartData = (entry: Entry, indexes: Map<string, number>) => {
  const label = formatTimestamp(entry.timestamp);

  if (!indexes.has(label)) {
    indexes.set(label, indexes.size);
  }

  const index = indexes.get(label);

  if (index === undefined) {
    throw new Error("index is undefined");
  }

  if (typeof entry.amount === "number") {
    return { label, index, amount: entry.amount };
  }

  return {
    label,
    index,
    amount: timeRangeToMinutes(entry.amount),
  };
};

export const getChartData = async <K extends Entry["kind"]>(
  babyId: string,
  kind: K,
  source: Source<K>,
) => {
  const docs = await getChartDataDocs(babyId, kind, source);

  const labels = new Set<string>();
  const indexes = new Map<string, number>();
  const data: number[] = [];

  for (const doc of docs) {
    const entry = Entry.parse(doc.data());

    const { label, index, amount } = entryToChartData(entry, indexes);

    labels.add(label);

    if (data[index] === undefined) {
      data[index] = 0;
    }

    data[index] += amount;
  }

  return {
    labels: Array.from(labels),
    data,
    unit: getUnitForKind(kind, source),
  };
};

export const getChartFeeds = async (
  babyId: string,
): Promise<{
  dates: { min: Date; max: Date };
  bottle: BottleFeed[];
  breast: BreastFeed[];
}> => {
  const [bottleDocs, breastDocs] = await Promise.all([
    getChartDataDocs(babyId, "feeds", "bottle"),
    getChartDataDocs(babyId, "feeds", "breast"),
  ]);

  const bottle: BottleFeed[] = [];
  const breast: BreastFeed[] = [];

  let min: Date | null = null;
  let max: Date | null = null;

  for (const doc of bottleDocs) {
    const feed = BottleFeed.parse(doc.data());
    const date = feed.timestamp.toDate();

    if (min === null || date < min) {
      min = date;
    }

    if (max === null || date > max) {
      max = date;
    }

    bottle.push(feed);
  }

  for (const doc of breastDocs) {
    const feed = BreastFeed.parse(doc.data());
    const date = feed.timestamp.toDate();

    if (min === null || date < min) {
      min = date;
    }

    if (max === null || date > max) {
      max = date;
    }

    breast.push(feed);
  }

  if (min === null) min = new Date();
  if (max === null) max = new Date();

  return {
    dates: { min, max },
    bottle: bottleDocs.map((doc) => BottleFeed.parse(doc.data())),
    breast: breastDocs.map((doc) => BreastFeed.parse(doc.data())),
  };
};

export const getChartOptions = <K extends Entry["kind"]>(
  kind: K,
  source: Source<K>,
): ChartOptions => {
  const title = kind === "feeds" ? `${source} ${kind}` : kind;
  const titleText = `${toTitleCase(title)} Chart`;
  const unit = getUnitForKind(kind, source);
  const titleUnit = toTitleCase(unit);

  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: titleText,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: titleUnit,
        },
      },
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };
};
