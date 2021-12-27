export const pick = <T>(o: T, ...keys: (keyof T)[]): T =>
  Object.fromEntries(
    Object.entries(o).filter(([key, _]) => keys.includes(key as keyof T))
  ) as T;

export const omit = <T>(o: T, ...keys: (keyof T)[]): T =>
  Object.fromEntries(
    Object.entries(o).filter(([key, _]) => !keys.includes(key as keyof T))
  ) as T;
