import compose from 'koa-compose';
import { defaults } from '../utils/';

/**
 * queue call function like that:
 * ```
 * (ctx, next) => {
 *   // ctx is content in all queue functions, like koa.
 *   // ctx have $model, arge, result fields
 *   // ======================================================
 *   // ctx.$model is function scope
 *   // ctx.arge is function arguments
 *   // ctx.result is this function result
 *   next();
 * }
 * ```
 * 
 * run function return Promise data pattern like that:
 * ```
 * let err, result;
 * [err, result] = Queue.run($model, args, queues);
 * if(err) throw err;
 * console.log(result);
 * ```
 * more detail look test file.
 */

class Method {
    static generate(queues) {
        const queue = compose(queues);
        return (args, ctx={}) => {
            ctx = Object.assign(ctx, {args});
            return new Promise((resolve, reject) => {
                try {
                    queue(
                        ctx,
                        ctx => resolve(ctx.result)
                    ).catch(e=>reject(e));
                } catch (e) {
                    reject(e);
                }
            });
        }
    }
    static concat(...args){
        return args.map(arg => defaults(arg, [])).reduce((x,y)=>x.concat(y));
    }
}

export default Method;