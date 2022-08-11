import { Timestamp } from "@firebase/firestore";
import type { TimeRangeAmount } from "baby-stats-models/time";

export type Time = { hours: number; minutes: number };

/** Adds days to the given date */
export const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(date.getDate() + days);
  return copy;
};

/** Adds hours to the given date */
export const addHours = (date: Date, hours: number) => {
  const copy = new Date(date);
  copy.setHours(date.getHours() + hours);
  return copy;
};

/** Converts a unix timestamp to a formatted string */
export const formatDaystamp = (daystamp: number) =>
  new Date(daystamp).toDateString();

const addLeadingZero = (num: number) => (num < 10 ? `0${num}` : num);

export const getDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
};

export const getTimeString = ({ hours, minutes }: Time) =>
  `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;

/**
 * Split a date string into its components. Format can be used for "date" or "time"
 * html input values. Default value is new Date().
 * https://stackoverflow.com/a/58054216/8340430
 **/
export const getDateAndTimeStrings = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  const adjusted = new Date(date.getTime() - offset);
  const iso = adjusted.toISOString(); // "2022-07-31T15:23:42.539Z"
  const [d, t] = iso.split("T"); // [d, t] = ["2022-07-31", "15:23:42.539Z"]

  const time = t.slice(0, 5); // "15:23"

  return { date: d, time };
};

export const getDateFromString = (string: string) => {
  const [y, mo, d] = string.split("-"); // [y, mo, d] = ["2022", "07", "31"]
  const [year, month, date] = [y, mo, d].map(Number); /* [2022, 7, 31] */

  return new Date(year, month - 1, date);
};

export const getTimeFromString = (string: string): Time => {
  const [h, mi] = string.split(":"); /* [h, mi] = ["15", "23"] */
  const [hours, minutes] = [h, mi].map(Number); /* [ 15, 23] */

  return { hours, minutes };
};

/**
 * Combine "date" and "time" strings into a single Date object.
 */
export const getDateTimeFromStrings = ({
  date /* "2022-07-31" */,
  time /* "15:23" */,
}: {
  date: string;
  time: string;
}) => {
  const [y, mo, d] = date.split("-"); // [y, mo, d] = ["2022", "07", "31"]
  const [h, mi] = time.split(":"); // [h, mi] = ["15", "23"]

  const [Y, MO, D, H, MI] = [y, mo, d, h, mi].map(
    Number
  ); /* [2022, 7, 31, 15, 23] */

  return new Date(Y, MO - 1, D, H, MI, 0);
};

/** Get the difference between dates in minutes */
export const getTimeRangeDiffInMinutes = ({ start, end }: TimeRangeAmount) => {
  const diff = end.seconds - start.seconds;
  return diff / 60;
};

/** Convert a number of minutes and a start time to a TimeRangeAmount */
export const getTimeRangeFromMinutes = (
  timestamp: Timestamp,
  minutes: number
): TimeRangeAmount => {
  const start = timestamp.toDate();
  const end = timestamp.toDate();
  end.setMinutes(start.getMinutes() + minutes);

  return { start: Timestamp.fromDate(start), end: Timestamp.fromDate(end) };
};
