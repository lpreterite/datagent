# 快速手上

## 安装

```sh
npm install datagent
```

## 使用

```js
// 引入
import axios from "axios";
import Datagent from "datagent";

// 创建链接
const contact = Datagent.Contact({
    base: axios.create({ baseURL: '/api' })
});

// 定义模型
const UserModel = Datagent.Model({ name: 'user' });

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