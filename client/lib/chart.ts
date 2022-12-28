import { Entry } from "@baby-stats/models/entries";
import type { TimeRangeAmount } from "@baby-stats/models/time";
import { collection, getDocs, query, where } from "@firebase/firestore";
import type { ChartOptions } from "chart.js";
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

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getUnitForKind = (kind: Entry["kind"]) => {
  switch (kind) {
    case "feeds":
      return "oz";
    case "meds":
      return "meds";
    case "naps":
      return "mins";
    case "pees":
      return "pees";
    case "poops":
      return "poops";
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

export const getChartData = async (babyId: string, kind: Entry["kind"]) => {
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
    unit: getUnitForKind(kind),
  };
};

export const getChartOptions = (kind: Entry["kind"]): ChartOptions => {
  const titleText = `${toTitleCase(kind)} Chart`;
  const unit = getUnitForKind(kind);
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
