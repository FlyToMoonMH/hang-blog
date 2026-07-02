---
title: "数学公式与代码高亮测试"
description: "验证 KaTeX 数学公式渲染和 Shiki 代码语法高亮"
date: "2026-07-03"
category: "随笔"
tags: ["测试", "数学", "代码"]
---

## 行内数学公式

这是一行包含公式 $E = mc^2$ 的文字，还有欧拉公式 $e^{i\pi} + 1 = 0$。

## 块级数学公式

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## 代码语法高亮

### TypeScript

```typescript
interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

function inorderTraversal<T>(root: TreeNode<T> | null): T[] {
  if (!root) return [];
  return [
    ...inorderTraversal(root.left),
    root.value,
    ...inorderTraversal(root.right),
  ];
}
```

### Python

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

### Rust

```rust
fn main() {
    let numbers = vec![34, 12, 5, 99, 1, 78];
    let sorted = quicksort(&numbers);
    println!("{:?}", sorted);
}

fn quicksort(arr: &[i32]) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr.to_vec();
    }
    let pivot = arr[arr.len() / 2];
    let mut left = Vec::new();
    let mut middle = Vec::new();
    let mut right = Vec::new();
    for &x in arr {
        if x < pivot { left.push(x); }
        else if x == pivot { middle.push(x); }
        else { right.push(x); }
    }
    let mut result = quicksort(&left);
    result.extend(middle);
    result.extend(quicksort(&right));
    result
}
```

### SQL

```sql
SELECT users.name, COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.created_at > '2024-01-01'
GROUP BY users.name
HAVING order_count > 5
ORDER BY order_count DESC;
```

## 混合内容

当 $a \ne 0$ 时，方程 $ax^2 + bx + c = 0$ 的解为：

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
