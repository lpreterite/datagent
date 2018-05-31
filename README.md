# DataPlumber

## 介绍

`DataPlumber`是一个用于前端Ajax请求的模块化工具，提供字段定义，方法扩展，切换源等。

### 为何使用`DataPlumber`？

前端看似简单，但是当项目越来越大的时候需要维护的成本就越高。使用`DataPlumber`能帮你减少一些问题的发生：

- 字段定义：定义字段为接口提高可读性，接手的同事阅读代码后能更快加入工作。
- 切换服务：多个服务器随意切换，满足不同服务器的请求。
- 面向RESTful：模型对象的贴近于restful接口的设计，代码语义更清晰。
- 数据处理：使用请求接口前后的钩子对数据进行预处理，减少冗余代码。

### 还需要了解

目前设计将前端数据交互定义为两种抽象：通讯层、数据模型层。通讯层常见的方式为基于restful设计的服务，目的是为程序提供与服务端通讯的功能；数据层是为了减少冗余代码的出现，提供基于面向对象的方式操作数据对象。

`DataPlumber`设计初期把代码分为两种抽象层：

- 通讯层：指Ajax请求代码层面上的封装，`DataPlumber`是基于axios再封装并提供管理多个远端服务功能。
- 数据模型层：数据模型使用同一语义的方法，使用更符合面向对象设计，致敬[`Backbone.js`](http://backbonejs.org/)的模型设计。

> 建议把`DataPlumber`使用在足够复杂的项目之上来避免代码臃肿，也可参考`DataPlumber`的设计思想融入你的代码之中。

## 快速手上

### 安装

```sh
npm install dataplumber
```

### 使用

```js
// 引入
import axios from "axios";
import DataPlumber from "dataplumber";

// 创建链接
const contact = DataPlumber.Contact({
    base: axios.create({ baseURL: '/api' })
});

// 定义模型
const UserModel = DataPlumber.Model({ name: 'user' });

// 创建模型
model = new UserModel({ contact });

async function(){
    // 发送GET请求
    const users = await model.fetch({ disabled: 0 });
    console.log(users) // { status: 200, data: [] }

    // 发送带id的GET请求
    const user = await model.find(1);
    console.log(user) // { status: 200, data: { id:1, name:"Tony", disabled: 1 } }

    // 发送POST请求
    const res = await model.save({ name:"Ben", disabled: 0 });
    console.log(res) // { status: 200, data: { id:2, name:"Ben", disabled: 0 } }

    // 带id时，发送带id的PUT请求
    const res = await model.save({ id:1, name:"Tony", disabled: 1 });
    console.log(res) // { status: 200, data: { id:1, name:"Tony", disabled: 1 } }

    // 发送带id的DELETE请求
    const res = await model.delete(2);
    console.log(res) // { status: 200, data: { id:2, name:"Ben", disabled: 0 } }
}()
```