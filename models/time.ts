import { Timestamp } from "baby-stats-firebase";
import { z } from "zod";

export const TimeRangeAmount = z
  .object({ start: z.instanceof(Timestamp), end: z.instanceof(Timestamp) })
  .refine((s) => s.start <= s.end, "start must be before end");
export type TimeRangeAmount = z.infer<typeof TimeRangeAmount>;

export const isTimeRangeAmount = (value: unknown) => {
  try {
    TimeRangeAmount.parse(value);
    return true;
  } catch {
    return false;
  }
};
