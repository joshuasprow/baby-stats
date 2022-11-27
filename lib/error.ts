export const parseError = (error: unknown, name = "UnknownError"): Error => {
  if (!error) return new Error("Empty error");

  if (error instanceof Error) return error;

  if (typeof error === "string") return new Error(error);

  const unknown = new Error(`${name}: ${JSON.stringify(error)}`);
  unknown.name = name;

  return unknown;
};
