import compose from 'koa-compose';

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

class Queue {
    static run(queues) {
        const queue = compose(queues);
        return (args, ctx={}) => {
            ctx = { ...ctx, args };
            return new Promise((resolve, reject) => {
                try {
                    queue(ctx, ctx => resolve([null, ctx.result, ctx]))
                } catch (e) {
                    reject([e, ctx]);
                }
            });
        }
    }
}

export default Queue;