export const parseError = (
  error: unknown,
  nameIfUnknown = "Unknown",
): Error => {
  if (!error) return new Error("Empty error");

  if (error instanceof Error) return error;

  if (typeof error === "string") return new Error(error);

  const unknown = new Error(`${nameIfUnknown}: ${JSON.stringify(error)}`);
  unknown.name = nameIfUnknown;

  return unknown;
};
