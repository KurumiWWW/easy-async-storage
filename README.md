# easy-async-storage

> 浏览器异步获取 sessionStorage/localStorage 的解决方案

## 1.简介

在项目开发中，有少数情况会有在存入`Storage`的同时获取该`storage`的逻辑，如果存入数据的函数为异步函数（比如请求了一个用户信息的接口，特别是在登录后），这样的逻辑就会导致原生的`getItem`函数获取不到，`easy-async-storage`库将`getItem`变为异步函数，返回一个`Promise`对象，让你可以像调用一个网络请求一样去调用`storage`。

## 2.安装

```shell
npm install easy-async-storage
```

## 3.使用

```js
import { useEStorage } from "easy-async-storage";
const estorage = useEStorage("local");
```

> 或者 const estorage = useEStorage("session"),它们相当于 js 的 localStorage 和 sessionStorage

```js
estorage.asyncGet("foo", 1000);
```

调用异步获取方法，参数如下

1. `key:string` Storage 的 key，必传
2. `timeout:number` 超时时间，若在超时时间到达后仍旧没有获取到值，则在`reject`中返回`undefined`，非必需，默认 1000(ms)
