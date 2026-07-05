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

## 存储

十六进制：用两位来表示##，比如1F，就表示16*1+15=31；FF是255；
通常我们会一次使用8个bit，1 Byte来表示值。
通常会在任何十六进制的数字前面加前缀"0x"；

```c
#include <stdio.h>
int main(void){
    int n = 5;
    printf("%d\n",n);
    printf("%p\n",&n); //输出地址
    return 0;
}
---输出---
5
0x7fffd3c34ecc
```
指针 pointer：一种变量，可以存储地址
```c
int n = 50;
int *p = &n; //int *代表的是p 存的是一个整数的地址，而不是一个整数
printf("%p\n",p); //输出0x7ffd9dc64d5c
printf("%d\n",*p);//前往p这个地址，看看里面存储了啥
```
存储地址的变量一般会占用8个字节，也就是64位。
目前的计算机都是64位的，因为用32位的计算机的话，大约是40亿的寻址范围，对应4GB，意味着计算机无法支持8GB、16GB 的内存。

对于程序员来说，了解底层原理是非常有益的。

在 C 语言里面，是不存在 string 这样一种变量的，本质上就是一个字符数组。

```c
string s;

```

<div align="center">
<img src="images/string-pointer.png" alt="描述" width="500" />
</div>

```c
int main(void){
    char *s = "HI!"; //字符串的本质就是字符指针，指向字符串第一个字符的地址，然后一直读取到最后一个/0（也就是 NUL） 的字符
    char *t = "HI!";
    printf("%s\n",s); 
    printf("%s\n",s+1); //因为是字符串，所以s+1，是指向第二个地址
    printf("%s\n",s+2);
    //输出 HI! I! !
    //用==不能直接判断字符串，因为字符串存的是地址
    if(strcmp(s,t)==0){
        printf("s和t相等\n");
    }else{
        printf("s和t不相等\n");
    }
    return 0;
}
```

### malloc 和 free

- malloc():是动态分配内存的函数
- free():当不需要新分配的内存时候，可以通过 free 释放还给计算机

用一段简单的复制字符串的代码来理解 malloc();实际上已经实现了这个功能 strcpy(t,s);把 s 复制到 t。

```c
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

int main(){
    char *s = "hello!";//6个字符，占据7个字节，因为有最后的NUL
    //向计算机申请一块和 s 所占内存大小相同的一块空间。
    char *t = malloc(strlen(s) + 1);
    //malloc 返回的是内存首字节的值。
    for(int i = 0,n = strlen(s); i <= n; i ++){
        t[i] = s[i];
    }
    t[0] = toupper(t[0]);
    printf("%s\n",t);
    printf("%s\n",s);
    return 0;
}
```

NULL 实际上是一个特殊的内存地址，0x0，这个地址上不应该存放任何内容，一般用于程序出现问题的时候，就指向这个地方。

