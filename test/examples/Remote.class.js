import fetch from "node-fetch"
import { URLSearchParams } from "url"

class Remote {
    constructor(options){
        const { baseURL, withJson=true } = { ...options }
        this._baseURL = baseURL
        this._withJson = withJson
    }
    sync(options){
        let { method, data, body, headers } = options
        const url = this._baseURL + options.url
        if(this._withJson){
            headers = !!headers ? headers : {}
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }else{
            body = data
        }
        return fetch(url, { method, body, headers }).then(res=>new Promise((resolve, reject)=>{
            res.json().then(data=>resolve({
                status: res.status,
                statusText: res.statusText,
                data,
                headers: res.headers,
                url: res.url
            }), reject)
        }))
    }
    get(url, _params={}){
        const params = new URLSearchParams()
        Object.keys(_params).forEach(key=>params.append(key, _params[key]))
        url += `/${params.toString()}`
        return this.sync({ method: "GET", url })
    }
    post(url, data){
        return this.sync({ method: "POST", url, data })
    }
    put(url, data){
        return this.sync({ method: "PUT", url, data })
    }
    patch(url, data){
        return this.sync({ method: "PATCH", url, data })
    }
    delete(url, data){
        return this.sync({ method: "DELETE", url, data })
    }
}
export default Remote