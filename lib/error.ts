export const parseError = (error: unknown): Error => {
  if (!error) return new Error("Empty error");

  if (error instanceof Error) return error;

  if (typeof error === "string") return new Error(error);

  return new Error(`Unknown error: ${JSON.stringify(error)}`);
};
