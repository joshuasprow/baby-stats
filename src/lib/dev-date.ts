import { derived, get, writable } from "svelte/store";

const now = new Date();

export const devDate = writable({
  year: now.getFullYear(),
  month: now.getMonth(),
  date: now.getDate(),
});

const addLeadingZero = (num: number): string =>
  num < 10 ? `0${num}` : `${num}`;

export const devDateString = derived(devDate, ($devDate) => {
  const y = $devDate.year;
  const m = addLeadingZero($devDate.month + 1);
  const d = addLeadingZero($devDate.date);

  return `${y}-${m}-${d}`;
});

export const newDevDate = (): Date => {
  const d = new Date();

  const { year, month, date } = get(devDate);

  d.setFullYear(year);
  d.setMonth(month);
  d.setDate(date);

  return d;
};
