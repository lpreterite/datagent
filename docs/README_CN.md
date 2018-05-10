# js-dataflow

这是一个简单的前端数据流的应用支持

他拥有以下特性

- 支持定义及处理字段
- 支持请求不同的远端服务
- 为每个方法提供前置(或后置)处理
- 使用axios进行请求处理

## 快速入门

```js
// 引入
import axios from "axios";
import { Model, Contact } from "lpreterite/js-dataflow";

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

后续文档待更新...