// paste question code here
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function rob(root: TreeNode | null): number {
  const find = (root: TreeNode | null): [number, number] => {
    if (!root) return [0, 0];
    const left = find(root.left);
    const right = find(root.right);
    const x = root.val + left[1] + right[1];
    const y = Math.max(...left) + Math.max(...right);
    return [x, y];
  };
  return Math.max(...find(root));
}

// generate by ../generate.js
export { rob };

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}
