import * as mysql from 'mysql';
import type { createQueryAPI } from './services/query';

export type TodoItem = {
  id: number;
  title: string;
  description: string;
  create_time: Date;
  update_time: Date;
};

export type Services = ReturnType<typeof createQueryAPI>;

export type Task = (connection: mysql.Connection, services: Services) => void | Promise<void>;

export type WithConnection = (task: Task) => Promise<void>;
