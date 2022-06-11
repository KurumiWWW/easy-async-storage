<h1>
  Easy Async Storage
  <h3>用更简单的方式操作浏览器存储</h3>
</h1>

[![easy-async-storage](https://img.shields.io/github/stars/KurumiWWW/easy-async-storage?style=social)](https://www.npmjs.com/package/easy-async-storage) 
[![easy-async-storage](https://img.shields.io/npm/v/easy-async-storage.svg)](https://www.npmjs.com/package/easy-async-storage) 
[![Stars](https://img.shields.io/npm/dt/easy-async-storage.svg)](https://github.com/KurumiWWW/easy-async-storage)

## 1.简介

### 最初目的

在项目开发中，有少数情况会有在存入`Storage`的同时获取该`storage`的逻辑，如果存入数据的函数为异步函数（比如请求了一个用户信息的接口，特别是在登录后），这样的逻辑就会导致原生的`getItem`函数获取不到，`easy-async-storage`库将`getItem`变为异步函数，返回一个`Promise`对象，让你可以像调用一个网络请求一样去调用`storage`。

### 目前已有功能

使用面向对象思想对存储方式进行二次封装，让 Storage 操作能够更加简便快捷，**不需要**考虑某条数据存在于`localStorage`还是`sessionStorage`。

### TODO

- 加密存取

## 2.Install

```shell
npm install easy-async-storage
```

## 3.Use

`eStorage()`会返回一个实例化的`EStorage`对象

```ts
import { eStorage } from "easy-async-storage";
const est = eStorage();
```

### 3.1 Get Storage

获取存储数据，调用对象的`get`方法，返回类型为`string`

```ts
est.get(key:string):string;
```

### 3.2 Async Get Storage

```ts
est.asyncGet(key:string,timeout?:number)
```

调用异步获取方法，参数如下

1. `key:string` Storage 的 key，必传
2. `timeout:number` 超时时间，若在超时时间到达后仍旧没有获取到值，则在`reject`中返回`undefined`，非必需，默认 1000(ms)

### 3.3 Set Storage

与原生存储方式相似，但是`value`参数强制使用`string`,存在类型检查，若不符合则抛出异常。

`set()`返回一个`EStorage`对象，支持链式调用

```ts
est.set(key: string, value: string);
```

### 3.4 Set Local Storage

`easy-async-storage`在使用`set()`方法时，底层默认操作对象为`sessionStorage`，如有对`localStorage`进行存储的需求，则可以使用`keep()`方法

`keep()`返回一个`EStorage`对象，支持链式调用

```ts
est.keep().set(key: string, value: string);
```

**注意**：您在进行`get`、`asyncGet`、`check`操作时，并不一定需要调用`keep()`

### 3.5 Check

查找当前存储中是否存在某一字段

使用：

```ts
est.check(key: string);
```

返回的数据类型：

```ts
interface CheckResult {
  status: boolean;
  target?: EStorage;
}
```

- `status:boolean` 存在 `true` 不存在 `false`
- `target?:EStorage` 存在返回一个`EStorage`对象，支持链式调用；不存在则没有该字段。
