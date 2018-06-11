# 使用文档

- [x] 快速手上
- [ ] 基础
    - [x] 介绍
    - [x] 远端、链接、数据模型
    - [x] 数据模型
    - [x] 定义字段
    - [x] 定义方法
    - [ ] 设置钩子
- [ ] 进阶
    - [ ] 使用链接
        - [ ] 多个远端服务
        - [ ] 默认远端服务
    - [ ] 模型字段
        - [ ] 自定义类型
        - [ ] 默认值
        - [ ] 配合方法钩子使用
    - [ ] 模型方法
        - [ ] 切换远端服务
        - [ ] 自定义方法
        - [ ] 自定义方法钩子
    - [ ] 方法钩子
        - [ ] 设置钩子
        - [ ] 制作钩子

## 快速手上

### 安装

```sh
npm install datagent
```

### 使用

```js
// 引入
import axios from "axios"
import Datagent from "datagent"

// 创建链接
const contact = Datagent.Contact({
    base: axios.create({ baseURL: '/api' })
})

// 定义模型
const UserModel = Datagent.Model({ name: 'user' })

// 创建模型
model = new UserModel({ contact })

model.fetch({ disabled: 0 }).then(users=>{
    // [GET] /api/user?disabled=0
    // => { status: 200, data: [] }
    console.log(users)
})

model.find(1).then(user=>{
    // [GET] /api/user/1
    // => { status: 200, data: { id:1, name:"Tony", disabled: 1 } }
    console.log(user)
})

model.save({ name:"Ben", disabled: 0 }).then(res=>{
    // [POST] /api/user | { name:"Ben", disabled: 0 }
    // => { status: 200, data: { id:2, name:"Ben", disabled: 0 } }
    console.log(res)
})

model.save({ id:1, name:"Tony", disabled: 1 }).then(res=>{
    // [PUT] /api/user/1 | { id:1, name:"Tony", disabled: 1 }
    // => { status: 200, data: { id:1, name:"Tony", disabled: 1 } }
    console.log(res)
})

// 发送带id的DELETE请求
model.destroy(2).then(res=>{
    // [DELETE] /api/user/2
    // => { status: 200, data: { id:2, name:"Ben", disabled: 0 } }
    console.log(res)
})
```

## 介绍

### Datagent是什么？

`Datagent`是一个用于前端Ajax请求的模块化工具，提供字段定义，方法扩展，切换源等功能。在如React, Vue, Angular等现代前端框架下不同UI层面通信的数据我们称为视图模型(ViewModel)。现在互联网常用于客户端与服务器间通信都是基于RESTful方式设计的持久化服务，这种基于持久化的设计可以借助`Datagent`将通信数据表示为数据模型(DataModel)。数据模型管理着数据字段和通信服务，同时为编排业务代码提供相关方法的钩子进行预处理或后处理。

### 远端、链接、数据模型

这三种定义的关系就如标题一样，链接和数据模型都是建立在远端之上。远端可以是一个服务，而链接管理着远端，在数据模型需要操作数据时就必须使用链接取得远端才能完成通信。

- 远端 Remote
- 链接 Contact
- 数据模型 DataModel

> 上面是三个是常用类

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

经过上面的例子相信对`Datagent`的使用有一定的了解。`Datagent`提供的数据模型还有字段、方法、钩子等功能下面再一一细说。如果你想知道得更详细，可以阅读[API参考](API.md)或源代码。

### 数据模型

这里引用Backbonejs关于模型的功能描述：

- 编排数据和业务逻辑
- 从服务器加载并保存
- 数据更改时发出事件

“数据更改时发出事件”的功能已不是模型层需要解决的问题，在如React, Vue, Angular等现代前端框架的帮助下，数据层应该更专注数据处理上。下面来看一下`Datagent`的模型层是如何使用的。

在使用数据模型之前，我们可以使用`Dataplumber.Model()`定义一个数据模型抽象：

```js
import Datagent from "datagent"
const UserModel = Datagent.Model({ name: 'user' })
```

接下来创建这个用户类，便能从服务器加载或保存数据：

