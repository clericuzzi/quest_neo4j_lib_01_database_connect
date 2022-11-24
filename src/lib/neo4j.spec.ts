import type { StepDefinitions } from 'jest-cucumber';
import { autoBindSteps, loadFeature } from 'jest-cucumber';
import { isCodeAndMessage, isErrorResponse } from '../utils/errors';
import {
  hasAtLeast,
  mapToSouthAmericanWorldCupWinner,
  SouthAmericanWorldCupWinner,
} from '../utils/types';
import { clearConnections } from './neo4j';

const feature = loadFeature('../features/neo4j_read.feature', { loadRelativePath: true });

let error: unknown;
let result: SouthAmericanWorldCupWinner[];
let dataset: SouthAmericanWorldCupWinner[];

beforeEach(() => {
  error = undefined;
  result = [];
  dataset = [];

  clearConnections();

  process.env.NEO4J_HOST = 'host_url';
  process.env.NEO4J_USER = 'username';
  process.env.NEO4J_PASS = 'password';
  process.env.NEO4J_BASE = 'database';
});

const stepDefinitions: StepDefinitions = ({ given, and, when, then }) => {
  given(/^the table data is defined as$/, (table: unknown) => {});
  and(/^that (.*) is not provided$/, (variable: string) => {});
  when(/^trying to fetch data with "(.*)"$/, async (query: string) => {});
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
    if (dataset.length == 0) throw new Error('database was not initialized');

    result = mapToSouthAmericanWorldCupWinner(table);
    for (const row of dataset) {
      const foundCountry = result.find((i) => i.id === row.id);
      expect(foundCountry).not.toBeUndefined();
    }
  });
};
autoBindSteps([feature], [stepDefinitions]);
