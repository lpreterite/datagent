# 基础

## 创建链接

链接(Contact)是`Datagent`的基础，使用的过程中模型(Model)需要基于链接提供的远端服务请求和提交数据。

```js
import axios from "axios";
import Datagent from "datagent";

//使用Datagent.Contact()提供的工厂方法生成链接实例
const contact = Datagent.Contact({
    base: axios.create({ baseURL: '/api' })
});

//使用默认远端请求数据
const res = contact.remote().get('/users');
// [GET] /api/users
console.log(res); // { status: 200, data:[...] }
```

## 定义字段

定义字段目的很简单，一是为了在编码过程中能知道数据提供怎样的字段，二是为了方便其他同事也能从阅读代码的时候便能理解清楚项目如何运作。当然`Datagent`还在方法钩子提供一下字段过滤及转义功能也是基于字段处理的，所以定义字段能为后续开发提供便利。

定义字段的代码如下：

```js
import Datagent from "datagent";
const UserModel = Datagent.Model({
    name: 'user',
    fields: {
        id: { type: Number, defaults: 0 },
        nickname: { type: String, defaults: '' },
        sex: { type: Number, defaults: 0 },
        create_at: { type: String, defaults: Date.now() },
        disabled: { type: Number, defaults: 0 }
    }
});

// 过滤未定义字段
const filterData = UserModel.schema.filter({
    id: 1,
    nickname: 'Tony',
    email: 'tony1990@qq.com'
})
console.log(filterData); // { id:1, nickname: 'Tony' }
```

## 使用钩子

钩子是`Datagent`的核心功能之一，在方法调用前后能设定一些额外处理数据方法，使调用方法时不需要对请求的数据作额外处理。

```js
import axios from "axios";
import { default as Datagent, respondData, format } from "datagent";

const UserModel = Datagent.Model({
    name: 'user',
    fields: {
        id: { type: Number, defaults: 0 },
        nickname: { type: String, defaults: '' },
        sex: { type: Number, defaults: 0 },
        create_at: { type: String, defaults: Date.now() },
        disabled: { type: Number, defaults: 0 }
    },
    hooks: {
        find: { after:[respondData(), filter(['id','nickname'])] }
    }
});

const contact = Datagent.Contact({
    base: axios.create({ baseURL: '/api' })
});

const $user = new UserModel({ contact });
const user = $user.find();
console.log(user); // { id: '1', nickname: 'Tony' }
```

## 自定义方法

`Datagent`模型虽提供`fetch`,`find`,`save`,`delete`方法更新数据对象，为满足更多的需要`Datagent`在定义模型的阶段便提供自定义方法的设置。

```js
import axios from "axios";
import Datagent from "datagent";
const UserModel = Datagent.Model({
    name: 'user',
    methods: {
        login(data){
            return this.remote().post(data);
        }
    }
});

const contact = Datagent.Contact({
    base: axios.create({ baseURL: '/api' })
});

const $user = new UserModel({ contact });
const res = $user.login({ email: '', password:'' });
```