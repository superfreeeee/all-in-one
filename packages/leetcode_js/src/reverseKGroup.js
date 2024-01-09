var reverseKGroup = function (head, k) {
  if (k === 1) {
    return head;
  }
  const listHeader = new ListNode(0, head);
  let kHeader = listHeader;
  let cursor = head;
  let temp = [];
  let isFirstReverse = true;
  while (cursor) {
    temp = [];
    for (let i = 0; i < k; i++) {
      if (cursor) {
        temp.push(cursor);
        cursor = cursor.next;
      }
    }
    if (temp.length === k) {
      if (isFirstReverse) {
        listHeader.next = temp[k - 1];
      }
      for (let j = k - 1; j >= 0; j--) {
        kHeader.next = temp[j];
        kHeader = kHeader.next;
      }
      isFirstReverse = false;
      kHeader.next = cursor;
    } else if (temp.length) {
      kHeader.next = temp[0];
    }
  }
  return listHeader.next;
};
