import { createEsSniperServer } from './EsSniperServer';

const connection = createEsSniperServer();

connection.listen();
