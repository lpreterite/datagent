# Datagent

[![npm version](https://img.shields.io/npm/v/datagent.svg)](https://www.npmjs.com/package/datagent)
[![build status](https://travis-ci.org/lpreterite/datagent.svg?branch=master)](https://travis-ci.org/lpreterite/datagent)

`Datagent`是一个用于前端Ajax请求的模块化工具，提供字段定义，方法扩展，切换源等功能。在如React, Vue, Angular等现代前端框架下不同UI层面通信的数据我们称为视图模型(ViewModel)。现在互联网常用于客户端与服务器间通信都是基于RESTful方式设计的持久化服务，这种基于持久化的设计可以借助`Datagent`将通信数据表示为数据模型(DataModel)。数据模型管理着数据字段和通信服务，同时为编排业务代码提供相关方法的钩子进行预处理或后处理。

## 安装

npm

```sh
npm install datagent
```

yarn

```sh
yarn add datagent
```

## 远端、链接、数据模型

这三种定义的关系就如标题一样，链接和数据模型都是建立在远端之上。远端可以是一个服务，而链接管理着远端，在数据模型需要操作数据时就必须使用链接取得远端才能完成通信。

以下是三种常用类：

- 远端 Remote
- 链接 Contact
- 数据模型 DataModel

用`Datagent`快速创建一个包含远端的链接：

```js
import axios from "axios"
import Datagent from "datagent"

const contact = Datagent.Contact({
    base: axios.create({ baseURL: '/api' })
})
```

数据模型实例化时把链接作为参数传入：

```js
const UserModel = Datagent.Model({ name: 'user' })
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

## 数据模型

```js
// api/user.js
import axios from "axios"
import { HOST } from "./config"

export function getUsers(params){
    return axios.get(`${HOST}/api/user`, { params })
}
export function getUserById(id){
    return axios.get(`${HOST}/api/user/${id}`)
}
export function createUser(data){
    return axios.post(`${HOST}/api/user`, data)
}
export function updateUser(data){
    return axios.put(`${HOST}/api/user/${data.id}`, data)
}
export function deleteUserById(id){
    return axios.delete(`${HOST}/api/user/${data.id}`)
}
```

上面是常见的基于`Restful`接口代码，随着项目持续发展这类代码只会越来越多。当需要修改时不能直观知道接口请求参数和返回数据，则不是那么容易降低出错的可能，这将会带来较多的麻烦。使用`Datagent`定义数据模型能减少较多的手写代码冗余。

```js
// models/user.model.js
import Datagent from "datagent"
const UserModel = Datagent.Model({ name: "user" })
```

## 定义字段

字段是数据模型的有效描述。在数据模型中定义的字段，虽然在请求（或提交）数据时并不会进行过滤或格式化，这钟功能将在钩子以可选的方式提供设置。

其次的作用在于为你的项目提高可读性，为接口部分提供更多的描述。一目了然的代码使同事能更快的加入项目。

```js
// models/user.model.js
import Datagent from "datagent"
const UserModel = Datagent.Model({
    name: "user",
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    }
})
```

## 模型的使用

`Datagent`通讯部分是基于`Restful`的方式，数据模型则提供统一的处理数据的方法：

- fetch：请求多份数据，发送`[GET] /user`请求。
- find：根据`id`请求单份数据，发送`[GET] /user/:id`请求。
- save：根据`id`提交数据。`id`不存在则新增数据，发送`[POST] /user`请求；`id`存在则更新数据，发送`[PUT] /user`请求。
- destroy：根据`id`请求销毁数据，发送`[DELETE] /user/:id`请求。

```js
// test.js
import contact from "contact"

const $user = new UserModel({ contact })

$user.fetch({ disabled: 0 }).then(users=>{
    // [GET] /api/user?disabled=0
    // => { status: 200, data: [] }
    console.log(users)
})

$user.find(1).then(user=>{
    // [GET] /api/user/1
    // => { status: 200, data: { id:1, name:"Tony", disabled: 1 } }
    console.log(user)
})

$user.save({ name:"Ben", disabled: 0 }).then(res=>{
    // [POST] /api/user | { name:"Ben", disabled: 0 }
    // => { status: 200, data: { id:2, name:"Ben", disabled: 0 } }
    console.log(res)
})

$user.save({ id:1, name:"Tony", disabled: 1 }).then(res=>{
    // [PUT] /api/user/1 | { id:1, name:"Tony", disabled: 1 }
    // => { status: 200, data: { id:1, name:"Tony", disabled: 1 } }
    console.log(res)
})

// 发送带id的DELETE请求
$user.destroy(2).then(res=>{
    // [DELETE] /api/user/2
    // => { status: 200, data: { id:2, name:"Ben", disabled: 0 } }
    console.log(res)
})
```

除了自带方法之外，还可以根据业务的需要添加方法。

```js
// models/user.model.js
import Datagent from "datagent"
const UserModel = Datagent.Model({
    name: "user",
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    },
    methods: {
        login(account){
            return this.remote().post(this._url + '/login', account)
        },
        logout(){
            return this.remote().get(this._url + '/logout')
        }
    }
})

const $user = new UserModel()
$user.login({ email: 'tony1990@qq.com', password: '******' }).then(res=>{
    // [POST] /api/user/login | { email: 'tony1990@qq.com', password: '******' }
    // => { status: 200 }
})
$user.logout().then(res=>{
    // [GET] /api/user/logout
    // => { status: 200 }
})
```

模型实例提供`remote()`方法获得远端服务，再使用远端服务发送信息至服务器登录，关于远端的使用可以参看[API参考 - Remote](./API.md#Remote)

## 钩子

钩子是数据模型的方法使用前后的预设方法，用于处理数据的一种设计。

目前钩子只有两种：`before`, `after`。

钩子能在定义数据模型时设置：

```js
import axios from 'axios'
import { default as Datagent, respondData } from 'datagent'

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const UserModel = Datagent.Model({
    name: 'user',
    hooks: {
        fetch: { after:[respondData()] }
    }
})
const $user = new UserModel({ contact })
$user.fetch().then(data=>console.log)
// [GET] localhost/api/user
// respond => { status: 200, data: [{id:1, name:'Tony'},{id:2, name:'Ben'}] }
// respondData => [{id:1, name:'Tony'},{id:2, name:'Ben'}]
```

也能在调用方法时进行设置：

```js
$user.fetch({}, {
    hooks:{ after: [ respondData() ] }
}).then(data=>console.log)
// [GET] localhost/api/user
// respond => { status: 200, data: [{id:1, name:'Tony'},{id:2, name:'Ben'}] }
// respondData => [{id:1, name:'Tony'},{id:2, name:'Ben'}]
```

`respondData`方法为我们把返回的`resquest.data`抽出来，再传递至下一个方法。钩子支持设置`fetch`, `find`, `save`, `delete`等模型自身或定义的方法，让一些业务代码或者额外的处理写在方法调用前，达到减少冗余代码的目的。

目前`Datagent`提供了以下一些钩子处理的方法：

- [`respondData()`](./docs/API.md#respondData)
- [`format()`](./docs/API.md#format)
- [`formatFor()`](./docs/API.md#formatFor)
- [`filter()`](./docs/API.md#filter)
- [`filterFor()`](./docs/API.md#filterFor)

钩子方法并不多，需要各位多提供意见及时完善满足更多需求，暂时没能满足你需要的，可以参考以下代码自定义钩子方法。

经过上面的例子相信对`Datagent`的使用有了一定的兴趣。`Datagent`提供的数据模型还有字段、方法、钩子等功能在后面再一一细说。如果想了解得更多，可以阅读[API参考](docs/API.md)或源代码。