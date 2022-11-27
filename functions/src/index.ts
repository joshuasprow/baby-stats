import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";

export const logs = onRequest(
  {
    cors: [
      "http://localhost",
      "https://genevieve.sprow.info",
      "https://baby-stats-10331--staging-k5ozmhec.web.app",
      "https://baby-stats-10331.firebaseapp.com",
      "https://baby-stats-10331.web.app",
    ],
    timeoutSeconds: 5,
  },
  (request, response) => {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
  }
);
