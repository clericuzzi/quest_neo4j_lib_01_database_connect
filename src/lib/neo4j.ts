import type { Driver, Session, SessionMode } from 'neo4j-driver';
import { auth, driver, session } from 'neo4j-driver';
import { ErrorResponse } from '../utils/errors';

let readSession: Session | undefined;
let currentDriver: Driver | undefined;

const driverOptions = {
  connectionTimeout: 5000,
  maxConnectionLifetime: 10000,
  maxConnectionPoolSize: 25,
  disableLosslessIntegers: true,
  connectionAcquisitionTimeout: 2000,
};

function validateParams() {
  const errors = new ErrorResponse();
  if (!process.env.NEO4J_HOST) errors.pushError('1', 'process.env.NEO4J_HOST was not provided');
  if (!process.env.NEO4J_USER) errors.pushError('2', 'process.env.NEO4J_USER was not provided');
  if (!process.env.NEO4J_PASS) errors.pushError('3', 'process.env.NEO4J_PASS was not provided');
  if (!process.env.NEO4J_BASE) errors.pushError('4', 'process.env.NEO4J_BASE was not provided');

  return errors;
}

// makes sure there always is a driver available
// if none are, we create a new instance
function getDriver() {
  if (!currentDriver)
    currentDriver = driver(
      // @ts-ignore If NEO4J_HOST is empty an error will be thrown before getting here
      process.env.NEO4J_HOST,
      // @ts-ignore If NEO4J_USER is empty an error will be thrown before getting here
      auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS),
      driverOptions,
    );

  return currentDriver;
}
// this function handles the database connection
function getSession(mode: SessionMode) {
  const errors = validateParams();
  try {
    if (errors.length > 0) throw errors;

    return getDriver().session({
      database: process.env.NEO4J_BASE,
      defaultAccessMode: mode,
    });
  } catch (e) {
    throw e;
  }
}
// makes sure there always is a reader available
// if none are, we create a new instance
function getReader() {
  if (!readSession) readSession = getSession(session.READ);

  return readSession;
}
// the read function allows us to read data from the database
export function readFromNeo4J(query: string) {
  return getReader().executeRead((tx) => {
    const result = tx.run(query);
    return result;
  });
}
export function clearConnections() {
  readSession = undefined;
  currentDriver = undefined;
}
