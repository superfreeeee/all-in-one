import { logGroup } from './log';

export const examplesFactory = (
  title: string,
  cb: () => void | Promise<void>,
) => {
  return () => logGroup(title, cb, false);
};
