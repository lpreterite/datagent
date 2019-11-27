export {default as context} from "./context"

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
export function wrap(method){
    return ctx=>{
        return method.apply(ctx.scope, ctx.args).then(data=>Promise.resolve({...ctx, result: data}))
    }
}