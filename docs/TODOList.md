# TODOList

- [x] 定义字段默认值处理
  - [x] 空值判断的处理
- [x] 定义字段值转义处理
- [x] ~~数据模型的链式调用设计与使用例子~~
- [x] 数据模型代理的设计及使用例子
- [ ] socket远端的支持与使用

## 定义字段默认值处理

  > **没有定义和空值均给与默认值**

### 空值判断的处理

  > **null、NaN、undefined均为空值**
  >
  > `{}`对象,`[]`数组属于存在值的情况均不处理

## 定义字段值转义处理

```js
// # 1.0.0 行为
export const format = (data, fieldSet) => convert(fieldSet, { format:true })(data);
export const schema = fieldSet => convert(fieldSet, { format: true })({}, Object.keys(fieldSet));
// convert耦合了默认值与转义处理
```

1.0.0版本值的转义与默认值处理是耦合一起，当时转义失败处理将给默认值进行处理，新版梳理完整后将会先处理默认值后再转义值内容，转义失败将直接输出错误内容。

```js
export const schema = (fieldSet)=>{...}
export const convert = (data, fieldSet)=>{...}
export const format = (data, fieldSet)=>convert({...schema(data)}, fieldSet)
```

## 数据模型的链式调用设计与使用例子

~~为何需要改为链式调用？目前数据交互过程是以发起请求的方式与服务端进行交互的。考虑到需要支持处理socket源的处理时，需要~~

调研了一下发现并不是很需要做成链式调用来支持socket部分的处理，反而要做好Remote部分的设计来支持socket的使用

## 数据模型代理的设计及使用例子

```js
// 定义数据字段
import { datagent } from "datagent"

function Fen(){}
function Yan(){}

const ServeSchema = datagent.schema({
    pice: { type: Fen, default: null },
    updated_at: { type: String, default: "" }
})
const ViewSchema = datagent.schema({
    pice: { type: Yan, default: null },
    updated_at: { type: Date, default: null }
})
const PaginationSchema = datagent.schema({
    total: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    data: { type: Array, default: [] },
})

// 设置数据模型处理细节
import { datagent } from "datagent"
const { respondData, requestHandle, formatFor } = datagent.hooks

const MODEL_NAME = "tags"
const TagsModel = datagent.model({
    name: MODEL_NAME,
    // or
    // url: "/tags",
    methods: {
        disabled(...args){
            const [params, {origin}] = args
            return this.remote(origin).get(`/course_orders`, params);
        }
    },
    hooks: {
        fetch: method=>[method(), respondData(), requestHandle(), formatFor(ViewSchema, (ctx,format)=>ctx.result.data=format(ctx.result.data))],
        find: method=>[method(), respondData(), requestHandle(), formatFor(ViewSchema)],
        save: method=>[formatFor(ServeSchema, (ctx,format)=>ctx.args=format(ctx.args)), method(), respondData(), requestHandle()],
        disabled: method=>[method(), respondData(), requestHandle()],
    }
})
export default TagsModel

// 页面代码
import axios from "axios"
import { datagent, asyncTo } from "datagent"
const contact = datagent.contact({base: axios.create()})
const datagent = datagent([TagsModel], { contact })
const TAGS = TagsModel.name

const page = {
    init(){
        // UI处理
        datagent.on('error', err=>this.$$error(err))
        datagent.on('before', ctx=>this.$$loading(ctx.model_name))
        datagent.on('after', (err, result, ctx)=>this.$$loaded(ctx.model_name))
    },

    // 请求
    async refresh(name, query){
        const [err, result] = await asyncTo(datagent.fetch(name, query))
        if(err) return
        this.list = result
    }
}
```

### 生成与执行串行函数

```js
const options = { action: [...] }
function action(...args){
    const ctx = { scope: this, args, methodName: "action", result: null }
    const queues = generate(options.action) //生成
    return queues(args, ctx) //执行
}
```

### 模型方法

自带方法包括：

- fetch
- find
- save
- destroy

自定义方法需要放置在`methods`的设定里

### 钩子

钩子处理之前用设置的方式出入进行处理，必定存在方法请求前后的问题这次改版将取消这种设定。钩子改为提供方法执行时进行设定，并把执行方法作为钩子参数传入，在返回串行函数。使用这种方式更能灵活自由地组合钩子处理的函数。

#### 存在的问题

这样改版后存在些问题：没有`before/after`钩子后数据处理的对象无法判断。before处理的是方法传入的数据(`params`)，而after处理的是核心方法返回后的结果(`result`)。

基于这个问题，可能钩子处理的函数需要改为提供`指定数据字段`的处理函数，像下面这样使用：

```js
function Fen(){}
function Yan(){}

const { respondData, requestHandle, formatFor } = datagent.hooks
const ServeSchema = datagent.schema({
    pice: { type: Fen, default: null },
    updated_at: { type: String, default: "" }
})
const ViewSchema = datagent.schema({
    pice: { type: Yan, default: null },
    updated_at: { type: Date, default: null }
})
const PaginationSchema = datagent.schema({
    total: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    data: { type: Array, default: [] },
})

// //只执行不处理返回值，然后默认返回ctx上下文
// format(ViewSchema, (ctx,format)=>ctx.result.data=format(ctx.result.data))
// format(PaginationSchema, (ctx,format)=>ctx.result=format(ctx.result))
// format(ViewSchema, (ctx,format)=>ctx.result=format(ctx.result))
// format(ServeSchema, (ctx,format)=>ctx.args=format(ctx.args))

    ...
    hooks: {
        //针对返回数据结构再指定处理的数据规则
        fetch: method=>[method(), respondData(), requestHandle(), formatFor(ViewSchema, (ctx,format)=>ctx.result.data=format(ctx.result.data))],
        //默认处理ctx.result的结果字段
        find: method=>[method(), respondData(), requestHandle(), formatFor(ViewSchema, /**defaultFun:(ctx,format)=>ctx.result=format(ctx.result)**/)],
        //当需要指定处理哪个字段时，在外部提供指定规则
        save: method=>[formatFor(ServeSchema, (ctx,format)=>ctx.args=format(ctx.args)), method(), respondData(), requestHandle()],
        disabled: method=>[method(), respondData(), requestHandle()],
    }
    ...
```

`(ctx,format)=>ctx.result=format(ctx.result)`执行方法不处理返回内容，默认返回ctx上下文。

数据字段定义由于获得数据后的处理和发送给服务的处理有可能并不是一样的，目前将在`model`废除`fields`设置，数据处理将在`hooks`公开声明处理。

