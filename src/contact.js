import { existError, isDef, isString } from "./utils/"
import remote from "./remote"
/**
 * 链接管理器
 *
 * @param {*} [remotes={}]
 * @class
 * 
 * @example
 * import axios from "axios"
 * import datagent from "datagent"
 * const contact = datagent.contact({ base: axios.create({ baseURL: 'http://localhost:8081' }) })
 * 
 * console.log('contact has test:'+contact.has('test'))
 * // output: 'contact has test:false'
 * 
 * // use default remote
 * console.log(contact.default().get('/user'))
 * // request 'http://localhost:8081/user'
 * // output respond like: { status: 200, data: {...}, headers: {...} }
 * 
 * // set nothing parmas will get default remote with remote function
 * console.log(contact.remote().get('/user'))
 * // request 'http://localhost:8081/user'
 * // output respond like: { status: 200, data: {...}, headers: {...} }
 */
function Contact(remotes={}){
    let _default = null
    Object.keys(remotes).forEach(remoteName=>{
        remotes[remoteName]=remote(remotes[remoteName])
    })
    _default = Object.values(remotes).shift()

    /**
     * 判断是否存在远端
     * 
     * @memberof Contact
     * @param {String} name 远端名称
     * @return {Boolean} true 存在, false 不存在
     */
    const has = name=>Object.keys(remotes).indexOf(name) > -1
    const getRemote = name=>{
        existError(isString, new Error(`The name must be String in contact`))(name)
        existError(isDef, new Error(`No '${name}' found in remotes`))(remotes[name])
        return remotes[name]
    }
    const setRemote = (name, remote)=>(remotes[name]=remote)
    const setDefault = name=>_default=getRemote(name)

    const context = {
        has,
        /**
         * 获取或设定默认远端
         * 
         * @memberof Contact
         * @param {String?} name 远端名称，不传参为获取默认远端
         * @return {Remote} 返回默认远端
         */
        default:name=>!!name?setDefault(name):_default,
        
        /**
         * 获取或设定远端
         * 
         * @memberof Contact
         * @param {Array} args
         * @param {String} args[].name 远端名称，不传参为获取默认远端
         * @param {Remote} args[].remote 远端，不传参为获取远端
         * @return {Remote} 返回默认远端
         * 
         * @example
         * //获得默认远端
         * contact.remote()
         * //获得远端
         * contact.remote('base')
         * //设置远端
         * contact.remote('test', datagent.remote(axios.create({ baseURL: "http://localhost:8082" })))
         */
        remote: (...args)=>{
            const [name, remote] = args
            if(args.length>1) return setRemote(name, remote)
            else if(!name) return _default
            else return getRemote(name)
        }
    }

    return Object.freeze(context)
}


const factory = remotes => new Contact(remotes)
export const constructor = Contact
export default factory