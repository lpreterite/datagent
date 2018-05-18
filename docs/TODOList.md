# TODOList

- [x] 模型方法运行时支持动态添加钩子
- [x] 模型创建时支持设置方法的默认钩子
- [x] 模型支持自定义方法
- [x] 模型创建时支持设置自定义方法的默认钩子
- [x] 模型需要支持额外的钩子(receive接收数据, send发送数据)的处理。
- [] ~~模型包含某些方法(fetch,find,save,delete)的默认处理(hooks)？~~
- [] ~~find接受参数必须跟fetch一致，第一参数为Object（代号为query）？~~
- [x] ctx上下文必须包含method方法名称和hook当前钩子，hook当前钩子会顺着整个钩子方法执行的过程而变化。
- [x] Hooks类添加静态方法parse解析context上下文得出当前hook，第二参数为解析结果类型(包含两种method方法钩子和behaviour行为钩子，默认是method方法钩子)，输出结果为方法+钩子的字符串，如：`fetch:after`。参考[场景1](#场景1)
- [x] 由于方法运行序列里的某序列出错无法捕获的问题，需要寻找替换`koa-compose`的解决方案，目前找到解决办法有[1](https://www.npmjs.com/package/compose-promise)、[2](https://medium.com/@dtipson/more-functional-javascript-reducing-promises-ramda-js-arrow-functions-again-c1f90e0a79d0)
- [x] 已使用第二个办法替换内容

## 模型包含某些方法(fetch,find,save,delete)的默认处理(hooks)？ 

答：不包含默认处理，所有处理需要手动配置（更可控），同时提供相关`operation`的方法，支持简单配置实现类似字段过滤、字段转义、字段添加之类的操作。

## 场景

### 场景1

hook处理

```js
function filter(fields){
    // ctx.hook = 'before'
    // ctx.method = 'fetch'
    return (ctx, next) => {
        // =====[method]============================================================
        // if (ctx.method == 'fetch' && ctx.hook == 'before') {

        // }
        // if (ctx.method == 'fetch' && ctx.hook == 'after') {

        // }
        // if (ctx.method == 'find' && ctx.hook == 'after') {

        // }
        // if (ctx.method == 'save' && ctx.hook == 'before') {

        // }
        // if (ctx.method == 'save' && ctx.hook == 'after') {

        // }


        // =====[behaviour]============================================================
        // if (isReceiveBehaviour(ctx)) {
        //     ctx.result = ctx.scope.schema.filter(ctx.result, fields);
        // }
        // if (isSendBehaviour(ctx)) {
        //     const data = ctx.args.pop();
        //     ctx.args = [ctx.scope.schema.filter(data, fields), ...ctx.args];
        // }

        const hook = Hooks.parse(ctx, 'behaviour'); //type: method or behaviour

        switch (hook){
            case 'receive':
                ctx.result = ctx.scope.schema.filter(ctx.result, fields);
                break;
            case 'send':
                const data = ctx.args.pop();
                ctx.args = [ctx.scope.schema.filter(data, fields), ...ctx.args];
                break;
            default:
                // throw error;
        }
        next();
    }
}
```

hook使用

```js
export default Dataflow.Model('user', {
    url: '/user',
    fields: {
        id: { type: Number, defaults: 0 },
        nickname: { type: String, defaults: '' },
        sex: { type: Number, defaults: '1' },
        create_at: { type: String, defaults: Date.now() }
    },
    hooks: {
        // 定义两种hook：receive接收数据, send发送数据
        // 接收数据hook将会添加至fetch, find之后, 发送数据hook将会添加至save之前
        ...mapReceiveHook([format()]),
        ...mapSendHook([filter(['id','nickname','sex','create_at'])]),
        
        //支持hooks包括：
        // - 不支持基础的请求：get, post, put, patch, delete
        // - 基于模型的：fetch, find, save, delete
        // - 基于处理的：receive, send
        fetch: {
            after: [format()]
        },
        find: {
            after: [format()]
        },
        save: {
            before: [filter(['id','nickname','sex','create_at'])]
        }
    },
    methods: {
        filter(params, opts){
            const { origin } = defaults(opts);
            return this.remote(origin).get(this._url+'/filter', { params });
        }
        ban(id, opts){
            return super.save({ id, disabled: true }, opts);
        }
    }
});

```