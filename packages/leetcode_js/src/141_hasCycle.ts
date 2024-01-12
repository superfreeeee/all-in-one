// paste question code here
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function hasCycle(head: ListNode | null): boolean {
  let fast: ListNode | null = head,
    slow: ListNode = head as ListNode;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next as ListNode;
    if (fast === slow) {
      return true;
    }
  }
  return false;
}

// generate by ../generate.js
export { hasCycle };
