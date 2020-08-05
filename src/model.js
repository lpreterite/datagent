import { existError, isDef, isString, isArray, isFunction } from "./utils/"
import * as queue from "./queue"

export const isNew = data => !isDef(data.id) || !data.id
export const getURI = (id, url, emulateIdKey) => emulateIdKey ? url : (url + ((isDef(id) && !!id) ? `/${id}` : ''))

export const restful = {
    /**
     * 获取数据列表
     *
     * @memberof Model
     * @param {Object} params 请求参数，可选
     * @param {Object} opts 请求设置，可选
     * @param {String} opts.origin 请求的远端名称
     * @param {Object} ctx 不用设置
     * @returns {Promise}
     */
    fetch(params, opts, ctx) {
        const { origin } = {...opts}
        const { contact, url } = ctx.options
        return contact.remote(origin).get(url, params)
    },

    /**
     * 获取单个数据，根据id取得数据
     *
     * @memberof Model
     * @param {Object} params 请求参数，可选
     * @param {Object} opts 请求设置，可选
     * @param {String} opts.origin 请求的远端名称
     * @param {Object} ctx 不用设置
     * @returns {Promise}
     */
    find(params, opts, ctx) {
        const { origin } = {...opts}
        const { contact, getURL, emulateIdKey } = ctx.options
        const { id } = params
        if (emulateIdKey) params[emulateIdKey] = params.id
        else delete params.id
        return contact.remote(origin).get(getURL(id), params )
    },

    /**
     * 储存数据，同步数据至远端，根据数据对象是否包含`id`进行新增或更新操作。
     *
     * @memberof Model
     * @param {Object} data 发送数据，必须
     * @param {Object} opts 请求设置，可选
     * @param {String} opts.origin 请求的远端名称
     * @param {Object} ctx 不用设置
     * @returns {Promise}
     */
    save(data, opts, ctx) {
        const { origin } = {...opts}
        const { contact, getURL, isNew } = ctx.options
        const { id } = data
        const _url = getURL(id)
        const method = isNew(data) ? 'post' : 'put'
        return contact.remote(origin)[method](_url, data)
    },
    
    /**
     * 删除数据，根据id通知远端销毁数据。别名方法`delete()`
     *
     * @memberof Model
     * @param {Object} params 请求参数，可选
     * @param {Object} opts 请求设置，可选
     * @param {String} opts.origin 请求的远端名称
     * @param {Object} ctx 不用设置
     * @returns {Promise}
     */
    destroy(params, opts, ctx) {
        const { origin } = {...opts}
        const { contact, getURL, emulateIdKey } = ctx.options
        const { id } = params
        if (emulateIdKey) params[emulateIdKey] = params.id
        else delete params.id
        return contact.remote(origin).delete(getURL(id), params)
    },
    delete(...args){
        return this.destroy(...args)
    }
}

