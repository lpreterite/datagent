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

export function formatFor(schema, handle=(ctx, format)=>ctx.result=format(ctx.result)){
    return ctx=>{
        handle(ctx, schema.format)
        return ctx
    }
}

export function filterFor(schema, handle=(ctx, filter)=>ctx.result=filter(ctx.result)){
    return ctx=>{
        handle(ctx, schema.filter)
        return ctx
    }
}