/**
 * @typedef {import('mysql').Connection} Connection
 * @typedef {import('../types').TodoItem} TodoItem
 */

/**
 *
 * @param {Connection} connection
 * @returns {(query: string) => Promise<any>}
 */
const queryFactory = (connection) => (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, function (error, results, fields) {
      // 查询失败
      if (error) {
        reject(error);
        return;
      }

      // 查询成功
      resolve(results);
    });
  });
};

/**
 *
 * @param {Connection} connection
 * @returns
 */
const createQueryAPI = (connection) => {
  const queryAPI = queryFactory(connection);

  const beginTransaction = () => {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  };

  const commitTransaction = () => {
    return new Promise((resolve, reject) => {
      connection.commit((error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  };

  const getIsolation = () => queryAPI('select @@transaction_isolation');

  /**
   *
   * @returns {Promise<TodoItem[]>}
   */
  const getTodoList = () => queryAPI('SELECT * FROM todo;');

  /**
   *
   * @param {Pick<TodoItem, 'title' | 'description'>[]} records
   * @returns {Promise<any>}
   */
  const insertTodo = (records) => {
    const values = records
      .map(({ title, description }) => `('${title}', '${description}')`)
      .join(',');
    const query = `INSERT INTO todo (title, description) VALUES ${values};`;

    return queryAPI(query);
  };

  /**
   *
   * @returns {Promise<any[]>}
   */
  const getCounterList = () => {
    return queryAPI('SELECT * FROM counter;');
  };

  /**
   *
   * @param {number} id
   * @param {boolean=} forUpdate 是否加上 FOR UPDATE
   * @returns
   */
  const getCounter = async (id, forUpdate = false) => {
    const results = await queryAPI(
      `SELECT * FROM counter WHERE id = ${id}${forUpdate ? ' FOR UPDATE' : ''};`,
    );
    return results[0];
  };

  /**
   * 简单 update 语句
   * @param {number} id
   * @param {number} num
   */
  const updateCounter = (id, num) => {
    return queryAPI(`UPDATE counter SET num = ${num} WHERE id = ${id};`);
  };

  /**
   * 原子化操作 => 单一 update 语句
   *   update
   * @param {number} id
   * @returns
   */
  const incrementCounterAtomic = (id) => {
    return queryAPI(`UPDATE counter SET num = num + 1 WHERE id = ${id};`);
  };

  /**
   * 没有使用事务
   * 执行顺序：
   *   select
   *   update
   * @param {number} id
   */
  const queryAndIncrementCounter = async (id) => {
    const counterItem = await getCounter(id);

    return await updateCounter(id, counterItem.num + 1);
  };

  /**
   * 使用事务
   * ! 每次使用事务，需要保证重新获取 connection
   *
   * 执行顺序：
   *   begin
   *   select
   *   update
   *   commit
   * @param {number} id
   * @returns
   */
  const queryAndIncrementCounterWithTransaction = async (id) => {
    await beginTransaction();

    const item = await getCounter(id, true);
    await updateCounter(id, item.num + 1);

    await commitTransaction();
  };

  return {
    getIsolation,
    getTodoList,
    insertTodo,
    getCounterList,
    getCounter,
    updateCounter,
    incrementCounterAtomic,
    queryAndIncrementCounter,
    queryAndIncrementCounterWithTransaction,
  };
};

exports.createQueryAPI = createQueryAPI;

/**
 *
 * @param {number} delay
 * @returns
 */
const sleep = (delay) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
