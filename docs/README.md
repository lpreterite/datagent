# datagent

[![npm version](https://img.shields.io/npm/v/datagent.svg)](https://www.npmjs.com/package/datagent)
[![build status](https://travis-ci.org/lpreterite/datagent.svg?branch=master)](https://travis-ci.org/lpreterite/datagent)
[![NPM downloads](http://img.shields.io/npm/dm/datagent.svg)](https://www.npmjs.com/package/datagent)

`datagent`是一个用于前端请求的模块化管理工具，提供数据格式化、多服务源切换、语义化数据定义等功能。在React,Vue,Angular等现代JavaScript框架下，UI显示均基于数据进行驱动，从服务端获得的数据并不能完全符合UI所需的结构。格式化数据、转义数据不可避免而代码往往写在任何地方又不易于维护。面对这种情况可使用`datagent`统一格式化从服务端获得的数据，并提供统一的请求服务的方式，让你更方便同步UI状态。

> 你可以马上尝试在`codepen`上的[例子](https://codepen.io/packy1980/pen/OEpNWW/)。

## 安装

## 介绍

### 什么是datagent.js

<!-- [描述datagent是什么？解决了什么问题？比如，定义数据字段能提供易读性，提供钩子对数据统一处理等] -->

### 开始

<!-- [提供代码及可交互的例子] -->

### 管理服务(serve)

<!-- [介绍如何使用链接来管理远端，列出一般使用场景例子] -->

### 处理数据

<!-- [举一个数据需要处理的情况，引申这种情况存在的问题（比如每次发送数据、接收数据都需要处理，需要配置一次通用其他地方），介绍可以使用数据模型管理数据字段及字段格式，使用数据对象操作数据交互，在数据对象的钩子中对获得的/需发送的数据进行统一处理等] -->

### 统一调用

<!-- [某些项目存在非常多的数据对象需要管理，页面请求数据是存在状态的（加载中、成功、失败），管理多个数据对象请求再反应至页面状态是一件麻烦事，这里接受统一处理的办法。] -->

## 深入了解

### 远端与`axios`

<!-- [为何使用axios？却又包装一遍？举个继承远端后重写方法支持其他http库的例子] -->

### 数据流动过程

<!-- [描述数据在服务端至使用的过程，中间经过datagent哪些环节进行了怎样的处理，举个例子并补上过程图] -->

### 方法与钩子

<!-- [讲解数据对象的方法执行过程，钩子是在什么情况下介入，如何决定执行顺序的，等等] -->

### 自定义钩子

<!-- [介绍制作钩子的规范，传入可自定义，返回一个接收和返回执行方法的上下文的函数，上下文包含哪些参数，在修改的过程中需要注意的细节，哪些是允许的，哪些是不推荐的] -->

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
$user.find({id:1}).then(data=>{
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

$user.find({id:1}).then(user=>{
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
$user.destroy({id:2}).then(res=>{
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
import Datagent from "datagent"
const { respondData } = Datagent.Hooks

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

- [`respondData()`](./API.md#respondData)
- [`format()`](./API.md#format)
- [`formatFor()`](./API.md#formatFor)
- [`filter()`](./API.md#filter)
- [`filterFor()`](./API.md#filterFor)

钩子方法并不多，需要各位多提供意见及时完善满足更多需求，暂时没能满足你需要的欢迎在这里提issue。

有时候一些处理需在所有钩子生效，比如以下状况：

```js
import Datagent from "datagent";
const Model = Datagent.Model({
    hooks: {
        fetch: { after: [respondData(), format()]},
        find: { after: [respondData(), format()]},
        save: { before: [format()], after: [respondData()]},
        delete: {after: [respondData()]},
        publish: {after: [respondData()]}
    }
}
```

这种例子较为常见，这里提供两个处理函数方便钩子的设置：

```js
import Datagent from "datagent";
const Model = Datagent.Model({
    hooks: {
         // 只设置发送数据前的钩子，save:before
        ...Datagent.mapSendHook([format()]),
         // 设置接收数据后的钩子，包括：fetch:after, find:after
        ...Datagent.mapReceiveHook([respondData(), requestHandle(), format()])
    }
}
```

经过上面的例子相信对`Datagent`的使用有了一定的兴趣。`Datagent`提供的数据模型还有字段、方法、钩子等功能在后面再一一细说。如果想了解得更多，可以阅读[API参考](./API.md)或源代码。