import { logger } from '../utils/logger';
export interface SouthAmericanWorldCupWinner {
  id: number;
  country: string;
}
function isSouthAmericanWorldCupWinner(row: unknown): row is SouthAmericanWorldCupWinner {
  if (typeof row == 'object') {
    //@ts-ignore Checking if row contains the given properties
    return !!row?.id && !!row?.country;
  } else return false;
}
function logInvalidObject(item: unknown) {
  logger.warn(`mapToSouthAmericanWorldCupWinner: invalid object provided ${JSON.stringify(item)}`);
}
export function mapToSouthAmericanWorldCupWinner(dataset: unknown) {
  const countries: SouthAmericanWorldCupWinner[] = [];
  if (Array.isArray(dataset)) {
    for (const row of dataset) {
      if (isSouthAmericanWorldCupWinner(row)) countries.push({ id: +row.id, country: row.country });
      else logInvalidObject(row);
    }
  } else {
    logInvalidObject(dataset);
  }

  return countries;
}

type Maybe<T> = T | null | undefined;
type Tuple<T, N extends number = 1, R extends readonly T[] = []> = R['length'] extends N
  ? R
  : Tuple<T, N, readonly [T, ...R]>;
type HasAtLeast<T, N extends number> = Tuple<T, N> & readonly T[];
export function hasAtLeast<T, N extends number>(
  array: Maybe<ReadonlyArray<T>>,
  length: N,
): array is HasAtLeast<T, N> {
  return array != null && array.length >= length;
}
