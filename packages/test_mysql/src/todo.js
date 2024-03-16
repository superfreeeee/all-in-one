const { withConnection } = require('./services/connection');
const { createQueryAPI } = require('./services/query');

withConnection(async (connection) => {
  try {
    const { getTodoList, insertTodo } = createQueryAPI(connection);

    const todoList = await getTodoList();

    console.error({ todoList });

    if (todoList.length === 0) {
      await insertTodo([
        { title: '测试 todo 1', description: '这是一个测试任务，需要完成项目的所有任务' },
        { title: '测试 todo 2', description: '这是一个测试任务，需要完成项目的所有任务' },
        { title: '测试 todo 3', description: '这是一个测试任务，需要完成项目的所有任务' },
      ]);
    }
  } catch (error) {
    console.error(error);
  }
});
