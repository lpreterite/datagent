export const compose = (...list) => acc => list.reduce((acc, fn) => acc.then(fn), Promise.resolve(acc));
export function generate(queues) {
    const queue = compose(...queues);
    return (args, ctx={}) => {
        ctx = Object.assign(ctx, {args});
        return new Promise((resolve, reject) => {
            queue(ctx)
                .then(ctx=>resolve(ctx.result))
                .catch(reject);
        });
    }
}
export function concat(...args){
    return args.map(arg => defaults(arg, [])).reduce((x,y)=>x.concat(y));
}
export function wrap(method){
    return ctx=>method.apply(ctx.scope, ctx.args).then(data=>Promise.resolve({...ctx, result: data}))
}
export function context(options){
    const { scope, method, ..._opts } = {args=null, result=null, ...options}
    const context = {
        ..._opts
    }
    Object.defineProperties(context, {
        "scope":{
            get(){
                return scope
            }
        },
        "method":{
            get(){
                return method
            }
        }
    })
    return context
}