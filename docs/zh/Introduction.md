# 介绍

`DataPlumber`是一个用于前端Ajax请求的模块化工具，提供字段定义，方法扩展，切换源等功能。

## 为何使用`DataPlumber`？

看似简单的前端在项目越做越大时，后续维护的成本也持续提升。使用`DataPlumber`能帮你减少一些问题的发生：

- 字段定义：定义字段为接口提高可读性，接手的同事阅读代码后能更快加入工作。
- 切换服务：多个服务器随意切换，满足不同服务请求。
- 面向RESTful：模型对象贴近于restful接口的设计，代码语义更清晰。
- 数据处理：请求接口前后能设置钩子对数据进行预处理或后续处理，减少冗余代码。

> 建议把`DataPlumber`使用在足够复杂的项目之上来避免代码臃肿，也可参考`DataPlumber`的设计思想融入你的代码之中。

## 设计概念

`DataPlumber`设计初期把代码分为两层抽象：

- 通讯层：指Ajax请求代码层面上的封装，`DataPlumber`是基于axios再封装并提供管理多个远端服务功能。
- 数据模型层：数据模型使用同一语义的方法，使用更符合面向对象设计，致敬[`Backbone.js`](http://backbonejs.org/)的模型设计。

### 通讯层

通讯层核心是提供HTTP请求支持，封装这部分功能为了提供更多的扩展。

链接(Contact)与远端服务(Remote)是通讯层的基础，远端服务封装HTTP请求处理并提供支持，链接提供管理远端服务功能。

```js
import axios from "axios";
import DataPlumber from "dataplumber";

const contact = DataPlumber.Contact({
    base: axios.create({ baseURL: '/api' })
});
```

好了，我们已经创建了一个包含名字为`base`的远端服务的链接。接下来要使用它来请求数据：

```js
const remote = contact.remote();
const res = remote.get('/users');
// [GET] /api/users
console.log(res); // { status: 200, data:[...] }
```

对`DataPlumber`通讯层设计敢兴趣的欢迎查阅源代码了解更多。