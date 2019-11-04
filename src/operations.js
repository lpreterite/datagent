/**
 * 钩子
 * 
 * @module hooks
 */

/**
 * 用于钩子的方法，提取返回的结果。从`respond`中提取`data`内容传至下一个方法。
 * 
 * @memberof hooks
 * @export respondData
 * @returns
 * 
 * @example
 * import axios from 'axios'
 * import datagent from "datagent"
 * const { respondData } = datagent.hooks
 * 
 * const contact = datagent.contact({
 *   base: axios.create({ baseURL: 'localhost/api' })
 * })
 *  
 * const userModel = datagent.model({
 *   name: 'user',
 *   contact,
 *   hooks: {
 *       fetch: method=>[method(), respondData()]
 *   }
 * })
 * userModel.fetch().then(data=>console.log)
 * // [GET] localhost/api/user
 * // respond => { status: 200, data: [{id:1, name:'Tony'},{id:2, name:'Ben'}] }
 * // fetch => [{id:1, name:'Tony'},{id:2, name:'Ben'}]
 */
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

/**
 * 用于钩子的方法，格式化数据。
 *
 * @memberof hooks
 * @export formatFor
 * @param {Schema} schema
 * @param {Function} [handle=(ctx, format)=>ctx.result=format(ctx.result)]
 * @returns
 * 
 * @example
 * import axios from 'axios'
 * import datagent from "datagent"
 * const { formatFor } = datagent.hooks
 * 
 * const contact = datagent.contact({
 *   base: axios.create({ baseURL: 'localhost/api' })
 * })
 * 
 * const userSchema = datagent.schema({
 *   id: { type: String, default: null },
 *   sex: { type: Number, default: 0 }
 * })
 *  
 * const userModel = datagent.model({
 *   name: 'user',
 *   contact,
 *   hooks: {
 *     fetch: method=>[method(), formatFor(userSchema, (ctx, format)=>ctx.result=ctx.result.data.map(format))]
 *   }
 * })
 * userModel.fetch().then(data=>console.log)
 * // [GET] localhost/api/user
 * // respond => { status: 200, data: [{id:1, name:'Tony'},{id:2, name:'Ben'}] }
 * // fetch => [{id:'1', name:'Tony'},{id:'2', name:'Ben'}]
 */
export function formatFor(schema, handle=(ctx, format)=>ctx.result=format(ctx.result)){
    return ctx=>{
        handle(ctx, schema.format)
        return ctx
    }
}

/**
 * 用于钩子的方法，过滤对象字段。
 *
 * @memberof hooks
 * @export filterFor
 * @param {Schema} schema
 * @param {Function} [handle=(ctx, filter)=>ctx.result=filter(ctx.result)]
 * @returns
 * 
 * @example
 * import axios from 'axios'
 * import datagent from "datagent"
 * const { filterFor } = datagent.hooks
 * 
 * const contact = datagent.contact({
 *   base: axios.create({ baseURL: 'localhost/api' })
 * })
 * 
 * const userSchema = datagent.schema({
 *   id: { type: String, default: null },
 *   sex: { type: Number, default: 0 }
 * })
 *  
 * const userModel = datagent.model({
 *   name: 'user',
 *   contact,
 *   hooks: {
 *     fetch: method=>[
 *       filterFor(userSchema, (ctx, filter)=>{
 *         const [data, ...args] = ctx.args
 *         ctx.args=[filter(data), ...args]
 *       }),
 *       method()
 *     ]
 *   }
 * })
 * userModel.save({ name: 'cathy' })
 * // [POST] localhost/api/user
 * // request => { name: 'cathy', sex: 0 }
 */
export function filterFor(schema, handle=(ctx, filter)=>ctx.result=filter(ctx.result)){
    return ctx=>{
        handle(ctx, schema.filter)
        return ctx
    }
}