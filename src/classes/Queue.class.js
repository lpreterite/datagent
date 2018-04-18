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
    static run($model, args, queues) {
        return new Promise((resolve, reject) => {
            const queue = compose(queues);
            try {
                queue({ $model, args, result: null }, ctx => resolve([null, ctx.result, ctx.$model]));
            } catch (e) {
                reject([e, ctx.$model]);
            }
        });
    }
}

export default Queue;