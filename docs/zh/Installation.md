# 安装与使用

## 安装

```sh
npm install dataplumber
```

## 使用

```js
// 引入
import axios from "axios";
import { Model, Contact } from "dataplumber";

// 创建链接
const contact = Contact({
    base: axios.create({ baseURL: '/api' })
});

// 定义模型
const UserModel = Model({
    name: 'user',
    fields: {
        id: { type: Number, defaults: 0 },
        nickname: { type: String, defaults: '' },
        sex: { type: Number, defaults: '1' },
        create_at: { type: String, defaults: Date.now() },
        disabled: { type: Number, defaults: 0 }
    },
    methods: {
        ban(id, opts) {
            return this.save({ id, disabled: 1 }, opts);
        },
        errorTest() {
            throw new Error('just a bug');
        }
    }
});

// 创建模型
model = new UserModel({ name: 'user', url: '/users', contact });

async function(){
    // 发送GET请求
    const users = await model.fetch({ disabled: 0 });
    // 发送带id的GET请求
    const Tony = await model.find(233);
    // 发送POST请求
    const res = await model.save({ name:"Ben", disabled: 0 });
    // 带id时，发送带id的PUT请求
    const res = await model.save({ id:233, name:"Tony", disabled: 1 });
    // 发送带id的DELETE请求
    const res = await model.delete(233);
}()
```