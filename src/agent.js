/**
 * 数据对象代理，提供方法执行前后事件通知。
 *
 * @fires Agent#before
 * @fires Agent#after
 * @fires Agent#error
 * @param {Object[]} _models
 * @param {Object} options
 * @property {Object} models
 * @class
 * 
 * @example
 * import axios from "axios"
 * import datagent from "datagent"
 * 
 * const contact = datagent.contact({ base: axios.create({ baseURL: "http://localhost:8081"  }) })
 * const userModel = datagent.model({ name: 'user', contact })
 * const roleModel = datagent.model({ name: 'role', contact })
 * const agent = datagent.agent([userModel, roleModel])
 * 
 * // 记录加载状态
 * const loader = { [userModel.name]:false, [roleModel.name]:false }
 * ;(async ()=>{
 *   agent.on("error", err=>console.error(err))
 *   agent.on("before", ctx=>loader[ctx.model_name] = true) //改为加载中
 *   agent.on("after", (err, result, ctx)=>loader[ctx.model_name] = false) //改为加载完成
 * 
 *   const [err, user_res] = await agent.fetch(userModel.name, { q: "pa" })
 *   // request 'http://localhost:8081/user?q=pa'
 *   // output respond like: { status: 200, data: {...}, headers: {...} }
 *   const [err, role_res] = await agent.fetch(userModel.name, { id: user_res.data.user.role_id })
 *   // request 'http://localhost:8081/role?q=pa'
 *   // output respond like: { status: 200, data: {...}, headers: {...} }
 * })
 */
function Agent(_models, options){
    const { model_name="name" } = {...options}
    const MODEL_NAME = model_name
    const models = [].concat(_models).reduce((result, model)=>({...result, [model[MODEL_NAME]]:model}),{})

    const events = {
        error: err=>console.error(err),
        before: ctx=>ctx,
        after: (err, result, ctx)=>{}
    }
    function eventWrapper(result, fn, args){
        return fn(...args) || result
    }

    /**
     * 执行对应的模型对象方法
     * 
     * @param {String} model_name 模型对象名称
     * @param {String} action 模型对象方法名
     * @param {*} query 传入方法的参数
     * @param {*} options 传入方法的设置
     * @memberof Agent
     * @return {Promise}
     */
    function active(model_name, action, query, options){
        options = {...options}
        let ctx = {model_name, action, query, options}
        /**
         * 执行对象方法前的事件
         * 
         * @event Agent#before
         * @type {Object} 执行上下文
         * @property {String} model_name 模型对象名称
         * @property {String} action 模型对象方法名
         * @property {*} query 传入方法的参数
         * @property {*} options 传入方法的设置
         */
        events.before(ctx)
        return models[ctx.model_name][ctx.action](ctx.query, ctx.options)
            .then(data=>[null, data], err=>([err]))
            .then(([err, result])=>{
                
                /**
                 * 执行对象方法后出错的事件
                 * 
                 * @event Agent#error
                 * @type {Error} 错误
                 */
                if(err) events.error(err)
                
                /**
                 * 执行对象方法后的事件
                 * 
                 * @event Agent#after
                 * @property {Error} err 错误
                 * @property {Object} result 返回结果，默认返回的是`respond`对象
                 * @property {Object} ctx 执行上下文，参考Agent#before中的上下文参数
                 */
                events.after(err, result, ctx)
                return [err, result]  
            })
    }

    const context = {
        //operator
        active,
        /**
         * 获取多条数据
         * 
         * @param {String} model_name 模型对象名称
         * @param {*} query 传入方法的参数
         * @param {*} options 传入方法的设置
         * @memberof Agent
         * @return {Promise}
         */
        fetch(model_name, query, options){ return active(model_name, "fetch", query, options) },
        
        /**
         * 获取单条数据
         * 
         * @param {String} model_name 模型对象名称
         * @param {Object} query 传入方法的参数
         * @param {String} query.id 必须传入id
         * @param {*} options 传入方法的设置
         * @memberof Agent
         * @return {Promise}
         */
        find(model_name, query, options){ return active(model_name, "find", query, options) },
        
        /**
         * 保存数据
         * 
         * 默认发起`[POST]`请求，传入数据如果带上`id`参数将会发起`[PUT]`请求
         * 
         * @param {String} model_name 模型对象名称
         * @param {*} query 传入方法的参数
         * @param {*} options 传入方法的设置
         * @memberof Agent
         * @return {Promise}
         */
        save(model_name, query, options){ return active(model_name, "save", query, options) },
        
        /**
         * 销毁数据
         * 
         * @param {String} model_name 模型对象名称
         * @param {Object} query 传入方法的参数
         * @param {String} query.id 必须传入id
         * @param {*} options 传入方法的设置
         * @memberof Agent
         * @return {Promise}
         */
        destroy(model_name, query, options){ return active(model_name, "destroy", query, options) },
        
        /**
         * 设置事件回调
         * 
         * @param {String} event_name 事件名称
         * @param {Function} cb 回调参数
         * @memberof Agent
         * @return {Promise}
         */
        on(event_name, cb){
            if(!events[event_name]) return false
            events[event_name] = cb
        }
    }

    Object.defineProperties(context, {
        "models":{
            get(){
                return models
            }
        }
    })

    return Object.freeze(context)
}

const factory = (_models, options) => new Agent(_models, options)
export const constructor = Agent
export default factory