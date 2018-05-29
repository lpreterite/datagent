# DataPlumber

`DataPlumber`是参考backbone的模型设计提供fetch、find、save、delete等更具语意的方法操作数据。同时使用折叠方法的方式为所有模型的方法提供前置与后置的钩子使其满足各类使用场景并保持可读可维护的目的。

它拥有以下特性：

- 支持定义及处理字段
- 支持请求不同的远端服务
- 为每个方法提供前置(或后置)处理

## 快速入门

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

想了解更多请查看[使用文档](./docs/README.md)