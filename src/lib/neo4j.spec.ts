import type { StepDefinitions } from 'jest-cucumber';
import { autoBindSteps, loadFeature } from 'jest-cucumber';
import { readFromNeo4J } from '../lib/neo4j';
import { isCodeAndMessage, isErrorResponse } from '../utils/errors';
import {
  hasAtLeast,
  mapToSouthAmericanWorldCupWinner,
  SouthAmericanWorldCupWinner,
} from '../utils/types';

const feature = loadFeature('../features/neo4j_read.feature', { loadRelativePath: true });

let error: unknown;
let result: SouthAmericanWorldCupWinner[];
let dataset: SouthAmericanWorldCupWinner[];

beforeEach(() => {
  error = undefined;
  result = [];
  dataset = [];

  process.env.DATABASE_HOST = 'host_url';
  process.env.DATABASE_USER = 'username';
  process.env.DATABASE_PASS = 'password';
  process.env.DATABASE_BASE = 'database';
});

const stepDefinitions: StepDefinitions = ({ given, and, when, then }) => {
  given(/^the table data is defined as$/, (table: unknown) => {
    dataset = mapToSouthAmericanWorldCupWinner(table);
  });
  and(/^that (.*) is not provided$/, (variable: string) => {
    if (variable == 'DATABASE_HOST') process.env.DATABASE_HOST = undefined;
    if (variable == 'DATABASE_USER') process.env.DATABASE_USER = undefined;
    if (variable == 'DATABASE_PASS') process.env.DATABASE_PASS = undefined;
    if (variable == 'DATABASE_BASE') process.env.DATABASE_BASE = undefined;
  });
  when(/^trying to fetch data with "(.*)"$/, async (query: string) => {
    try {
      result = mapToSouthAmericanWorldCupWinner(await readFromNeo4J(query));
    } catch (e) {
      error = e;
    }
  });
  then(/^expect the error object to contain$/, (table: any) => {
    if (!hasAtLeast(table, 1)) throw new Error('invalid expected error list provided');
    else {
      if (isErrorResponse(error)) {
        const expectedError = table[0];
        if (!isCodeAndMessage(expectedError))
          throw new Error('unexpected error list item provided');

        const foundError = error.errorList.find((i) => i.code == expectedError.code);
        expect(foundError).not.toBeUndefined();
      } else {
        throw new Error('unexpected error thrown');
      }
    }
  });
  then(/^expect the data returned to look like$/, (table: string) => {
    result = mapToSouthAmericanWorldCupWinner(table);
    for (const row of dataset) {
      const foundCountry = result.find((i) => i.id === row.id);
      expect(foundCountry).not.toBeUndefined();
    }
  });
};
autoBindSteps([feature], [stepDefinitions]);
