// https://stackoverflow.com/a/58054216/8340430
export const getDatetimeLocalString = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  const adjusted = new Date(date.getTime() - offset);

  return adjusted.toISOString().substring(0, 16); // For minute precision
};
