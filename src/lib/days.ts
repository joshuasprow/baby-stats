import { derived } from "svelte/store";
import type { Day } from "./entries";
import { feedsByDay, type Feed } from "./feeds";

export interface DayState {
  feeds: Feed[];
}

export type Days = {
  [day: string]: DayState;
};

const encodeDay = (day: Day): string => `${day.year}-${day.month}-${day.day}`;

export const days = derived([feedsByDay], ([$feedsByDay]) => {
  const days: Days = {};

  for (const [day, feeds] of $feedsByDay.entries()) {
    const encoded = encodeDay(day);
    days[encoded] = { feeds };
  }
  console.log(days);

  return days;
});
