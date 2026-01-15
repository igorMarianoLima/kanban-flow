import { Transform } from 'class-transformer';

export const StrintToArray = () => {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }

    return value;
  });
};
