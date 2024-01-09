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

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const head = new ListNode();
  let cur = head;
  let carry = 0;
  while (l1 || l2 || carry) {
    const x = l1 ? l1.val : 0;
    const y = l2 ? l2.val : 0;
    const num = x + y + carry;
    cur = cur.next = new ListNode(num % 10);
    carry = Math.floor(num / 10);
    l1 = l1 ? l1.next : l1;
    l2 = l2 ? l2.next : l2;
  }
  return head.next;
}

export { ListNode, addTwoNumbers };
