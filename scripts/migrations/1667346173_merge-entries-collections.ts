import { ENTRY_KINDS } from "@baby-stats/models/entries-base";
import { Firestore } from "firebase-admin/firestore";
import { getCollectionDocs, setCollectionDocs } from "../collections";
import { parseError } from "../error";
import { Paths } from "../models";

export const mergeEntriesCollection = async (
  db: Firestore,
  { babyId, userId, paths }: { babyId: string; userId: string; paths: Paths }
) => {
  const [docs, error] = await getCollectionDocs(db, paths.source);

  if (error) return error;

  try {
    await setCollectionDocs(db, { babyId, userId, path: paths.target }, docs);

    return null;
  } catch (error) {
    return parseError(error);
  }
};

export const _1667346173_mergeEntriesCollections = async (
  db: Firestore,
  babyId: string
) => {
  const users = await db.collection("users").get();
  const paths: Paths[] = ENTRY_KINDS.map((kind) => ({
    source: `babies/${babyId}/${kind}`,
    target: "entries",
  }));

  for (const doc of users.docs) {
    const user = doc.data();

    console.log(`Migrating user ${user.displayName} [${doc.id}]`);

    for (const p of paths) {
      const error = await mergeEntriesCollection(db, {
        paths: p,
        userId: doc.id,
        babyId,
      });
      if (error) console.error(error);
    }
  }
};
