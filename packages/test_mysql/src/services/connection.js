const mysql = require('mysql');
const { createQueryAPI } = require('./query');

/** @type {mysql.ConnectionConfig} */
const MYSQL_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'dev',
  password: '123456789',
  database: 'test_mysql',
};

/**
 *
 * @returns {Promise<mysql.Connection>}
 */
const createConnection = () => {
  const connection = mysql.createConnection(MYSQL_CONFIG);

  return new Promise((resolve, reject) => {
    connection.connect((error) => {
      if (error) return reject(error);
      resolve(connection);
    });
  });
};

const createConnectionPool = () => {
  const pool = mysql.createPool(MYSQL_CONFIG);
  return pool;
};

exports.createConnection = createConnection;
exports.createConnectionPool = createConnectionPool;

/**
 *
 * @param {(connection: mysql.Connection) => void | Promise<void>} task
 */
const withConnection = async (task) => {
  /** @type {mysql.Connection} */
  let connection;

  try {
    connection = await createConnection();

    // main task
    await task(connection);
  } catch (error) {
    console.error('task failed:', error);
  } finally {
    connection.end();
  }
};

exports.withConnection = withConnection;

/**
 *
 * @param {mysql.Pool} pool
 * @returns {Promise<import('../types').Services>}
 */
const getServices = (pool) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) return reject(error);
      const services = createQueryAPI(connection);
      resolve(services);
    });
  });
};

/**
 *
 * @param {mysql.Pool} pool
 * @param {(services: import('../types').Services) => Promise<void>} task
 */
const withServices = async (pool, task) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) return reject(error);

      let res;
      try {
        const services = createQueryAPI(connection);

        res = task(services);
      } catch (error) {
        reject(error);
        connection.release();
        return;
      }

      if (res instanceof Promise) {
        res
          .then(() => resolve())
          .catch((error) => reject(error))
          .finally(() => connection.release());
      } else {
        resolve();
        connection.release();
      }
    });
  });
};

exports.getServices = getServices;
exports.withServices = withServices;
