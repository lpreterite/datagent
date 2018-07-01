# 测试内容

```js

field('data', format())

function field(fieldName, action){
    return async ctx =>{
        const fieldVal = ctx.result[fieldName]
        ctx.result[fieldName] = await action({ ...ctx, result:fieldVal });
        return Promise.resolve(ctx)
    }
}

```