---
title: "Data Structure"
description: "这是一篇关于CS50x 学习记录的笔记"
summary: "围绕链表、树、哈希表等数据结构建立一套更扎实的直觉。"
date: "2026-07-06"
updated: "2026-07-07"
category: "随笔"
section: "CS50x"
subsection: "C Language"
nav_title: "数据结构"
order: 30
access: "protected"
tags: ["C", "CS50", "加密", "数据结构"]
password: "Mahangmh370.."
---

### C语言不同数据类型占据内存大小

| 数据类型 | 占据内存大小 |  sizeof() |
|----------|--------------|-----------|
| char     | 1 字节       |     1     |
| int      | 4 字节       |     4     |
| float    | 4 字节       |     4     |
| double   | 8 字节       |     8     |
| long     | 8 字节       |     8     |

### 数据结构

1. queue 队列，FIFO，先入先出，

```c
const int CAPACITY = 50;
//假设这个队列最多容纳50人
typedef struct {
    int people[CAPACITY];
    int size; //当前队列中人数
} queue;
```

有入队和出队两种操作，入队就是把一个人加入到队列的末尾，出队就是把一个人从队列的开头移除。

实际上我们希望内存可以动态分配，队列可以容纳任意人数，用数组就没法实现了，所以我们需要链表来实现队列.

2. stack 栈，LIFO，后入先出，

> 比如我们打开 Gmail，出现在顶上的邮件是我们最近收到的邮件，最先收到的邮件在最下面。我们可以把这个邮件列表想象成一个栈，最上面的邮件就是栈顶，最下面的邮件就是栈底。

```c
const int CAPACITY = 50;
typedef struct {
    int people[CAPACITY];
    int size; //当前栈中人数
} stack;
```

有入栈push和出栈pop两种操作，入栈就是把一个人加入到栈的顶端，出栈就是把一个人从栈的顶端移除。

3. 字典
> 字典是一种数据结构，它存储的是键值对（key-value pair），每个键都是唯一的，而值可以是任意类型的数据。字典允许我们通过键快速查找对应的值。

常规的是：电话薄，一个人的名字是键，电话号码是值。我们可以通过名字快速查找电话号码。
还有单词和他的解释，单词是键，解释是值。我们可以通过单词快速查找解释。

4. 数组（Array）
> 数组是一种数据结构，它存储的是一组相同类型的数据。数组允许我们通过索引快速访问每个元素。数组的大小是固定的，一旦创建就不能改变。

```c
#include <stdio.h>

int main(void){
    int list[5] = {1, 2, 3, 4, 5}; // 创建一个包含5个整数的数组
    for(int i = 0; i < 5; i++){
        printf("%d ", list[i]); // 输出数组中的每个元素
    }
    return 0;
}
```

使用数组在现实里面会存在的问题，因为大小是固定的，系统只保证分配那一块内存的空间，假设我们创建了一个数组，大小是5，那么我们只能存储5个元素，如果我们想要存储更多的元素，就会出现问题。

```c
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

int main(int agrc, char *agrv[]){
    int *list = malloc(3 * sizeof(int)); // 创建一个包含5个整数的动态数组
    if(list == NULL) {
        return 1; // 检查内存分配是否成功
    }
    *list = 1;
    *(list + 1) = 2;
    *(list + 2) = 3;
    //如果这个时候需要存储更多的元素，就会出现问题，因为我们只分配了3个整数的空间。

    int *tmp = malloc(5 * sizeof(int)); // 创建一个新的动态数组，大小为5
    if(tmp == NULL) {
        free(list); // 释放之前分配的内存，因为只要内存分配失败，程序直接退出，但是之前的堆内存永远不会被释放，所以我们需要在退出之前释放之前分配的内存。
        return 1; // 检查内存分配是否成功
    }
    for(int i = 0; i < 3; i++){
        tmp[i] = list[i]; // 将原数组的元素复制到新数组中
    }
    free(list); // 释放原数组的内存
    list = tmp; // 将list指向新数组
    for(int i = 0; i < 5; i++){
        printf("%d ", list[i]);
    }
    free(list); // 释放动态分配的内存
    return 0;
}
```

```c
//其实有一种重分配内存的方式，叫做realloc()，它可以在不丢失原有数据的情况下，重新分配内存空间。
#include <stdio.h>
#include <stdlib.h>

int main(){
    int *list = malloc(3 * sizeof(int)); // 创建一个包含3个整数的动态数组
    if(list == NULL) {
        return 1; // 检查内存分配是否成功
    }
    list[0] = 1;
    list[1] = 2;
    list[2] = 3;

    int *tmp = realloc(list, 5 * sizeof(int)); // 重新分配内存空间，大小为5，并把原数组的元素复制到新数组中
    if(tmp == NULL) {
        return 1; // 检查内存分配是否成功
    }
    tmp[3] = 4;
    tmp[4] = 5;

    list = tmp; // 将list指向新数组
    
    for(int i = 0; i < 5; i++){
        printf("%d ", list[i]);
    }
    free(list); // 释放动态分配的内存
    free(tmp); // 释放动态分配的内存
    return 0;
}
```

所以我们需要链表来实现动态大小的数组。
## 链表（Linked List）

链表的每个节点的地址不需要像数组那样是连续的，链表的每个节点都包含一个数据域和一个指针域，指针域指向下一个节点的地址。链表的最后一个节点的指针域指向NULL，表示链表的结束。

```c