```js
const contact = Contact({ base: axios.create({ baseURL: '/api' }) })
const $user = new UserModel({ contact })

$user.find(1).then(user=>{
    // [GET] /api/user/1
    // => { status: 200, data: { id:1, name:"Tony", disabled: 1 } }
    console.log(user)

    $user.save({...user.data, disabled:0 }).then(res=>{
        // [PUT] /api/user | { id:1, name:"Tony", disabled: 0 }
        // => { status: 200, data: { id:1, name:"Tony", disabled: 0 } }
        console.log(res)
    })
})
```

### 定义字段

为模型定义数据字段能让你在开发项目期间对数据接口一目了然，同时也让接手的同事能更快的了解项目。

```js
import Datagent from "datagent"
const UserModel = Datagent.Model({
    name: 'user',
    fields: {
        id: { type: Number, default: null },
        nickname: { type: String, default: '' },
        sex: { type: Number, default: 0 },
        disabled: { type: Number, default: 0 }
    }
})

const user = { id: 1, nickname: 'Tony', email:'tony1990@qq.com' }
const result = UserModel.schema.filter(user)
console.log(result) // { id: 1, nickname: 'Tony' }
```

定义字段在获取或保存数据时并没起到实际作用（就目前代码是这样），但是为后续扩展提供了一些处理依据，同时让接口的数据更易读。具体如何起到实际用途可异步至 设置钩子 部分，那里有详细使用说明。

### 定义方法

`Datagent`的模型提供`fetch`, `find`, `save`, `destroy`方法进行数据的获取和编辑功能，但是在实际的开发场景中并不能完全满足需求。所以在定义模型的同时提供定义方法的设置：

```js
import Datagent from "datagent"
const UserModel = Datagent.Model({
    name: 'user',
    methods: {
        test(){
            return 'test string'
        }
    }
})

const $user = new UserModel()
console.log($user.test()) // test string
```

以下可能是比较贴合实际使用的情况：

```js
import Datagent from "datagent"
const UserModel = Datagent.Model({
    name: 'user',
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

模型实例提供`remote()`方法获得远端服务，再使用远端服务发送信息至服务器登录，我们能够定义更为贴合使用的方法并结合到模型层。可能同一个模型下为满足不同的业务需求，其请求的数据接口可能来自多个地址或多个源。

### 设置钩子

`Datagent`为模型方法提供调用前后处理钩子设置，在使用时提供请求数据的处理，下面来看一下如何使用：

```js
import { default as Datagent, respondData, filter } from "datagent"
const UserModel = Datagent.Model({
    name: 'user',
    fields: {
        id: { type: Number, default: null },
        nickname: { type: String, default: '' },
        sex: { type: Number, default: 0 },
        disabled: { type: Number, default: 0 }
    },
    hooks: {
        fetch: { after: [respondData(), filter(['id'])] }
    }
})

const $user = new UserModel()
$user.fetch().then(data=>{
    // [GET] /api/user
    // => { status:200, data: [{ id:1, nickname:'Tony' }, { id:2, nickname:'Ben' }, { id:3, nickname:'Tim' }...] }
    console.log(data); // [{ id:1 }, { id:2 }, { id:3 }...]
})
```

`respondData`方法为我们把返回的`resquest.data`抽出来，然后`filter`方法把所有数据对象的字段都过滤只剩下id字段。钩子支持设置`fetch`, `find`, `save`, `destroy`等包括模型定义的方法，让一些业务代码或者额外的处理写在方法调用前，达到减少冗余代码的目的。

目前`Datagent`提供了以下一些钩子处理的方法：

- `respondData()`用于`after`钩子，把返回数据对象抽出。
    ```js
    const UserModel = Datagent.Model({
        name: 'user',
        hooks: {
            find: { after: [respondData()] }
        }
    })
    const $user = new UserModel()
    $user.find(1).then(data=>{
        // [GET] /api/user
        // => { status:200, data: { id:1, nickname:'Tony' } }
        console.log(data); // { id:1, nickname:'Tony' }...]
    })
    ```
- `format()`
- `formatFor()`
- `filter()`
- `filterFor()`

钩子方法并不多，需要各位多提供意见及时完善满足更多需求，暂时没能满足你需要的，可以参考以下代码自定义钩子方法。

#### 自定义钩子方法