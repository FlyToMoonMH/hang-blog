---
title: "React Hooks 实用指南"
description: "全面介绍常用的 React Hooks，包含实际使用场景和最佳实践"
summary: "把常见 Hooks 的用法、边界和思维方式收成一篇可反复查阅的参考笔记。"
date: "2026-07-01"
updated: "2026-07-06"
category: "React"
section: "React"
nav_title: "Hooks 指南"
order: 10
tags: ["react", "hooks", "前端"]
---

## 为什么需要 Hooks

React Hooks 让我们在函数组件中使用状态和生命周期特性，无需编写 class 组件。

## useState — 状态管理

```typescript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
```

### 函数式更新

当需要基于前一个状态更新时，使用函数式更新：

```typescript
// ✅ 正确：使用函数式更新
setCount((prev) => prev + 1);

// ❌ 错误：连续调用可能不会生效
setCount(count + 1);
setCount(count + 1);
```

## useEffect — 副作用处理

```typescript
useEffect(() => {
  // 组件挂载时执行
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then((res) => res.json())
    .then(setData);

  // 清理函数
  return () => controller.abort();
}, []); // 空依赖数组 = 仅挂载时执行
```

### 依赖数组的重要性

```typescript
// 每次渲染都执行
useEffect(() => {
  console.log("每次渲染");
});

// 仅挂载时执行
useEffect(() => {
  console.log("仅挂载时");
}, []);

// count 变化时执行
useEffect(() => {
  console.log("count 变化了:", count);
}, [count]);
```

## useMemo 与 useCallback

用于性能优化，避免不必要的重新计算和函数重建：

```typescript
const sortedList = useMemo(() => {
  return list.sort((a, b) => a.id - b.id);
}, [list]);

const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

## 自定义 Hook

将可复用的逻辑抽取为自定义 Hook：

```typescript
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

## 最佳实践

| 实践 | 说明 |
|------|------|
| 依赖数组 | 始终填写完整的依赖数组 |
| 自定义 Hook | 逻辑复用优先使用自定义 Hook |
| 性能优化 | 不要过度使用 useMemo/useCallback |
| 清理函数 | 副作用一定要有清理逻辑 |

## 总结

Hooks 是现代 React 开发的核心概念。理解每个 Hook 的使用场景和注意事项，能帮助我们写出更干净、更高效的代码。
