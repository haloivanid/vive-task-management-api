export const stringToEnum = <T extends Record<string, string>>(
  enumObj: T,
  value: string,
  defaultValue: T[keyof T],
): T[keyof T] => {
  const validValues = Object.values(enumObj);
  return (validValues.includes(value) ? value : defaultValue) as T[keyof T];
};
