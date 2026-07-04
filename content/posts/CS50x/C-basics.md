---
title: "Lecture2-Arrays"
description: "这是一篇关于CS50x 学习记录的笔记"
date: "2026-07-04"
category: "随笔"
tags: ["C", "CS50", "加密"]
password: "Mahangmh370.."
---


```typescript {3}
    function greet(name: string) {
    const message = `Hello, ${name}!`; // 这一行会被高亮
    return message;
}
```

main 函数还支持另一种语法，支持两个参数：

```c {1}
int main(int argc, string argv[]){
    //argc：count of arguments
    //argv: argument vector，说人话就是输入的字符串数组
    printf("%s\n",argv[0]);
    printf("Hello,%s\n",argv[1]);
}
```

argv 的第0个位置会自动设置为程序自身名称

```bash
$./a.out MaHang
./a.out
Hello,MaHang
```
