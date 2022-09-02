export const getCssVariable = (variable: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    variable,
  );

  if (!value) {
    console.warn(`missing color variable: ${variable}`);
    return null;
  }

  return value;
};

export const setCssVariable = (variable: string, value: string) => {
  if (!variable.startsWith("--")) {
    console.warn(`invalid color variable: ${variable}`);
    return;
  }

  document.documentElement.style.setProperty(variable, value);
};
