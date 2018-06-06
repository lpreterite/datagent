# DataPlumber

[![npm version](https://img.shields.io/npm/v/@packy-tang/dataplumber.svg)](https://www.npmjs.com/package/@packy-tang/dataplumber)
[![build status](https://travis-ci.org/lpreterite/dataplumber.svg?branch=master)](https://travis-ci.org/lpreterite/dataplumber)

`DataPlumber`是一个用于前端Ajax请求的模块化工具，提供字段定义，方法扩展，切换源等功能。在如React, Vue, Angular等现代前端框架下不同UI层面通信的数据我们称为视图模型(ViewModel)。现在互联网常用于客户端与服务器间通信都是基于RESTful方式设计的持久化服务，这种基于持久化的设计可以借助`DataPlumber`将通信数据表示为数据模型(DataModel)。数据模型管理着数据字段和通信服务，同时为编排业务代码提供相关方法的钩子进行预处理或后处理。

## 安装

npm

```sh
npm install @packy-tang/dataplumber
```

yarn

```sh
yarn add @packy-tang/dataplumber
```

## 远端、链接、数据模型

这三种定义的关系就如标题一样，链接和数据模型都是建立在远端之上。远端可以是一个服务，而链接管理着远端，在数据模型需要操作数据时就必须使用链接取得远端才能完成通信。

以下是三种常用类：

- 远端 Remote
- 链接 Contact
- 数据模型 DataModel

用`DataPlumber`快速创建一个包含远端的链接：

```js
import axios from "axios"
import DataPlumber from "dataplumber"

const contact = DataPlumber.Contact({
    base: axios.create({ baseURL: '/api' })
})
```

数据模型实例化时把链接作为参数传入：

```js
const UserModel = DataPlumber.Model({ name: 'user' })
const $user = new UserModel({ contact })
```

尝试请求数据：

```js
$user.find(1).then(data=>{
    // [GET] /api/user
    // => { status:200, data: { id:1, nickname:'Tony' } }
    console.log(data);
})
```

经过上面的例子相信对`DataPlumber`的使用有了一定的兴趣。`DataPlumber`提供的数据模型还有字段、方法、钩子等功能在后面再一一细说。如果想了解得更多，可以阅读[API参考](docs/API.md)或源代码。