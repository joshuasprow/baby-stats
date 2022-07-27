import type { Days } from "../stores/days";

const daysData: Days = {
  "1658548800000": {
    feeds: [
      {
        amount: 1,
        kind: "bottle",
        timestamp: new Date("2022-07-24T02:17:52.694Z"),
      },
    ],
    naps: [],
    pees: [
      { amount: 1, timestamp: new Date("2022-07-24T02:17:54.977Z") },
      { amount: 1, timestamp: new Date("2022-07-24T02:17:55.230Z") },
    ],
    poops: [
      { timestamp: new Date("2022-07-24T02:17:53.409Z") },
      { timestamp: new Date("2022-07-24T02:17:54.444Z") },
    ],
  },
  "1658635200000": {
    feeds: [
      {
        amount: 1,
        kind: "breast",
        side: "L",
        timestamp: new Date("2022-07-25T02:18:07.126Z"),
      },
    ],
    naps: [{ amount: 2, timestamp: new Date("2022-07-25T02:18:13.244Z") }],
    pees: [
      { amount: 2, timestamp: new Date("2022-07-25T02:18:10.094Z") },
      { amount: 2, timestamp: new Date("2022-07-25T02:18:11.011Z") },
    ],
    poops: [{ timestamp: new Date("2022-07-25T02:18:12.144Z") }],
  },
  "1658721600000": {
    feeds: [],
    naps: [
      { amount: 1.5, timestamp: new Date("2022-07-26T02:18:34.111Z") },
      { amount: 0.5, timestamp: new Date("2022-07-26T02:18:34.394Z") },
    ],
    pees: [{ amount: 3, timestamp: new Date("2022-07-26T02:18:35.027Z") }],
    poops: [],
  },
};

export default daysData;
