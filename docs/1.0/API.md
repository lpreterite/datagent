# API 参考

- [Datagent](#datagent)
    - [Datagent.Contact()](#datagentcontact)
    - [Datagent.Model()](#datagentmodel)
    - [Datagent.mapSendHook()](#datagentmapSendHook)
    - [Datagent.mapReceiveHook()](#datagentmapReceiveHook)
- [Remote](#remote)
    - [remote.origin](#remoteorigin)
- [Contact](#contact)
    - [contact.remote()](#contactremote)
        - [传入单个参数为取得远端](#传入单个参数为取得远端)
        - [传入多个参数可设置远端](#传入多个参数可设置远端)
    - [contact.default()](#contactdefault)
    - [contact.has()](#contacthas)
- [Model](#model)
    - [model.fetch()](#modelfetch)
    - [model.find()](#modelfind)
    - [model.save()](#modelsave)
    - [model.destroy()](#modeldestroy)
    - [model.remote()](#modelremote)
    - [model.contact](#modelcontact)
- [DataModel](#datamodel)
    - [DataModel.schema](#datamodelschema)
    - [DataModel实例的方法](#DataModel实例的方法)
- [Schema](#schema)
    - [schema.format()](#schemaformat)
    - [schema.filter()](#schemafilter)
    - [schema.default()](#schemadefault)
    - [schema.fieldSet](#schemafieldset)
    - [Schema.format()](#schemaformat)
    - [Schema.filter()](#schemafilter)
    - [Schema.default()](#schemadefault)
- [Operations](#operations)
    - [respondData](#responddata)
    - [format](#format)
    - [formatFor](#formatfor)
    - [filter](#filter)
    - [filterFor](#filterfor)
    - [getField](#getField)

## Datagent

### Datagent.Contact()

快速生成链接(Contact)对象并设置远端(Remote)内容。

参数：

| 字段     | 限制         | 描述         |
|----------|--------------|--------------|
| remotes  | 必须, Object | 远端设定     |
| defaults | 可选, String | 设置默认远端 |

返回[`Contact`](#Contact)

```js
import axios from 'axios'
import Datagent from "datagent"
const { filter } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' }),
    test: axios.create({ baseURL: 'localhost:8880/api' })
})

// [GET] localhost/api/user
// => { status:200, data:[...] }
contact.remote().get('/user').then(res=>console.log)
```

### Datagent.Model()

生成`DataModel`的工厂方法。

参数：

| 字段    | 限制         | 描述 |
|---------|--------------|------|
| options | 可选, Object |      |

options格式：

| 字段    | 限制          | 描述                                     |
|---------|---------------|------------------------------------------|
| name    | 可选, String  | 类名                                     |
| url     | 可选, String  | 远端地址，默认为``/${name}``              |
| contact | 可选, Contact | 链接                                     |
| fields  | 可选, Object  | 字段设定，格式参考[`Schema`](#Schema)     |
| methods | 可选, Object  | 方法                                     |
| hooks   | 可选, Object  | 钩子，使用参考[`Operations`](#operations) |

返回[`DataModel`](#DataModel)

一个较为完整的例子：

```js
import axios from 'axios'
import Datagent from "datagent"
const { respondData, filter } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const UserModel = Datagent.Model({
    name: 'user',
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    },
    methods: {
        disable(data){
            return this.remote().post({ ...data, disabled: 1 })
        },
        enable(data){
            return this.remote().post({ ...data, disabled: 0 })
        }
    },
    hooks: {
        disable: { before:[filter(['id','disabled'])] },
        enable: { before:[filter(['id','disabled'])] }
    }
})

const $user = new UserModel({ contact })

$user.disable({ id:1, name:'Tony' }).then(res=>console.log)
// [POST] localhost/api/user | { id:1, disabled:1 }
// => { status: 200, data: {...} }

$user.enable({ id:1, name:'Tony' }).then(res=>console.log)
// [POST] localhost/api/user | { id:1, disabled:0 }
// => { status: 200, data: {...} }
```

## Datagent.mapSendHook()

设置发送数据前的钩子（save:before）

参数：

| 字段  | 限制        | 描述             |
|-------|-------------|------------------|
| hooks | 必须, Array | 一堆钩子处理函数 |

使用：

```js
import Datagent from "datagent";
const Model = Datagent.Model({
    hooks: {
        ...Datagent.mapSendHook([format()])
    }
}
```

## Datagent.mapReceiveHook()

设置接收数据后的钩子，包括：fetch:after, find:after

参数：

| 字段  | 限制        | 描述             |
|-------|-------------|------------------|
| hooks | 必须, Array | 一堆钩子处理函数 |

使用：

```js
import Datagent from "datagent";
const Model = Datagent.Model({
    hooks: {
        ...Datagent.mapReceiveHook([respondData(), requestHandle(), format()])
    }
}
```

## Remote

初次化参数：

| 字段   | 限制                    | 描述         |
|--------|-------------------------|--------------|
| origin | 必须, `axios`的实例对象 | 远端服务的源 |

```js
import axios from 'axios'
import Remote from 'datagent/src/classes/Remote.class'
const remote = new Remote({ origin: axios.create({ baseURL: 'localhost/api' }) })
```

- `remote.get(url[, params])`
- `remote.post(url, data)`
- `remote.put(url, data)`
- `remote.patch(url, data)`
- `remote.delete(url)`

以上跟`axios`提供的方法使用上是一致的。

- `remote.sync(options)`

`sync`方法的使用与`axios`是一致的。

### remote.origin

获取服务源头，一般返回的是`axios`实例对象。

## Contact

```js
import axios from 'axios'
import Remote from 'datagent/src/classes/Remote.class'
import Contact from 'datagent/src/classes/Contact.class'
const contact = new Contact();
```

### contact.remote()

`contact.remote()`是一个多态方法。

#### 传入单个参数为取得远端

| 字段 | 限制         | 描述                                  |
|------|--------------|---------------------------------------|
| name | 可选, String | 远端名称，默认为空时取得首次设置的远端 |

```js
const baseRemote = contact.remote('base')
```

#### 传入多个参数可设置远端

| 字段    | 限制         | 描述                                      |
|---------|--------------|-------------------------------------------|
| name    | 必须, String | 远端名称                                  |
| remote  | 必须, Remote | 远端                                      |
| options | 可选, Object | 配置参数，`{ default:'name' }`用于设置默认值 |

```js
contact.remote('base', new Remote({ origin: axios.create({ baseURL: 'localhost/api' }) }))
```

### contact.default()

设置链接使用`remote`方法时获得的默认远端。

参数：

| 字段 | 限制         | 描述     |
|------|--------------|----------|
| name | 必须, String | 远端名字 |

```js
contact.default('test');
```

### contact.has()

判断是否存在某名字的远端

参数：

| 字段 | 限制         | 描述     |
|------|--------------|----------|
| name | 必须, String | 远端名字 |

返回：布尔值`Boolean`

```js
const hasRemote = contact.has('test')
console.log(hasRemote) // false
```

## Model

初次化参数：

| 字段    | 限制         | 描述 |
|---------|--------------|------|
| options | 可选, Object |      |

options对象字段：

| 字段         | 限制 | 描述                                                                                   |
|--------------|------|----------------------------------------------------------------------------------------|
| name         | 必须, String | 类名                                                                                   |
| url          | 可选, String | 远端地址，默认为``/${name}``                                                            |
| contact      | 必须, Contact | 链接                                                                               |
| emulateIdKey | 可选, String | 仿真ID，默认为`false`，当设置值如`id`时会在请求数据是把仿真ID以`query`的方式添加至地址中 |

```js
import axios from 'axios'
import Remote from 'datagent/src/classes/Remote.class'
import Contact from 'datagent/src/classes/Contact.class'
import Model from 'datagent/src/classes/Model.class'

const contact = new Contact();
contact.remote('base', new Remote({ origin: axios.create({ baseURL: 'localhost/api' }) }))
contact.remote('test', new Remote({ origin: axios.create({ baseURL: 'localhost:8880/api' }) }))

const model = new Model({
    name: 'user',
    contact
})
```

### model.fetch()

取得数据列表

参数：

| 字段    | 限制         | 描述                            |
|---------|--------------|---------------------------------|
| params  | 可选, Object | 请求接口参数                    |
| options | 可选, Object | 配置，`{ origin }`用于设置访问源 |

```js
// [GET] localhost/api/user
// => { status: 200, data:[...] }
model.fetch().then(res=>console.log)
```

访问不同远端：

```js
// [GET] localhost:8880/api/user
// => { status: 200, data:[...] }
model.fetch({}, {origin:'test'}).then(res=>console.log)
```

### model.find()

根据id取得数据

参数：

| 字段    | 限制         | 描述                            |
|---------|--------------|---------------------------------|
| params  | 必须, Object | 参数对象必须包含id              |
| options | 可选, Object | 配置，`{ origin }`用于设置访问源 |

```js
// [GET] localhost/api/user/1
// => { status: 200, data:{...} }
model.find({id:1}).then(res=>console.log)
```

### model.save()

同步数据至远端，根据数据对象是否包含`id`进行新增或更新操作。

参数：

| 字段    | 限制         | 描述                            |
|---------|--------------|---------------------------------|
| data    | 必须, Object | 需同步的模型数据                |
| options | 可选, Object | 配置，`{ origin }`用于设置访问源 |

新增数据：

```js
// [POST] localhost/api/user/1 | { name: 'Tony' }
// => { status: 200, data:{...} }
model.save({ name: 'Tony' }).then(res=>console.log)
```

更新数据：

```js
// [PUT] localhost/api/user/1 | { id:1, name: 'Tony', disabled: 0 }
// => { status: 200, data:{...} }
model.save({ id:1, name: 'Tony', disabled: 0 }).then(res=>console.log)
```

### model.destroy()

根据id通知远端销毁数据，`delete()`与此方法相同。

参数：

| 字段    | 限制         | 描述                            |
|---------|--------------|---------------------------------|
| params  | 必须, Object | 参数对象必须包含id              |
| options | 可选, Object | 配置，`{ origin }`用于设置访问源 |

```js
// [DELETE] localhost/api/user/1
// => { status: 200, data:{...} }
model.destroy({id:1}).then(res=>console.log)
```

### model.remote()

使用方法与`contact.remote()`一致，这里不再详细说明。

### model.contact

访问链接

```js
console.log(model.contact.constructor === Contact) // true
```

## DataModel

继承模型类(Model)并把模型类下的方法进行二次封装实现钩子处理。

初始化参数：

| 字段         | 限制          | 描述                                                                                   |
|--------------|---------------|----------------------------------------------------------------------------------------|
| name         | 可选, String  | 类名 |
| url          | 可选, String  | 远端地址，默认为``/${name}``                                                            |
| contact      | 可选, Contact | 链接                                                                                   |
| emulateIdKey | 可选, String  | 仿真ID，默认为`false`，当设置值如`id`时会在请求数据是把仿真ID以`query`的方式添加至地址中 |

`name`,`url`,`contact`参数在使用`Datagent.Model()`定义时均可以设置，所以在模型初次化时不一定需要提供。

```js
import axios from 'axios'
import Datagent from 'datagent'
import Schema from 'datagent/src/classes/Schema.class'

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const UserModel = Datagent.Model({ name: 'user', contact })
const $user = new UserModel();
```

### DataModel.schema

`Datagent.Model`方法提供的字段设置，背后其实是生成了一个`Schema`类。

```js
console.log(UserModel.schema.constructor === Schema) // true
```

创建的实例也包含`schema`

```js
console.log($user.schema.constructor === Schema) // true
```

### DataModel实例的方法

实例方法进行了一些有趣的封装处理，当调用方法时会先运行预先设置的前置钩子方法等处理完后才会真正调用真实的方法函数，然后再把结果传入后置钩子方法进行后续处理，当处理完才真正完成处理输出结果。

运行顺序大概像这样子：

```js
//方法队列
[
    f1(),
    f2(),
    fetch(),
    e1(),
    e2()
]
```

实际处理的方式我称为“折叠方法”，把一个队列的方法顺序运行并得出结果，具体想了解更多可看源码`datagent/src/utls/index.js:14`的`compose`方法。

这里只写`fetch`方法作为例子，其他方法使用是一致的。

参数：

| 字段    | 限制         | 描述                            |
|---------|--------------|---------------------------------|
| id      | 必须, Object | 对象id                          |
| options | 可选, Object | 配置，`{ origin }`用于设置访问源；`{ hooks }`用于设置一次性钩子，接受包含`before`与`after`字段的对象 |

调用时设置一次性钩子：

```js
$user.fetch({ keyword:'Ti' }, {
    hooks: {
        before: [ctx=>{
            const params = ctx.args[0];
            params.q = params.keyword;
            delete params.keyword;
            return ctx;
        }]
    }
}).then(res=>console.log)
// [GET] /api/user?q=Ti
// => { status:200, data:[...] }
```

## Schema

初次化参数：

| 字段     | 限制         | 描述                                                                                  |
|----------|--------------|---------------------------------------------------------------------------------------|
| fieldSet | 必须, Object | 包含字段名(key)与字段设定(val)的哈希数据，例子：{ id: { type: Number, default: null } } |

字段设定(fieldSet)的字段：

| 字段    | 限制           | 描述                                      |
|---------|----------------|-------------------------------------------|
| type    | 必须, Function | 定义字段类型                              |
| default | 可选, any      | 定义字段默认值，默认值类型可字段类型不一致 |

```js
import Schema from 'datagent/src/classes/Schema.class'

const schema = new Schema({
    id: { type: Number, default: null },
    name: { type: String, default: '' },
    disabled: { type: Number, default: 0 }
})
```

### schema.format()

格式化对象

参数：

| 字段 | 限制         | 描述             |
|------|--------------|------------------|
| data | 必须, Object | 需要格式化的对象 |

```js
const data = { name: 'Tony' }
const result = schema.format(data)
console.log(result) // { id:null, name:'Tony', disabled: 0 }
```

### schema.filter()

过滤字段

参数：

| 字段   | 限制                | 描述                                                        |
|--------|---------------------|-------------------------------------------------------------|
| data   | 必须, Object        | 需要处理的对象                                              |
| fields | 可选, Array<String> | 需要保留的字段名称，默认是初次化时传入的对象所包含的字段列表 |

```js
const data = { name: 'Tony', sex: 1, disabled: 0 }
const result = schema.filter(data)
console.log(result) // { name:'Tony', disabled: 0 }
```

保留给定字段

```js
const data = { name: 'Tony', sex: 1, disabled: 0 }
const result = schema.filter(data, ['name','sex'])
console.log(result) // { name:'Tony', sex: 1 }
```

### schema.default()

获取一个包含默认值的对象

```js
const defaultData = schema.default();
console.log(result) // { id:null, name:'', disabled: 0 }
```

### schema.fieldSet

取得field设定

```js
console.log(schema.fieldSet);
/*
{
    id: { type: Number, default: null },
    name: { type: String, default: '' },
    disabled: { type: Number, default: 0 }
}
*/
```

### Schema.format()

格式化对象，`Schema`的静态方法

参数：

| 字段     | 限制         | 描述             |
|----------|--------------|------------------|
| data     | 必须, Object | 需要格式化的对象 |
| fieldSet | 必须, Object | 格式化依据       |

```js
const data = { name: 'Tony' }
const result = Schema.format(data)
console.log(result) // { id:null, name:'Tony', disabled: 0 }
```

### Schema.filter()

过滤字段，`Schema`的静态方法

参数：

| 字段   | 限制                | 描述                                                        |
|--------|---------------------|-------------------------------------------------------------|
| data   | 必须, Object        | 需要格式化的对象                                            |
| fields | 必须, Array<String> | 需要保留的字段名称，默认是初次化时传入的对象所包含的字段列表 |

```js
const data = { name: 'Tony', sex: 1, disabled: 0 }
const result = Schema.filter(data, ['name','sex'])
console.log(result) // { name:'Tony', sex: 1 }
```

### Schema.default()

获取一个包含默认值的对象，`Schema`的静态方法

```js
const fieldSet = {
    id: { type: Number, default: null },
    name: { type: String, default: '' },
    disabled: { type: Number, default: 0 }
}
const data = { name: 'Tony' }
const result = Schema.default(fieldSet)
console.log(result) // { id:null, name:'Tony', disabled: 0 }
```

## Operations

### respondData

用于钩子的方法，提取返回的结果。从`respond`中提取`data`内容传至下一个方法。

限制：

| 钩子   | 是否支持 | 描述 |
|--------|----------|------|
| before | ✘        |      |
| after  | ✔        |      |

```js
import axios from 'axios'
import Datagent from "datagent"
const { respondData } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const UserModel = Datagent.Model({
    name: 'user',
    contact,
    hooks: {
        fetch: { after:[respondData()] }
    }
})
const $user = new UserModel()
$user.fetch().then(data=>console.log)
// [GET] localhost/api/user
// respond => { status: 200, data: [{id:1, name:'Tony'},{id:2, name:'Ben'}] }
// respondData => [{id:1, name:'Tony'},{id:2, name:'Ben'}]
```

### format

用于钩子的方法，格式化数据。

参数：

| 字段   | 限制        | 描述                                   |
|--------|-------------|----------------------------------------|
| schema | 可选，Schema | 默认使用数据模型设定的schema进行格式化 |

限制：

| 钩子   | 是否支持 | 描述                                                |
|--------|----------|-----------------------------------------------------|
| before | ✔        | 为传入参数格式化                                    |
| after  | ✔        | 为返回结果格式化；返回结果是数组时格式化数组内的对象 |

```js
import axios from 'axios'
import Datagent from "datagent"
const { respondData, format } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const UserModel = Datagent.Model({
    name: 'user',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    },
    hooks: {
        find: { after:[respondData(), format()] }
    }
})
const $user = new UserModel()
$user.find({id:1}).then(data=>console.log)
// [GET] localhost/api/user
// respond => { status: 200, data: {id:1, name:'Tony', disabled: 0 } }
// format => {id:1, name:'Tony', disabled:'0'}
```

### formatFor

用于钩子的方法，格式化指定数据。

参数：

| 字段   | 限制        | 描述                                   |
|--------|-------------|----------------------------------------|
| field  | 必须，String | 需格式化的字段名称                               |
| schema | 可选，Schema | 默认使用数据模型设定的schema进行格式化 |

限制：

| 钩子   | 是否支持 | 描述                                                |
|--------|----------|-----------------------------------------------------|
| before | ✔        | 为传入参数格式化                                    |
| after  | ✔        | 为返回结果格式化；返回结果是数组时格式化数组内的对象 |

```js
import axios from 'axios'
import Datagent from "datagent"
const { respondData, formatFor } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const RoleModel = Datagent.Model({
    name: 'role',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    }
})

const UserModel = Datagent.Model({
    name: 'user',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    },
    hooks: {
        find: { after:[respondData(), formatFor('role', RoleModel.schema)] }
    }
})

const $user = new UserModel()
$user.find({id:1}).then(data=>console.log)
// [GET] localhost/api/user
// respond => { status: 200, data: { id:1, name:'Tony', disabled: 0, role: { id: 1, name:'admin', disabled: 0 } } }
// formatFor => { id:1, name:'Tony', disabled: 0, role: { id: 1, name:'admin', disabled: '0' } }
```

### filter

用于钩子的方法，过滤对象字段。

参数：

| 字段   | 限制               | 描述                       |
|--------|--------------------|----------------------------|
| fields | 可选，Array<String> | 默认使用数据模型设定的字段 |

限制：

| 钩子   | 是否支持 | 描述                                                |
|--------|----------|-----------------------------------------------------|
| before | ✔        | 为传入参数过滤字段                                    |
| after  | ✔        | 为返回结果过滤字段；返回结果是数组时过滤字段数组内的对象 |

```js
import axios from 'axios'
import Datagent from "datagent"
const { filter } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const UserModel = Datagent.Model({
    name: 'user',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    },
    hooks: {
        save: { before:[filter(['id','disabled'])] }
    }
})
const $user = new UserModel()
const data = { id:1, name:'Tony', disabled: '1' };
$user.save(data).then(data=>console.log)
// [PUT] localhost/api/user | { id: 1, disabled: '1' }
// => { status: 200, data: {id:1, name:'Tony', disabled: 1 } }
```

### filterFor

用于钩子的方法，过滤指定对象字段。

参数：

| 字段   | 限制               | 描述                       |
|--------|--------------------|----------------------------|
| field  | 必须，String        | 需过滤的字段名称           |
| fields | 可选，Array<String> | 默认使用数据模型设定的字段 |

限制：

| 钩子   | 是否支持 | 描述                                                |
|--------|----------|-----------------------------------------------------|
| before | ✔        | 为传入参数过滤字段                                    |
| after  | ✔        | 为返回结果过滤字段；返回结果是数组时过滤字段数组内的对象 |

```js
import axios from 'axios'
import Datagent from "datagent"
const { filterFor } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const RoleModel = Datagent.Model({
    name: 'role',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    }
})

const UserModel = Datagent.Model({
    name: 'user',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    },
    hooks: {
        save: { before:[filterFor('role', ['id','disabled'])] }
    }
})

const $user = new UserModel()
const data = { id:1, name:'Tony', disabled: '1', role: { id: 1, name:'admin', disabled: '1' } }
$user.save(data).then(data=>console.log)
// [PUT] localhost/api/user | { id:1, name:'Tony', disabled: '1', role: { id: 1, disabled: '1' } }
// => { status: 200, data: {id:1, name:'Tony', disabled: 1 } }
```

### getField

用于钩子的方法，提取指定字段进行后续操作。

参数：

| 字段   | 限制               | 描述                       |
|--------|--------------------|----------------------------|
| field | 必须，String | 需要处理的字段 |
|action|必须, Function| 后续处理的函数，可使用钩子的函数方法：format, filter, formatFor等 |

限制：

| 钩子   | 是否支持 | 描述                                                |
|--------|----------|-----------------------------------------------------|
| before | ✔        | 为传入参数处理字段                                    |
| after  | ✔        | 为返回结果处理字段 |

```js
import axios from 'axios'
import Datagent from "datagent"
const { filter, getField } = Datagent.Hooks

const contact = Datagent.Contact({
    base: axios.create({ baseURL: 'localhost/api' })
})

const RoleModel = Datagent.Model({
    name: 'role',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    }
})

const UserModel = Datagent.Model({
    name: 'user',
    contact,
    fields: {
        id: { type: Number, default: null },
        name: { type: String, default: '' },
        disabled: { type: String, default: '' },
    },
    hooks: {
        save: { before:[getField('role', filter(['id','disabled']))] }
    }
})

const $user = new UserModel()
const data = { id:1, name:'Tony', disabled: '1', role: { id: 1, name:'admin', disabled: '1' } }
$user.save(data).then(data=>console.log)
// [PUT] localhost/api/user | { id:1, name:'Tony', disabled: '1', role: { id: 1, disabled: '1' } }
// => { status: 200, data: {id:1, name:'Tony', disabled: 1 } }
```
