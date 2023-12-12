export type IsExpired = () => boolean;

/**
 * Solve race-condition by remembering last caller of same mutex object
 */
export class HashMutex {
  /**
   * Only memo id created by lastest next call
   */
  private lastId = {};

  next() {
    const nextId = {};
    this.lastId = nextId;
    /**
     * return `IsExpired` function
     * check if current next is last caller
     */
    return () => this.lastId !== nextId;
  }
}
