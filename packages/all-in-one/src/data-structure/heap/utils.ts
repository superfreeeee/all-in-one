export const left = (pos: number) => 2 * pos + 1;
export const right = (pos: number) => 2 * pos + 2;
export const parent = (pos: number) => Math.floor((pos - 1) / 2);
