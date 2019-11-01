/**
 * Promise based HTTP client for the browser and node.js
 * @external axios
 * @see {@link https://www.npmjs.com/package/axios}
 */

 /**
 * Requests can be made by passing the relevant config to axios.
 * @external axios.config
 * @see {@link https://www.npmjs.com/package/axios#axios-api}
 */

/**
 * 远端，一般指后端服务，远端作为记录后端服务的功能节点
 *
 * @param {axios} origin - 服务源头，一般指`axios`
 * @property {axios} origin - 服务源头，一般指`axios`
 * @class
 * 
 * @example
 * import axios from "axios"
 * import datagent from "datagent"
 * const remote = datagent.remote(axios.create({ baseURL: "http://localhost:8081" }))
 * 
 * remote.get('/user', { q: "pa" }).then(res=>console.log(res))
 * // request 'http://localhost:8081/user?q=pa'
 * // output respond like: { status: 200, data: {...}, headers: {...} }
 */
function Remote(origin){
    /**
     * 发起请求
     * @param {axios.config} options
     * @memberof Remote
     * @return {Promise}
     */
    const sync = (options)=>{
        return origin(options);
    }
    const methods = {
        /**
         * 发起GET请求
         * @param {String} url 请求地址
         * @param {*} params 请求参数
         * @memberof Remote
         * @return {Promise}
         */
        get: (url, params)=>sync({ method: 'GET', url, params }),
        
        /**
         * 发起POST请求
         * @param {String} url 请求地址
         * @param {*} data 请求参数
         * @memberof Remote
         * @return {Promise}
         */
        post: (url, data)=>sync({ method: 'POST', url, data }),

        /**
         * 发起PUT请求
         * @param {String} url 请求地址
         * @param {*} data 请求参数
         * @memberof Remote
         * @return {Promise}
         */
        put: (url, data)=>sync({ method: 'PUT', url, data }),
        
        /**
         * 发起PATCH请求
         * @param {String} url 请求地址
         * @param {*} data 请求参数
         * @memberof Remote
         * @return {Promise}
         */
        patch: (url, data)=>sync({ method: 'PATCH', url, data }),

        /**
         * 发起DELETE请求
         * @param {String} url 请求地址
         * @param {*} data 请求参数
         * @memberof Remote
         * @return {Promise}
         */
        delete: (url, data)=>sync({ method: 'DELETE', url, data })
    }
    const context = {
        sync,
        ...methods
    }

    Object.defineProperties(context, {
        "origin":{
            get(){
                return origin
            }
        }
    })

    return Object.freeze(context)
}

const factory = origin => new Remote(origin)
export const constructor = Remote
export default factory