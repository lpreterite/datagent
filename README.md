# DataPlumber

[![build status](https://img.shields.io/travis/lpreterite/dataplumber.svg?style=flat-square)](https://travis-ci.org/lpreterite/dataplumber)

`DataPlumber`是一个用于前端Ajax请求的模块化工具，提供字段定义，方法扩展，切换源等。

## 为何使用`DataPlumber`？

前端看似简单，但是当项目越来越大的时候需要维护的成本就越高。使用`DataPlumber`能帮你减少一些问题的发生：

- 字段定义：定义字段为接口提高可读性，接手的同事阅读代码后能更快加入工作。
- 切换服务：多个服务器随意切换，满足不同服务器的请求。
- 面向RESTful：模型对象的贴近于restful接口的设计，代码语义更清晰。
- 数据处理：使用请求接口前后的钩子对数据进行预处理，减少冗余代码。

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