/**
 * 数据对象
 *
 * @param {Object} options
 * @param {String} options.name 对象名称; 必需，用于拼接请求地址
 * @param {String?} options.url 请求地址; 可选，用于发起请求
 * @param {Contact} options.contact 链接管理器; 必需，用于发起请求
 * @param {Object} options.methods 对象方法集合; 可选，设置对象的自定义方法
 * @param {Object} options.hooks 对象方法的钩子集合; 可选，设置对象方法的钩子处理
 * @param {Boolean} options.emulateIdKey 默认为`false`; 可选，默认行为是不将`id`作为请求数据发送并将`id`拼接至请求地址，如：`http://localhost/user/10422`
 * @property {String} name 对象名称；可更改
 * @property {String} url 请求地址；可更改
 * @property {Contact} contact 链接管理器；可更改
 * @returns
 * 
 * @example
 * import axios from "axios"
 * import datagent from "datagent"
 * const { respondData } = datagent.hooks
 * 
 * const contact = datagent.contact({ base: axios.create({ baseURL: "http://localhost:8081"  }) })
 * const userModel = datagent.model({
 *   name: 'user',
 *   url: 'users',
 *   contact,
 *   methods: {
 *     // 自定义方法，向服务端发送`[PATCH]`请求，禁用用户
 *     disabled(data, opts, ctx){
 *       // 最全的处理方法（推荐）
 *       const { origin } = {...opts}
 *       const { contact, url, getURL, emulateIdKey, isNew } = ctx.options
 *       const { id } = data
 *       const _url = getURL(id, url, emulateIdKey)
 *       return contact.remote(origin).patch(_url, {...data, disabled: true})
 *     },
 *     enabled(data, opts){
 *       //简单的处理方法
 *       const { origin } = {...opts}
 *       const { id } = data
 *       return this.contact.remote(origin).patch(this.getURL(id), {id, disabled: 1})
 *     }
 *   },
 *   hooks: {
 *     fetch: method=>[method(), respondData()],
 *     find: method=>[method(), respondData()],
 *     save: method=>[method(), respondData()],
 *     destroy: method=>[method(), respondData()],
 *     disabled: method=>[method(), respondData()]
 *   }
 * })
 * 
 * //对象名称
 * console.log(userModel.name)
 * // output: user
 * 
 * //获得用户数据列表
 * console.log(userModel.fetch({q: 'pa'}))
 * // request: [GET]'http://localhost:8081/users?q=pa'
 * // respond: { status: 200, data: [{id:1, username:'packy'}], headers: {...} }
 * // output: [{id:1, username:'packy'}]
 * 
 * //屏蔽用户
 * console.log(userModel.disabled({id:20}))
 * // request: [PATCH]'http://localhost:8081/users/20'
 */
function Model(options){
    let { name, url, contact, methods={}, hooks={}, emulateIdKey=false } = { ...options }
    existError(val=>(isDef(val) && isString(val)), new Error('options.name must be string in Model'))(name)
    existError(isDef, new Error('options.contact must be Contact class in Model'))(contact)
    const _url = isDef(url) ? url : `/${name}`

    const getURL = (opts=>(id, url=opts.url, emulateIdKey=opts.emulateIdKey)=>getURI(id, url, emulateIdKey))({url:_url, emulateIdKey})
    const context = {
        getURL
    }

    methods = { ...restful, ...methods }
    Object.keys(methods).forEach(methodName=>{
        let method = queue.wrap(methods[methodName])
        let hook = hooks[methodName]
        context[methodName] = (...args)=>{
            /** 
             * 钩子需要传入method的方法
             * 存入至钩子的method方法需要包裹成串行方法可执行的方法
             * 
             * method方法执行传入的第二个参数opts需要提供model自带的一些参数如：contact, url, getURL, emulateIdKey
             * 提供model自带的参数的目的在于不提供this调取内部变量和函数，已传入的方式提供
             * @ignore
             * **/
            const options = { contact, url:_url, getURL, emulateIdKey, isNew }
            const ctx = queue.context({ scope: context, method: methodName, options })
            // 先判断是否有钩子函数，有执行并获得方法串数组，没有则提供只有当前方法的数组
            const method_queue = hook ? hook(()=>method) : [method]
            existError(val=>isArray(val)&&val.every(fn=>isFunction(fn)), new Error("hook return result must be Array<Function> in Model"))(method_queue)
            // 串联方法组并生成可执行方法
            const method_exec = queue.generate(method_queue)
            // 执行串联后的方法
            const _args = new Array(3)
            args.forEach((arg,index)=>_args.splice(index, 1, arg))
            _args.splice(2, 1, ctx)
            return method_exec(_args, ctx)
        }
    })


    Object.defineProperties(context, {
        "name":{
            get(){
                return name
            },
            set(val){
                name = val
            }
        },
        "url":{
            get(){
                return _url
            },
            set(val){
                url = val
            }
        },
        "contact": {
            get(){
                return contact
            },
            set(val){
                contact = val
            }
        }
    })

    return Object.freeze(context)
}


const factory = options => new Model(options)
export const constructor = Model
export default factory