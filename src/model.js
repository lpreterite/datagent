import { existError, isDef, isString, isArray, isFunction } from "./utils/"
import * as queue from "./queue"

export const isNew = data => !isDef(data.id) || !data.id
export const getURL = (url, id, emulateIdKey) => emulateIdKey ? url : (url + ((isDef(id) && !!id) ? `/${id}` : ''))

export const restful = {
    fetch(params, opts, ctx) {
        const { origin } = {...opts}
        const { contact, url } = ctx.options
        return contact.remote(origin).get(url, params)
    },
    find(params, opts, ctx) {
        const { origin } = {...opts}
        const { contact, url, getURL, emulateIdKey } = ctx.options
        const { id } = params
        if (emulateIdKey) params[emulateIdKey] = params.id
        else delete params.id
        return contact.remote(origin).get(getURL(url, id, emulateIdKey), params )
    },
    save(data, opts, ctx) {
        const { origin } = {...opts}
        const { contact, url, getURL, emulateIdKey, isNew } = ctx.options
        const { id } = data
        const _url = getURL(url, id, emulateIdKey)
        const method = isNew(data) ? 'post' : 'put'
        return contact.remote(origin)[method](_url, data)
    },
    destroy(params, opts, ctx) {
        const { origin } = {...opts}
        const { contact, url, getURL, emulateIdKey } = ctx.options
        const { id } = params
        if (emulateIdKey) params[emulateIdKey] = params.id
        else delete params.id
        return contact.remote(origin).delete(getURL(url, id, emulateIdKey), params)
    },
    delete(...args){
        return this.destroy(...args)
    }
}

function Model(options){
    let { name, url, contact, methods={}, hooks={}, emulateIdKey=false } = { ...options }
    existError(val=>(isDef(val) && isString(val)), new Error('options.name must be string in Model'))(name)
    existError(isDef, new Error('options.contact must be Contact class in Model'))(contact)
    const _url = isDef(url) ? url : `/${name}`

    const context = {}

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
            const ctx = queue.context({ scope: context, method: methodName, args, options })
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