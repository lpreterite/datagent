export function wrap(cb){
    return ctx => cb() || ctx
}

export function respondData(){
    return ctx=>{
        const res = ctx.result;
        if(res.status < 200){
            const err = new Error(res.message);
            err.response = res.response;
            throw err
        };
        ctx.result = res.data;
        return Promise.resolve(ctx);
    }
}

export function formatFor(schema, handle){
    return ctx=>{
        return wrap(handle(ctx, schema.format))
    }
}

export function filterFor(schema, handle){
    return ctx=>{
        return wrap(handle(ctx, schema.filter))
    }
}