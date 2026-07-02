---
title: 加密笔记测试
description: 这是一篇加密的笔记，需要密码才能查看
date: 2026-07-03
category: 测试
tags: [加密, 测试]
password: "mhang2026"
---

## 恭喜你成功解锁了！

这是一篇加密笔记的测试内容。只有输入正确的密码才能看到这些文字。

### 加密机制说明

- **加密算法**：AES-128-CBC
- **密钥生成**：MD5(密码)
- **加密时机**：构建时加密，生成静态 JSON 文件
- **解密时机**：浏览器端输入密码后解密
- **密码记忆**：48 小时内自动记住密码（localStorage）

### 支持的功能

加密笔记同样支持完整的 Markdown 功能：

1. 代码高亮

```python
def hello():
    print("Hello from encrypted note!")
```

2. 数学公式

$$
E = mc^2
$$

3. 表格、列表、引用等所有 Markdown 语法

### 如何创建加密笔记

在文章的 frontmatter 中添加 `password` 字段即可：

```yaml
---
title: 我 的私密笔记
date: 2026-07-03
category: 私密
tags: [私密]
password: "你的密码"
---
```

构建时会自动加密，访问时需要输入密码。

> 本测试笔记的密码是：`mhang2026`
