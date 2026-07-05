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

## Algorithms

复杂度：用大 O 法，从更宏观的角度，只需要关注数学上占主导地位的最高阶项，表示上界。
常见的有：

1. $O(n)$，比如线性搜索
2. $O(nlogn)$，
3. $O(n^2)$
4. $O(logn)$，比如二分查找
5. $O(1)$

可以用$\Omega$来表示下界。比如二分查找最少的次数就是1次。
当大$O$和大$\Omega$恰好相同时候，就可以用$\Theta$来表示。

```c
#include <stdio.h>

int main(void){

    return 0;
}
```

string.h 这个库能处理很多字符串的事情，
strlen()获取字符串长度
stecmp()用来比较两个字符串是否相同，strcmp(s1,s2)，如果相同，返回0，如果不同返回正数1或者2，可以用此判断他们的 ASCII 码的大小。

> 注意哦，不能直接用==来判断字符串是否相等。因为==比较的是变靓村吃的地址，不是字符串的文字内容。

数据结构设计的时候，不要有依赖人的自觉性的结构，比如写两个数组，一个写名字，一个写电话，编号一一对应，这种就依赖人的自觉性。**要用防御性的措施，把相关的信息更紧密的封装在一起。**

### 数据结构
数组是最简单的数据结构，在内存中连续地、从左到右的一个个存储数据。

```c
typedef struct{
    string name;
    string number;
} person;

int main(void){
    person people[3];
    people[0].name = "Kelly";
    people[0].number = "17816616276";
    ...
}
```

关于排序
1. $O(n)$，比如线性搜索
2. $O(nlogn)$，
3. $O(n^2)$
   - 比如暴力排序，第一次需要比较
    > 第一次需要比较n-1，第二次 n-2，以此类推，就是一个等差数列，$1+2+...+n-1=\frac{n(n-1)}{2}$，所以是$O(n^2)$。
4. $O(logn)$，比如二分查找
5. $O(1)$

递归：Recursion，通过调用自身的函数。
我感觉递归最重要的就是不要陷入死循环，设置合理的终止循环的条件。

比如归并排序
```c
#include <stdio.h>
//采用了分而治之的方法
using namespace std;

int main(){

    return 0;
}
```