import type { StepDefinitions } from 'jest-cucumber';
import { autoBindSteps, loadFeature } from 'jest-cucumber';
import { isCodeAndMessage, isErrorResponse } from '../utils/errors';
import {
  hasAtLeast,
  mapToSouthAmericanWorldCupWinner,
  SouthAmericanWorldCupWinner,
} from '../utils/types';
import { clearConnections, readFromNeo4J } from './neo4j';

jest.mock('neo4j-driver', () => {
  return {
    __esModule: true,
    auth: {
      basic: () => {},
    },
    driver: jest.fn().mockImplementation(() => ({
      session: () => ({
        executeRead: () => dataset,
      }),
    })),
    session: { READ: 'READ', WRITE: 'WRITE' },
  };
});

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
  given(/^the table data is defined as$/, (table: unknown) => {
    dataset = mapToSouthAmericanWorldCupWinner(table);
  });
  and(/^that (.*) is not provided$/, (variable: string) => {
    if (variable == 'NEO4J_HOST') process.env.NEO4J_HOST = '';
    if (variable == 'NEO4J_USER') process.env.NEO4J_USER = '';
    if (variable == 'NEO4J_PASS') process.env.NEO4J_PASS = '';
    if (variable == 'NEO4J_BASE') process.env.NEO4J_BASE = '';
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
