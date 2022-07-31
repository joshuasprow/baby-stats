// https://stackoverflow.com/a/58054216/8340430
export const getDatetimeLocalString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const adjusted = new Date(now.getTime() - offset);

  return adjusted.toISOString().substring(0, 16); // For minute precision
};
